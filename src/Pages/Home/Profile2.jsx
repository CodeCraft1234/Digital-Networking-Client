

import { useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";
import Selary from "./Selary";
import EmployeerMouthlySelery from "./EmployeerMouthlySelery";
import UserAdAccount from "../../Components/UserAdAccount/MyAdsAccount";
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

  return (
    <div className="mt-5   ">
      <Helmet>
              <title> Digital Network | Employee Ad Account</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
      
    <UserAdAccount email={userr?.email}></UserAdAccount>
    </div>
  );
};

export default Profile2;