'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import TasksList from '@/components/TasksList';
import MemberRankings from '@/components/MemberRankings';

// Define the Task type
interface Task {
  _id: string;
  title: string;
  description: string;
  credits: number;
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  priority: 'low' | 'medium' | 'high';
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

// Task data type for API operations
interface TaskData {
  title: string;
  description: string;
  credits: number;
  priority: string;
  assignedTo: string;
  dueDate?: string;
  status: string;
  isGlobal?: boolean;
}

// Function to get gradient based on credit score
const getCreditGradient = (creditScore: number): string => {
  if (creditScore >= 80) {
    // High credits: purple to gold gradient
    return 'from-purple-500 to-amber-400';
  } else if (creditScore >= 50) {
    // Medium credits: indigo to purple gradient
    return 'from-indigo-500 to-purple-500';
  } else if (creditScore >= 25) {
    // Low credits: blue to indigo gradient
    return 'from-blue-500 to-indigo-500';
  } else {
    // Very low credits: teal to blue gradient
    return 'from-teal-500 to-blue-500';
  }
};

// Function to get credit level text based on credit score
const getCreditLevel = (creditScore: number): string => {
  if (creditScore >= 80) return 'Expert';
  if (creditScore >= 50) return 'Advanced';
  if (creditScore >= 25) return 'Intermediate';
  return 'Beginner';
};

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskViewFilter, setTaskViewFilter] = useState('all');

  // Credit score from session or default to 0
  const userCreditScore = session?.user?.creditScore || 0;
  
  // Get gradient classes based on user's credit score
  const creditGradient = getCreditGradient(userCreditScore);
  const creditLevel = getCreditLevel(userCreditScore);

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

  const handleCreateTask = async (taskData: TaskData) => {
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

  const handleUpdateTask = async (taskData: TaskData) => {
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
    <div className="min-h-screen bg-black bg-[radial-gradient(circle,#0f0f0f_1px,transparent_1px)] bg-[length:24px_24px]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-4 md:mb-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Task Management
          </h1>
          
          <div className="flex space-x-4">
            {isAdminOrHigher && !isCreatingTask && !editingTask && (
              <button
                onClick={() => setIsCreatingTask(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-md transition-all duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Task
              </button>
            )}
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-200 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
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
              setSuccessMessage('');
              setErrorMessage('');
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Admin or higher view */}
            {isAdminOrHigher && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                <div className="border-b border-gray-800 overflow-x-auto">
                  <div className="flex p-4">
                    <button
                      className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                        activeTab === 'tasks'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab('tasks')}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Tasks
                      </span>
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ml-2 transition-all duration-200 font-medium ${
                        activeTab === 'rankings'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab('rankings')}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Member Rankings
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {activeTab === 'tasks' ? (
                    <div>
                      <div className="mb-6 bg-gray-800/70 p-4 rounded-lg">
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <label htmlFor="taskViewFilter" className="text-sm text-gray-400 mb-1 block">
                              View Tasks:
                            </label>
                            <select
                              id="taskViewFilter"
                              value={taskViewFilter}
                              onChange={(e) => setTaskViewFilter(e.target.value)}
                              className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="all">All Tasks</option>
                              <option value="pending">Pending Tasks</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed Tasks</option>
                              <option value="verified">Verified Tasks</option>
                              <option value="assignedToMe">Assigned to Me</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <TasksList 
                        filterByStatus={taskViewFilter === 'all' || taskViewFilter === 'assignedToMe' ? undefined : taskViewFilter}
                        onTaskSelect={(task) => setEditingTask(task as Task)}
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
              </div>
            )}
            
            {/* For members - simplified view */}
            {isMember && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden p-6">
                  <div className="mb-6">
                    <h2 className={`text-xl font-semibold bg-gradient-to-r ${creditGradient} bg-clip-text text-transparent mb-4 flex items-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${creditGradient.split('-')[1]}-400`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Your Credit Status
                    </h2>
                    
                    <div className={`bg-gray-800/50 rounded-lg p-6 border border-${creditGradient.split('-')[1]}-900/30`}>
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <span className="text-gray-400 text-sm block mb-1">Current Credits:</span>
                          <span className={`text-2xl font-bold text-${creditGradient.split('-')[1]}-400`}>
                            {userCreditScore} credits
                          </span>
                        </div>
                        
                        <div className="mb-4 md:mb-0">
                          <span className="text-gray-400 text-sm block mb-1">Credit Level:</span>
                          <span className={`text-lg font-semibold bg-gradient-to-r ${creditGradient} bg-clip-text text-transparent`}>
                            {creditLevel}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-gray-400 text-sm block mb-1">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${creditGradient} rounded-full`}
                                style={{
                                  width: `${Math.min(100, (userCreditScore / 100) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">
                              {userCreditScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Your Tasks
                  </h3>
                  
                  <div className="mb-4">
                    <div className="inline-flex rounded-md shadow-sm mb-4">
                      <button
                        onClick={() => setTaskViewFilter('assignedToMe')}
                        className={`px-3 py-1.5 text-sm rounded-l-md ${
                          taskViewFilter === 'assignedToMe' 
                            ? `bg-gradient-to-r ${creditGradient} text-white` 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setTaskViewFilter('pending')}
                        className={`px-3 py-1.5 text-sm ${
                          taskViewFilter === 'pending' 
                            ? `bg-gradient-to-r ${creditGradient} text-white` 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => setTaskViewFilter('in-progress')}
                        className={`px-3 py-1.5 text-sm ${
                          taskViewFilter === 'in-progress' 
                            ? `bg-gradient-to-r ${creditGradient} text-white` 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => setTaskViewFilter('completed')}
                        className={`px-3 py-1.5 text-sm rounded-r-md ${
                          taskViewFilter === 'completed' || taskViewFilter === 'verified'
                            ? `bg-gradient-to-r ${creditGradient} text-white` 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Task list */}
                <TasksList 
                  filterByStatus={taskViewFilter === 'assignedToMe' ? undefined : taskViewFilter}
                  assignedToMe={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}