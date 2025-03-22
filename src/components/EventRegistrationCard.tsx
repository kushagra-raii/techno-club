import React, { useState } from 'react';
import PaymentButton from './PaymentButton';

interface EventRegistrationCardProps {
  event: {
    _id: string;
    name: string;
    description: string;
    ticketPrice: number;
    capacity: number;
    participantCount: number;
    isParticipating: boolean;
    isPublished: boolean;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  isPastEvent: boolean;
  isProcessing: boolean;
  onParticipate: () => Promise<void>;
  onUnregister: () => Promise<void>;
  onPaymentSuccess?: () => void;
  refreshEventDetails: () => void;
}

const EventRegistrationCard: React.FC<EventRegistrationCardProps> = ({
  event,
  user,
  isPastEvent,
  isProcessing,
  onParticipate,
  onUnregister,
  onPaymentSuccess,
  refreshEventDetails,
}) => {
  const [localProcessing, setLocalProcessing] = useState(isProcessing);
  
  // Check if event is at capacity
  const isAtCapacity = event.participantCount >= event.capacity;
  
  const handleRegularParticipate = async () => {
    setLocalProcessing(true);
    await onParticipate();
    setLocalProcessing(false);
  };
  
  const handleUnregister = async () => {
    setLocalProcessing(true);
    await onUnregister();
    setLocalProcessing(false);
  };
  
  const handlePaymentSuccess = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    } else {
      refreshEventDetails();
    }
  };

  return (
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
              disabled={localProcessing}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {localProcessing ? (
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
      ) : event.ticketPrice > 0 ? (
        // For paid events
        <PaymentButton
          eventId={event._id}
          eventName={event.name}
          description={`Registration for ${event.name}`}
          amount={event.ticketPrice}
          userEmail={user.email}
          userName={user.name}
          userId={user.id}
          onSuccess={handlePaymentSuccess}
          isDisabled={localProcessing}
        />
      ) : (
        // For free events
        <button
          onClick={handleRegularParticipate}
          disabled={localProcessing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {localProcessing ? (
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
  );
};

export default EventRegistrationCard; 