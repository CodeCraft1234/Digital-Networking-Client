import { Link } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUsers from "../../Hook/useUsers";
import { useState } from "react";
import { toast } from "react-toastify";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import axios from "axios";
import { ImCross } from "react-icons/im";

const AdsAccount = () => {
    const [adsAccount, refetch] = useAdsAccount();
    const [users] = useUsers();
    const [searchQuery, setSearchQuery] = useState("");
    const AxiosPublic = UseAxiosPublic();
    const [modalData, setModalData] = useState(null);
    const [modalData2, setModalData2] = useState(null);
    const initialTab = localStorage.getItem("activeTabAlladsAccountStatus") || "Active";
    const initialTab2 = localStorage.getItem("activeTabAlladsAccountEmail") || "all";
    const [selectedEmail, setSelectedEmail] = useState(initialTab2 );
    const [selectedStatus, setSelectedStatus] = useState(initialTab);
    
    const changeTab = (tab) => {
      setSelectedStatus(tab);
      localStorage.setItem("activeTabAlladsAccountStatus", tab); 
    };
    
    const changeTab2 = (tab) => {
      setSelectedEmail(tab);
      localStorage.setItem("activeTabAlladsAccountEmail", tab); 
    };

    const filteredAdsAccount = adsAccount
    .filter((account) =>
      (selectedStatus ? account.status === selectedStatus : true) &&
      (selectedEmail === "all" || account.employeeEmail === selectedEmail) &&
      (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    )
    .sort((a, b) => a.accountName.localeCompare(b.accountName, undefined, { sensitivity: 'base' }));
  

      const handleUpdate = (e, id) => {
        e.preventDefault();
        const accountName = e.target.accountName.value;
        const date = e.target.date.value;
        const currentBallence = e.target.currentBallence.value;
        const threshold = e.target.threshold.value;
        const body = {date, accountName, currentBallence, threshold};
      
        AxiosPublic.patch(`/adsAccount/${id}`, body)
          .then((res) => {
            console.log(res.data);
            refetch(); 
            setModalData(null); 
            toast.success("Account updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating account:", error);
            toast.error("Failed to update account. Please try again.");
          });
      };
  
    const handleDelete = (id) => {
          AxiosPublic.delete(`/adsAccount/${id}`).then((res) => {
            refetch();
          });
    };
  
    const generateRandomId = () => {
      return Math.floor(Math.random() * 1e13); 
    };
  
    const handleUpdateTotalSpent = (e, id,  accountName, employeeEmail, employeeName) => {
      e.preventDefault();
      const totalSpent = e.target.totalSpent.value;
      const date = e.target.date.value;
      const body = { totalSpent: parseFloat(totalSpent)};
      const ids=generateRandomId()
   
      AxiosPublic.put(`/adsAccount/totalSpent/${id}`, body)
        .then((res) => {
          refetch();
          setModalData2(null);
        })
        .catch((error) => {
          console.error("Error updating total spent:", error);
        });
    
      const totalSpentt = parseFloat(totalSpent);
      const monthlySpent = {
        ids,
        totalSpentt,
        accountName,
        date,
        employeeName
      };
  
      AxiosPublic.post('/users/update', { email: employeeEmail, monthlySpent })
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.error("Error posting user data:", error);
        });
    };
  
    const handleUpdate2 = (id, newStatus) => {
      const body = { status: newStatus };
      AxiosPublic.patch(`/adsAccount/status/${id}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
          toast.success(`Campaign updated successfully`);
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
    };

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // "YYYY-MM-DD" format

    return (
        <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="m-5 rounded-lg p-5">
           
           <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)'}} className=" flex justify-center lg:justify-start    mb-5  mx-auto   items-center gap-3 ">

            <div className="flex  lg:mb-0 justify-center">
      <select
       style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
        name="email"
        value={selectedEmail}
        onChange={(e) => changeTab2(e.target.value)}
        className="border bg-white text-black  text-sm border-black rounded p-2"
      >
        <option className="text-sm" value="all">All Employees</option>
        {users
          ?.filter((u) => u.role === "employee")
          .map((user) => (
            <option key={user._id} value={user.email}>
              {user.name}
            </option>
          ))}
      </select>

      <div>
        {selectedEmail === "all"
          ? adsAccount.map((account) => (
              <div key={account.id}> 
                <p>{account.name}</p> 
              </div>
            ))
          : adsAccount
              .filter((account) => account.userEmail === selectedEmail)
              .map((account) => (
                <div key={account.id}> 
                  <p>{account.name}</p> 
                </div>
              ))}
      </div>
    </div>
            <div className="flex  justify-center gap-3">
            <div className="flex text-sm lg:mb-0  justify-center">
                <select
                 style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
                  name="status"
                  value={selectedStatus}
                  onChange={(e) => changeTab(e.target.value)}
                  className="border text-sm bg-white px-4 text-black border-black rounded p-2 "
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>
          
            </div>
          


            </div>
         
            <div  className="overflow-x-auto rounded-xl  text-center " >
          <table className="min-w-full text-center ">
            <thead style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                <th className="p-3 " >
                  Action
                </th>
                <th className="p-3 text-start">Ad Account Name</th>
                <th className="p-3  text-start">Employeer Name</th>
                <th className="p-3 text-start">Current Balance</th>
                <th className="p-3 text-start">Threshold</th>
                <th className="p-3 text-start">Spend</th>
                <th className="p-3">Payment Date</th>
                
                <th className="p-3">OFF/ON</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdsAccount.map((account, index) => (
                <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                key={account._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-200  text-left text-black border-b border-opacity-20"
                }`}
              >
                    <td style={{  border: 'var(--border)'}}
                    className={`p-3 border-r-2  text-center border-gray-300  `}
                  >
               <div className="flex justify-center gap-3">
                        <button
                          className="text-red-600 text-xl hover:bg-blue-700  px-2 py-1 rounded"
                          onClick={() => handleDelete(account._id)}
                        >
                          <FaMinusSquare  />
                        </button>
                      
                      </div>
                  </td>

                

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                    <button
                         className="flex justify-start items-center gap-2"
                          onClick={() => setModalData(account)}
                        >
                          <FaEdit />
                           <h1> {account.accountName}</h1>
                        </button>
                     
                    
                    </div>
                  </td>

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5 ">
                    <Link to={`/dashboard/userInfo/${account?.employeeEmail}`}>
                    {account.employeerName}
                    </Link>
                
                  </td>
                
                
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start">
                  <span className=" text-xm font-extrabold">৳</span> {account.currentBallence}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start ">
                  <span className=" text-xm font-extrabold">৳</span> {account.threshold}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                      <h1><span className=" text-xm font-extrabold">৳</span> {account.totalSpent}</h1>
                      <button
                      className="text-black text-center px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     onClick={() => setModalData2(account)}
                   >
                <FaEdit />
               </button>

                    </div>
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 text-center border-gray-300 ">
                    {new Date(account.paymentDate).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={account.status === "Active"}
    onChange={() => {
      const newStatus = account.status === "Active" ? "Disable" : "Active";
      handleUpdate2(account._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      account.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        account.status === "Active" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
                 </td>

                </tr>
              ))}

<tr style={{backgroundColor: 'var(--bg-color)',border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className="font-bold">
                <td className="p-3  text-right" colSpan="4">
                  Total :
                </td>
                <td className="p-3 text-center border-gray-300  ">
                <span className=" text-xm font-extrabold">$</span> {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.currentBallence || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 text-center  border-gray-300  ">
                <span className=" text-xm font-extrabold">$</span> {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.threshold || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 text-start  border-gray-300 ">
                <span className=" text-xm font-extrabold">$</span>  {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.totalSpent || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 border-gray-300 text-center"></td>
              
              </tr>
        


            </tbody>
          </table>
        </div>

        {modalData && (
     <dialog className="modal" open>
     <div className="modal-box bg-white text-black">
     <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => setModalData(null)}
           >
            <ImCross />
           </h1>
       <form onSubmit={(e) => handleUpdate(e, modalData._id)}>
        <h1 className="text-black text-center d">Account Name: <span className="text-blue-700 text-center font-bold" >{modalData.accountName}</span></h1>
        
        <div className="mb-4">
             <label className="block text-gray-500">Date</label>
             <input
               type="date"
               required
               name="date"
               defaultValue={modalData.paymentDate}
               className="w-full border-2 border-gray-400 rounded p-2 mt-1 bg-green-300 text-black"
             />
           </div>
         <div className="mb-4">
           <label className="block text-gray-500">Account Name</label>
           <input
             type="text"
             name="accountName"
             required
             defaultValue={modalData.accountName}
             className="w-full border-2 border-black rounded p-2 mt-1 bg-white text-black"
           />
         </div>
            <div className="grid lg:grid-cols-2 gap-3">
            <div className="mb-4">
           <label className="block text-gray-500">Current Balance</label>
           <input
             type="number"
             name="currentBallence"
             step="0.01"
             defaultValue={modalData.currentBallence}
             className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-500">Threshold</label>
           <input
             type="number"
             name="threshold"
             step="0.01"
             defaultValue={modalData.threshold}
             className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
           />
         </div>
            </div>

         <div className="grid grid-cols-2 gap-3">
         <button
             className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
             onClick={() => setModalData(null)}
           >
             Close
           </button>
           <button
             type="submit"
             className="font-avenir hover:bg-indigo-700 px-3 py-1 rounded-lg text-white bg-[#05a0db]"
           >
             Update
           </button>
          
         </div>
       </form>
     </div>
   </dialog>
      )}

   {modalData2 && ( 
           <dialog className="modal" open>
  <div className="modal-box bg-white">

         <h1 className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => setModalData2(null)} >
            <ImCross />
        </h1>

  
     <form
      onSubmit={(e) =>
        handleUpdateTotalSpent(e, modalData2._id, modalData2.accountName, modalData2.employeeEmail, modalData2.employeerName)
      }
    >
     <h1 className="text-black font-bold text-center">{modalData2.accountName}</h1>

      <h1 className="text-black font-bold text-start">Date</h1>
      <input
        className="text-black inline-block w-full mb-5 p-3 border border-black bg-red-200"
        type="date"
        name="date"
        required
        defaultValue={formattedDate}
        id=""
      />
      <h1 className="text-black font-bold text-start">Total Spent</h1>
      <input
        type="number"
        name="totalSpent"
        step="0.01"
        placeholder="0"
        className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
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
    );
};

export default AdsAccount;