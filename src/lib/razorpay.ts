import { loadScript } from './utils';

// Razorpay credentials
export const RAZORPAY_KEY_ID = 'rzp_test_pQLbxWbQ5iwwZe';

export interface PaymentOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  notes?: Record<string, string>;
  email: string;
  contact?: string;
  eventId: string;
  userId: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
    contact?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
}

// Define the Razorpay interface
interface RazorpayInterface {
  new (options: RazorpayOptions): { open: () => void };
}

// Declare global window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: RazorpayInterface;
  }
}

export const initializeRazorpay = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error('Razorpay SDK failed to load', error);
        resolve(false);
      });
  });
};

export const createRazorpayOrder = async (eventId: string, amount: number): Promise<RazorpayOrder | null> => {
  try {
    // Convert amount to paise (Razorpay expects amount in paise)
    const amountInPaise = Math.round(amount * 100);
    
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        amount: amountInPaise,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
};

export const handlePayment = async (
  options: PaymentOptions,
  onSuccess: (payment: { paymentId: string; message: string }) => void,
  onError: (error: Error) => void
): Promise<void> => {
  const res = await initializeRazorpay();
  
  if (!res) {
    onError(new Error('Razorpay SDK failed to load'));
    return;
  }

  try {
    // Create order on the server
    const order = await createRazorpayOrder(options.eventId, options.amount);
    
    if (!order) {
      throw new Error('Failed to create order');
    }

    const razorpayOptions: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount, // Use the amount returned from the server
      currency: options.currency || 'INR',
      name: options.name,
      description: options.description,
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        // Verify payment on the server
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            eventId: options.eventId,
          }),
        });

        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          onSuccess(data);
        } else {
          throw new Error('Payment verification failed');
        }
      },
      prefill: {
        email: options.email,
        contact: options.contact,
      },
      notes: options.notes || {},
      theme: {
        color: '#4f46e5', // Indigo-600
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    console.error('Error handling payment:', error);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}; 