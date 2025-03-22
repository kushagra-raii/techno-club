"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

type Event = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  club: string;
  imageUrl?: string;
  ticketPrice: number;
  capacity: number;
  participantCount: number;
  isParticipating: boolean;
  isPublished: boolean;
};

type Tab = 'all' | 'pending' | 'past';

const EventsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    // Get user role from session
    if (session?.user) {
      // Custom session property
      const role = (session.user as { role?: string }).role || 'user';
      setUserRole(role);
      
      // Fetch events when session and role are available
      fetchEvents();
    }
  }, [status, session]);

  // Separate useEffect to handle tab changes
  useEffect(() => {
    if (session?.user) {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build URL with query parameters
      const url = new URL('/api/events', window.location.origin);
      
      // Only show pending events for superadmins if on pending tab
      if (activeTab === 'pending' && userRole === 'superadmin') {
        url.searchParams.append('publishedOnly', 'false');
      } else {
        url.searchParams.append('publishedOnly', 'true');
      }
      
      console.log('Fetching events from:', url.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }
      
      const data = await response.json();
      console.log('Fetched events:', data.events.length);
      
      if (data.events && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
        console.error('Invalid events data received:', data);
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve event');
      }
      
      // Refetch events to update approval status
      fetchEvents();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while approving the event';
      setError(errorMessage);
    }
  };

  const handleParticipate = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join event');
      }
      
      // Update local state to reflect participation without refetching
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, isParticipating: true, participantCount: event.participantCount + 1 } 
          : event
      ));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while joining the event';
      setError(errorMessage);
    }
  };

  // Group events by published status for better display
  const pendingEvents = events.filter(event => !event.isPublished);
  const publishedEvents = events.filter(event => event.isPublished);

  // Filter events by date
  const now = new Date();
  const pastEvents = publishedEvents.filter(event => new Date(event.endDate) < now);
  const currentEvents = publishedEvents.filter(event => new Date(event.endDate) >= now);

  // Determine which events to display based on active tab
  const displayEvents = activeTab === 'pending' 
    ? pendingEvents 
    : activeTab === 'past'
      ? pastEvents
      : activeTab === 'all' && userRole === 'superadmin'
        ? [...pendingEvents, ...currentEvents]
        : currentEvents;

  if (loading && events.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Events</h1>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-indigo-400">Events</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {userRole === 'superadmin' && (
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              {activeTab === 'pending' ? 'Showing Pending' : 'Show All'}
            </button>
          )}
          
          {['member', 'admin', 'superadmin'].includes(userRole) && (
            <Link 
              href="/dashboard/events/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">Create Event</span>
            </Link>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {displayEvents.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-lg text-center shadow-md border border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-gray-300 text-lg mb-4">
            {activeTab === 'pending' 
              ? 'No pending events found for approval.' 
              : activeTab === 'past'
                ? 'No past events found.'
                : 'No events found at this time.'}
          </p>
          {['member', 'admin', 'superadmin'].includes(userRole) && activeTab === 'all' && (
            <Link 
              href="/dashboard/events/create"
              className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">Create Your First Event</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map(event => (
            <EventCard
              key={event._id}
              id={event._id}
              name={event.name}
              description={event.description}
              startDate={event.startDate}
              endDate={event.endDate}
              location={event.location}
              club={event.club}
              imageUrl={event.imageUrl}
              ticketPrice={event.ticketPrice}
              capacity={event.capacity}
              participantCount={event.participantCount}
              isParticipating={event.isParticipating}
              isPublished={event.isPublished}
              onParticipate={activeTab !== 'past' ? handleParticipate : undefined}
              onApprove={activeTab === 'pending' || (activeTab === 'all' && !event.isPublished) ? handleApproveEvent : undefined}
              showAdminControls={userRole === 'superadmin' && !event.isPublished}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage; 