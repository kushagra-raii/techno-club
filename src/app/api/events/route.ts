import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    
    // Parse query parameters - always limit to top 10
    const limit = 10;
    const publishedOnly = url.searchParams.get('publishedOnly') === 'true';
    
    // Get user session to check role
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
    
    // Build query based on filters
    const query: Record<string, unknown> = {};
    
    // Non-superadmins can only see published events
    if (publishedOnly || userRole !== 'superadmin') {
      query.isPublished = true;
    }
    
    console.log('Events API - Query:', JSON.stringify(query));
    console.log('Events API - User Role:', userRole);
    
    // Get all events without pagination
    let events;
    try {
      if (userRole === 'superadmin' && !publishedOnly) {
        // For superadmins viewing all events, prioritize pending events
        // First fetch pending events
        const pendingEvents = await Event.find({ isPublished: false })
          .sort({ createdAt: -1 })
          .populate('creatorId', 'name email')
          .lean();
          
        // Then fetch published events
        const publishedEvents = await Event.find({ isPublished: true })
          .sort({ createdAt: -1 })
          .limit(Math.max(0, limit - pendingEvents.length)) // Adjust limit to account for pending events
          .populate('creatorId', 'name email')
          .lean();
          
        // Combine the two sets, with pending events first
        events = [...pendingEvents, ...publishedEvents];
      } else {
        // For regular users, just fetch published events
        events = await Event.find(query)
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate('creatorId', 'name email')
          .lean();
      }
      
      console.log('Events API - Found events:', events.length);
      if (userRole === 'superadmin' && !publishedOnly) {
        console.log('Events API - Pending events:', events.filter(e => !e.isPublished).length);
        console.log('Events API - Published events:', events.filter(e => e.isPublished).length);
      }
    } catch (queryError) {
      console.error('Error querying events:', queryError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
    
    // Format events to include participation status for the current user
    const formattedEvents = events.map((event) => {
      // Check if current user is participating
      const isParticipating = userId ? 
        event.participants?.some((id) => 
          id.toString() === userId.toString()
        ) : false;
      
      // Add a field to show if user is participating
      return {
        ...event,
        isParticipating,
        // Only return participant count instead of full array for privacy
        participantCount: event.participants?.length || 0,
        // Only include full participants list for admins/superadmins
        participants: ['admin', 'superadmin'].includes(userRole) ? event.participants : undefined
      };
    });
    
    return NextResponse.json({
      events: formattedEvents
    }, { status: 200 });
    
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 