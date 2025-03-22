import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: process.env.RAZORPAY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0',
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { eventId, amount } = await req.json();

    // Validate inputs
    if (!eventId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Create a shorter receipt ID (must be under 40 chars)
    // Use timestamp in unix format to make it shorter
    const timestamp = Math.floor(Date.now() / 1000);
    const shortEventId = eventId.substring(0, 8);
    const receipt = `rcpt_${shortEventId}_${timestamp}`;

    // Create Razorpay order
    const options = {
      amount: amount, // already in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        eventId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Return order data
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
} 