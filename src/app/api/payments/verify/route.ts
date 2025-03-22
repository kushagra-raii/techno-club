import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
// Import your database models or ORM here to update payment status

// Razorpay secret key for verification
const razorpaySecret = process.env.RAZORPAY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0';

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId,
    } = await req.json();

    // Validate inputs
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !eventId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Here you would update your database to mark the payment as successful
    // and register the user for the event
    
    // Example (pseudo-code):
    // await db.payments.create({
    //   userId: session.user.id,
    //   eventId,
    //   paymentId: razorpay_payment_id,
    //   orderId: razorpay_order_id,
    //   amount: amount,
    //   status: 'successful'
    // });
    
    // Register user for the event (similar to your participate endpoint)
    // await registerUserForEvent(session.user.id, eventId);

    // For now, we'll just call the participate API
    const participateResponse = await fetch(`${req.nextUrl.origin}/api/events/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
      body: JSON.stringify({ eventId }),
    });

    if (!participateResponse.ok) {
      throw new Error('Failed to register for event after payment');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and user registered for event',
      paymentId: razorpay_payment_id,
    }, { status: 200 });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 