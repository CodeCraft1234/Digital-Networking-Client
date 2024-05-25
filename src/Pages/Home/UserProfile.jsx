import { useContext, useEffect, useState } from "react";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";
import WorkList from "../../Components/WorkList/WorkList";
import { AuthContext } from "../../Security/AuthProvider";
import { useLoaderData } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";


const UserProfile = () => {
    const {user}=useContext(AuthContext)

    const userr=useLoaderData()

    console.log(userr)
    const AxiosPublic=UseAxiosPublic()
  const [data,setData]=useState([])
  console.log(data)
  
      useEffect(()=>{
        AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${user?.email}`)
        .then(res=>{
          console.log(res.data)
          setData(res.data)
        })
      },[])


    //   const [dataa,setData]=useState([])
    //  
    //   

      const [campaign]=useCampaings()
      console.log(campaign)
     
      const [dataa2,setData2]=useState([])
      console.log(dataa2)
      useEffect(() => {
       const filtered = campaign.filter(campaign => campaign.clientEmail === user?.email);
       console.log(filtered);
       setData2(filtered);
     }, [campaign, user?.email]);
     

    return (
        <div>
<div className="mt-24">
              <img className="rounded-full mx-auto w-72 h-72" src={data?.photo} alt=""/>
    </div>

            
             <div className="flex flex-wrap  justify-around p-5 ">
      <div className="px-24 py-16 rounded-2xl  bg-green-400 shadow-lg   text-center">
        <h2 className="text-4xl font-bold">Total Spent</h2>
        <p className="text-xl">Balance: $100.00</p>
      </div>

      <div className="px-24 py-16 rounded-2xl  bg-green-400 shadow-lg   text-center">
        <h2 className="text-4xl font-bold">Total Bill</h2>
        <p className="text-xl">Balance: ৳100.00</p>
      </div>

      <div className="px-24 py-16 rounded-2xl  bg-green-400 shadow-lg   text-center">
        <h2 className="text-4xl font-bold">Total Paid</h2>
        <p className="text-xl">Balance: ৳44000</p>
      </div>

      <div className="px-24 py-16 rounded-2xl  bg-green-400 shadow-lg  text-center">
        <h2 className="text-4xl font-bold">Total DUE</h2>
        <p className="text-2xl">Balance: ৳5000</p>
      </div>

    </div>
    <div className=" p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        Own Work List
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Page Name & URL</th>
              <th className="p-3">T. Budget</th>
              <th className="p-3">T. Spent</th>
              <th className="p-3">Status</th>
             
            </tr>
          </thead>
          <tbody>
            {dataa2.map((work, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 text-center">{work.date}</td>
                <td className="p-3 text-center">{work.pageName}</td>
                <td className="p-3 text-center">
                {work.tBudged}
                </td>
                <td className="p-3 text-center">
                {work.tSpent}
                </td>
               
                <td
                  className={`p-3 text-center ${
                    work.status === "Active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                   {work.status}
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
             
              <td className="p-3 text-center">
              
              </td>
              <td className="p-3 text-right" colSpan="2">
                Total Spent:
              </td>
              
              <td className="p-3 text-center">
                {/* ৳{" "}
                {works
                  .reduce((sum, work) => sum + work.totalBill, 0)
                  .toLocaleString()} */}
              </td>
              <td className="p-3 text-center">
             
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
                    <PaymentHistory></PaymentHistory>
        </div>
    );
};

export default UserProfile;