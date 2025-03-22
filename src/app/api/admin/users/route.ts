import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current user's token to check permissions
    const token = await getToken({ req: request });
    
    // Check if user is authenticated and has appropriate role
    if (!token || !['admin', 'superadmin'].includes(token.role as string)) {
      return NextResponse.json(
        { message: 'Unauthorized. Only Admins can access this resource.' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // If it's a superadmin, get all users except superadmins
    // If it's just an admin, get only users and members
    let query = {};
    if (token.role === 'superadmin') {
      query = {}; // Get all users
    } else if (token.role === 'admin') {
      query = { role: { $in: ['user', 'member'] } }; // Get only users and members
    }

    // Find users based on role
    const users = await User.find(query)
      .select('name email role image club creditScore')  // Include club and creditScore
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        users: users.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
          club: user.club || '',
          creditScore: user.creditScore || 0,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
} 