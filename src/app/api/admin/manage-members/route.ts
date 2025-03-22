import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongoose';
import User, { ClubType } from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    // Verify that the user is an admin or superadmin
    const token = await getToken({ req: request });
    if (!token || !['admin', 'superadmin'].includes(token.role as string)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const { userId, action, data } = await request.json();

    // Validate required parameters
    if (!userId || !action) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    // Find user to update
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prevent admin modification by non-superadmins
    if (['admin', 'superadmin'].includes(user.role) && token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'You do not have permission to modify admins or superadmins' },
        { status: 403 }
      );
    }

    // For regular admins, check club constraints
    if (token.role === 'admin' && action === 'assign-club') {
      // If admin has a club, they can only assign their own club
      if (token.club) {
        if (data.club && data.club !== token.club) {
          return NextResponse.json(
            { message: `As an admin of ${token.club}, you can only assign users to your own club` },
            { status: 403 }
          );
        }
      }
    }

    // For regular admins, they can only update users in their club or users with no club
    if (token.role === 'admin' && user.club && token.club && user.club !== token.club && user.club) {
      return NextResponse.json(
        { message: 'You can only manage users in your own club or users with no club' },
        { status: 403 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'update-role':
        // Validate role
        if (!data?.role || !['user', 'member'].includes(data.role)) {
          return NextResponse.json(
            { message: 'Invalid role. Admins can only set users to "user" or "member"' },
            { status: 400 }
          );
        }

        user.role = data.role;
        await user.save();

        return NextResponse.json({
          message: `User role updated to ${data.role}`,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            club: user.club,
            creditScore: user.creditScore,
          },
        });

      case 'update-info':
        // Update user information
        if (data?.name) {
          user.name = data.name;
        }

        if (data?.email) {
          // Check if email is already taken
          const existingUser = await User.findOne({ email: data.email });
          if (existingUser && existingUser._id && existingUser._id.toString() !== userId) {
            return NextResponse.json(
              { message: 'Email is already in use' },
              { status: 400 }
            );
          }
          user.email = data.email;
        }

        await user.save();

        return NextResponse.json({
          message: 'User information updated',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            club: user.club,
            creditScore: user.creditScore,
          },
        });

      case 'assign-club':
        // Validate club
        if (data?.club !== undefined) {
          // If admin has a club, they can only assign their own club
          if (token.role === 'admin' && token.club && data.club !== '' && data.club !== token.club) {
            return NextResponse.json(
              { message: `As an admin of ${token.club}, you can only assign users to your own club` },
              { status: 403 }
            );
          }
          
          // Empty string is valid for removing club
          if (data.club === '' || ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'].includes(data.club)) {
            user.club = data.club as ClubType;
            await user.save();

            return NextResponse.json({
              message: data.club ? `User assigned to ${data.club} club` : 'User removed from club',
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                club: user.club,
                creditScore: user.creditScore,
              },
            });
          } else {
            return NextResponse.json(
              { message: 'Invalid club' },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            { message: 'Club is required' },
            { status: 400 }
          );
        }

      case 'update-credit':
        // Validate credit score
        if (data?.creditScore !== undefined) {
          if (typeof data.creditScore === 'number' && data.creditScore >= 0) {
            user.creditScore = data.creditScore;
            await user.save();

            return NextResponse.json({
              message: `User credit score updated to ${data.creditScore}`,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                club: user.club,
                creditScore: user.creditScore,
              },
            });
          } else {
            return NextResponse.json(
              { message: 'Credit score must be a positive number' },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            { message: 'Credit score is required' },
            { status: 400 }
          );
        }

      case 'delete':
        // Only superadmins can delete users
        if (token.role !== 'superadmin') {
          return NextResponse.json(
            { message: 'Only superadmins can delete users' },
            { status: 403 }
          );
        }

        await User.findByIdAndDelete(userId);
        return NextResponse.json({ message: 'User deleted successfully' });

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error managing members:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 