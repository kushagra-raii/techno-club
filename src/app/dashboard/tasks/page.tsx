'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import TaskForm from '@/components/TaskForm';
import TasksList from '@/components/TasksList';
import MemberRankings from '@/components/MemberRankings';

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskViewFilter, setTaskViewFilter] = useState('all');

  // If user is a member, automatically filter to their tasks
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'member') {
      setTaskViewFilter('assignedToMe');
    }
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  // Check authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const userRole = session?.user?.role || '';
  const isAdminOrHigher = ['admin', 'superadmin'].includes(userRole);
  const isMember = userRole === 'member';

  const handleCreateTask = async (taskData: Record<string, any>) => {
    try {
      setErrorMessage('');
      
      console.log('Creating task with data:', taskData);
      console.log('Current user:', session?.user);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          isGlobal: taskData.isGlobal || false
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error creating task:', responseData);
        setErrorMessage(responseData.error || 'Failed to create task');
        return;
      }
      
      console.log('Task created successfully:', responseData);
      setSuccessMessage('Task created successfully!');
      setIsCreatingTask(false);
      
      // Refresh the task list or navigate as needed
      // You might want to add additional logic here
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleUpdateTask = async (taskData: Record<string, any>) => {
    if (!editingTask?._id) {
      setErrorMessage('No task selected for update');
      return;
    }
    
    try {
      setErrorMessage('');
      
      console.log('Updating task with data:', taskData);
      console.log('Task ID:', editingTask._id);
      
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error updating task:', responseData);
        setErrorMessage(responseData.error || 'Failed to update task');
        return;
      }
      
      console.log('Task updated successfully:', responseData);
      setSuccessMessage('Task updated successfully!');
      setEditingTask(null);
      
      // Refresh the task list or navigate as needed
      // You might want to add additional logic here
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-4 md:mb-0">
            Task Management
          </h1>
          
          <div className="flex space-x-4">
            {isAdminOrHigher && !isCreatingTask && !editingTask && (
              <button
                onClick={() => setIsCreatingTask(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create New Task
              </button>
            )}
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-900 text-green-200 rounded-md">
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-900 text-red-200 rounded-md">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {(isCreatingTask || editingTask) ? (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setIsCreatingTask(false);
              setEditingTask(null);
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Admin or higher view */}
            {isAdminOrHigher && (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="border-b border-gray-800 pb-4 mb-4">
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded-md ${
                        activeTab === 'tasks'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab('tasks')}
                    >
                      Tasks
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        activeTab === 'rankings'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab('rankings')}
                    >
                      Member Rankings
                    </button>
                  </div>
                </div>
                
                {activeTab === 'tasks' ? (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="taskViewFilter" className="mr-2 text-sm text-gray-400">
                        View:
                      </label>
                      <select
                        id="taskViewFilter"
                        value={taskViewFilter}
                        onChange={(e) => setTaskViewFilter(e.target.value)}
                        className="bg-gray-700 text-white rounded px-3 py-1"
                      >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending Tasks</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed Tasks</option>
                        <option value="verified">Verified Tasks</option>
                        <option value="assignedToMe">Assigned to Me</option>
                      </select>
                    </div>
                    
                    <TasksList 
                      filterByStatus={taskViewFilter === 'all' || taskViewFilter === 'assignedToMe' ? undefined : taskViewFilter}
                      onTaskSelect={(task) => setEditingTask(task)}
                      assignedToMe={taskViewFilter === 'assignedToMe'}
                    />
                  </div>
                ) : (
                  <MemberRankings
                    clubFilter={userRole === 'admin' ? session?.user?.club as string : undefined}
                    limit={50}
                  />
                )}
              </div>
            )}
            
            {/* For members - simplified view */}
            {isMember && (
              <div>
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-white mb-2">Your Credit Status</h2>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Current Credits:</span>
                        <span 
                          className={`text-lg font-bold ${
                            (session?.user?.creditScore || 0) >= 50 
                              ? 'text-green-500' 
                              : (session?.user?.creditScore || 0) >= 30
                              ? 'text-yellow-500'
                              : (session?.user?.creditScore || 0) >= 10
                              ? 'text-orange-500'
                              : 'text-red-500'
                          }`}
                        >
                          {session?.user?.creditScore || 0}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (session?.user?.creditScore || 0) >= 50 
                              ? 'bg-green-500' 
                              : (session?.user?.creditScore || 0) >= 30
                              ? 'bg-yellow-500'
                              : (session?.user?.creditScore || 0) >= 10
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, ((session?.user?.creditScore || 0) / 50) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-400">
                        {(session?.user?.creditScore || 0) >= 50 
                          ? 'Excellent! You have reached the top credit tier.'
                          : (session?.user?.creditScore || 0) >= 30
                          ? 'Good progress! Keep going to reach the next tier.'
                          : (session?.user?.creditScore || 0) >= 10
                          ? 'You\'re making progress. Complete more tasks to increase your credits.'
                          : 'Start completing tasks to earn credits and improve your ranking.'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Your Tasks</h2>
                  <TasksList assignedToMe={true} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}