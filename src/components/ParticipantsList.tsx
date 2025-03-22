import React from 'react';
import Image from 'next/image';

interface Participant {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  participantCount: number;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, participantCount }) => {
  if (!participants || participants.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Participants ({participantCount})
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {participants.map((participant) => (
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
  );
};

export default ParticipantsList; 