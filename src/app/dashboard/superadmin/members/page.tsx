'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  club: string;
  creditScore: number;
};

type ClubType = 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC' | 'ALL';

export default function SuperadminMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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

    // Fetch all users if authenticated
    if (status === 'authenticated') {
      fetchAllUsers();
    }
  }, [status, session, router]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      // The API directly returns an array of users instead of a nested users property
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on selected club tab and ensure it's always an array
  const filteredUsers = activeTab === 'ALL' 
    ? users 
    : users.filter(user => user.club === activeTab);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            User Management
          </h1>
          <span className="bg-blue-900 text-blue-100 px-4 py-2 rounded-lg text-sm font-medium">
            Total: {users.length}
          </span>
        </div>
        
        {/* Club tabs */}
        <div className="flex flex-wrap mb-8 gap-2 border-b border-gray-700 pb-4">
          {clubTypes.map((club) => (
            <button
              key={club}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === club
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(club)}
            >
              {club}
            </button>
          ))}
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-100 px-6 py-5 rounded-lg shadow-lg">
            <p>No users found for {activeTab === 'ALL' ? 'any club' : activeTab}.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Club</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">Credit Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-11 w-11 relative rounded-full overflow-hidden border-2 border-gray-600">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-blue-700 to-purple-700 flex items-center justify-center">
                                <span className="text-white font-medium text-lg">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'superadmin' ? 'bg-red-900/70 text-red-100 border border-red-700' :
                          user.role === 'admin' ? 'bg-purple-900/70 text-purple-100 border border-purple-700' :
                          user.role === 'member' ? 'bg-blue-900/70 text-blue-100 border border-blue-700' :
                          'bg-gray-700 text-gray-300 border border-gray-600'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.club === 'IEEE' ? 'bg-blue-900/70 text-blue-100 border border-blue-700' :
                          user.club === 'ACM' ? 'bg-green-900/70 text-green-100 border border-green-700' :
                          user.club === 'AWS' ? 'bg-yellow-900/70 text-yellow-100 border border-yellow-700' :
                          user.club === 'GDG' ? 'bg-red-900/70 text-red-100 border border-red-700' :
                          user.club === 'STIC' ? 'bg-purple-900/70 text-purple-100 border border-purple-700' :
                          'bg-gray-700 text-gray-300 border border-gray-600'
                        }`}>
                          {user.club || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (user.creditScore || 0) * 2)}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm font-medium">{user.creditScore || 0}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 