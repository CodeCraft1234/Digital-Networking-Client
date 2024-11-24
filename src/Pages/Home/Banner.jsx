import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";
import useAdsAccount from "../../Hook/useAdAccount";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import useMpayment from "../../Hook/UseMpayment";
import ShowOfSellery from "../DashboardRoot/ShowOfSellery";

const Banner = () => {
  const [users, refetch] = useUsers();
  const [employeePayment] = useEmployeePayment();
  const [MPayment] = useMpayment();
  const [adsAccount] = useAdsAccount();
  const [payoneerTotal, setPayoneerTotal] = useState(0);
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState();
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === user?.email);
          setDdd(fff || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  useEffect(() => {
      if (users) {
          const fff = users.filter(u => u.role === 'employee');
          setEmployee(fff || []); // Update state with found users or an empty array
      }
  }, [users]);

  const calculateTotalByPaymentMethod = (employeeEmail, paymentMethod) => {
      return employeePayment
          .filter(payment => payment.employeeEmail === employeeEmail && payment.paymentMethod === paymentMethod)
          .reduce((total, payment) => total + parseFloat(payment.payAmount), 0)
          .toFixed(2); 
  };

  const calculateTotalByPaymentMethod4 = (employeeEmail) => {
      return employeePayment
          .filter(payment => payment.employeeEmail === employeeEmail)
          .reduce((total, payment) => total + parseFloat(payment.payAmount), 0)
          .toFixed(2); 
  };

  const calculateTotalByPaymentMethod2 = (employeeEmail, paymentMethod) => {
      return MPayment
          .filter(payment => payment.employeeEmail === employeeEmail && payment.paymentMethod === paymentMethod)
          .reduce((total, payment) => total + parseFloat(payment.amount), 0)
          .toFixed(2); 
  };

  const calculateTotalByPaymentMethod3 = (employeeEmail) => {
      return MPayment
          .filter(payment => payment.employeeEmail === employeeEmail)
          .reduce((total, payment) => total + parseFloat(payment.amount), 0)
          .toFixed(2); 
  };

  const calculateTotalAmount = (users, paymentMethod) => {
    return users.reduce((acc, user) => acc + (parseFloat(user[paymentMethod]) || 0), 0);
  };

  useEffect(() => {
    const totalPayoneer = calculateTotalAmount(users, 'payoneer');
    setPayoneerTotal(totalPayoneer);
  }, [users]);

  const handleUpdateTotalBudget = (e, id, modalId) => {
    e.preventDefault();
    const tBudged = e.target.tBudged.value;
    const body = { payoneer: tBudged };

    axios.put(`https://digital-networking-server.vercel.app/users/payoneer/${id}`, body)
      .then((res) => {
        refetch();
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          modalElement.close();
        }
      })
      .catch((error) => {
        console.error("Error updating Payoneer amount:", error);
      });
  };

  const getThresholdValue = (email) => {

    const thresholdss = adsAccount.filter(acc => acc.employeeEmail === email && acc.status === 'Active')
    
    const thresholds = thresholdss
      .filter(acc => acc.employeeEmail === email)
      .map(acc => parseFloat(acc.threshold) || 0); // Map to threshold values or 0 if not found
    
    return thresholds.reduce((acc, curr) => acc + curr, 0); // Sum all threshold values
  };
  

  
  return (
    <div className="p-5">
      <Helmet>
        <title>Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className='px-5 py-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }}>
  {ddd?.role === 'admin' && (
   <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5">
   <div className="balance-card bg-[#f7e8e8] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
       <span className="text-lg lg:text-2xl font-extrabold">৳</span>{employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0).toLocaleString('en-IN')}
     </p>
   </div>
 
   <div className="balance-card items-center bg-[#ffe6f7] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
       <span className="text-lg lg:text-2xl font-extrabold">৳</span>{employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0).toLocaleString('en-IN')}
     </p>
   </div>
 
   <div className="balance-card bg-[#fff2cc] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
       <span className="text-lg lg:text-2xl font-extrabold">৳</span>{employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0).toLocaleString('en-IN')}
     </p>
   </div>
 
   <div className="balance-card bg-[#e0f7fa] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
     <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
       <span className="text-lg lg:text-2xl font-extrabold">৳</span>{employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0).toLocaleString('en-IN')}
     </p>
   </div>
 
   <div className="balance-card bg-[#d9f8d9] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <h className="p-3 mt-7 text-black text-3xl font-bold text-center">Total</h>
     <p className="balance-card-text mt-8 text-lg lg:text-2xl font-bold text-gray-700">
       <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
         (
           employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0) +
           employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0) +
           employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0) +
           employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0)
         ).toLocaleString('en-IN')
       }
     </p>
   </div>
 
   <div className="bg-[#f2f2f2] rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105" style={{ border: 'var(--border)' }}>
     <div>
       <img className="balance-card-img w-56 h-auto" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
       <span className="balance-card-text text-2xl flex items-center justify-center gap-2">
         <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">
           <span className="text-lg lg:text-2xl font-extrabold text-red-600">$</span>{payoneerTotal.toLocaleString('en-IN')}
         </p>
       </span>
     </div>
   </div>
 </div>
 
  )}
