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

  const calculateTotalByPaymentMethod2 = (employeeEmail, paymentMethod) => {
      return MPayment
          .filter(payment => payment.employeeEmail === employeeEmail && payment.paymentMethod === paymentMethod)
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
  
  const calculateTotalThreshold = () => {
    const totalThreshold = employee.reduce((acc, user) => {
      const thresholdsForUser = adsAccount
        .filter(acc => acc.employeeEmail === user.email)
        .map(acc => parseFloat(acc.threshold) || 0); // Map to threshold values or 0 if not found
  
      const sumThresholdsForUser = thresholdsForUser.reduce((acc, curr) => acc + curr, 0); // Sum thresholds for each user
  
      return acc + sumThresholdsForUser;
    }, 0);
    
    return totalThreshold;
  };
  
  return (
    <div className="px-5">
      <Helmet>
        <title>Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      {
        ddd?.role === 'admin' && <div className="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5 mt-5 mb-5">
        <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0">
          <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
          <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
            <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0)
                                        }
          </p>
        </div>
        <div className="balance-card items-center bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0">
          <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
          <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
            <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0)
                                        }
          </p>
        </div>
        <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0">
          <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
          <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
            <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0)
                                        }
          </p>
        </div>
        <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0">
          <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
          <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
            <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0)
                                        }
          </p>
        </div>
        <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0">
          <img className="balance-card-img" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="Rocket" />
          <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
            <span className="text-lg lg:text-2xl font-extrabold">৳</span>{
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bank')), 0)
                                        }
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105 border-0 gap-4">
          <div>
            <img className="balance-card-img w-56 h-auto " src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
            <span className="balance-card-text text-2xl flex items-center justify-center gap-2">
              <p className="balance-card-text text-lg lg:text-2xl mt-3 font-bold text-gray-700">
                <span className="text-lg lg:text-2xl font-extrabold text-red-600">$</span>{payoneerTotal}
              </p>
            </span>
          </div>
        </div>
      </div>
      }

      <div className=" mb-5">
        <div className="overflow-x-auto text-black border shadow-2xl rounded-xl border-gray-400">
          <table className="min-w-full text-xs md:text-base">
            <thead className="bg-[#8bcfe8] text-black font-bold text-sm md:text-xl">
              <tr>
                  <th className="p-3 text-center">
                   SL
                  </th>
                 
                    <th className="p-3 text-center">Employee Name</th>
                  {
                    ddd?.role === 'admin' && <>
                                        <th className="p-3 text-center">
                      <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash Merchant" />
                    </th>
                    <th className="p-3 text-center">
                      <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash Personal" />
                    </th>
                    <th className="p-3 text-center">
                      <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad Personal" />
                    </th>
                    <th className="p-3 text-center">
                      <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket Personal" />
                    </th>
                    <th className="p-3 text-center">
                      <img className="w-28 h-10 mx-auto" src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png" alt="bank" />
                    </th>
                    </>
                  }
                    <th className="p-3 text-center">
                      <img className="w-28 h-8 mx-auto" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
                    </th>
                    <th className="p-3 text-center">Current Balance</th> 
                 
           
              </tr>
            </thead>
            {employee.map((userr,index) => (
              <tbody key={userr._id}>
                <tr
      key={userr._id}
      className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
    >
      <td className="p-3 border border-gray-300 text-center font-bold">{index + 1}</td>
      <td className="p-3 hover:text-blue-600 font-bold hover:text-sm md:hover:text-sm sm:hover:text-sm flex flex-col md:flex-row justify-start text-center items-center gap-2 border border-gray-300">
        {ddd?.role === 'admin' ? (
          <>
            <Link to={`/dashboard/userInfo/${userr?.email}`}>
              <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
            </Link>
            <Link to={`/dashboard/userInfo/${userr?.email}`}>{userr.name}</Link>
          </>
        ) : (
          <>
            <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
            <h1>{userr.name}</h1>
          </>
        )}
      </td>
      {
                    ddd?.role === 'admin' && <>
                     <td className="p-3 border border-gray-300 text-center">
        ৳ {calculateTotalByPaymentMethod2(userr.email, 'bkashMarchent') - calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')}
      </td>
      <td className="p-3 border border-gray-300 text-center">
        ৳ {calculateTotalByPaymentMethod2(userr.email, 'bkashPersonal') - calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')}
      </td>
      <td className="p-3 border border-gray-300 text-center">
        ৳ {calculateTotalByPaymentMethod2(userr.email, 'nagadPersonal') - calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')}
      </td>
      <td className="p-3 border border-gray-300 text-center">
        ৳ {calculateTotalByPaymentMethod2(userr.email, 'rocketPersonal') - calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')}
      </td>
      <td className="p-3 border border-gray-300 text-center">
        ৳ {calculateTotalByPaymentMethod2(userr.email, 'bank') - calculateTotalByPaymentMethod(userr.email, 'bank')}
      </td>
                    </>

      }
     
      <td className="p-3 border border-gray-300 text-center">
        <div className="relative group flex items-center justify-center">
          <h1 className="ml-10">$ {userr?.payoneer}</h1>
          {ddd?.role === 'admin' && (
            <button
              className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() =>
                document.getElementById(`my_modal_${userr._id}`).showModal()
              }
            >
              <FaEdit />
            </button>
          )}
          <dialog id={`my_modal_${userr._id}`} className="modal">
            <div className="modal-box bg-white">
              <form
                onSubmit={(e) => handleUpdateTotalBudget(e, userr._id, `my_modal_${userr._id}`)}
              >
                <input
                  type="number"
                  name="tBudged"
                  step="0.01"
                  defaultValue={userr.payoneer}
                  className="w-full border bg-white border-black rounded p-2 mt-1 text-gray-500"
                />
                <button
                  type="submit"
                  className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
                >
                  Update
                </button>
              </form>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
          </dialog>
        </div>
      </td>
      <td className="p-3 border border-gray-300 text-center">$ {getThresholdValue(userr.email)}</td>
    </tr>
              </tbody>
            ))}
             <tfoot>
      <tr className="bg-[#05a0db] text-white">

        <td className="p-3 text-center font-bold"></td>
        <td className="p-3 text-center font-bold">Total</td>


        {
                    ddd?.role === 'admin' && <>
                     <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bank')), 0)
                                        }</td>
                    </>

        }
  
                                      
            <td className="p-3 text-center font-bold">$ {payoneerTotal}</td>
            <td className="p-3 text-center font-bold">৳ {calculateTotalThreshold()}</td>
      
   
      </tr>
    </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Banner;

