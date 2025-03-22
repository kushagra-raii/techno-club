import React from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export type EventCardProps = {
  id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  club?: string; // Club name is optional
  imageUrl?: string;
  ticketPrice?: number;
  capacity?: number;
  participantCount?: number;
  isParticipating?: boolean;
  isPublished?: boolean;
  onParticipate?: (id: string) => void;
  onApprove?: (id: string) => void;
  showAdminControls?: boolean;
};

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  description,
  startDate,
  endDate,
  location,
  club,
  imageUrl,
  ticketPrice,
  capacity,
  participantCount = 0,
  isParticipating = false,
  isPublished = true,
  onParticipate,
  onApprove,
  showAdminControls = false,
}) => {
  // Map club names to colors
  const clubColorMap: Record<string, string> = {
    'Web Development': 'bg-blue-500',
    'AI & ML': 'bg-purple-500',
    'Cybersecurity': 'bg-red-500',
    'Game Development': 'bg-green-500',
    'Robotics': 'bg-orange-500',
    'Design': 'bg-pink-500',
    'Mobile Development': 'bg-indigo-500',
    'Data Science': 'bg-teal-500',
    'Default': 'bg-gray-500'
  };

  const clubColor = club && clubColorMap[club] ? clubColorMap[club] : clubColorMap['Default'];
  
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  
  const handleParticipateClick = () => {
    if (onParticipate) {
      onParticipate(id);
    }
  };
  
  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(id);
    }
  };

  return (
    <div className="relative bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-600">
      {!isPublished && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-md">
          Pending Approval
        </div>
      )}
      
      <div className="h-48 relative overflow-hidden bg-gray-700">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {club && (
          <div className="mb-2">
            <span className={`${clubColor} text-white text-xs font-medium px-2.5 py-0.5 rounded`}>
              {club}
            </span>
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-2 text-white">{name}</h2>
        
        <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div className="text-sm text-gray-300">
              <div>{formattedStartDate}</div>
              {formattedStartDate !== formattedEndDate && <div>to {formattedEndDate}</div>}
            </div>
          </div>
          
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-sm text-gray-300">{location}</span>
          </div>
          
          {ticketPrice !== undefined && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm text-gray-300">
                {ticketPrice === 0 ? 'Free' : `₹${ticketPrice}`}
              </span>
            </div>
          )}
          
          {capacity !== undefined && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <div className="flex flex-col text-sm">
                <span className="text-gray-300">{participantCount} / {capacity} participants</span>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (participantCount / capacity) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Link 
            href={`/dashboard/events/${id}`}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors duration-200"
          >
            View Details
          </Link>
          
          {onParticipate && isPublished && (
            <button
              onClick={handleParticipateClick}
              disabled={isParticipating}
              className={`px-4 py-2 rounded-lg text-sm text-center transition-colors duration-200 ${
                isParticipating
                  ? 'bg-green-700 text-green-100 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isParticipating ? 'Participating' : 'Join Event'}
            </button>
          )}
          
          {showAdminControls && !isPublished && onApprove && (
            <button
              onClick={handleApproveClick}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors duration-200"
            >
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 