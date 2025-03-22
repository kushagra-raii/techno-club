'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserManagementModal from '@/components/UserManagementModal';

type UserRole = 'user' | 'member' | 'admin' | 'superadmin';
type ClubType = '' | 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  club?: ClubType;
  creditScore?: number;
};

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSuperAdmin = session?.user?.role === 'superadmin';
  const isAdmin = session?.user?.role === 'admin' || isSuperAdmin;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !isAdmin) {
      router.push('/dashboard');
    } else if (status === 'authenticated' && isAdmin) {
      fetchUsers();
    }
  }, [status, isAdmin, router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Superadmins use the users endpoint to see all users
      // Regular admins use the members endpoint to see only members/users
      const endpoint = isSuperAdmin ? '/api/admin/users' : '/api/admin/members';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = (updatedUser: User) => {
    setSuccessMessage(`Successfully updated ${updatedUser.name}`);
    
    // Update the user in the list
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    
    // Clear error after 3 seconds
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Filter users - no need to show all users for superadmin if specified
  const filteredUsers = users;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-white p-4 rounded-md mb-6">
            {successMessage}
          </div>
        )}
        
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {isSuperAdmin ? 'All Users' : 'Club Members'}
            </h2>
            <button
              onClick={() => fetchUsers()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Refresh List
            </button>
          </div>
          
          {filteredUsers.length === 0 ? (
            <p className="text-gray-400 p-4 text-center">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Club</th>
                    <th className="text-left p-3">Credit Score</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full bg-gray-800 text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {user.club ? (
                          <span className="px-2 py-1 rounded-full bg-blue-900/50 text-xs">
                            {user.club}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {user.creditScore !== undefined ? user.creditScore : '-'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserManagementModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isSuperAdmin={isSuperAdmin}
          adminClub={session?.user?.club as ClubType}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
} 