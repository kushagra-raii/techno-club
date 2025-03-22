import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`GET /api/tasks/${params.id} - Fetching task details`);
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log(`GET /api/tasks/${params.id} - Unauthorized: No session found`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`GET /api/tasks/${params.id} - User:`, {
      id: session.user.id,
      role: session.user.role,
      club: session.user.club
    });
    
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`GET /api/tasks/${params.id} - Invalid task ID format`);
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email image role club')
      .populate('createdBy', 'name email image role club');
    
    if (!task) {
      console.log(`GET /api/tasks/${params.id} - Task not found`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log(`GET /api/tasks/${params.id} - Task found:`, {
      id: task._id,
      title: task.title,
      status: task.status,
      club: task.club
    });

    // Check user permissions
    const userRole = session.user.role;
    const userClub = session.user.club as string;
    const userId = session.user.id;

    // Superadmin can view all tasks
    if (userRole === 'superadmin') {
      console.log(`GET /api/tasks/${params.id} - Superadmin access granted`);
      return NextResponse.json(task);
    }

    // Admin can view tasks from their club
    if (userRole === 'admin') {
      const taskClub = task.club?.toString() || '';
      if (taskClub === userClub) {
        console.log(`GET /api/tasks/${params.id} - Admin access granted for club task`);
        return NextResponse.json(task);
      }
      console.log(`GET /api/tasks/${params.id} - Admin access denied: Task not in admin's club`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Member can view their assigned tasks
    if (userRole === 'member') {
      // Check if assignedTo is a populated object with _id or just an id
      let assignedToId = '';
      if (typeof task.assignedTo === 'object' && task.assignedTo !== null) {
        assignedToId = (task.assignedTo as any)._id?.toString() || '';
      } else {
        assignedToId = task.assignedTo?.toString() || '';
      }
      
      if (assignedToId === userId) {
        console.log(`GET /api/tasks/${params.id} - Member access granted for assigned task`);
        return NextResponse.json(task);
      }
      console.log(`GET /api/tasks/${params.id} - Member access denied: Task not assigned to user`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log(`GET /api/tasks/${params.id} - Forbidden: User role ${userRole} not allowed`);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error: any) {
    console.error(`GET /api/tasks/${params.id} - Server error:`, error);
    console.error(`GET /api/tasks/${params.id} - Error stack:`, error.stack);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`PATCH /api/tasks/${params.id} - Updating task`);
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log(`PATCH /api/tasks/${params.id} - Unauthorized: No session found`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`PATCH /api/tasks/${params.id} - User:`, {
      id: session.user.id,
      role: session.user.role,
      club: session.user.club
    });
    
    const { id } = params;
    const data = await req.json();
    console.log(`PATCH /api/tasks/${params.id} - Request data:`, data);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`PATCH /api/tasks/${params.id} - Invalid task ID format`);
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    const task = await Task.findById(id);
    if (!task) {
      console.log(`PATCH /api/tasks/${params.id} - Task not found`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log(`PATCH /api/tasks/${params.id} - Current task state:`, {
      id: task._id,
      title: task.title,
      status: task.status,
      isVerified: task.isVerified
    });

    const userRole = session.user.role;
    const userClub = session.user.club as string;
    const userId = session.user.id;

    // Can update status and complete tasks
    if (data.status) {
      // Members can only update status of their assigned tasks to "in-progress" or "completed"
      if (userRole === 'member') {
        const assignedToId = task.assignedTo?.toString() || '';
        if (assignedToId !== userId) {
          console.log(`PATCH /api/tasks/${params.id} - Forbidden: Member can only update their own tasks`);
          return NextResponse.json({ error: 'You can only update your assigned tasks' }, { status: 403 });
        }
        
        if (!['in-progress', 'completed'].includes(data.status)) {
          console.log(`PATCH /api/tasks/${params.id} - Forbidden: Member can only set status to in-progress or completed`);
          return NextResponse.json({ error: 'You can only set tasks to in-progress or completed' }, { status: 403 });
        }
      }
      
      // Admin can only update tasks in their club, cannot mark verified directly
      if (userRole === 'admin') {
        const taskClub = task.club?.toString() || '';
        if (taskClub !== userClub) {
          console.log(`PATCH /api/tasks/${params.id} - Forbidden: Admin can only update tasks in their club`);
          return NextResponse.json({ error: 'You can only update tasks in your club' }, { status: 403 });
        }
        
        if (data.isVerified && !task.isVerified) {
          console.log(`PATCH /api/tasks/${params.id} - Admin verifying task`);
          // If admin is verifying a completed task, update user's credit score
          if (task.status === 'completed' || data.status === 'completed') {
            const assignedUser = await User.findById(task.assignedTo);
            if (assignedUser) {
              const newCreditScore = (assignedUser.creditScore || 0) + task.credits;
              console.log(`PATCH /api/tasks/${params.id} - Updating user credit score from ${assignedUser.creditScore} to ${newCreditScore}`);
              await User.findByIdAndUpdate(task.assignedTo, { 
                $inc: { creditScore: task.credits } 
              });
            }
          }
        }
      }
      
      task.status = data.status;
    }
    
    // Only admins and superadmins can update other task properties
    if (['admin', 'superadmin'].includes(userRole)) {
      if (userRole === 'admin') {
        const taskClub = task.club?.toString() || '';
        if (taskClub !== userClub) {
          console.log(`PATCH /api/tasks/${params.id} - Forbidden: Admin can only update tasks in their club`);
          return NextResponse.json({ error: 'You can only update tasks in your club' }, { status: 403 });
        }
      }
      
      if (data.title) task.title = data.title;
      if (data.description) task.description = data.description;
      if (data.priority) task.priority = data.priority;
      if (data.credits) task.credits = data.credits;
      if (data.dueDate) task.dueDate = new Date(data.dueDate);
      if (data.isVerified !== undefined) task.isVerified = data.isVerified;
    }
    
    console.log(`PATCH /api/tasks/${params.id} - Saving updated task`);
    await task.save();
    console.log(`PATCH /api/tasks/${params.id} - Task updated successfully`);
    
    return NextResponse.json(task);
  } catch (error: any) {
    console.error(`PATCH /api/tasks/${params.id} - Server error:`, error);
    console.error(`PATCH /api/tasks/${params.id} - Error stack:`, error.stack);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`DELETE /api/tasks/${params.id} - Deleting task`);
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log(`DELETE /api/tasks/${params.id} - Unauthorized: No session found`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`DELETE /api/tasks/${params.id} - User:`, {
      id: session.user.id,
      role: session.user.role,
      club: session.user.club
    });
    
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`DELETE /api/tasks/${params.id} - Invalid task ID format`);
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    const task = await Task.findById(id);
    if (!task) {
      console.log(`DELETE /api/tasks/${params.id} - Task not found`);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log(`DELETE /api/tasks/${params.id} - Task found:`, {
      id: task._id,
      title: task.title,
      status: task.status,
      isVerified: task.isVerified
    });

    const userRole = session.user.role;
    const userClub = session.user.club as string;
    const userId = session.user.id;

    // Check if the task is already verified
    if (task.isVerified) {
      console.log(`DELETE /api/tasks/${params.id} - Forbidden: Cannot delete verified tasks`);
      return NextResponse.json(
        { error: 'Verified tasks cannot be deleted' },
        { status: 403 }
      );
    }

    // Check permissions to delete
    const isTaskCreator = task.createdBy?.toString() === userId;
    const isClubAdmin = userRole === 'admin' && (task.club?.toString() || '') === userClub;
    const isSuperAdmin = userRole === 'superadmin';

    if (!isTaskCreator && !isClubAdmin && !isSuperAdmin) {
      console.log(`DELETE /api/tasks/${params.id} - Forbidden: User does not have permission to delete this task`);
      return NextResponse.json(
        { error: 'You do not have permission to delete this task' },
        { status: 403 }
      );
    }

    console.log(`DELETE /api/tasks/${params.id} - Deleting task`);
    await Task.findByIdAndDelete(id);
    console.log(`DELETE /api/tasks/${params.id} - Task deleted successfully`);
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error(`DELETE /api/tasks/${params.id} - Server error:`, error);
    console.error(`DELETE /api/tasks/${params.id} - Error stack:`, error.stack);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}