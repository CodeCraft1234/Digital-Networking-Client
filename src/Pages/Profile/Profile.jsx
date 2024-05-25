
import "./profile.css";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import AdAccountTable from "../Home/AdAccountTable";
import ShowProfile from "../ShowProfile";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import TransictionCard from "../Home/TransictionCard";



const Profile = () => {

  const [users] = useUsers(); 
  console.log(users)

  const userr=useLoaderData()
  console.log(userr)
  const AxiosPublic=UseAxiosPublic()
const [data,setData]=useState([])
console.log(data)

    useEffect(()=>{
      const user=AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res=>{
        console.log(res.data)
        setData(res.data)
      })
    },[])

  return (
    <div className="mt-24   ">
      
      <div >
              <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
    </div>
    <TransictionCard></TransictionCard>
    <CampaignTable email={userr?.email}></CampaignTable>
    </div>
  );
};

export default Profile;