import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import { uploadImage } from '@/lib/cloudinary';
import { Schema } from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user session to verify authentication
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find user by email to get their role
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Only members, admins and superadmins can create events
    if (!['member', 'admin', 'superadmin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized, insufficient privileges' }, { status: 403 });
    }
    
    const data = await req.json();
    
    // Process image upload if present
    if (data.imageBase64) {
      try {
        const imageUrl = await uploadImage(data.imageBase64);
        data.imageUrl = imageUrl;
        delete data.imageBase64; // Remove base64 data after upload
      } catch {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }
    
    // Create event with creator ID
    const event = new Event({
      ...data,
      creatorId: user._id,
      isPublished: user.role === 'superadmin' // Events are published immediately if created by superadmin
    });
    
    // If creator is superadmin, add their approval automatically
    if (user.role === 'superadmin') {
      event.approvals = [user._id as unknown as Schema.Types.ObjectId];
    }
    
    await event.save();
    
    return NextResponse.json({ 
      message: 'Event created successfully, pending approval',
      eventId: event._id 
    }, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 