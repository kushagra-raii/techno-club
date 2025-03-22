"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

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
      const role = (session.user as { role?: string }).role || 'user';
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
  // Check if event is at capacity
  const isAtCapacity = event.participantCount >= event.capacity;

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
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Event Image */}
            <div className="h-64 md:h-80 relative">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Event Header */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  {event.club && (
                    <span className="bg-indigo-500 text-white text-xs font-medium px-2.5 py-0.5 rounded mb-2 inline-block">
                      {event.club}
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">{event.name}</h1>
                </div>
                
                {event.ticketPrice > 0 && (
                  <span className="bg-green-900 text-green-200 text-lg font-semibold px-3 py-1 rounded-lg">
                    ₹{event.ticketPrice}
                  </span>
                )}
              </div>

              {/* Event Time & Location */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <div className="text-gray-300">
                    <div className="font-medium">Date & Time</div>
                    <div className="mt-1">{formatDate(event.startDate)}</div>
                    {formatDate(event.startDate) !== formatDate(event.endDate) && (
                      <div className="mt-1">to {formatDate(event.endDate)}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div className="text-gray-300">
                    <div className="font-medium">Location</div>
                    <div className="mt-1">{event.location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">About This Event</h2>
            <div className="text-gray-300 space-y-4 whitespace-pre-line">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Organizer Info */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Organized by</h2>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700 mr-4">
                {event.creatorId.image ? (
                  <Image
                    src={event.creatorId.image}
                    alt={event.creatorId.name || 'Event creator'}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white text-lg font-bold">
                    {event.creatorId.name && event.creatorId.name.length > 0
                      ? event.creatorId.name.charAt(0).toUpperCase()
                      : 'U'
                    }
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-white">{event.creatorId.name}</div>
                <div className="text-gray-400 text-sm">{event.creatorId.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Registration</h2>
            
            <div className="mb-4">
              <div className="flex justify-between text-gray-300 mb-2">
                <span>Available Spots</span>
                <span className="font-medium">{event.participantCount} / {event.capacity}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isAtCapacity ? 'bg-red-600' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(100, (event.participantCount / event.capacity) * 100)}%` }}
                ></div>
              </div>
            </div>

            {event.isParticipating ? (
              <div className="flex flex-col gap-4">
                <div className="bg-green-900 text-green-200 p-4 rounded-lg text-center">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="font-medium">You&apos;re registered for this event!</p>
                </div>
                
                {!isPastEvent && (
                  <button
                    onClick={handleUnregister}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Unregister from Event"}
                  </button>
                )}
              </div>
            ) : isPastEvent ? (
              <div className="bg-gray-700 text-gray-300 p-4 rounded-lg text-center">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="font-medium">This event has ended</p>
              </div>
            ) : isAtCapacity ? (
              <div className="bg-red-900 text-red-200 p-4 rounded-lg text-center">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <p className="font-medium">Event is at full capacity</p>
              </div>
            ) : !event.isPublished ? (
              <div className="bg-yellow-900 text-yellow-200 p-4 rounded-lg text-center">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p className="font-medium">Registration not available until approved</p>
              </div>
            ) : (
              <button
                onClick={handleParticipate}
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Register for Event"}
              </button>
            )}
          </div>

          {/* Participants List */}
          {event.participantDetails && event.participantDetails.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Participants ({event.participantCount})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {event.participantDetails.map((participant) => (
                  <div key={participant._id} className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 mr-3">
                      {participant.image ? (
                        <Image
                          src={participant.image}
                          alt={participant.name || 'Participant'}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white font-bold">
                          {participant.name && participant.name.length > 0
                            ? participant.name.charAt(0).toUpperCase()
                            : 'U'
                          }
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{participant.name}</div>
                      <div className="text-gray-400 text-sm">{participant.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 