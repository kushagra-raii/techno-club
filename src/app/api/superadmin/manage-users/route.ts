import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongoose';
import User, { ClubType } from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    // Verify that the user is a superadmin
    const token = await getToken({ req: request });
    console.log('Token in superadmin API:', { role: token?.role, id: token?.id });
    
    // Check if the user is authenticated and has the super admin role
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized. Only Super Admins can perform this action.' },
        { status: 403 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const { userId, action, data } = await request.json();
    console.log('Received superadmin request:', { userId, action, data });
    
    if (!userId || !action) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Find the user to update
    const userToModify = await User.findById(userId);
    
    if (!userToModify) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Found user to modify:', { 
      id: userToModify._id, 
      name: userToModify.name, 
      role: userToModify.role, 
      club: userToModify.club,
      creditScore: userToModify.creditScore 
    });
    
    // Prevent super admin from modifying their own account via this endpoint
    if (token.id === userId) {
      return NextResponse.json(
        { message: 'You cannot modify your own account through this endpoint' },
        { status: 403 }
      );
    }
    
    // Handle different actions
    switch (action) {
      case 'update-role':
        // Validate the new role
        if (!data || !data.role || !['user', 'member', 'admin', 'superadmin'].includes(data.role)) {
          return NextResponse.json(
            { message: 'Invalid role' },
            { status: 400 }
          );
        }
        
        // Update the role
        userToModify.role = data.role;
        await userToModify.save();
        
        return NextResponse.json({
          message: `User role updated to ${data.role}`,
          user: {
            id: userToModify._id,
            name: userToModify.name,
            email: userToModify.email,
            role: userToModify.role,
            club: userToModify.club,
            creditScore: userToModify.creditScore,
          }
        });
      
      case 'assign-club':
        // Validate club
        if (data?.club !== undefined) {
          console.log('Assigning club (superadmin):', data.club);
          
          // Empty string is valid for removing club
          if (data.club === '' || ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'].includes(data.club)) {
            userToModify.club = data.club as ClubType;
            await userToModify.save();
            
            const updatedUser = await User.findById(userId);
            console.log('User after club update (superadmin):', { 
              id: updatedUser?._id, 
              club: updatedUser?.club 
            });

            return NextResponse.json({
              message: data.club ? `User assigned to ${data.club} club` : 'User removed from club',
              user: {
                id: userToModify._id,
                name: userToModify.name,
                email: userToModify.email,
                role: userToModify.role,
                club: userToModify.club,
                creditScore: userToModify.creditScore,
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
          console.log('Updating credit score (superadmin):', data.creditScore);
          
          if (typeof data.creditScore === 'number' && data.creditScore >= 0) {
            userToModify.creditScore = data.creditScore;
            await userToModify.save();
            
            const updatedUser = await User.findById(userId);
            console.log('User after credit score update (superadmin):', { 
              id: updatedUser?._id, 
              creditScore: updatedUser?.creditScore 
            });

            return NextResponse.json({
              message: `User credit score updated to ${data.creditScore}`,
              user: {
                id: userToModify._id,
                name: userToModify.name,
                email: userToModify.email,
                role: userToModify.role,
                club: userToModify.club,
                creditScore: userToModify.creditScore,
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
        
      case 'update-info':
        // Validate the update data
        if (!data) {
          return NextResponse.json(
            { message: 'No update data provided' },
            { status: 400 }
          );
        }
        
        // Update allowed fields
        if (data.name) userToModify.name = data.name;
        if (data.email) {
          // Check if email already exists for a different user
          const existingUser = await User.findOne({ 
            email: data.email, 
            _id: { $ne: userId } 
          });
          
          if (existingUser) {
            return NextResponse.json(
              { message: 'Email already in use by another user' },
              { status: 400 }
            );
          }
          
          userToModify.email = data.email;
        }
        
        await userToModify.save();
        
        return NextResponse.json({
          message: 'User information updated',
          user: {
            id: userToModify._id,
            name: userToModify.name,
            email: userToModify.email,
            role: userToModify.role,
            club: userToModify.club,
            creditScore: userToModify.creditScore,
          }
        });
        
      case 'delete':
        await User.findByIdAndDelete(userId);
        
        return NextResponse.json({
          message: 'User deleted successfully'
        });
        
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in super admin manage-users API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}