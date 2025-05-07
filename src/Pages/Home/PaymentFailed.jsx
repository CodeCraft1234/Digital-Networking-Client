import React from 'react';

const PaymentFailed = () => {
    return (
        <div>
             <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
      <h1 className="text-3xl font-bold">❌ Payment Failed</h1>
      <p className="text-gray-700 mt-2">Something went wrong. Please try again.</p>
    </div>
        </div>
    );
};

export default PaymentFailed;