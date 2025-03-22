import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import TaskCard from './TaskCard';
import Modal from './Modal';

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

interface TodoProps {
  taskFilter?: string;
  assignedToMe?: boolean;
}

const Todo: React.FC<TodoProps> = ({ taskFilter = 'all', assignedToMe = false }) => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/tasks';
        if (taskFilter && taskFilter !== 'all') {
          url += `?status=${taskFilter}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (assignedToMe && session?.user?.id) {
          const filteredTasks = data.filter(
            (task: Task) => task.assignedTo._id === session.user.id
          );
          setTasks(filteredTasks);
        } else {
          setTasks(data);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [status, taskFilter, assignedToMe, session?.user?.id]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTask = await response.json();
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleVerifyTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: true }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTask = await response.json();
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      console.error('Failed to verify task:', err);
      setError('Failed to verify task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="p-6 text-center bg-gray-900/50 rounded-lg border border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400 text-lg">No tasks found</p>
          <p className="text-gray-500 mt-1">Tasks will appear here when they're assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onSelect={task => setSelectedTask(task)}
              onStatusChange={handleStatusChange}
              onVerifyTask={handleVerifyTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Todo; 