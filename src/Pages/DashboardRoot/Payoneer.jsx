import  { useState, useEffect, useContext } from 'react';
import useUsers from '../../Hook/useUsers';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import { FaEdit } from 'react-icons/fa';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { ImCross } from 'react-icons/im';

const Payoneer = () => {
  const [users,refetch] = useUsers();
  const AxiosPublic=UseAxiosPublic()
  const [modalData, setModalData] = useState(null);
  const { user } = useContext(AuthContext);
  console.log(users);
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
      if (users && user) {
          const foundUser = users.find(u => u.email === user.email);
          setDdd(foundUser || {}); 
      }
  }, [users, user]);

  const handleUpdateTotalBudget = (e, id, modalId) => {
    e.preventDefault();
    const tBudged = e.target.tBudged.value;
    const body = { payoneer: tBudged };

    AxiosPublic.put(`/users/payoneer/${id}`, body)
      .then((res) => {
        refetch();
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          modalElement.close();
        }
      })
      .catch((error) => {
        console.error("Error updating Payoneer amount:", error);
      });
  };
  const handleUpdateTotalBudget2 = (e, id) => {
    e.preventDefault();
  
    // Get Payoneer email from form
    const payoneerEmail = e.target.payoneerEmail.value;
  
    // Construct request body
    const body = { payoneerEmail };
  
    // Optionally: Add a loading state here if necessary
  
    AxiosPublic.put(`/users/payoneerEmail/${id}`, body)
      .then((res) => {
        // Trigger refetch if available (make sure refetch is properly defined)
        if (typeof refetch === "function") {
          refetch();
          setModalData(null)
        }
  
        // Close modal using React state instead of DOM manipulation
        const modalElement = document.getElementById('my_modal_8');
        if (modalElement && typeof modalElement.close === 'function') {
          modalElement.close();
        } else {
          console.error("Modal element not found or invalid.");
        }
  
        // Optionally: Handle success feedback here, such as showing a success message
      })
      .catch((error) => {
        console.error("Error updating Payoneer email:", error);
  
        // Optionally: Show error feedback to the user
      });
  };


  const totalPayoneerBalance = users
  ?.filter((user) => user.role === 'employee')
  ?.reduce((acc, user) => acc + parseFloat(user.payoneer || 0), 0);


  return (
    <div className='m-5 text-black'>
      <Helmet>
        <title>Sellery | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="p-5 rounded-lg " style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div  className="overflow-x-auto rounded-xl text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th style={{  border: 'var(--border)'}} className="p-3">SL</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Employee Name</th>
              
              <th style={{  border: 'var(--border)'}} className="p-3">ThresHold
              </th>
              <th style={{  border: 'var(--border)'}} className="p-3">Current Balance
              </th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-center">
                     Payoneer USD
                    </th>
              <th style={{  border: 'var(--border)'}} className="p-3">Payoneer Email
              </th>
              
             
            </tr>
          </thead>
          <tbody className='text-black'>
            {users?.filter(f=>f.role === 'employee')?.sort((a, b) => a.name.localeCompare(b.name))?.map((user, index) => (
                  <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                  key={user._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-200  text-left text-black border-b border-opacity-20"
                  }`}
                >
                 <td style={{  border: 'var(--border)'}} className="p-3  text-center">{index + 1}</td>
                <td style={{  border: 'var(--border)'}} className="p-3  hover:text-blue-700 hover:font-bold  font-bold text-start pl-5">
                  {
                    ddd?.role === 'admin' ? <Link className='flex justify-start items-center gap-2' to={`/dashboard/userInfo/${user?.email}`}><img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span></Link> :  <h1 className='flex justify-start items-center gap-2'><img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span></h1>
                  }
                 
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3  text-center">
                $ {user?.adsAccounts?.filter(a=>a.status === 'Active')?.reduce((acc, account) => acc + parseFloat(account.threshold), 0).toFixed(0)}
               </td>
                <td style={{  border: 'var(--border)'}} className="p-3  text-center">
                $ {user?.adsAccounts?.filter(a=>a.status === 'Active')?.reduce((acc, account) => acc + parseFloat(account.currentBallence), 0).toFixed(0)}
               </td>
            
                <td style={{  border: 'var(--border)'}} className="p-3  text-center">
        <div className="relative group flex items-center justify-center">
          <h1 className="ml-10">$ {user?.payoneer}</h1>
          {  (
            <button
              className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() =>
                document.getElementById(`my_modal_${user._id}`).showModal()
              }
            >
              <FaEdit />
            </button>
          )}
          <dialog id={`my_modal_${user._id}`} className="modal">
            <div className="modal-box bg-white">
              <form
                onSubmit={(e) => handleUpdateTotalBudget(e, user._id, `my_modal_${user._id}`)}
              >
                <input
                  type="number"
                  name="tBudged"
                  step="0.01"
                  defaultValue={user.payoneer}
                  className="w-full border bg-white border-black rounded p-2 mt-1 text-gray-500"
                />
                <button
                  type="submit"
                  className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
                >
                  Update
                </button>
              </form>
              <form method="dialog">
                <button className="btn btn-sm text-black btn-circle btn-ghost absolute right-2 top-1">
                  ✕
                </button>
              </form>
            </div>
          </dialog>
        </div>
            </td>
                <td style={{  border: 'var(--border)'}} className="p-3  text-center">
        <div className="relative group flex items-center justify-center">
          <h1 className="ml-10">{user?.payoneerEmail}</h1>
          {ddd?.role === 'admin' && (
            <button
              className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => setModalData(user)}
            >
              <FaEdit />
            </button>
          )}



               {modalData && (
         <dialog className="modal" open>
            <div className="modal-box bg-white">
            <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => setModalData(null)}
           >
            <ImCross />
           </h1>
              <form
                onSubmit={(e) => handleUpdateTotalBudget2(e, modalData._id,)}
              >
                <input
                  type="email"
                  name="payoneerEmail"
                  step="0.01"
                  defaultValue={modalData.payoneerEmail}
                  className="w-full border bg-white border-black rounded p-2 mt-1 text-gray-500"
                />
                <button
                  type="submit"
                  className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
                >
                  Update
                </button>
              </form>
              
            </div>
          </dialog>
               )}

        </div>
            </td>
               

              </tr>
            ))}
          </tbody>
          <tfoot className='font-bold'>
  <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
    <td style={{  border: 'var(--border)'}} className='p-3 text-right border-gray-300' colSpan='2'>
      Total:
    </td>
   
    <td style={{  border: 'var(--border)'}} className='p-3 border-gray-300 text-center'>
      $ {users
        ?.filter((user) => user?.role === 'employee')
        ?.reduce((acc, user) => {
          // Handle null or undefined values for adsAccounts and threshold
          const thresholdSum = user?.adsAccounts
            ?.filter(a => a?.status === 'Active')
            ?.reduce((sum, account) => sum + parseFloat(account?.threshold || 0), 0) || 0;
          return acc + thresholdSum;
        }, 0)
        ?.toFixed(0) || 0} {/* Total Threshold */}
    </td>
    <td style={{  border: 'var(--border)'}} className='p-3 border-gray-300 text-center'>
      $ {users
        ?.filter((user) => user?.role === 'employee')
        ?.reduce((acc, user) => {
          // Handle null or undefined values for adsAccounts and currentBallence
          const currentBalanceSum = user?.adsAccounts
            ?.filter(a => a?.status === 'Active')
            ?.reduce((sum, account) => sum + parseFloat(account?.currentBallence || 0), 0) || 0;
          return acc + currentBalanceSum;
        }, 0)
        ?.toFixed(0) || 0} {/* Total Current Balance */}
    </td>
    <td style={{  border: 'var(--border)'}} className='p-3 border-gray-300 text-center'>
      $ {totalPayoneerBalance?.toFixed(2) || 0} {/* Display the total Payoneer balance */}
    </td>
    <td style={{  border: 'var(--border)'}}></td>
  </tr>
</tfoot>



        </table>
      </div>
      </div>
    </div>
  );
};

export default Payoneer;
