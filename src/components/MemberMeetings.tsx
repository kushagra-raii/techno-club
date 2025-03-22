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
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming'>('all');

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

  // Calculate days until meeting
  const daysUntilMeeting = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(dateString);
    meetingDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(meetingDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format time in a more readable way
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Sort meetings by date (upcoming first)
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Filter meetings based on active tab
  const todayMeetings = sortedMeetings.filter(meeting => isToday(meeting.date));
  const upcomingMeetings = sortedMeetings.filter(meeting => isFuture(meeting.date) && !isToday(meeting.date));
  const allFutureMeetings = sortedMeetings.filter(meeting => isFuture(meeting.date) || isToday(meeting.date));
  
  const displayedMeetings = 
    activeTab === 'today' ? todayMeetings :
    activeTab === 'upcoming' ? upcomingMeetings :
    allFutureMeetings;

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Meetings
        </h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Meetings
        </h2>
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (allFutureMeetings.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Meetings
        </h2>
        <div className="bg-gray-700 p-6 rounded-md flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-center">No upcoming meetings scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upcoming Meetings
      </h2>
      
      {/* Meeting filter tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'all'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          All ({allFutureMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'today'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Today ({todayMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upcoming'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Upcoming ({upcomingMeetings.length})
        </button>
      </div>
      
      {displayedMeetings.length === 0 ? (
        <div className="bg-gray-700 p-6 rounded-md flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-center">No meetings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedMeetings.map((meeting) => (
            <div 
              key={meeting._id} 
              className={`rounded-md overflow-hidden shadow-md ${
                isToday(meeting.date) 
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800' 
                  : 'bg-gray-700'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-3 bg-gray-800 rounded-md h-10 w-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                        meeting.club === 'IEEE' ? 'text-blue-400' :
                        meeting.club === 'ACM' ? 'text-green-400' :
                        meeting.club === 'AWS' ? 'text-yellow-400' :
                        meeting.club === 'GDG' ? 'text-red-400' :
                        meeting.club === 'STIC' ? 'text-purple-400' :
                        'text-gray-400'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{meeting.title}</h3>
                      <p className="text-sm text-gray-400">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      meeting.club === 'IEEE' ? 'bg-blue-900/50 text-blue-200 border border-blue-800' :
                      meeting.club === 'ACM' ? 'bg-green-900/50 text-green-200 border border-green-800' :
                      meeting.club === 'AWS' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800' :
                      meeting.club === 'GDG' ? 'bg-red-900/50 text-red-200 border border-red-800' :
                      meeting.club === 'STIC' ? 'bg-purple-900/50 text-purple-200 border border-purple-800' :
                      'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}>
                      {meeting.club}
                    </span>
                    
                    {isToday(meeting.date) && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-200 border border-blue-800">
                        Today
                      </span>
                    )}
                    
                    {!isToday(meeting.date) && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                        In {daysUntilMeeting(meeting.date)} days
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(meeting.date)}
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {meeting.location}
                  </div>
                </div>
                
                {meeting.description && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm">
                    {meeting.description.length > 120 
                      ? `${meeting.description.substring(0, 120)}...`
                      : meeting.description
                    }
                  </div>
                )}
                
                {meeting.meetLink && (
                  <div className="mt-3">
                    <a 
                      href={meeting.meetLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 