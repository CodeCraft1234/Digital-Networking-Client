

import { useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";
import Selary from "./Selary";
import EmployeerMouthlySelery from "./EmployeerMouthlySelery";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import { Helmet } from "react-helmet-async";




const Profile2 = () => {

  const [users] = useUsers(); 
  const {user}=useContext(AuthContext)
  console.log(users)

  const [userss,setUser]=useState([])
  console.log(userss?.email)
  useEffect(()=>{
    const filtered=users.find(e=>e.email === user?.email) 
    console.log('sdahjgj',filtered)
    setUser(filtered)
  },[users,user])

  const userr=useLoaderData()
  console.log(userr)
  const AxiosPublic=UseAxiosPublic()
const [data,setData]=useState([])
console.log(data)

    useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res=>{
        console.log(res.data)
        setData(res.data)
      })
    },[])

  return (
    <div className="mt-5   ">
      <Helmet>
              <title> Digital Network | Employee Ad Account</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
      
       {/* <div >
            <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
      </div> */}
    {/* <CampaignTable email={userr?.email}></CampaignTable> */}
    {/* <Selary email={userr?.email}> </Selary> */}
    <UserAdAccount email={userr?.email}></UserAdAccount>
    </div>
  );
};

export default Profile2;