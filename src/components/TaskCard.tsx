import React, { useState } from 'react';
import Modal from './Modal';
import { format } from 'date-fns';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface TaskCreator {
  _id: string;
  name: string;
  email: string;
  role: string;
  club: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  credits: number;
  status: TaskStatus;
  priority: TaskPriority;
  isVerified?: boolean;
  createdBy: TaskCreator;
  assignedTo: TaskCreator;
  dueDate?: string;
  completedAt?: string;
  verifiedAt?: string;
  club?: string;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  onVerifyTask?: (taskId: string) => Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onSelect,
  onStatusChange,
  onDeleteTask,
  onVerifyTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (!dateString) return 'Not set';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusLabel = (status: TaskStatus, isVerified?: boolean) => {
    if (isVerified) return 'Verified';
    
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: {
        const statusString = status as string;
        return statusString.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
                {getStatusLabel(task.status, task.isVerified)}
              </span>
            </div>
          </div>
          
          <div className="mt-3">
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            
            {onSelect && (
              <button
                onClick={() => onSelect(task)}
                className="px-3 py-1.5 text-xs bg-indigo-900 hover:bg-indigo-800 text-white rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            )}
            
            {onStatusChange && task.status === 'pending' && (
              <button
                onClick={() => onStatusChange(task._id, 'in-progress')}
                className="px-3 py-1.5 text-xs bg-blue-900 hover:bg-blue-800 text-white rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Start Task
              </button>
            )}
            
            {onStatusChange && task.status === 'in-progress' && (
              <button
                onClick={() => onStatusChange(task._id, 'completed')}
                className="px-3 py-1.5 text-xs bg-yellow-900 hover:bg-yellow-800 text-white rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Complete
              </button>
            )}
            
            {onVerifyTask && task.status === 'completed' && !task.isVerified && (
              <button
                onClick={() => onVerifyTask(task._id)}
                className="px-3 py-1.5 text-xs bg-green-900 hover:bg-green-800 text-white rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verify
              </button>
            )}
            
            {onDeleteTask && (
              <button
                onClick={() => onDeleteTask(task._id)}
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={task.title}
      >
        <div className="p-6 pt-4">
          {task.isGlobal && (
            <div className="mb-4">
              <span className="px-2 py-1 text-xs rounded-full bg-indigo-900 text-indigo-200">
                Global Task
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
              <div className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(task.status, task.isVerified)}`}>
                {getStatusLabel(task.status, task.isVerified)}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Priority</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Credits</h4>
              <p className="text-purple-400 font-semibold">{task.credits} points</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Due Date</h4>
              <p className="text-white">{formatDate(task.dueDate)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Assigned To</h4>
              <p className="text-white">{task.assignedTo.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Created By</h4>
              <p className="text-white">{task.createdBy.name}</p>
            </div>
            {task.completedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Completed At</h4>
                <p className="text-white">{formatDate(task.completedAt)}</p>
              </div>
            )}
            {task.isVerified && task.verifiedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Verified At</h4>
                <p className="text-white">{formatDate(task.verifiedAt)}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Created At</h4>
              <p className="text-gray-300 text-sm">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
            <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
              <p className="text-white whitespace-pre-line">{task.description}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 border-t border-gray-700 pt-4">
            {onSelect && (
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onSelect(task);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                Edit Task
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard; 