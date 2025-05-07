import { useEffect, useState, useContext, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr3 from '../../Hook/useUserr3';

const PaymentSuccessContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const paymentID = searchParams.get('paymentID');
  const statusParam = searchParams.get('status');
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const AxiosPublic = UseAxiosPublic();
  const { user } = useContext(AuthContext);
  const { users, isLoading: userLoading } = useUserr3(user?.email);

  console.log(data);

  useEffect(() => {
    const executePayment = async () => {
      if (statusParam === 'cancel') {
        setStatus('cancel');
        return;
      }
  
      if (statusParam === 'success') {
        setStatus('success');
      }
  
      if (!paymentID) {
        setStatus('failure');
        return;
      }
  
      try {
        const { data } = await AxiosPublic.post('/execute-payment', { paymentID });
  
        if (data.statusCode === '0000') {
          setStatus('success');
          setData(data);
  
          const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
          const pendingClientPayment = JSON.parse(localStorage.getItem('pendingClientPayment'));
  
          // 🟢 CLIENT PAYMENT
          if (pendingClientPayment && Object.keys(pendingClientPayment).length > 0) {
            const clientPayments = {
              ...pendingClientPayment,
              transactionId: data.trxID,
              paymentID:data.paymentID,
              status: "Approved",
              hidden:'yes'
            };
  
            const clientRes = await AxiosPublic.post("/clients/payments", {
              id: pendingClientPayment.id,
              payments: clientPayments,
            });
  
            if (clientRes.status === 200) {
              console.log("✅ Client payment saved.");
              setStatus('success');
              localStorage.removeItem('pendingClientPayment');
            } else {
              console.error("❌ Failed to post client payment:", clientRes);
            }
          }
  
          // 🔵 CONTRIBUTOR PAYMENT
          if (pendingPayment && Object.keys(pendingPayment).length > 0) {
            const contributorData = {
              ...pendingPayment,
              transactionId: data.trxID,
              paymentID:data.paymentID,
               status: "Approved"
            };
  
            console.log("🔍 Contributor Data:", contributorData);
  
            const contributorRes = await AxiosPublic.post("/contributorPayment", contributorData);
            if (contributorRes.status === 200) {
              console.log("✅ Contributor payment saved.");
              setStatus('success');
              localStorage.removeItem('pendingPayment');
            } else {
              console.error("❌ Failed to post contributor payment:", contributorRes);
            }
          }
  
        } else {
          setStatus('error');
        }
  
      } catch (error) {
        console.error('🔥 Error in executePayment:', error);
        setStatus('error');
      }
    };
  
    if (!userLoading) {
      executePayment();
    }
  }, [paymentID, statusParam, user, users, userLoading]);
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      {status === null && <p className="text-gray-500 text-lg">⏳ Processing your payment...</p>}

      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h1>
          {
            data?.trxID && <p className="text-gray-700 mt-2">Transection ID: {data?.trxID}</p>
          }
          
          <p className="mt-1">
            আপনার আবেদনটি সফল ভাবে সম্পন্ন হয়েছে। অনুগ্রহ করে ইনভয়েস অপশন থেকে আপনার ইনভয়েস সংরক্ষণ করুন। এটি ভবিষ্যতে প্রয়োজন হতে পারে।
          </p>
        </>
      )}

      {status === 'cancel' && (
        <>
          <h1 className="text-2xl font-bold text-red-600">❌ Payment Canceled</h1>
          <p className="text-gray-700 mt-2">You canceled the payment process.</p>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded" onClick={() => navigate('/')}>
            Go Back to Homepage
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-red-600">⚠️ Payment Failed</h1>
          <p className="text-gray-700 mt-2">Something went wrong while processing your payment.</p>
          <button className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded" onClick={() => navigate('/myCart')}>
            Retry Payment
          </button>
        </>
      )}
    </div>
  );
};

const PaymentStatus = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentStatus;
