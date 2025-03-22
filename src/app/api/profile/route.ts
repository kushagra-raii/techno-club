import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find user
    const user = await User.findOne(
      { email: session.user.email },
      'name email image role club creditScore createdAt'
    ).lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find events created by user
    const createdEvents = await Event.find(
      { creatorId: user._id },
      'name description startDate endDate location imageUrl isPublished participants'
    )
    .sort({ createdAt: -1 })
    .lean();
    
    // Find events user is participating in
    const participatingEvents = await Event.find(
      { participants: user._id, isPublished: true },
      'name description startDate endDate location imageUrl'
    )
    .sort({ startDate: 1 })
    .lean();
    
    // Count upcoming and past events
    const now = new Date();
    const upcomingEvents = participatingEvents.filter(
      (event) => new Date(event.startDate) > now
    );
    const pastEvents = participatingEvents.filter(
      (event) => new Date(event.endDate) < now
    );
    
    // Format stats
    const stats = {
      eventsCreated: createdEvents.length,
      eventsParticipating: participatingEvents.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
    };
    
    // Format the response
    return NextResponse.json({
      user,
      stats,
      createdEvents: createdEvents.map(event => ({
        ...event,
        participantCount: event.participants?.length || 0,
        participants: undefined // Don't expose participant details
      })),
      participatingEvents: participatingEvents
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 