import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to participate in events' },
        { status: 401 }
      );
    }

    // Get event ID from request body
    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }

    // Find user by email
    const userEmail = session.user.email as string;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if the event is published
    if (!event.isPublished) {
      return NextResponse.json(
        { error: 'Cannot join an unpublished event' },
        { status: 403 }
      );
    }

    // Ensure participants array exists
    if (!event.participants) {
      event.participants = [];
    }

    // Check if event is already at capacity
    if (event.participants.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at full capacity' },
        { status: 400 }
      );
    }

    // Check if user is already participating
    const isParticipating = event.participants.some(
      participantId => participantId.toString() === user._id.toString()
    );
    
    if (isParticipating) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Add user to participants
    event.participants.push(user._id);
    await event.save();

    return NextResponse.json({ 
      message: 'Successfully registered for the event',
      participantCount: event.participants.length 
    });
  } catch (error) {
    console.error('Error in event participation:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to modify event participation' },
        { status: 401 }
      );
    }

    // Get event ID from request body
    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }

    // Find user by email
    const userEmail = session.user.email as string;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Ensure participants array exists
    if (!event.participants) {
      event.participants = [];
    }

    // Check if user is participating
    const isParticipating = event.participants.some(
      participantId => participantId.toString() === user._id.toString()
    );
    
    if (!isParticipating) {
      return NextResponse.json(
        { error: 'You are not registered for this event' },
        { status: 400 }
      );
    }

    // Remove user from participants
    event.participants = event.participants.filter(
      participantId => participantId.toString() !== user._id.toString()
    );
    await event.save();

    return NextResponse.json({ 
      message: 'Successfully unregistered from the event',
      participantCount: event.participants.length 
    });
  } catch (error) {
    console.error('Error in event participation removal:', error);
    return NextResponse.json(
      { error: 'Failed to unregister from event' },
      { status: 500 }
    );
  }
} 