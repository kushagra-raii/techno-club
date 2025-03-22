'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const TestSuperAdminClubAssignment: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState('67dde16e8d366dedcab6db15');
  const [club, setClub] = useState('ACM');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not a superadmin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/superadmin/manage-users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'assign-club',
          data: { club },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign club to user');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Test Super Admin Club Assignment</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {result && (
          <div className="bg-green-500/20 border border-green-500 text-white p-4 rounded-md mb-6">
            <h3 className="font-semibold">{result.message}</h3>
            {result.user && (
              <div className="mt-2">
                <p>User: {result.user.name}</p>
                <p>Email: {result.user.email}</p>
                <p>Role: {result.user.role}</p>
                <p>Club: {result.user.club || 'None'}</p>
                <p>Credit Score: {result.user.creditScore}</p>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Club</label>
            <select
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              required
            >
              <option value="">No Club</option>
              <option value="IEEE">IEEE</option>
              <option value="ACM">ACM</option>
              <option value="AWS">AWS</option>
              <option value="GDG">GDG</option>
              <option value="STIC">STIC</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Processing...' : 'Assign Club'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestSuperAdminClubAssignment; 