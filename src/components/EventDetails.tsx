import React from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface EventDetailsProps {
  event: {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    club?: string;
    imageUrl?: string;
    ticketPrice: number;
    creatorId: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <>
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
    </>
  );
};

export default EventDetails; 