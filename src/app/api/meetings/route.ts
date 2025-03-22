import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Meeting from '@/lib/models/Meeting';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { sendMeetingInvitation } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get current user details
    const currentUser = await User.findOne({ email: session.user.email });
    
    // Check if user is admin or superadmin
    if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Only admins can schedule meetings' }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { title, date, startTime, endTime, location, description, meetLink, sendEmail = true } = body;
    
    // Validate required fields
    if (!title || !date || !startTime || !endTime || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new meeting
    const meeting = new Meeting({
      title,
      date: new Date(date),
      startTime,
      endTime,
      location,
      description,
      meetLink,
      club: currentUser.club, // Use admin's club
      creatorId: currentUser._id,
    });
    
    // If user is an admin, get all members of their club
    // If superadmin, they need to specify the club in the request
    const targetClub = currentUser.role === 'superadmin' && body.club ? body.club : currentUser.club;
    
    if (!targetClub) {
      return NextResponse.json({ error: 'Club information is required' }, { status: 400 });
    }
    
    // Find all members of the target club
    const clubMembers = await User.find({
      club: targetClub,
      role: { $in: ['member', 'admin'] }
    });
    
    if (clubMembers.length === 0) {
      return NextResponse.json({ error: 'No members found for this club' }, { status: 404 });
    }
    
    // Add club members as invitees
    meeting.invitees = clubMembers.map(member => member._id);
    
    // Save meeting
    await meeting.save();
    
    // Send email notifications if sendEmail is true
    if (sendEmail) {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const recipients = clubMembers.map(member => ({
        email: member.email,
        name: member.name
      }));
      
      const emailSent = await sendMeetingInvitation(recipients, {
        title,
        date: formattedDate,
        time: `${startTime} - ${endTime}`,
        location,
        description,
        meetLink,
        clubName: targetClub
      });
      
      if (!emailSent) {
        // Meeting was created but email sending failed
        return NextResponse.json({
          meeting: meeting,
          message: 'Meeting scheduled successfully but email notifications failed'
        }, { status: 201 });
      }
    }
    
    return NextResponse.json({
      meeting: meeting,
      message: 'Meeting scheduled successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to schedule meeting';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get current user details
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    let meetings;
    
    // If superadmin, get all meetings
    if (currentUser.role === 'superadmin') {
      meetings = await Meeting.find()
        .populate('creatorId', 'name email')
        .sort({ date: 1, startTime: 1 })
        .lean();
    } 
    // If admin, get meetings for their club
    else if (currentUser.role === 'admin') {
      meetings = await Meeting.find({ club: currentUser.club })
        .populate('creatorId', 'name email')
        .sort({ date: 1, startTime: 1 })
        .lean();
    } 
    // If member, get meetings where they are invited
    else {
      meetings = await Meeting.find({ 
        invitees: currentUser._id,
        club: currentUser.club
      })
        .populate('creatorId', 'name email')
        .sort({ date: 1, startTime: 1 })
        .lean();
    }
    
    return NextResponse.json({ meetings }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching meetings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch meetings';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 