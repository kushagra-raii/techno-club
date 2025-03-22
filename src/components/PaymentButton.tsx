import React, { useState } from 'react';
import { handlePayment, PaymentOptions } from '@/lib/razorpay';
import { toast } from 'react-hot-toast';

interface PaymentButtonProps {
  eventId: string;
  eventName: string;
  description: string;
  amount: number;
  userEmail: string;
  userName: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isDisabled?: boolean;
  isProcessing?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  eventId,
  eventName,
  description,
  amount,
  userEmail,
  userName,
  userId,
  onSuccess,
  onError,
  isDisabled = false,
  isProcessing = false,
}) => {
  const [processing, setProcessing] = useState(isProcessing);
  const [showOverlay, setShowOverlay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleClick = async () => {
    setProcessing(true);
    
    try {
      const paymentOptions: PaymentOptions = {
        amount,
        name: eventName,
        description: description,
        email: userEmail,
        eventId,
        userId,
        notes: {
          eventId,
          userId,
          userName,
        },
      };

      // Show overlay when payment starts
      setShowOverlay(true);
      setPaymentStatus('processing');

      await handlePayment(
        paymentOptions,
        (paymentResponse) => {
          // Store payment ID for reference
          setPaymentId(paymentResponse.paymentId);
          setPaymentStatus('success');
          toast.success('Payment successful! You are now registered for the event.');
          
          // Keep overlay visible for a moment to show success
          setTimeout(() => {
            setShowOverlay(false);
            setProcessing(false);
            if (onSuccess) onSuccess();
          }, 2000);
        },
        (error) => {
          setPaymentStatus('error');
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
          
          // Keep overlay visible for a moment to show error
          setTimeout(() => {
            setShowOverlay(false);
            setProcessing(false);
            if (onError) onError(error);
          }, 2000);
        }
      );
    } catch (error) {
      setPaymentStatus('error');
      console.error('Error processing payment:', error);
      toast.error('Something went wrong. Please try again.');
      
      // Keep overlay visible for a moment to show error
      setTimeout(() => {
        setShowOverlay(false);
        setProcessing(false);
        if (onError) onError(error instanceof Error ? error : new Error(String(error)));
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isDisabled || processing}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : `Pay ₹${amount}`}
      </button>

      {/* Payment processing overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              {paymentStatus === 'processing' && (
                <>
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-white mb-2">Processing Payment</h2>
                  <p className="text-gray-300">Please wait while we process your payment...</p>
                </>
              )}

              {paymentStatus === 'success' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Payment Successful!</h2>
                  <p className="text-gray-300">You are now registered for this event.</p>
                  {paymentId && (
                    <p className="text-xs text-gray-400 mt-2">Payment ID: {paymentId}</p>
                  )}
                </>
              )}

              {paymentStatus === 'error' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Payment Failed</h2>
                  <p className="text-gray-300">Sorry, there was an issue with your payment. Please try again.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton; 