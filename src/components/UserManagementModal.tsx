'use client';

import React, { useState } from 'react';

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

type UserManagementModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  isSuperAdmin: boolean;
  adminClub?: ClubType;
  onSuccess?: (updatedUser: User) => void;
  onError?: (error: string) => void;
};

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  user,
  isOpen,
  onClose,
  isSuperAdmin,
  adminClub,
  onSuccess,
  onError,
}) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const [club, setClub] = useState<ClubType>(user.club || '');
  const [creditScore, setCreditScore] = useState<number>(user.creditScore || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const hasRoleChanged = role !== user.role;
    const hasClubChanged = club !== user.club;
    const hasCreditChanged = creditScore !== user.creditScore;

    if (!hasRoleChanged && !hasClubChanged && !hasCreditChanged) {
      setError('No changes to save');
      setLoading(false);
      return;
    }

    try {
      // Create an array of promises for each update
      const updates = [];
      const apiEndpoint = isSuperAdmin
        ? '/api/superadmin/manage-users'
        : '/api/admin/manage-members';

      if (hasRoleChanged) {
        updates.push(
          fetch(apiEndpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              action: 'update-role',
              data: { role },
            }),
          }).then(res => res.json())
        );
      }

      if (hasClubChanged) {
        updates.push(
          fetch(apiEndpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              action: 'assign-club',
              data: { club },
            }),
          }).then(res => res.json())
        );
      }

      if (hasCreditChanged) {
        updates.push(
          fetch(apiEndpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              action: 'update-credit',
              data: { creditScore },
            }),
          }).then(res => res.json())
        );
      }

      // Execute all updates in parallel
      const results = await Promise.all(updates);
      
      // Check if any request failed
      const failedUpdate = results.find(result => result.error);
      
      if (failedUpdate) {
        throw new Error(failedUpdate.message || 'Failed to update user');
      }

      // Get the most recent updated user data
      const updatedUser = results[results.length - 1].user || user;
      
      setSuccessMessage('User updated successfully');
      onSuccess?.(updatedUser);

      // Close modal after successful update
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage User: {user.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-md">
              {successMessage}
            </div>
          )}
          
          <div>
            <label className="block text-gray-400 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="user">User</option>
              <option value="member">Member</option>
              {isSuperAdmin && (
                <>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Club</label>
            <select
              value={club}
              onChange={(e) => setClub(e.target.value as ClubType)}
              disabled={loading || (!isSuperAdmin && adminClub && adminClub !== club && club !== '')}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="">No Club</option>
              {/* If admin, only show their club or no club */}
              {isSuperAdmin ? (
                <>
                  <option value="IEEE">IEEE</option>
                  <option value="ACM">ACM</option>
                  <option value="AWS">AWS</option>
                  <option value="GDG">GDG</option>
                  <option value="STIC">STIC</option>
                </>
              ) : (
                adminClub && <option value={adminClub}>{adminClub}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Credit Score</label>
            <input
              type="number"
              min="0"
              value={creditScore}
              onChange={(e) => setCreditScore(Number(e.target.value))}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white py-2 px-4 rounded-md"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementModal; 