import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";
import useUsers from "../../Hook/useUsers";
import Profile3 from "./Profile3";
import CampaignTable2 from "./CampaignTable2";
import { FaEdit } from "react-icons/fa";
import Banner from "./Banner";


const MyProfile = () => {
    const {user}=useContext(AuthContext)
    const [users]=useUsers()
    const [use,SetUse]=useState()
    useEffect(()=>{
        const d=users.find(u=>u.email === user?.email)
        SetUse(d)
    },[])
  const [payoneerTotal, setPayoneerTotal] = useState(0); 
const [ddd, setDdd] = useState(null);

useEffect(() => {
    if (users && user) {
        const fff = users.find(u => u.email === user?.email);
        console.log(fff);
        setDdd(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);



const [employee,setEmployee]=useState([])
useEffect(() => {
    if (users && user) {
        const fff = users.filter(u => u.role === 'employee');
        console.log(fff);
        setEmployee(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);




const [bkashMarchentTotal, setBkashMarchentTotal] = useState(0);
const [bkashPersonalTotal2, setBkashPersonalTotal2] = useState(0);
const [nagadPersonalTotal2, setNagadPersonalTotal] = useState(0);
const [rocketPersonalTotal2, setRocketPersonalTotal] = useState(0);

const calculateTotalAmount = (users, paymentMethod) => {
  return users.reduce((acc, user) => acc + (parseFloat(user[paymentMethod]) || 0), 0);
};

useEffect(() => {
  const totalBkashMarchent = calculateTotalAmount(users, 'bkashMarchent');
  const totalBkashPersonal = calculateTotalAmount(users, 'bkashPersonal');
  const totalNagadPersonal = calculateTotalAmount(users, 'nagadPersonal');
  const totalRocketPersonal = calculateTotalAmount(users, 'rocketPersonal');
  const totalpayoneer = calculateTotalAmount(users, 'payoneer');

  setBkashMarchentTotal(totalBkashMarchent);
  setBkashPersonalTotal2(totalBkashPersonal);
  setNagadPersonalTotal(totalNagadPersonal);
  setRocketPersonalTotal(totalRocketPersonal);
  setPayoneerTotal(totalpayoneer);

}, [users]);


const handleUpdateTotalBudget = (e, id) => {
  e.preventDefault();
  const tBudged = e.target.tBudged.value;
  const body = { payoneer: tBudged };
  console.log(body);

  axios.put(`https://digital-networking-server.vercel.app/users/payoneer/${id}`, body)
    .then((res) => {
      console.log(res.data);
      refetch();  // Make sure this function correctly refetches the updated data
      Swal.fire({
        title: "Good job!",
        text: "Total Budget updated!",
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Error updating account:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update account!",
      });
    });
};
    return (
        <div className=" ">
           
          <CampaignTable2></CampaignTable2>
          <div className="">
        <Banner></Banner>
      </div>
      
      
        </div>
    );
};

export default MyProfile;