import { useContext, useEffect, useState } from "react";
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";
import { AuthContext } from "../../Security/AuthProvider";
import SalarySheet from "../../Components/SalarySheet/SalarySheet";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import WorkList from "../../Components/WorkList/WorkList";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";
import MonthlyAdAccount from "./MonthlyAddAccount";
import EmployeerMouthlySelery from "./EmployeerMouthlySelery";
import Login from "../../Security/Login";
import useUsers from "../../Hook/useUsers";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const Home = () => {
    const {user} = useContext(AuthContext);
    const [users]=useUsers()

    console.log(users)

    return (
        <div>
           {
            user ?  <div>
            {
                user?.email==="anowarulbd2@gmail.com" ?   <div>
                <Banner></Banner>
                <UserAdAccount></UserAdAccount>
                <MonthlyAdAccount></MonthlyAdAccount>
                <SalarySheet></SalarySheet>
                </div>
                :   <div>
                    <img className="mx-auto mt-24 w-52 h-52 rounded-full" src={user?.photoURL} alt="" />
                <CampaignTable></CampaignTable>
                <UserAdAccount></UserAdAccount>
                <EmployeerMouthlySelery></EmployeerMouthlySelery>
                <WorkList></WorkList>
            <PaymentHistory></PaymentHistory>
                </div>
            }
            </div> :  <Login></Login>
           }


           

            {/* {
                user.role === 'client' && <div>
                     <WorkList></WorkList>
            <PaymentHistory></PaymentHistory>
                </div>
            } */}
          
          
            
           
            
        </div>
    );
};

export default Home;