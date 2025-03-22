'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  club: string;
  creditScore: number;
};

type RequestData = {
  userId: string;
  action: string;
  data?: {
    role?: string;
    name?: string;
    email?: string;
    club?: string;
    creditScore?: number;
  };
};

type ApiError = {
  message: string;
};

const Sidebar = () => {
  const { data: session } = useSession();
  
  return (
    <div className="bg-gray-900 w-64 min-h-screen p-5 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || 'User'} className="h-10 w-10 rounded-full" />
            ) : (
              <span className="text-white text-sm">{session?.user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <p className="text-white font-medium">{session?.user?.name}</p>
            <p className="text-gray-400 text-sm">{session?.user?.role}</p>
            {session?.user?.club && (
              <p className="text-indigo-400 text-xs">{session.user.club}</p>
            )}
          </div>
        </div>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/user-management" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              User Management
            </Link>
          </li>
          <li>
            <Link 
              href="/profile" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              My Profile
            </Link>
          </li>
          <li>
            <Link 
              href="/" 
              className="flex items-center text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Back to Site
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    club: '',
    creditScore: 0,
  });

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !['admin', 'superadmin'].includes(session?.user?.role as string)) {
      router.push('/');
    } else if (status === 'authenticated') {
      // Fetch users if authenticated as admin
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app you would fetch from your API
      const response = await fetch('/api/admin/members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      // Filter to only show users and members (not admins or superadmins)
      // If admin has a club, only show users in their club or with no club
      const filteredUsers = data.users.filter(
        (user: User) => ['user', 'member'].includes(user.role) && 
        (session?.user?.club ? user.club === session.user.club || user.club === '' : true)
      );
      
      setUsers(filteredUsers);
    } catch (err) {
      setError('Error fetching members. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser || !action) return;
    
    try {
      setLoading(true);
      
      const requestData: RequestData = {
        userId: selectedUser.id,
        action,
      };
      
      if (action === 'update-role') {
        requestData.data = { role: formData.role };
      } else if (action === 'update-info') {
        requestData.data = {
          name: formData.name || undefined,
          email: formData.email || undefined,
        };
      } else if (action === 'assign-club') {
        // If admin has a club, only allow assigning their club
        const clubToAssign = session?.user?.club && session.user.club !== '' 
          ? session.user.club 
          : formData.club;
          
        requestData.data = { club: clubToAssign };
      } else if (action === 'update-credit') {
        requestData.data = { creditScore: formData.creditScore };
      }
      
      const response = await fetch('/api/admin/manage-members', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      // Update local state
      if (action === 'delete') {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSuccessMessage(`Deleted user ${selectedUser.name}`);
      } else if (action === 'update-role') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, role: formData.role };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s role to ${formData.role}`);
      } else if (action === 'update-info') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { 
              ...user, 
              name: formData.name || user.name,
              email: formData.email || user.email,
            };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s information`);
      } else if (action === 'assign-club') {
        const clubToAssign = session?.user?.club && session.user.club !== '' 
          ? session.user.club 
          : formData.club;
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, club: clubToAssign };
          }
          return user;
        }));
        setSuccessMessage(`Assigned ${selectedUser.name} to ${clubToAssign} club`);
      } else if (action === 'update-credit') {
        setUsers(users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, creditScore: formData.creditScore };
          }
          return user;
        }));
        setSuccessMessage(`Updated ${selectedUser.name}'s credit score to ${formData.creditScore}`);
      }
      
      // Reset state
      setSelectedUser(null);
      setAction('');
      setFormData({
        name: '',
        email: '',
        role: '',
        club: '',
        creditScore: 0,
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (user: User, actionType: string) => {
    setSelectedUser(user);
    setAction(actionType);
    
    if (actionType === 'update-info') {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    } else if (actionType === 'update-role') {
      setFormData({
        ...formData,
        role: user.role,
      });
    } else if (actionType === 'assign-club') {
      setFormData({
        ...formData,
        club: user.club,
      });
    } else if (actionType === 'update-credit') {
      setFormData({
        ...formData,
        creditScore: user.creditScore,
      });
    }
  };

  // Helper function for displaying club badge
  const getClubBadgeClass = (club: string) => {
    switch (club) {
      case 'IEEE':
        return 'bg-blue-500/20 text-blue-300';
      case 'ACM':
        return 'bg-green-500/20 text-green-300';
      case 'AWS':
        return 'bg-orange-500/20 text-orange-300';
      case 'GDG':
        return 'bg-red-500/20 text-red-300';
      case 'STIC':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile header with menu */}
      <div className="md:hidden w-full fixed top-0 left-0 bg-gray-900 z-10 px-4 py-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 md:ml-64 mt-12 md:mt-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Manage Members
              </h1>
              {session?.user?.club && (
                <p className="text-gray-400 mt-2">
                  Admin of club: <span className={`px-2 py-1 rounded-full text-xs ${getClubBadgeClass(session.user.club)}`}>{session.user.club}</span>
                </p>
              )}
            </div>
            <div className="hidden md:block">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
          
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
          
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm"
              >
                Create New User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Club</th>
                    <th className="px-4 py-3 text-left">Credits</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 flex items-center space-x-3">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white text-sm">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <span>{user.name}</span>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'member' ? 'bg-green-500/20 text-green-300' : 
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.club ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${getClubBadgeClass(user.club)}`}>
                            {user.club}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
                          {user.creditScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openActionModal(user, 'update-role')}
                            className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm"
                          >
                            Role
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'assign-club')}
                            className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors text-white text-sm"
                          >
                            Club
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'update-credit')}
                            className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 transition-colors text-white text-sm"
                          >
                            Credits
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'update-info')}
                            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openActionModal(user, 'delete')}
                            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-8">
                No members found.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            {action === 'update-role' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Update User Role</h3>
                <p className="mb-4">
                  Change role for <span className="font-medium">{selectedUser.name}</span>
                </p>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Select Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                  >
                    <option value="">Select role...</option>
                    <option value="member">Member</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </>
            )}
            
            {action === 'update-info' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Edit User Information</h3>
                <p className="mb-4">
                  Update information for <span className="font-medium">{selectedUser.name}</span>
                </p>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                  />
                </div>
              </>
            )}
            
            {action === 'assign-club' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Assign Club</h3>
                <p className="mb-4">
                  Assign club for <span className="font-medium">{selectedUser.name}</span>
                </p>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Select Club</label>
                  <select
                    value={formData.club}
                    onChange={(e) => setFormData({...formData, club: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                    disabled={session?.user?.club && session.user.club !== ''}
                  >
                    <option value="">No Club</option>
                    {!session?.user?.club || session.user.club === '' ? (
                      <>
                        <option value="IEEE">IEEE</option>
                        <option value="ACM">ACM</option>
                        <option value="AWS">AWS</option>
                        <option value="GDG">GDG</option>
                        <option value="STIC">STIC</option>
                      </>
                    ) : (
                      <option value={session.user.club}>{session.user.club}</option>
                    )}
                  </select>
                  {session?.user?.club && session.user.club !== '' && (
                    <p className="mt-2 text-xs text-gray-400">
                      As an admin, you can only assign users to your own club: {session.user.club}
                    </p>
                  )}
                </div>
              </>
            )}
            
            {action === 'update-credit' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Update Credit Score</h3>
                <p className="mb-4">
                  Update credit score for <span className="font-medium">{selectedUser.name}</span>
                </p>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Credit Score</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({...formData, creditScore: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                  />
                </div>
              </>
            )}
            
            {action === 'delete' && (
              <>
                <h3 className="text-xl font-semibold mb-4">Delete User</h3>
                <p className="mb-4">
                  Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>?
                  This action cannot be undone.
                </p>
              </>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setAction('');
                }}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUserAction}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  action === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {action === 'delete' ? 'Delete' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;