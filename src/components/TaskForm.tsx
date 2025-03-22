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
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
              placeholder="Task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Assign To
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.assignedTo ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
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
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Credits
            </label>
            <input
              type="number"
              name="credits"
              min="1"
              max="100"
              value={formData.credits}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.credits ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
            />
            {errors.credits && <p className="mt-1 text-sm text-red-500">{errors.credits}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.priority ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.dueDate ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
          </div>
          
          {isSuperAdmin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isGlobal"
                id="isGlobal"
                checked={formData.isGlobal}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-500 border-gray-700 rounded"
              />
              <label htmlFor="isGlobal" className="ml-2 block text-sm text-gray-400">
                Global Task (visible to all clubs)
              </label>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              } rounded-md text-white`}
              placeholder="Task description"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              'Processing...' : 
              isEditing ? 'Update Task' : 'Create Task'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;