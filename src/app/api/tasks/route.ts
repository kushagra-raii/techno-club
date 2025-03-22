import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import type { ITask } from '@/lib/models/Task';
import mongoose from 'mongoose';

// ... existing code ...

// GET - Fetch tasks based on user role
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/tasks - Fetching tasks');
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('GET /api/tasks - Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('GET /api/tasks - User:', {
      id: session.user.id,
      role: session.user.role,
      club: session.user.club
    });
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    console.log('GET /api/tasks - Query params:', {
      status: status || 'all'
    });
    
    const query: Record<string, unknown> = {};
    
    // Apply status filter if provided
    if (status && status !== 'all' && status !== 'verified') {
      query.status = status;
    } else if (status === 'verified') {
      query.isVerified = true;
    }
    
    const userRole = session.user.role;
    const userClub = session.user.club;
    const userId = session.user.id;
    
    // Filter tasks based on user role
    if (userRole === 'member') {
      // Members can only see tasks assigned to them
      query.assignedTo = userId;
    } else if (userRole === 'admin') {
      // Admins can see tasks in their club
      query.club = userClub;
    }
    // Superadmins can see all tasks (no additional filter)
    
    console.log('GET /api/tasks - Final query:', query);
    
    // Fetch tasks with populated references
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email image role club')
      .populate('createdBy', 'name email image role club')
      .sort({ createdAt: -1 });
    
    console.log(`GET /api/tasks - Found ${tasks.length} tasks`);
    
    return NextResponse.json(tasks);
  } catch (error: unknown) {
    console.error('GET /api/tasks - Server Error:', error);
    const err = error as Error;
    console.error('GET /api/tasks - Error stack:', err.stack);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}

// POST - Create a new task
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/tasks - Creating new task');
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('POST /api/tasks - Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = session.user.role;
    const userId = session.user.id;
    const userClub = session.user.club;
    
    // Only allow admins or superadmins to create tasks
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      console.log('POST /api/tasks - Unauthorized: Only admins can create tasks');
      return NextResponse.json({ error: 'Unauthorized: Only admins can create tasks' }, { status: 403 });
    }
    
    console.log('POST /api/tasks - User:', {
      id: userId,
      role: userRole,
      club: userClub
    });
    
    // Parse request body
    const body = await req.json();
    console.log('POST /api/tasks - Request body:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'credits', 'assignedTo', 'priority', 'dueDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`POST /api/tasks - Validation error: Missing required field ${field}`);
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Validate credit range
    if (body.credits < 1 || body.credits > 100) {
      console.log('POST /api/tasks - Validation error: Credits must be between 1 and 100');
      return NextResponse.json({ error: 'Credits must be between 1 and 100' }, { status: 400 });
    }
    
    // Validate priority
    if (!['low', 'medium', 'high'].includes(body.priority)) {
      console.log('POST /api/tasks - Validation error: Invalid priority value');
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 });
    }
    
    // Check if assigned user exists and validation
    let assignedUser;
    try {
      if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
        console.log('POST /api/tasks - Validation error: Invalid assignedTo ID format');
        return NextResponse.json({ error: 'Invalid assignedTo ID format' }, { status: 400 });
      }
      
      assignedUser = await User.findById(body.assignedTo);
      if (!assignedUser) {
        console.log('POST /api/tasks - Validation error: Assigned user not found');
        return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 });
      }
      
      // Admins can only assign tasks to members of their club
      if (userRole === 'admin' && assignedUser.club !== userClub) {
        console.log('POST /api/tasks - Unauthorized: Admins can only assign tasks to members of their club');
        return NextResponse.json({ 
          error: 'Unauthorized: Admins can only assign tasks to members of their club' 
        }, { status: 403 });
      }
      
    } catch (error) {
      console.error('POST /api/tasks - Error checking assigned user:', error);
      return NextResponse.json({ error: 'Error validating assigned user' }, { status: 500 });
    }
    
    // Format due date
    const dueDate = new Date(body.dueDate);
    if (isNaN(dueDate.getTime())) {
      console.log('POST /api/tasks - Validation error: Invalid due date format');
      return NextResponse.json({ error: 'Invalid due date format' }, { status: 400 });
    }
    
    // Prepare task data
    const taskData: Partial<ITask> = {
      title: body.title,
      description: body.description,
      credits: body.credits,
      priority: body.priority as 'low' | 'medium' | 'high',
      dueDate,
      status: 'pending', // Default status for new tasks
      createdBy: userId,
      assignedTo: body.assignedTo,
      isVerified: false,
      club: userRole === 'admin' ? userClub : assignedUser.club,
      isGlobal: userRole === 'superadmin' && body.isGlobal ? true : false,
    };
    
    console.log('POST /api/tasks - Creating task with data:', taskData);
    
    // Create the task
    const newTask = await Task.create(taskData);
    console.log('POST /api/tasks - Task created:', newTask._id);
    
    // Populate references for response
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedTo', 'name email image role club')
      .populate('createdBy', 'name email image role club');
      
    console.log('POST /api/tasks - Task created successfully');
    
    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/tasks - Server error:', error);
    const err = error as Error;
    console.error('POST /api/tasks - Error stack:', err.stack);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}

// ... rest of the file