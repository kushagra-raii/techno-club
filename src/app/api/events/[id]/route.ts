import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
    }
    
    // Get user session to check role and get user info
    const session = await getServerSession();
    let userId = null;
    let userRole = 'user';
    
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        userId = user._id;
        userRole = user.role;
      }
    }
    
    // Find the event and populate creator details
    const event = await Event.findById(id)
      .populate('creatorId', 'name email image')
      .lean();
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Check if the event is published or if the user is authorized to view unpublished events
    if (!event.isPublished && userRole !== 'superadmin' && event.creatorId.toString() !== userId?.toString()) {
      return NextResponse.json(
        { error: 'You do not have permission to view this unpublished event' },
        { status: 403 }
      );
    }
    
    // Check if current user is participating
    const isParticipating = userId 
      ? event.participants?.some(participantId => 
          participantId.toString() === userId.toString()
        ) 
      : false;
    
    // Get participant details if user is admin, superadmin, or the creator
    let participantDetails = [];
    if (['admin', 'superadmin'].includes(userRole) || event.creatorId.toString() === userId?.toString()) {
      // @ts-expect-error: Mongoose type mismatch with lean()
      participantDetails = await User.find(
        { _id: { $in: event.participants || [] } },
        'name email image'
      ).lean();
    }
    
    // Format the response
    const formattedEvent = {
      ...event,
      isParticipating,
      participantCount: event.participants?.length || 0,
      participantDetails: participantDetails.length > 0 ? participantDetails : undefined,
    };
    
    return NextResponse.json(formattedEvent, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch event';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 