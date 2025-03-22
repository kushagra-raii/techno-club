"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type FormState = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  club: string;
  ticketPrice: number;
  capacity: number;
  requireApproval: boolean;
  imageBase64: string;
};

const initialForm: FormState = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  club: '',
  ticketPrice: 0,
  capacity: 30,
  requireApproval: false,
  imageBase64: '',
};

const clubs = ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'];

const CreateEventPage = () => {
  const { data: session, status } = useSession();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userClub, setUserClub] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    // Get user role and club from session
    if (session?.user) {
      // @ts-expect-error - session.user.role is not typed in the default NextAuth types
      const role = session.user.role as string || 'user';
      // @ts-expect-error - session.user.club is not typed in the default NextAuth types
      const club = session.user.club as string || '';
      
      setUserRole(role);
      setUserClub(club);
      
      // For non-superadmins, pre-select their club and disable the field
      if (role !== 'superadmin' && club) {
        setForm(prev => ({ ...prev, club }));
      }
    }
  }, [session, status, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (type === 'number') {
      setForm(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setForm(prev => ({
        ...prev,
        imageBase64: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewImage('');
    setForm(prev => ({
      ...prev,
      imageBase64: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAIDescription = async () => {
    try {
      setAiLoading(true);
      setError('');
      
      // Check if we have event name and club at minimum
      if (!form.name || !form.club) {
        throw new Error('Please enter event name and select a club to generate a description');
      }
      
      // Prepare prompt for OpenAI
      const prompt = `Generate a compelling, detailed description for a college tech event with the following details:
      
Event Name: ${form.name}
Hosting Club: ${form.club}
${form.location ? `Location: ${form.location}` : ''}
${form.startDate ? `Start Date: ${new Date(form.startDate).toLocaleString()}` : ''}
${form.endDate ? `End Date: ${new Date(form.endDate).toLocaleString()}` : ''}
${form.ticketPrice > 0 ? `Ticket Price: ₹${form.ticketPrice}` : 'Free Entry'}
${form.capacity ? `Capacity: ${form.capacity} attendees` : ''}
${form.requireApproval ? 'Requires approval for registration' : ''}

The description should be engaging, informative, and highlight what attendees can expect from the event. Make it around 3-4 paragraphs.`;

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'You are an experienced event coordinator for tech events in a college. Write engaging and professional event descriptions.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate description');
      }
      
      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content?.trim();
      
      if (!generatedText) {
        throw new Error('No description was generated');
      }
      
      // Update the form with the generated description
      setForm(prev => ({
        ...prev,
        description: generatedText
      }));
      
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Basic validation
      if (!form.name || !form.description || !form.startDate || !form.endDate || !form.location || !form.club) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate dates
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      const now = new Date();
      
      if (startDate < now) {
        throw new Error('Start date cannot be in the past');
      }
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
      
      // Submit the form to API
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }
      
      // On success, redirect to events page
      router.push('/dashboard/events');
      router.refresh();
      
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Determine club selection help text
  const getClubHelpText = () => {
    if (userRole === 'superadmin') return 'As a superadmin, you can create events for any club.';
    if (userClub) return `Events you create will be associated with ${userClub}.`;
    return 'Select the club hosting this event.';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-xl">
      <h1 className="text-3xl font-bold mb-2 text-indigo-400">Create New Event</h1>
      <p className="text-gray-400 mb-6">Fill in the details below to create a new event.</p>
      
      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-lg shadow">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event details section */}
        <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Event Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Event Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="Give your event a catchy name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="Where will the event be held?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-gray-300 mb-1">
                Hosting Club*
              </label>
              <select
                id="club"
                name="club"
                value={form.club}
                onChange={handleChange}
                disabled={userRole !== 'superadmin' && !!userClub}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-600 disabled:text-gray-400 placeholder-gray-400"
                required
              >
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-400">{getClubHelpText()}</p>
            </div>
          </div>
        </div>
        
        {/* Dates and Time */}
        <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Date and Time
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                Start Date and Time*
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                End Date and Time*
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Additional Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-300 mb-1">
                Ticket Price (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full pl-8 px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  placeholder="0"
                />
              </div>
              <p className="mt-1 text-sm text-gray-400">Leave at 0 for free events</p>
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                Capacity*
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="mt-1 text-sm text-gray-400">Maximum number of participants allowed</p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="requireApproval"
                checked={form.requireApproval}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-500 rounded"
              />
              <span className="ml-3 text-sm text-gray-300">Require approval for participation</span>
            </label>
            <p className="mt-1 text-sm text-gray-400 ml-8">If checked, participants will need approval before they can join the event</p>
          </div>
        </div>
        
        {/* Event Image */}
        <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Event Image
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Image (Optional)
            </label>
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          
          {previewImage && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Image Preview</h3>
              <div className="relative w-full h-64 mb-3 border rounded-lg overflow-hidden bg-gray-700 border-gray-600">
                <Image 
                  src={previewImage} 
                  alt="Preview" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-400 bg-red-900 rounded-md hover:bg-red-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Remove image
              </button>
            </div>
          )}
        </div>
        
        {/* Description Section - Moved to the end */}
        <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Event Description
          </h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1 flex justify-between items-center">
              <span>Description*</span>
              <button
                type="button"
                onClick={generateAIDescription}
                disabled={aiLoading}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md ${
                  aiLoading 
                    ? 'bg-purple-700 opacity-70 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-500'
                }`}
              >
                {aiLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={7}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              placeholder="Describe what your event is about, what attendees can expect, etc."
              required
            />
            <p className="mt-1 text-sm text-gray-400">Fill in all event details above for better AI-generated descriptions</p>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 bg-transparent hover:bg-gray-700 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white shadow-md flex items-center space-x-2 ${
              loading ? 'bg-indigo-700 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Create Event</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage; 