import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import User, { UserRole, ClubType } from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    const { name, email, password, club = '', creditScore = 0 } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' as UserRole, // Default role
      club: club as ClubType, // Club assignment
      creditScore, // Credit score
    });

    await newUser.save();

    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          club: newUser.club,
          creditScore: newUser.creditScore,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 