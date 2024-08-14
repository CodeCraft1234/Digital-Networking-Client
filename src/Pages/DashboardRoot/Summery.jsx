import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";

import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";


const Summery = () => {
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


const handleUpdateTotalBudget = (e, id) => {
  e.preventDefault();
  const tBudged = e.target.tBudged.value;
  const body = { payoneer: tBudged };
  console.log(body);

  axios.put(`https://digital-networking-server.vercel.app/users/payoneer/${id}`, body)
    .then((res) => {
      console.log(res.data);
      refetch();  // Make sure this function correctly refetches the updated data
      Swal.fire({
        title: "Good job!",
        text: "Total Budget updated!",
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Error updating account:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update account!",
      });
    });
};



return (

        <div className="mt-5 p-4 dark:text-green-800">
             <Helmet>
        <title>Summery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
    <div className="">
     <div className="overflow-x-auto mt-6">
     <table className="min-w-full text-xs md:text-base">
        <thead className="bg-[#5db646] text-white font-bold text-sm md:text-xl">
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
               
               
               
              </>
              
            )}
             <th className="p-3 text-center">
                  <img className="w-28 h-6 mx-auto" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
                </th>
          </tr>
        </thead>
        {employee.map((userr, index) => (
          <tbody className="text-black text-sm md:text-xl" key={userr._id}>
            <tr className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-opacity-20`}>
              <td className="p-3 hover:bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100  font-bold -sm flex flex-col md:flex-row justify-start text-center ml-2 md:ml-10 items-center gap-2  border-r-2 border-gray-300">
                  <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
                <h1 >{userr.name}</h1>
              </td>
              <td className="p-3 text-center  border-r-2 border-gray-300">$ {userr?.payoneer}</td>
            </tr>
          </tbody>
        ))}
        <tfoot>
          {ddd?.role === 'admin' && (
            <tr className="border-b border-opacity-20 bg-green-800 font-bold p-5 text-white text-sm md:text-lg">

              <td className="p-3 text-center">Total BDT</td>
              <td className="p-3 text-center">৳ {bkashMarchentTotal}</td>
              <td className="p-3 text-center">৳ {bkashPersonalTotal2}</td>
              <td className="p-3 text-center">৳ {nagadPersonalTotal2}</td>
              <td className="p-3 text-center">৳ {rocketPersonalTotal2}</td>
             
            </tr>
          )}
           <td className="p-3 bg-green-800 text-white text-center"></td>
           <td className="p-3 bg-green-800 text-white text-center">$ {payoneerTotal}</td>
        </tfoot>
      </table>
    </div>
      </div>
      
        </div>
    );
};

export default Summery;
