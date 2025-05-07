import { useEffect } from 'react';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';

const PaymentSuccess = () => {
  const AxiosPublic = UseAxiosPublic();

  useEffect(() => {
    const savePaymentToDB = async () => {
      const payments = localStorage.getItem("pendingPayment");
      const alreadyPosted = localStorage.getItem("paymentPosted");

      if (payments && !alreadyPosted) {
        try {
          const parsedPayment = JSON.parse(payments); // ✅ Parse string back to object

          await AxiosPublic.post("/contributorPayment", parsedPayment); // ✅ Send to backend
          localStorage.removeItem("pendingPayment");
          localStorage.setItem("paymentPosted", "true");
          console.log("💾 Payment saved successfully.");
        } catch (error) {
          console.error("❌ Failed to post payment data:", error);
        }
      }
    };

    savePaymentToDB();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful</h1>
      <p className="mt-2 text-gray-700">Thank you for your payment!</p>
    </div>
  );
};

export default PaymentSuccess;
