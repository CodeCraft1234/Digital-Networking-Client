import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import Profile3 from "./Profile3";
import CampaignTable2 from "./CampaignTable2";


const MyProfile = () => {
    const {user}=useContext(AuthContext)
    const [users]=useUsers()
    const [use,SetUse]=useState()
    useEffect(()=>{
        const d=users.find(u=>u.email === user?.email)
        SetUse(d)
    },[])

    return (
        <div className="mx auto mt-24 ">
           
          <CampaignTable2></CampaignTable2>
        </div>
    );
};

export default MyProfile;