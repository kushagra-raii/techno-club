'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface FormData {
  title: string;
  description: string;
  credits: number;
  priority: string;
  assignedTo: string;
  dueDate?: string;
  status: TaskStatus;
  isGlobal?: boolean;
}

interface TaskFormProps {
  task?: any;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    credits: 10,
    priority: 'medium',
    assignedTo: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // One week from now
    status: 'pending',
    isGlobal: false
  });
  
  const [members, setMembers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!task;
  const isSuperAdmin = session?.user?.role === 'superadmin';
  
  // Fetch members for the dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      if (!session?.user) {
        console.log('No session user found. Cannot fetch members.');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Construct endpoint based on user role
        const endpoint = session.user.role === 'superadmin' 
          ? '/api/admin/members' 
          : `/api/admin/members?club=${session.user.club}&role=member`;
          
        console.log('Fetching members from endpoint:', endpoint);
        console.log('Current user role:', session.user.role);
        console.log('Current user club:', session.user.club);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Members data:', data);
        
        if (Array.isArray(data)) {
          setMembers(data);
        } else {
          console.error('Expected array of members but received:', data);
          setMembers([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [session?.user]);
  
  // If editing, pre-fill the form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        credits: task.credits || 10,
        priority: task.priority || 'medium',
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : undefined,
        status: task.status || 'pending',
        isGlobal: task.isGlobal || false
      });
    }
  }, [task]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    let hasErrors = false;
    const validationErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      hasErrors = true;
      validationErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      hasErrors = true;
      validationErrors.description = 'Description is required';
    }

    if (formData.priority === '') {
      hasErrors = true;
      validationErrors.priority = 'Priority is required';
    }

    if (formData.assignedTo === '') {
      hasErrors = true;
      validationErrors.assignedTo = 'Assignee is required';
    }

    if (formData.credits < 1 || formData.credits > 100) {
      hasErrors = true;
      validationErrors.credits = 'Credits must be between 1 and 100';
    }

    if (!formData.dueDate) {
      hasErrors = true;
      validationErrors.dueDate = 'Due date is required';
    }

    if (hasErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Debug logging
    console.log('Submitting task with data:', formData);
    console.log('Current session user:', session?.user);
    console.log('Members available:', members);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        dueDate: formData.dueDate,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        isGlobal: isSuperAdmin ? formData.isGlobal : false,
      };
      
      await onSubmit(taskData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assignedTo: '',
        credits: 10,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        isGlobal: false
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting task:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseFloat(value) : value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8 animate-fadeIn">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
        {isEditing ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Task
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Task
          </>
        )}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800/80 border ${
                  errors.title ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholder="Task title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 bg-gray-800/80 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholder="Describe the task details..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Assign To <span className="text-red-400">*</span>
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800/80 border ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                <option value="">Select a member</option>
                {members.length === 0 ? (
                  <option value="" disabled>No members available</option>
                ) : (
                  members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))
                )}
              </select>
              {errors.assignedTo && <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Priority <span className="text-red-400">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800/80 border ${
                  errors.priority ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Credits <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  step="0.1"
                  className={`w-full px-3 py-2 bg-gray-800/80 border ${
                    errors.credits ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                  } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 text-sm">pts</span>
                </div>
              </div>
              {errors.credits && <p className="mt-1 text-sm text-red-500">{errors.credits}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Due Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800/80 border ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                } rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
            </div>
            
            {isSuperAdmin && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isGlobal"
                    checked={formData.isGlobal}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded bg-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Global Task (available across all clubs)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-colors duration-200 shadow-md flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>{isEditing ? 'Update Task' : 'Create Task'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;