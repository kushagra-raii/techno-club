import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/lib/models/User';
import { connectToDatabase } from '@/lib/mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { role, club } = token;
    const searchParams = new URL(req.url).searchParams;
    const roleFilter = searchParams.get('role');
    const clubFilter = searchParams.get('club');
    
    // Define the query with proper typing
    const query: { role?: string; club?: string } = {};
    
    // Add role filter if provided
    if (roleFilter) {
      query.role = roleFilter;
    }
    
    // Add club filter based on user role and provided club filter
    if (role === 'superadmin') {
      // Superadmins can see members from any club, or filter by a specific club
      if (clubFilter) {
        query.club = clubFilter;
      }
    } else if (role === 'admin') {
      // Admins can only see members from their own club
      query.club = club as string;
    } else {
      // Regular members shouldn't access this endpoint
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 });
    }
    
    console.log('Query:', query);
    
    const members = await User.find(query)
      .select('name email role club creditScore profileImage')
      .sort({ name: 1 });
    
    console.log('Found members:', members.length);
    
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}