'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  club: string;
  creditScore: number;
};

type ClubType = 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC' | 'ALL';

export default function SuperadminMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
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

    // Fetch all members if authenticated
    if (status === 'authenticated') {
      fetchAllMembers();
    }
  }, [status, session, router]);

  const fetchAllMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      
      // Filter to only show members (not regular users)
      const allMembers = data.users.filter(
        (user: Member) => user.role === 'member'
      );
      
      setMembers(allMembers);
      setError(null);
    } catch (err) {
      setError('Failed to load members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on selected club tab
  const filteredMembers = activeTab === 'ALL' 
    ? members 
    : members.filter(member => member.club === activeTab);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Club Members</h1>
      
      {/* Club tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {clubTypes.map((club) => (
          <button
            key={club}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === club
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(club)}
          >
            {club}
          </button>
        ))}
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No members found for {activeTab === 'ALL' ? 'any club' : activeTab}.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">{member.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.club === 'IEEE' ? 'bg-blue-100 text-blue-800' :
                      member.club === 'ACM' ? 'bg-green-100 text-green-800' :
                      member.club === 'AWS' ? 'bg-yellow-100 text-yellow-800' :
                      member.club === 'GDG' ? 'bg-red-100 text-red-800' :
                      member.club === 'STIC' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.club || 'None'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {member.creditScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 