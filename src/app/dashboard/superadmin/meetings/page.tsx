'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MeetingScheduler from '@/components/MeetingScheduler';

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
  invitees: string[];
  createdAt: string;
  updatedAt: string;
};

type ClubType = 'ALL' | 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC';
type TimeFilterType = 'all' | 'upcoming' | 'past';

export default function SuperadminMeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClub, setActiveClub] = useState<ClubType>('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');

  const clubTypes: ClubType[] = ['ALL', 'IEEE', 'ACM', 'AWS', 'GDG', 'STIC'];

  useEffect(() => {
    // Redirect if not superadmin
    if (status === 'authenticated' && session?.user?.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }

    // Fetch meetings if authenticated
    if (status === 'authenticated') {
      fetchMeetings();
    }
  }, [status, session, router]);

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

  // Format time in a more readable way
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if the meeting is in the future
  const isFuture = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(dateString);
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate >= today;
  };

  // Check if the meeting is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return today.toDateString() === meetingDate.toDateString();
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

  // Filter meetings based on selected club tab and time filter
  const filteredMeetings = meetings
    .filter(meeting => (activeClub === 'ALL' ? true : meeting.club === activeClub))
    .filter(meeting => {
      if (timeFilter === 'upcoming') return isFuture(meeting.date);
      if (timeFilter === 'past') return !isFuture(meeting.date);
      return true; // 'all' filter
    })
    .sort((a, b) => {
      // For upcoming, sort by closest date first
      if (timeFilter === 'upcoming') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      // For past or all, sort by most recent
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Get counts for filter badges
  const getClubCount = (club: ClubType): number => {
    return meetings.filter(meeting => club === 'ALL' ? true : meeting.club === club).length;
  };

  const getTimeFilterCount = (filter: TimeFilterType, club: ClubType): number => {
    return meetings
      .filter(meeting => club === 'ALL' ? true : meeting.club === club)
      .filter(meeting => {
        if (filter === 'upcoming') return isFuture(meeting.date);
        if (filter === 'past') return !isFuture(meeting.date);
        return true;
      }).length;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        All Club Meetings
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MeetingScheduler />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Scheduled Meetings</h2>
            
            {/* Club filter tabs */}
            <div className="mb-6 border-b border-gray-700">
              <div className="flex flex-wrap -mb-px">
                {clubTypes.map((club) => (
                  <button
                    key={club}
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                      activeClub === club
                        ? 'border-b-2 border-blue-500 text-blue-400'
                        : 'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                    onClick={() => setActiveClub(club)}
                  >
                    {club} ({getClubCount(club)})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time filters */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({getTimeFilterCount('all', activeClub)})
              </button>
              <button
                onClick={() => setTimeFilter('upcoming')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeFilter === 'upcoming' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Upcoming ({getTimeFilterCount('upcoming', activeClub)})
              </button>
              <button
                onClick={() => setTimeFilter('past')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeFilter === 'past' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Past ({getTimeFilterCount('past', activeClub)})
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            {filteredMeetings.length === 0 ? (
              <div className="p-8 bg-gray-700 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-300">No meetings found for {activeClub === 'ALL' ? 'any club' : activeClub}.</p>
                <p className="text-gray-400 text-sm mt-1">Try another filter or schedule a new meeting.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredMeetings.map((meeting) => (
                  <div key={meeting._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-md hover:bg-gray-650 transition-colors">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className={`mr-3 bg-gray-800 rounded-md h-10 w-10 flex items-center justify-center ${
                            meeting.club === 'IEEE' ? 'border border-blue-700' :
                            meeting.club === 'ACM' ? 'border border-green-700' :
                            meeting.club === 'AWS' ? 'border border-yellow-700' :
                            meeting.club === 'GDG' ? 'border border-red-700' :
                            meeting.club === 'STIC' ? 'border border-purple-700' :
                            ''
                          }`}>
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
                            'bg-gray-600 text-gray-200'
                          }`}>
                            {meeting.club}
                          </span>
                          
                          {isToday(meeting.date) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-200 border border-green-800">
                              Today
                            </span>
                          )}
                          
                          {isFuture(meeting.date) && !isToday(meeting.date) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                              In {daysUntilMeeting(meeting.date)} days
                            </span>
                          )}
                          
                          {!isFuture(meeting.date) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                              Past
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(meeting.date)}
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {meeting.location}
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {meeting.creatorId?.name || 'Unknown'}
                        </div>
                      </div>
                      
                      {meeting.description && (
                        <div className="mt-4 p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm">
                          {meeting.description}
                        </div>
                      )}
                      
                      <div className="mt-4 flex space-x-3">
                        {meeting.meetLink && (
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
                        )}
                        
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this meeting?')) {
                              // TODO: Implement delete meeting API call
                              console.log('Delete meeting:', meeting._id);
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 