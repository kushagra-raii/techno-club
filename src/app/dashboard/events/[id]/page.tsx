"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import EventDetails from '@/components/EventDetails';
import EventRegistrationCard from '@/components/EventRegistrationCard';
import ParticipantsList from '@/components/ParticipantsList';

// Define extended session user type
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

type EventDetail = {
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
  creatorId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  participantDetails?: Array<{
    _id: string;
    name: string;
    email: string;
    image?: string;
  }>;
};

const EventDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('user');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user) {
      // Get user role
      const user = session.user as ExtendedUser;
      const role = user.role || 'user';
      setUserRole(role);
    }

    fetchEventDetails();
  }, [id, status, session]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/events/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch event details');
      }

      const eventData = await response.json();
      setEvent(eventData);
    } catch (err: unknown) {
      console.error('Error fetching event details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/events/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join event');
      }

      // Refresh event details
      fetchEventDetails();
    } catch (err: unknown) {
      console.error('Error joining event:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/events/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unregister from event');
      }

      // Refresh event details
      fetchEventDetails();
    } catch (err: unknown) {
      console.error('Error unregistering from event:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/events/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve event');
      }

      // Refresh event details
      fetchEventDetails();
    } catch (err: unknown) {
      console.error('Error approving event:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <Link href="/dashboard/events" className="text-indigo-400 hover:underline flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 p-10 rounded-lg text-center shadow-md border border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-300 text-lg mb-4">Event not found or you don&apos;t have permission to view it.</p>
          <Link href="/dashboard/events" className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all duration-200">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if event is in the past
  const isPastEvent = new Date(event.endDate) < new Date();
  // Get user from session
  const user = session?.user as ExtendedUser;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link href="/dashboard/events" className="text-indigo-400 hover:underline flex items-center mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Events
      </Link>

      {!event.isPublished && (
        <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-200 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>This event is awaiting approval and is not publicly visible yet.</span>
            
            {userRole === 'superadmin' && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="ml-4 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm"
              >
                {isProcessing ? 'Processing...' : 'Approve Event'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <EventDetails event={event} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <EventRegistrationCard
            event={event}
            user={{
              id: user?.id || '',
              name: user?.name || '',
              email: user?.email || '',
            }}
            isPastEvent={isPastEvent}
            isProcessing={isProcessing}
            onParticipate={handleParticipate}
            onUnregister={handleUnregister}
            refreshEventDetails={fetchEventDetails}
          />

          {/* Participants List */}
          {event.participantDetails && event.participantDetails.length > 0 && (
            <ParticipantsList 
              participants={event.participantDetails}
              participantCount={event.participantCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 