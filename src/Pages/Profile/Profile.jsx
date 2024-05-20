
import "./profile.css";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useEffect, useState } from "react";


const Profile = () => {

  const [users] = useUsers(); 
  console.log(users)

  const userr=useLoaderData()
  console.log(userr)

  const [bkashMarcentTotal, setBkashMarcentTotal] = useState(0); 
  const [bkashPersonalTotal, setBkashPersonalTotal] = useState(0); 
  const [nagadPersonalTotal, setnagadMarcentTotal] = useState(0); 
  const [rocketPersonalTotal, setrocketMarcentTotal] = useState(0); 
  const [payoneerTotal, setPayoneerTotal] = useState(0); 
  const [totalBDT, setTotalBDT] = useState(0);
  
  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.bkashMarcent || 0), 0); 
    setBkashMarcentTotal(total);
  }, [users]); 

  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.bkashPersonal || 0), 0); 
    setBkashPersonalTotal(total);
  }, [users]); 

  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.nagadPersonal || 0), 0); 
    setnagadMarcentTotal(total);
  }, [users]); 

  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.rocketPersonal || 0), 0); 
    setrocketMarcentTotal(total);
  }, [users]); 

  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.payoneer || 0), 0); 
    setPayoneerTotal(total);
  }, [users]); 

  useEffect(() => {
    const total = users.reduce((acc, user) => acc + (user.totalBDT || 0), 0); 
    setTotalBDT(total);
  }, [users]); 

  console.log(users)

//dhdsffdsjh
  return (
    <div className="mt-24   ">
      <div >
      <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
      
    </div>
    <div className="flex mx-auto items-center px-10 space-x-2 overflow-hidden sm:justify-center flex-nowrap dark:bg-gray-800 dark:text-gray-100">
    <NavLink to=""
          className="flex items-center flex-shrink-0 pl-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Profile
        </NavLink>
        <NavLink
          to="/ad-account"
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Ad Account
        </NavLink>
        <NavLink
          to=""
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Mobile Banking
        </NavLink>
        <NavLink
          to="/salary"
          className="flex items-center flex-shrink-0 pr-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Salary
        </NavLink>
      </div>
      {/* 1st table */}
      <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-400">
              <tr>
                <th className="p-3 text-center">Cover Photo</th>
                <th className="p-3 text-center">Company Logo</th>
                <th className="p-3 text-center">Full Name</th>
                <th className="p-3 text-center">Full Address</th>
                <th className="p-3 text-center">Facebook ID</th>
                <th className="p-3 text-center">Contact Number</th>
              </tr>
            </thead>
                <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  <td className="p-3 text-center">     <Link to={`/userInfo/${userr._id}`}>
                    <img  className="w-10 h-10 mx-auto rounded-full" src={userr.photo} alt="" />
                                                       </Link>
                  </td>
                  <td className="p-3 text-center">
                  <img  className="w-10 h-10 mx-auto rounded-full" src={userr.companyLogo} alt="" />
                  </td>
                
                  <td className="p-3 text-center">{userr?.fullName}</td>
                  <td className="p-3 text-center">{userr?.fullAddress}</td>
                  <td className="p-3 text-center">{userr?.facebookID}</td>
                  <td className="p-3 text-center">{userr?.contctNumber}</td>
                </tr>
          </table>
        </div>
        {/* 2nd table */}

          {/* 3rd table */}
          <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-400">
              <tr>
                <th  className="p-3  text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src=" https://i.ibb.co/QkTM4M3/rocket.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-28 h-6 mx-auto" src=" https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="" /></th>
                <th className="p-3 text-center">Total-BDT</th>
              </tr>
            </thead>
                <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  
                  
                  <td className="p-3 text-center">৳ {userr.bkashMarcent}</td>
                  <td className="p-3 text-center">৳ {userr.bkashPersonal}</td>
                  <td className="p-3 text-center">৳ {userr.nagadPersonal}</td>
                  <td className="p-3 text-center">৳ {userr.rocketPersonal}</td>
                  <td className="p-3 text-center">$ {userr.payoneer}</td>
                  <td className="p-3 text-center">৳ {userr.totalBDT}</td>
                </tr>
                
          </table>
        </div>
    </div>
  );
};

export default Profile;