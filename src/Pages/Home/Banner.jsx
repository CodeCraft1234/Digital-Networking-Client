import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import Payment from "./Payment";
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";


const Banner = () => {
  const [users] = useUsers(); 


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

const {user}=useContext(AuthContext)
const [ddd, setDdd] = useState(null);

useEffect(() => {
    if (users && user) {
        const fff = users.find(u => u.email === user?.email);
        console.log(fff);
        setDdd(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);

console.log(ddd?.name);

const [employee,setEmployee]=useState([])
useEffect(() => {
    if (users && user) {
        const fff = users.filter(u => u.role === 'employee');
        console.log(fff);
        setEmployee(fff || {}); // Update state with found user or an empty object
    }
}, [users, user]);

console.log(ddd?.name);


const [bkashMarcent2,setBkashMarcentTotal2]=useState(0)
const [nagadPersonal2,setNagadPersonalTotal2]=useState(0)
const [bkashPersonal2,setBkashPersonalTotal2]=useState(0)
const [rocketPersonal2,setRocketPersonalTotal2]=useState(0)
const [bankTotal2,setBankTotal2]=useState(0)
const [Total2,setTotal2]=useState(0)
console.log(bkashMarcent2,rocketPersonal2,nagadPersonal2,bkashPersonal2,bankTotal2,Total2)

const [employeePayment,refetch]=useEmployeePayment()
useEffect(()=>{


        const filter2=employeePayment.filter(d=>d.paymentMethod === 'bkashMarchent')
        const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setBkashMarcentTotal2(total)

        const filter3=employeePayment.filter(d=>d.paymentMethod === 'nagadPersonal')
        const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setNagadPersonalTotal2(total3)

        const filter4=employeePayment.filter(d=>d.paymentMethod === 'bkashPersonal')
        const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setBkashPersonalTotal2(total4)

        const filter5=employeePayment.filter(d=>d.paymentMethod === 'rocketPersonal')
        const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setRocketPersonalTotal2(total5)
        const filter6=employeePayment.filter(d=>d.paymentMethod === 'bank')
        const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setBankTotal2(total6)
        const total7 = employeePayment.reduce((acc, datas) => acc + parseFloat(datas.payAmount),0);
        setTotal2(total7)

        

},[employeePayment])


return (

        <div className="mt-20 p-4 dark:text-green-800">
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mb-3  lg:grid-cols-6 gap-8 mt-4 p-4 ">

      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />

        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{bkashMarcent2}
        </p>
      </div>
      <div className="balance-card items-center bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img  " src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{bkashPersonal2}
        </p>
      </div>
      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{nagadPersonal2}
        </p>
      </div>
      <div className="balance-card bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 ">
        <img className="balance-card-img   " src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
        <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
          <span className="text-lg lg:text-2xl font-extrabold">৳</span>{rocketPersonal2}
        </p>
      </div>

      <div className=" bg-white rounded-2xl p-5 text-center shadow-2xl transition-transform transform hover:scale-105 border-0 gap-4 ">
      <div>
       <img className="balance-card-img w-56 h-auto mt-6" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
       <span className="balance-card-text text-4xl flex items-center justify-center gap-2">
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-red-600">$</span>4000</p>
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-blue-600">/</span></p>
       <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700"> <span className="text-lg lg:text-2xl font-extrabold text-green-600">$</span>6000</p>
       </span>
     </div>
      </div>
      
      <div className="balance-card bg-white rounded-2xl shadow-2xl p-5 text-center transition-transform transform hover:scale-105 border-0">
      <p className="balance-card-text text-lg mt-5 lg:text-xl font-bold text-gray-700">Total: <span className="text-lg lg:text-xl font-extrabold">৳{Total2}</span></p>
      <p className="balance-card-text text-lg mt-2 lg:text-xl font-bold text-gray-700">DUE: <span className="text-lg lg:text-xl font-extrabold text-gray-700">৳</span></p>
      </div>
    </div>
    
    

    <div className="">
     <div className="overflow-x-auto mt-6">
     <table className="min-w-full text-xs md:text-base">
        <thead className="bg-[#5db646] text-white font-bold text-sm md:text-xl">
          <tr>
            <th className="p-3 text-center">Employee Name</th>
            <th className="p-3 text-center">Company Name</th>
            {ddd?.role === 'admin' && (
              <>
                <th className="p-3 text-center">
                  <img className="w-28 h-6 mx-auto" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
                </th>
                <th className="p-3 text-center">
                  <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash Merchant" />
                </th>
                <th className="p-3 text-center">
                  <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash Personal" />
                </th>
                <th className="p-3 text-center">
                  <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad Personal" />
                </th>
                <th className="p-3 text-center">
                  <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket Personal" />
                </th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Action</th>
              </>
            )}
          </tr>
        </thead>
        {employee.map((userr, index) => (
          <tbody className="text-black text-sm md:text-xl" key={userr._id}>
            <tr className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-opacity-20`}>
              <td className="p-3 hover:bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 hover:text-blue-600 font-bold hover:text-sm md:hover:text-sm sm:hover:text-sm flex flex-col md:flex-row justify-start text-center ml-2 md:ml-10 items-center gap-2  border-r-2 border-gray-300">
                <Link to={`/userInfo/${userr?.email}`}>
                  <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
                </Link>
                <Link to={`/userInfo/${userr?.email}`}>{userr.name}</Link>
              </td>
              <td className="p-3 text-center  border-r-2 border-gray-300">{userr.fullName}</td>
              {ddd?.role === 'admin' && (
                <>
                  <td className="p-3 text-center  border-r-2 border-gray-300">$ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">৳ 1000</td>
                  <td className="p-3 text-center  border-r-2 border-gray-300">
                    <button className="font-avenir px-3  mx-auto py-1 bg-green-800 rounded-lg text-white" onClick={() => document.getElementById(`modal_${userr._id}`).showModal()}>Edit</button>
                    <dialog id={`modal_${userr._id}`} className="modal">
                      <Payment id={userr._id}></Payment>
                      <form method="dialog">
                        <button className="p-3 bg-red-600 rounded-lg text-white font-bold">Close</button>
                      </form>
                    </dialog>
                  </td>
                </>
              )}
            </tr>
          </tbody>
        ))}
        <tfoot>
          {ddd?.role === 'admin' && (
            <tr className="border-b border-opacity-20 bg-green-800 font-bold p-5 text-white text-sm md:text-lg">
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center">Total BDT</td>
              <td className="p-3 text-center">$ {payoneerTotal}</td>
              <td className="p-3 text-center">৳ {bkashMarcentTotal}</td>
              <td className="p-3 text-center">৳ {bkashPersonalTotal}</td>
              <td className="p-3 text-center">৳ {nagadPersonalTotal}</td>
              <td className="p-3 text-center">৳ {rocketPersonalTotal}</td>
              <td className="p-3 text-center">৳ {totalBDT}</td>
              <td className="p-3 text-center"></td>
            </tr>
          )}
        </tfoot>
      </table>
    </div>
      </div>
      
        </div>
    );
};

export default Banner;
