'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

type MeetingFormData = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  meetLink?: string;
  club?: string;
  sendEmail: boolean;
};

export default function MeetingScheduler() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    meetLink: '',
    club: '',
    sendEmail: true
  });
  
  const isSuperAdmin = session?.user?.role === 'superadmin';
  const clubOptions = ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule meeting');
      }
      
      // Reset form on success
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        meetLink: '',
        club: '',
        sendEmail: true
      });
      
      setSuccessMessage(data.message || 'Meeting scheduled successfully');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule meeting');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">Schedule Club Meeting</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-900 text-green-200 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Weekly Standup"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-1">
              End Time *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lab 101 or Virtual"
            />
          </div>
          
          <div>
            <label htmlFor="meetLink" className="block text-sm font-medium text-gray-300 mb-1">
              Meeting Link
            </label>
            <input
              type="url"
              id="meetLink"
              name="meetLink"
              value={formData.meetLink}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://meet.google.com/..."
            />
          </div>
          
          {isSuperAdmin && (
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-gray-300 mb-1">
                Club *
              </label>
              <select
                id="club"
                name="club"
                value={formData.club}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Club</option>
                {clubOptions.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Meeting agenda and details..."
          ></textarea>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sendEmail"
            name="sendEmail"
            checked={formData.sendEmail}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="sendEmail" className="ml-2 text-sm font-medium text-gray-300">
            Send email notifications to all club members
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:ring-4 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
} 