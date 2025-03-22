'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Member {
  _id: string;
  name: string;
  email: string;
  club: string;
  creditScore: number;
}

interface MemberRankingsProps {
  clubFilter?: string;
  limit?: number;
}

const MemberRankings: React.FC<MemberRankingsProps> = ({ 
  clubFilter,
  limit = 10
}) => {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayClub, setDisplayClub] = useState<string | undefined>(clubFilter);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Construct URL based on club filter
        let url = '/api/admin/members?role=member';
        if (displayClub) {
          url += `&club=${displayClub}`;
        }

        console.log('Fetching members ranking from:', url);
        console.log('Current user role:', session.user.role);
        console.log('Club filter:', displayClub);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched member rankings data:', data);
        
        // Ensure data is in the correct format
        if (Array.isArray(data)) {
          // Sort by credit score (descending)
          const sortedMembers = data.sort((a: Member, b: Member) => 
            b.creditScore - a.creditScore
          );
          
          setMembers(sortedMembers.slice(0, limit));
        } else {
          console.error('Unexpected data format:', data);
          setMembers([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      // If no club filter provided, default to admin's club
      if (!displayClub && session.user.role === 'admin') {
        setDisplayClub(session.user.club as string);
      }
      
      fetchMembers();
    }
  }, [session, displayClub, limit]);

  const getCreditColor = (creditScore: number) => {
    if (creditScore >= 50) return 'text-green-500'; // Green for 50+
    if (creditScore >= 30) return 'text-yellow-500'; // Yellow for 30-49
    if (creditScore >= 10) return 'text-orange-500'; // Orange for 10-29
    return 'text-red-500'; // Red for < 10
  };

  const getCreditBackgroundColor = (creditScore: number) => {
    if (creditScore >= 50) return 'bg-green-900 bg-opacity-20'; // Green background for 50+
    if (creditScore >= 30) return 'bg-yellow-900 bg-opacity-20'; // Yellow background for 30-49
    if (creditScore >= 10) return 'bg-orange-900 bg-opacity-20'; // Orange background for 10-29
    return 'bg-red-900 bg-opacity-20'; // Red background for < 10
  };

  const handleClubFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayClub(e.target.value === 'all' ? undefined : e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-800 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Member Rankings</h2>
        
        {session?.user?.role === 'superadmin' && (
          <div>
            <label htmlFor="clubFilter" className="mr-2 text-sm text-gray-400">Club:</label>
            <select
              id="clubFilter"
              value={displayClub || 'all'}
              onChange={handleClubFilterChange}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="all">All Clubs</option>
              <option value="IEEE">IEEE</option>
              <option value="ACM">ACM</option>
              <option value="AWS">AWS</option>
              <option value="GDG">GDG</option>
              <option value="STIC">STIC</option>
            </select>
          </div>
        )}
      </div>

      {members.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-400">No members found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                {!displayClub && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Club</th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {members.map((member, index) => (
                <tr key={member._id} className={`${getCreditBackgroundColor(member.creditScore)}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{member.name}</div>
                    <div className="text-xs text-gray-400">{member.email}</div>
                  </td>
                  {!displayClub && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {member.club || 'None'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getCreditColor(member.creditScore)}`}>
                      {member.creditScore} credits
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberRankings;