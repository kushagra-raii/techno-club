import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';

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
    
    // Only superadmins can approve events
    if (user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized, only superadmins can approve events' }, { status: 403 });
    }
    
    const { eventId } = await req.json();
    
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }
    
    // Convert to ObjectId for consistent querying
    const objectEventId = new mongoose.Types.ObjectId(eventId);
    
    // Find the event
    const event = await Event.findById(objectEventId);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Check if user already approved this event
    const userIdStr = user._id.toString();
    const alreadyApproved = event.approvals?.some(id => id.toString() === userIdStr);
    
    if (alreadyApproved) {
      return NextResponse.json({ 
        message: 'You have already approved this event',
        isPublished: event.isPublished 
      }, { status: 200 });
    }
    
    // Add the approval
    if (!event.approvals) {
      event.approvals = [];
    }
    
    // Use correct type
    event.approvals.push(new mongoose.Types.ObjectId(userIdStr));
    
    // Set isPublished to true - one superadmin approval is enough
    event.isPublished = true;
    
    await event.save();
    
    return NextResponse.json({ 
      message: 'Event approved and published successfully',
      isPublished: true
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error approving event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to approve event';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 