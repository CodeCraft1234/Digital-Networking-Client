import { useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import Payment2 from "./Payment2";
import Payment from "./Payment";


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



    return (
        <div className="mt-24">
             <div className="p-2 sm:p-4 dark:text-gray-100">
        <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
          Employes Activities
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-400">
              <tr>
                <th className="p-3 text-center">Worker Logo</th>
                <th className="p-3 text-center">Worker Name</th>
                <th  className="p-3  text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src=" https://i.ibb.co/QkTM4M3/rocket.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-28 h-6 mx-auto" src=" https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="" /></th>
                <th className="p-3 text-center">Total-BDT</th>
                <th className="p-3 text-center">Total-BDT</th>
              </tr>
            </thead>
            {
              users.map(user=><tbody key={user._id}>
            
                <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  <td className="p-3 text-center">     <Link to={`/userInfo/${user?.email}`}>
                    <img  className="w-10 h-10 mx-auto rounded-full" src={user.photo} alt="" />
                                                       </Link>
                  </td>
                  <td className="p-3 text-center">
                  <Link to={`/userInfo/${user._id}`}>{user.name} </Link>
                  </td>
                  <td className="p-3 text-center">৳ {user.bkashMarcent}</td>
                  <td className="p-3 text-center">৳ {user.bkashPersonal}</td>
                  <td className="p-3 text-center">৳ {user.nagadPersonal}</td>
                  <td className="p-3 text-center">৳ {user.rocketPersonal}</td>
                  <td className="p-3 text-center">$ {user.payoneer}</td>
                  <td className="p-3 text-center">৳ {user.totalBDT}</td>
                  <td className="p-3 text-center">
<button  className="font-avenir px-3 py-1 bg-neutral rounded text-white" onClick={()=>document.getElementById('my_modal_1').showModal()}> Edit</button>
<dialog id="my_modal_1" className="modal">
  <Payment id={user._id} ></Payment>
  <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-secondary bg-blue-500 text-white font-bold">Close</button>
      </form>
</dialog>
                    </td>
                </tr>
              </tbody>)
            }
            <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">৳ {bkashMarcentTotal}</td>
                <td className="p-3 text-center">৳ {bkashPersonalTotal}</td>
                <td className="p-3 text-center">৳ {nagadPersonalTotal}</td>
                <td className="p-3 text-center">৳ {rocketPersonalTotal}</td>
                <td className="p-3 text-center">$ {payoneerTotal}</td>
                <td className="p-3 text-center">৳ {totalBDT}</td>
                <td className="p-3 text-center">৳ {totalBDT}</td>
               
              </tr>
          </table>
        </div>
      </div>
      
        </div>
    );
};

export default Banner;
