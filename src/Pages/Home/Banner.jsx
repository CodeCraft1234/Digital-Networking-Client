import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import Payment from "./Payment";
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";


const Banner = () => {
  const [users,refetch] = useUsers(); 
  const [payoneerTotal, setPayoneerTotal] = useState(0); 
const {user}=useContext(AuthContext)
const [ddd, setDdd] = useState(null);

useEffect(() => {
    if (users && user) {
        const fff = users.find(u => u.email === user?.email);
        console.log(fff);
        setDdd(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);



const [employee,setEmployee]=useState([])
useEffect(() => {
    if (users && user) {
        const fff = users.filter(u => u.role === 'employee');
        console.log(fff);
        setEmployee(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);




const [bkashMarchentTotal, setBkashMarchentTotal] = useState(0);
const [bkashPersonalTotal2, setBkashPersonalTotal2] = useState(0);
const [nagadPersonalTotal2, setNagadPersonalTotal] = useState(0);
const [rocketPersonalTotal2, setRocketPersonalTotal] = useState(0);

const calculateTotalAmount = (users, paymentMethod) => {
  return users.reduce((acc, user) => acc + (parseFloat(user[paymentMethod]) || 0), 0);
};

useEffect(() => {
  const totalBkashMarchent = calculateTotalAmount(users, 'bkashMarchent');
  const totalBkashPersonal = calculateTotalAmount(users, 'bkashPersonal');
  const totalNagadPersonal = calculateTotalAmount(users, 'nagadPersonal');
  const totalRocketPersonal = calculateTotalAmount(users, 'rocketPersonal');
  const totalpayoneer = calculateTotalAmount(users, 'payoneer');

  setBkashMarchentTotal(totalBkashMarchent);
  setBkashPersonalTotal2(totalBkashPersonal);
  setNagadPersonalTotal(totalNagadPersonal);
  setRocketPersonalTotal(totalRocketPersonal);
  setPayoneerTotal(totalpayoneer);

}, [users]);


const handleUpdateTotalBudget = (e, id, modalId) => {
  e.preventDefault();
  const tBudged = e.target.tBudged.value;
  const body = { payoneer: tBudged };
  console.log(body);

  axios.put(`https://digital-networking-server.vercel.app/users/payoneer/${id}`, body)
    .then((res) => {
      console.log(res.data);
      refetch();

      // Automatically close the modal
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        modalElement.close();
      }
    })
    .catch((error) => {
      console.error("Error updating Payoneer amount:", error);
    });
};


return (

        <div className="mt-5 p-4 dark:text-green-800">
           <Helmet>
        <title>Dashboard | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-6 gap-8 mt-4 p-4 ">

      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />

        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{bkashMarchentTotal}
        </p>
      </div>
      <div className="balance-card items-center bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img  " src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{bkashPersonalTotal2}
        </p>
      </div>
      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{nagadPersonalTotal2}
        </p>
      </div>
      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{rocketPersonalTotal2}
        </p>
      </div>

      <div className=" bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 gap-4 ">
      <div>
       <img className="balance-card-img w-56 h-auto mt-6" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
       <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-red-600">$</span>{payoneerTotal}</p>
       </span>
     </div>
      </div>
      <div className=" bg-white rounded-2xl p-5 mt-4 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 gap-4 ">
      <div>
      <h1 className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">Total:</h1>
       <span className="balance-card-text mt-3 text-4xl flex items-center justify-center gap-2">
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-black">৳</span>{bkashMarchentTotal + rocketPersonalTotal2 + bkashPersonalTotal2 + nagadPersonalTotal2}</p>
       </span>
     </div>
      </div>
    </div>
    
    

    <div className="">
     <div className="overflow-x-auto mt-6">
     <table className="min-w-full text-xs md:text-base">
        <thead className="bg-[#05a0db] text-white font-bold text-sm md:text-xl">
          <tr>
            <th className="p-3 text-center">Employee Name</th>
         
            {ddd?.role === 'admin' && (
              <>
               
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
                  <img className="w-28 h-6 mx-auto" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
                </th>
               
               
              </>
            )}
          </tr>
        </thead>
        {employee.map((userr, index) => (
          <tbody className="text-black text-sm md:text-xl" key={userr._id}>
            <tr className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-opacity-20`}>
              <td className="p-3 hover:bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 hover:text-blue-600 font-bold hover:text-sm md:hover:text-sm sm:hover:text-sm flex flex-col md:flex-row justify-start text-center ml-2 md:ml-10 items-center gap-2  border-r-2 border-gray-300">
                <Link to={`/dashboard/userInfo/${userr?.email}`}>
                  <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
                </Link>
                <Link to={`/dashboard/userInfo/${userr?.email}`}>{userr.name}</Link>
              </td>
           
              {ddd?.role === 'admin' && (
                <>
                  
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ {userr.bkashMarchent}
                  </td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ {userr. bkashPersonal}</td>
                 
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ {userr.nagadPersonal}</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ {userr.rocketPersonal}</td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                      <h1 className="ml-28">$ {userr?.payoneer}</h1>
                      <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_${userr._id}`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>

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
                  
                 
                </>
              )}
            </tr>
          </tbody>
        ))}
        <tfoot>
          {ddd?.role === 'admin' && (
            <tr className="border-b border-opacity-20 bg-[#05a0db] font-bold p-5 text-white text-sm md:text-lg">

              <td className="p-3 text-center">Total BDT</td>
              <td className="p-3 text-center">৳ {bkashMarchentTotal}</td>
              <td className="p-3 text-center">৳ {bkashPersonalTotal2}</td>
              <td className="p-3 text-center">৳ {nagadPersonalTotal2}</td>
              <td className="p-3 text-center">৳ {rocketPersonalTotal2}</td>
              <td className="p-3 text-center">$ {payoneerTotal}</td>
            </tr>
          )}
        </tfoot>
      </table>
    </div>
      </div>
      
        </div>
    );
};

export default Banner;