</div>


       <div className='px-5 p-5  my-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

<div className="  rounded-xl " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
  <div className="overflow-x-auto  shadow-2xl ">
    <table className="min-w-full text-xs md:text-base">
      <thead className="  font-bold text-sm md:text-xl">
        <tr>
                  <th className="p-2 text-center">
                   SL
                  </th>
                 
                    <th className="p-2 text-center">Employee Name</th>
                  {
                    ddd?.role === 'admin' && <>
                                        <th className="p-3 text-center">
                     
                      <h1 className="">bKash PRA </h1>
                    </th>
                    <th className="p-2 text-center">
                      
                      <h1 className="">bKash </h1>
                    </th>
                    <th className="p-2 text-center">
                     
                      <h1 className="">Nagad </h1>
                    </th>
                    <th className="p-2 text-center">
                      <h1 className="">Rocket </h1>
                    </th>
                    <th className="p- text-center">
                    <th className="p- text-center">Total</th> 
                    </th>
                    </>
                  }
                  
                 
           
              </tr>
            </thead>
            {employee.map((userr,index) => (
              <tbody key={userr._id}>
                <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                  key={userr._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-200  text-left text-black border-b border-opacity-20"
                  }`}
                >
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center font-bold">{index + 1}</td>
      <td style={{ border: 'var(--border)' }} className="p-3 hover:text-blue-600 font-bold hover:text-sm md:hover:text-sm sm:hover:text-sm  gap-2 ">
        {ddd?.role === 'admin' ? (
          <p className="flex flex-col md:flex-row justify-start text-center items-center gap-2">
            <Link to={`/dashboard/userInfo/${userr?.email}`}>
              <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
            </Link>
            <Link to={`/dashboard/userInfo/${userr?.email}`}>{userr.name}</Link>
          </p>
        ) : (
          <>
            <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
            <h1>{userr.name}</h1>
          </>
        )}
      </td>
      {
                    ddd?.role === 'admin' && <>
                     <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center">
                     <span className=" text-xm font-extrabold">৳</span> {calculateTotalByPaymentMethod2(userr.email, 'bkashMarchent') - calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')}
      </td>
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center">
      <span className=" text-xm font-extrabold">৳</span> {calculateTotalByPaymentMethod2(userr.email, 'bkashPersonal') - calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')}
      </td>
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center">
      <span className=" text-xm font-extrabold">৳</span> {calculateTotalByPaymentMethod2(userr.email, 'nagadPersonal') - calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')}
      </td>
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center">
      <span className=" text-xm font-extrabold">৳</span> {calculateTotalByPaymentMethod2(userr.email, 'rocketPersonal') - calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')}
      </td>
      <td style={{ border: 'var(--border)' }} className="p-3 border border-gray-300 text-center">
      <span className=" text-xm font-extrabold">৳</span> {calculateTotalByPaymentMethod3(userr.email) - calculateTotalByPaymentMethod4(userr.email)}
      </td>
                    </>

      }
     
   
    </tr>
              </tbody>
            ))}
             <tfoot >
      <tr  className="">

        <td className="p-3 text-center font-bold"></td>
        <td className="p-3 text-center font-bold">Total</td>


        {
                    ddd?.role === 'admin' && <>
                     <td className="p-3 text-center font-bold"><span className=" text-xm font-extrabold">৳</span> {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold"><span className=" text-xm font-extrabold">৳</span> {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold"><span className=" text-xm font-extrabold">৳</span> {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold"><span className=" text-xm font-extrabold">৳</span> {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold"><span className=" text-xm font-extrabold">৳</span> { employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0) +
                                               employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0) +   employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0) +   employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0)
                                        }</td>
                    </>

        }
  
                                      
    
         
      
   
      </tr>
    </tfoot>
          </table>
        </div>
      </div>
      </div>

<ShowOfSellery></ShowOfSellery>
    </div>
  );
};

export default Banner;

