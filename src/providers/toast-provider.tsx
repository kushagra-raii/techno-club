'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid #374151',
        },
        success: {
          style: {
            background: '#065f46',
            border: '1px solid #047857',
          },
        },
        error: {
          style: {
            background: '#991b1b',
            border: '1px solid #b91c1c',
          },
        },
      }}
    />
  );
};

export default ToastProvider; 