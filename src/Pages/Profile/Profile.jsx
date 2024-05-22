
import "./profile.css";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import { useEffect, useState } from "react";
import CampaignTable from "../Home/CampaignTable";
import AdAccountTable from "../Home/AdAccountTable";


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
    <CampaignTable></CampaignTable>
    <AdAccountTable></AdAccountTable>
    </div>
  );
};

export default Profile;