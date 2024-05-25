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
import Profile from "../Profile/Profile";
import MyProfile from "./MyProfile";
import TransictionCard from "./TransictionCard";
import UserProfile from "./UserProfile";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [role, setUserr] = useState();
    const AxiosPublic=UseAxiosPublic()
  
    useEffect(() => {
        AxiosPublic.get(`http://localhost:5000/users/${user?.email}`)
        .then(res=>{
            console.log(res.data.role)
            setUserr(res.data.role)
        })
    }, [user, users]);
  
 

    return (
        <div> 
            {
            user?.email ? <div>
 {
                user?.email === "anowarulbd2@gmail.com" ?  <div>
                <TransictionCard></TransictionCard>
                <Banner></Banner> 
                 </div> : 
                 <>
                 {
                    role === "employee" ?   <MyProfile></MyProfile> : <>   <UserProfile></UserProfile></>
                 }
                
                 </>
            }

            </div> : <Login></Login>     
            }

            



            {/* {
                
            }
            <div>
                {
                       user?.email==="anowarulbd2@gmail.com" &&   <div>
                       <TransictionCard></TransictionCard>
                       <Banner></Banner> 
                        </div> 
                }

                {
                     user?.email === user?.email && 
                }

            </div> */}

            {/* <div>     
             
            </div>
         
             */}


           

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