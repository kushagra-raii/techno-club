'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface Task {
  _id: string;
  title: string;
  description: string;
  credits: number;
  status: TaskStatus;
  priority: TaskPriority;
  isVerified?: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
    club: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    role: string;
    club: string;
  };
  dueDate?: string;
  completedAt?: string;
  verifiedAt?: string;
  club?: string;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TasksListProps {
  onTaskSelect?: (task: Task) => void;
  filterByStatus?: string;
  assignedToMe?: boolean;
}

const TasksList: React.FC<TasksListProps> = ({ 
  onTaskSelect, 
  filterByStatus,
  assignedToMe = false
}) => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(filterByStatus || 'all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If filterByStatus prop changes, update internal state
    if (filterByStatus) {
      setStatusFilter(filterByStatus);
    }
  }, [filterByStatus]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Construct the query URL with filters
        let url = '/api/tasks';
        if (statusFilter && statusFilter !== 'all') {
          url += `?status=${statusFilter}`;
        }
        
        console.log('Fetching tasks from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Tasks data:', data);
        
        if (assignedToMe && session?.user?.id) {
          // Filter tasks to only those assigned to the current user
          const filteredTasks = data.filter(
            (task: Task) => task.assignedTo._id === session.user.id
          );
          setTasks(filteredTasks);
        } else {
          setTasks(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [status, statusFilter, assignedToMe, session?.user?.id]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      console.log(`Updating task ${taskId} status to ${newStatus}`);
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      
      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (err: any) {
      console.error('Failed to update task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleVerifyTask = async (taskId: string) => {
    try {
      console.log(`Verifying task ${taskId}`);
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: true }),
      });

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      
      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (err: any) {
      console.error('Failed to verify task:', err);
      setError('Failed to verify task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      console.log(`Deleting task ${taskId}`);
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(`Error: ${response.status}`);
      }

      // Remove the task from the local state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'credits':
          return b.credits - a.credits;
        case 'status':
          const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
          // Consider verified status (using isVerified)
          if (a.isVerified && !b.isVerified) return 1;
          if (!a.isVerified && b.isVerified) return -1;
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: TaskStatus, isVerified?: boolean) => {
    if (isVerified) {
      return 'bg-green-200 text-green-800';
    }
    
    switch (status) {
      case 'pending': return 'bg-gray-200 text-gray-800';
      case 'in-progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-6 text-center bg-gray-900/50 rounded-lg border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400 text-lg">No tasks found</p>
          <p className="text-gray-500 mt-1">Tasks assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-400">
                <span className="mr-2">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white rounded-md border border-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="credits">Credits</option>
                  <option value="status">Status</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {getSortedTasks().map((task) => (
              <div 
                key={task._id} 
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                        {task.title}
                        {task.isGlobal && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-900 text-indigo-200">
                            Global
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-400 mb-2">
                        Assigned to: <span className="text-gray-300">{task.assignedTo.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status, task.isVerified)}`}>
                        {task.isVerified ? 'Verified' : task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-300 text-sm line-clamp-2">{task.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Due</span>
                      <span className="text-gray-300">{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Credits</span>
                      <span className="text-purple-400 font-semibold">{task.credits} pts</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-2">
                    {session?.user?.role !== 'member' && onTaskSelect && (
                      <button
                        onClick={() => onTaskSelect(task)}
                        className="px-3 py-1.5 text-xs bg-indigo-900 hover:bg-indigo-800 text-white rounded-md transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                    )}
                    
                    {session?.user?.id === task.assignedTo._id && task.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                        className="px-3 py-1.5 text-xs bg-blue-900 hover:bg-blue-800 text-white rounded-md transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Start Task
                      </button>
                    )}
                    
                    {session?.user?.id === task.assignedTo._id && task.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusChange(task._id, 'completed')}
                        className="px-3 py-1.5 text-xs bg-yellow-900 hover:bg-yellow-800 text-white rounded-md transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete
                      </button>
                    )}
                    
                    {(session?.user?.role === 'admin' || session?.user?.role === 'superadmin' || session?.user?.id === task.createdBy._id) && 
                     task.status === 'completed' && !task.isVerified && (
                      <button
                        onClick={() => handleVerifyTask(task._id)}
                        className="px-3 py-1.5 text-xs bg-green-900 hover:bg-green-800 text-white rounded-md transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify
                      </button>
                    )}
                    
                    {(session?.user?.role === 'admin' || session?.user?.role === 'superadmin' || session?.user?.id === task.createdBy._id) && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-3 py-1.5 text-xs bg-red-900 hover:bg-red-800 text-white rounded-md transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksList;