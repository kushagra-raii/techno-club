'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  email: string;
  club: string;
  role: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayClub, setDisplayClub] = useState<string | undefined>(clubFilter);
  const [roleFilter, setRoleFilter] = useState<string | undefined>('member');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Construct URL based on filters and user role
        let url = '';
        const params = new URLSearchParams();
        const userRole = session.user.role;
        const isSuperAdmin = userRole === 'superadmin';
        const isAdmin = userRole === 'admin';
        
        // For superadmins viewing all users across all clubs/roles
        if (isSuperAdmin && roleFilter === 'all') {
          url = '/api/admin/users';
          if (displayClub) {
            params.append('club', displayClub);
          }
        } 
        // For admins, always filter by their club
        else if (isAdmin) {
          url = '/api/admin/members';
          // Force club filter to be the admin's club
          const adminClub = session.user.club as string;
          params.append('club', adminClub);
          // Filter by member role for admins
          params.append('role', 'member');
        }
        // For other scenarios (superadmins with filtered views)
        else {
          url = '/api/admin/members';
          
          if (roleFilter) {
            params.append('role', roleFilter);
          }
          
          if (displayClub) {
            params.append('club', displayClub);
          }
        }
        
        // Add params to URL if there are any
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log('Fetching users ranking from:', url);
        console.log('Current user role:', session.user.role);
        console.log('Club filter:', displayClub);
        console.log('Role filter:', roleFilter);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched rankings data:', data);
        
        // Ensure data is in the correct format
        if (Array.isArray(data)) {
          // Sort by credit score (descending)
          const sortedUsers = data.sort((a: User, b: User) => 
            b.creditScore - a.creditScore
          );
          
          setUsers(sortedUsers.slice(0, limit));
        } else {
          console.error('Unexpected data format:', data);
          setUsers([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      // If admin, always set display club to their club
      if (session.user.role === 'admin') {
        setDisplayClub(session.user.club as string);
      }
      
      fetchUsers();
    }
  }, [session, displayClub, roleFilter, limit]);

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

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value === 'all' ? 'all' : e.target.value);
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

  const isSuperAdmin = session?.user?.role === 'superadmin';
  const isAdmin = session?.user?.role === 'admin';
  const title = isSuperAdmin && roleFilter === 'all' ? 'User Rankings' : 'Club Member Rankings';

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-800 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">
          {isAdmin ? `${session?.user?.club} Member Rankings` : title}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Only show role filter to superadmins */}
          {isSuperAdmin && (
            <div>
              <label htmlFor="roleFilter" className="mr-2 text-sm text-gray-400">Role:</label>
              <select
                id="roleFilter"
                value={roleFilter || 'member'}
                onChange={handleRoleFilterChange}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="member">Members</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
            </div>
          )}
          
          {/* Only show club filter to superadmins */}
          {isSuperAdmin && (
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
      </div>

      {users.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-400">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                {/* Only show club column for superadmins when not filtering by club */}
                {!displayClub && isSuperAdmin && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Club</th>
                )}
                {/* Only show role column for superadmins when viewing all roles */}
                {isSuperAdmin && roleFilter === 'all' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {users.map((user, index) => (
                <tr key={user._id} className={`${getCreditBackgroundColor(user.creditScore)}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  {/* Only show club column for superadmins when not filtering by club */}
                  {!displayClub && isSuperAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.club || 'None'}
                    </td>
                  )}
                  {/* Only show role column for superadmins when viewing all roles */}
                  {isSuperAdmin && roleFilter === 'all' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getCreditColor(user.creditScore)}`}>
                      {user.creditScore} credits
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