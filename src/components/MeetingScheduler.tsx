'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

type FormErrors = {
  [key in keyof MeetingFormData]?: string;
};

export default function MeetingScheduler() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
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
  const isAdmin = session?.user?.role === 'admin';
  const clubOptions = ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'];
  
  // Set club automatically for admin users
  useEffect(() => {
    if (isAdmin && session?.user?.club) {
      setFormData(prev => ({
        ...prev,
        club: session.user.club as string
      }));
    }
  }, [session, isAdmin]);
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
        isValid = false;
      }
    }
    
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
      isValid = false;
    }
    
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
      isValid = false;
    } else if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time';
      isValid = false;
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }
    
    if (isSuperAdmin && !formData.club) {
      errors.club = 'Please select a club';
      isValid = false;
    }
    
    if (formData.meetLink && !isValidUrl(formData.meetLink)) {
      errors.meetLink = 'Please enter a valid URL';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
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
      
      // Clear validation error when user types
      if (formErrors[name as keyof MeetingFormData]) {
        setFormErrors({
          ...formErrors,
          [name]: undefined
        });
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
        club: isAdmin && session?.user?.club ? (session.user.club as string) : '',
        sendEmail: true
      });
      
      setSuccessMessage(data.message || 'Meeting scheduled successfully');
      
      // Refresh meetings list after creating a new one
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule meeting');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Schedule New Meeting
      </h2>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-200 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.title ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Weekly Standup"
            />
            {formErrors.title && <p className="mt-1 text-sm text-red-400">{formErrors.title}</p>}
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
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.date ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.date && <p className="mt-1 text-sm text-red-400">{formErrors.date}</p>}
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
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.startTime ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.startTime && <p className="mt-1 text-sm text-red-400">{formErrors.startTime}</p>}
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
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.endTime ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.endTime && <p className="mt-1 text-sm text-red-400">{formErrors.endTime}</p>}
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
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.location ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Lab 101 or Virtual"
            />
            {formErrors.location && <p className="mt-1 text-sm text-red-400">{formErrors.location}</p>}
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
              className={`w-full p-2.5 bg-gray-700 border ${formErrors.meetLink ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://meet.google.com/..."
            />
            {formErrors.meetLink && <p className="mt-1 text-sm text-red-400">{formErrors.meetLink}</p>}
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
                className={`w-full p-2.5 bg-gray-700 border ${formErrors.club ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Club</option>
                {clubOptions.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
              {formErrors.club && <p className="mt-1 text-sm text-red-400">{formErrors.club}</p>}
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
            rows={4}
            className={`w-full p-2.5 bg-gray-700 border ${formErrors.description ? 'border-red-500' : 'border-gray-600'} text-white rounded-md focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Meeting agenda and details..."
          ></textarea>
          {formErrors.description && <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sendEmail"
            name="sendEmail"
            checked={formData.sendEmail}
            onChange={handleInputChange}
            className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="sendEmail" className="text-sm font-medium text-gray-300">
            Send email notifications to members
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`px-5 py-2.5 font-medium rounded-md text-white transition-colors ${
            isLoading 
              ? 'bg-blue-800 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50'
          } w-full`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scheduling...
            </span>
          ) : 'Schedule Meeting'}
        </button>
      </form>
    </div>
  );
} 