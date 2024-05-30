import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";
import Payment from "./Payment";
import { AuthContext } from "../../Security/AuthProvider";


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


return (
        <div className="mt-24 p-4 dark:text-green-800">


         <div className=" ">
         {/* {ddd?.role === 'admin' ? <h2 className="text-center mx-4 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 dark:text-green-800">Employers Activities
         </h2>:  <h2 className="text-center mx-4 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 dark:text-green-800">All Employers 
         </h2>}  */}
       
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-xs">
            <thead className="bg-green-600 text-white font-bold text-xl">
              <tr>
                <th className="p-3 text-center">Employeer Name</th>
                {
                  ddd?.role === 'admin' ? <>
                  <th className="p-3 text-center"><img  className="w-28 h-6 mx-auto" src=" https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="" /></th>
                <th  className="p-3  text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src=" https://i.ibb.co/QkTM4M3/rocket.png" alt="" /></th>
                <th className="p-3  text-center">Total BDT</th>
                <th className="p-3 text-center">Action</th>
                  </> : <></>
                }
              </tr>
            </thead>
            {
              employee.map((userr,index)=><tbody className="text-black  text-xl"  key={userr._id}> 
            
            <Link to={`/userInfo/${userr?.email}`}>
              
            </Link>
                <tr  className={`${index % 2 === 0 ? "text-gray-500 border-b border-opacity-20" : "text-gray-500 border-b border-opacity-20"}`}>

              <Link to={`/userInfo/${userr?.email}`}>
              <td className="p-3 hover:bg-gray-200 hover:text-blue-600 font-bold hover:text-2xl flex justify-start text-center  ml-10  items-center gap-2 "> <Link     to={`/userInfo/${userr?.email}`}>
                    <img  className="w-10 h-10 mx-auto rounded-full" src={userr?.photo} alt="" />
                           </Link>
                         <Link to={`/userInfo/${userr?.email}`}>{userr.name} </Link>
                  </td>
              </Link>
              
                  {
                    ddd?.role === 'admin' ? <> 
                     <td className="p-3 text-center">$ {userr.payoneer}</td>
                  <td className="p-3 text-center">৳ {userr.bkashMarcent}</td>
                  <td className="p-3 text-center">৳ {userr.bkashPersonal}</td>
                  <td className="p-3 text-center">৳ {userr.nagadPersonal}</td>
                  <td className="p-3 text-center">৳ {userr.rocketPersonal}</td>
                  <td className="p-3 text-center">৳ {userr.totalBDT}</td>
                  <td className="p-3 text-center">
<button   className="font-avenir px-3 py-1 bg-neutral rounded text-white" onClick={()=>document.getElementById('my_modal_1').showModal()}> Edit</button>
<dialog id="my_modal_1" className="modal">
  <Payment id={userr._id} ></Payment>
  <form method="dialog">

        <button className="p-3 bg-red-600 rounded-lg  text-white font-bold">Close</button>
      </form>
</dialog>
                    </td>
                    </> : <></>
                  }

                 
                </tr>
              </tbody>)
            }

            <tr className="border-b border-opacity-20 bg-green-800 font-bold p-5 text-white text-lg">
                {
                   ddd?.role === 'admin' ? <>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">$ {payoneerTotal}</td>
                <td className="p-3 text-center">৳ {bkashMarcentTotal}</td>
                <td className="p-3 text-center">৳ {bkashPersonalTotal}</td>
                <td className="p-3 text-center">৳ {nagadPersonalTotal}</td>
                <td className="p-3 text-center">৳ {rocketPersonalTotal}</td>
                <td className="p-3 text-center">৳ {totalBDT}</td>
                <td className="p-3 text-center">৳ {totalBDT}</td>
                   </> : <></>
                }
              
              </tr>
          </table>
        </div>
      </div>
      
        </div>
    );
};

export default Banner;
