import { useContext, useEffect, useState } from "react";
import useAdsPayment from "../../Hook/useAdsPayment";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import useMpayment from "../../Hook/UseMpayment";
import AdminPayments from "../DashboardRoot/AdminPayments";
import ClientPayments from "../DashboardRoot/ClientPayments";
import { AuthContext } from "../../Security/AuthProvider";


const MyPayments = () => {
    const {user}=useContext(AuthContext)
    const [employeePayment]=useEmployeePayment()
    const [MPayment] = useMpayment();
    const initialTab = localStorage.getItem("activeTabAdminPayment") || "adminPay";
    const [activeTab, setActiveTab] = useState(initialTab);
  
    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabAdminPayment", tab); // Store the active tab in local storage
      };

    const getButtonClass = (tab) => 
        `px-1 py-2 rounded ${activeTab === tab ? ' text-blue-700 font-bold' : ' text-black font-md'}`;
    
    const [employeePay,setEmployeePay]=useState([])
    const [clientPay,setClientPay]=useState([])
    useEffect(()=>{
        const emPay=employeePayment.filter(e=>e.employeeEmail === user?.email)
        setEmployeePay(emPay)
        const cliPay=MPayment.filter(e=>e.employeeEmail === user?.email)
        setClientPay(cliPay)
    },[])

    return (
        <div>
                         <div className="flex lg:justify-start justify-center items-center gap-1 lg:mt-5 mt-5 mx-5">
      <button 
          className={getButtonClass('adminPay')}
          onClick={() => changeTab('adminPay')}
        >
          Admin Pay 
        </button>
        <p className='font-extrabold text-blue text-2xl'>|</p>
      <button 
          className={getButtonClass('clientsPay')}
          onClick={() => changeTab('clientsPay')}
        >
          Clients Pay 
        </button>

      </div>

      {activeTab === 'adminPay' && <AdminPayments></AdminPayments>}
      {activeTab === 'clientsPay' && <ClientPayments></ClientPayments>}


        </div>

    );
};

export default MyPayments;