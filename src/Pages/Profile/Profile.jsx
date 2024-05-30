
import "./profile.css";
import { useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import EmployeerMouthlySelery from "../Home/EmployeerMouthlySelery";




const Profile = () => {

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
    <div className="mt-24   ">
      
       <div >
            <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
      </div>
      
    <CampaignTable email={userr?.email}></CampaignTable> 
     <UserAdAccount email={userr?.email}></UserAdAccount>
      <EmployeerMouthlySelery email={userr?.email}></EmployeerMouthlySelery>
    </div>
  );
};

export default Profile;