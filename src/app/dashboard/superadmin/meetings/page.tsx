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

export default function SuperadminMeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ClubType>('ALL');

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

  // Filter meetings based on selected club tab
  const filteredMeetings = activeTab === 'ALL' 
    ? meetings 
    : meetings.filter(meeting => meeting.club === activeTab);

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

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-white">All Club Meetings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Scheduled Meetings</h2>
            
            {/* Club tabs */}
            <div className="flex flex-wrap mb-6 border-b border-gray-700">
              {clubTypes.map((club) => (
                <button
                  key={club}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === club
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                  onClick={() => setActiveTab(club)}
                >
                  {club}
                </button>
              ))}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {filteredMeetings.length === 0 ? (
              <div className="p-4 bg-gray-700 rounded-md text-gray-300">
                No meetings scheduled for {activeTab === 'ALL' ? 'any club' : activeTab}.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => (
                  <div key={meeting._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{meeting.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        meeting.club === 'IEEE' ? 'bg-blue-900 text-blue-200' :
                        meeting.club === 'ACM' ? 'bg-green-900 text-green-200' :
                        meeting.club === 'AWS' ? 'bg-yellow-900 text-yellow-200' :
                        meeting.club === 'GDG' ? 'bg-red-900 text-red-200' :
                        meeting.club === 'STIC' ? 'bg-purple-900 text-purple-200' :
                        'bg-gray-600 text-gray-200'
                      }`}>
                        {meeting.club}
                      </span>
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
                      
                      <div>
                        <p className="text-gray-400">Organizer:</p>
                        <p className="text-gray-200">{meeting.creatorId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    {meeting.description && (
                      <div className="mb-3">
                        <p className="text-gray-400">Description:</p>
                        <p className="text-gray-200 text-sm">{meeting.description}</p>
                      </div>
                    )}
                    
                    {meeting.meetLink && (
                      <div className="mt-2">
                        <a 
                          href={meeting.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
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
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <MeetingScheduler />
        </div>
      </div>
    </div>
  );
} 