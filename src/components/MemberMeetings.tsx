'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type Meeting = {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  meetLink?: string;
  club: string;
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function MemberMeetings() {
  const { data: session } = useSession();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchMeetings();
    }
  }, [session]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meetings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      
      const data = await response.json();
      setMeetings(data.meetings);
      setError(null);
    } catch (err) {
      setError('Failed to load meetings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if the meeting is happening today
  const isToday = (dateString: string) => {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return today.toDateString() === meetingDate.toDateString();
  };

  // Check if the meeting is in the future
  const isFuture = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(dateString);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate > today;
  };

  // Sort meetings by date (upcoming first)
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Filter for upcoming and today's meetings
  const upcomingMeetings = sortedMeetings.filter(meeting => isFuture(meeting.date) || isToday(meeting.date));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-red-200 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (upcomingMeetings.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Upcoming Meetings</h2>
        <p className="text-gray-400">No upcoming meetings scheduled.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Upcoming Meetings</h2>
      <div className="space-y-4">
        {upcomingMeetings.map((meeting) => (
          <div 
            key={meeting._id} 
            className={`p-4 rounded-md ${
              isToday(meeting.date) 
                ? 'bg-blue-900 bg-opacity-50 border border-blue-700' 
                : 'bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-white">{meeting.title}</h3>
              {isToday(meeting.date) && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-700 text-blue-100">
                  Today
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-400">Date:</p>
                <p className="text-gray-200">{formatDate(meeting.date)}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Time:</p>
                <p className="text-gray-200">{meeting.startTime} - {meeting.endTime}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Location:</p>
                <p className="text-gray-200">{meeting.location}</p>
              </div>
            </div>
            
            {meeting.meetLink && (
              <div className="mt-3">
                <a 
                  href={meeting.meetLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Join Meeting
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 