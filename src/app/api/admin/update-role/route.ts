import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongoose';
import User, { UserRole } from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user's token to check permissions
    const token = await getToken({ req: request });
    
    // Check if user is authenticated and is a super admin
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized. Only Super Admins can update admin roles.' },
        { status: 403 }
      );
    }

    const { userId, newRole } = await request.json();

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the new role
    const allowedRoles: UserRole[] = ['admin', 'user', 'member'];
    if (!allowedRoles.includes(newRole as UserRole)) {
      return NextResponse.json(
        { message: 'Invalid role. Role must be one of: ' + allowedRoles.join(', ') },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the user to update
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent updating superadmin users as a security measure
    if (user.role === 'superadmin') {
      return NextResponse.json(
        { message: 'Cannot modify a Super Admin\'s role' },
        { status: 403 }
      );
    }

    // Update the user's role
    user.role = newRole as UserRole;
    await user.save();

    return NextResponse.json(
      {
        message: 'User role updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the role' },
      { status: 500 }
    );
  }
}