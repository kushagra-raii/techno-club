import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';

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
    
    let query: any = {};
    
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
  } catch (error: any) {
    console.error('GET /api/tasks - Server Error:', error);
    console.error('GET /api/tasks - Error stack:', error.stack);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}

// ... rest of the file