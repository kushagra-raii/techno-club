import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // We don't need to do much here as NextAuth handles session deletion
    // This route is mainly for any server-side session cleanup if needed in the future
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 