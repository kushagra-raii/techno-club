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
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Credits</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned To</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {getSortedTasks().map((task) => (
              <tr key={task._id} className="hover:bg-gray-800 cursor-pointer" onClick={() => onTaskSelect && onTaskSelect(task)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{task.title}</div>
                  <div className="text-xs text-gray-400">{task.club || 'Global'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status, task.isVerified)}`}>
                    {task.isVerified ? 'Verified' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {task.credits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{task.assignedTo.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                    {session?.user.role === 'member' && task.assignedTo._id === session.user.id && task.status === 'pending' && !task.isVerified && (
                      <button 
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        Start
                      </button>
                    )}
                    {session?.user.role === 'member' && task.assignedTo._id === session.user.id && task.status === 'in-progress' && !task.isVerified && (
                      <button 
                        onClick={() => handleStatusChange(task._id, 'completed')}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        Complete
                      </button>
                    )}
                    {['admin', 'superadmin'].includes(session?.user.role as string) && task.status === 'completed' && !task.isVerified && (
                      <button 
                        onClick={() => handleVerifyTask(task._id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        Verify
                      </button>
                    )}
                    {['admin', 'superadmin'].includes(session?.user.role as string) && !task.isVerified && (
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksList;