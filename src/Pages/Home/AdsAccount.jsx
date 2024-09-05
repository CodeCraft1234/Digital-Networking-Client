import { Link } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import { FaEdit } from "react-icons/fa";
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
    );

      const handleUpdate = (e, id) => {
        e.preventDefault();
        const accountName = e.target.accountName.value;
        const date = e.target.date.value;
        const currentBallence = e.target.currentBallence.value;
        const threshold = e.target.threshold.value;
        const status = e.target.status.value;
        const body = {date, accountName, currentBallence, threshold, status };
      
        AxiosPublic.patch(`/adsAccount/${id}`, body)
          .then((res) => {
            console.log(res.data);
            refetch(); // Refetch the data to get the updated list
            setModalData(null); // Close the modal upon successful update
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
      const body = { totalSpent: parseFloat(totalSpent)  };
      const ids=generateRandomId()
   
      axios.put(`https://digital-networking-server.vercel.app/adsAccount/totalSpent/${id}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
          document.getElementById(`my_modal_${id}`).close(); // Close the modal
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
    return (
        <div className="m-5">
           
            <div className=" flex justify-center lg:justify-end lg:mb-5  mx-auto mb-3  items-center gap-3 ">

            <div className="flex  lg:mb-0 justify-center">
      <select
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
         
            <div className="overflow-x-auto rounded-xl text-black text-center border border-black">
          <table className="min-w-full  text-center bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3">OFF/ON</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Employeer Name</th>
                <th className="p-3">Ad Account Name</th>
                <th className="p-3">Current Balance</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Spent</th>
                <th className="p-3 " >
                  Status
                </th>
                <th className="p-3 " >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdsAccount.map((account, index) => (
                <tr
                  key={account._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-200  text-left text-black border-b border-opacity-20"
                  }`}
                >
                   <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
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
                  <td className="p-3 border-l-2 border-r-2 text-center border-gray-300 ">
                    {new Date(account.paymentDate).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-start px-5 ">
                    <Link to={`/dashboard/userInfo/${account?.employeeEmail}`}>
                    {account.employeerName}
                    </Link>
                
                  </td>
                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                      <h1> {account.accountName}</h1>
                    
                    </div>
                  </td>
                
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                  $ {account.currentBallence}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                  $ {account.threshold}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                      <h1>$ {account.totalSpent}</h1>
                      <button
                        className=" text-black text-right px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document
                            .getElementById(`my_modal_${account._id}`)
                            .showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id={`my_modal_${account._id}`} className="modal">
  <div className="modal-box bg-white">
    <form
      onSubmit={(e) =>
        handleUpdateTotalSpent(e, account._id, account.accountName, account.employeeEmail, account.employeerName)
      }
    >
      <h1 className="text-black font-bold text-start">Date</h1>
      <input
        className="text-black inline-block w-full mb-5 p-3 border border-black bg-red-200"
        type="date"
        name="date"
        required
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
    <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
        ✕
      </button>
    </form>
  </div>
</dialog>

                    </div>
                  </td>
                  <td
                    className={`p-3 border-r-2  text-center border-gray-300  ${
                      account.status === "Active"
                        ? "text-green-900 font-bold"
                        : "text-red-600 font-bold"
                    }`}
                  >
                    {account.status}
                  </td>
                  <td
                    className={`p-3 border-r-2  text-center border-gray-300  `}
                  >
               <div className="flex justify-center gap-3">
                        <button
                          className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => setModalData(account)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(account._id)}
                        >
                         Delete
                        </button>
                      
                      </div>
                  </td>

                
                </tr>
              ))}

<tr className="bg-[#05a0db]   text-sm text-white font-bold">
                <td className="p-3  text-right" colSpan="4">
                  Total :
                </td>
                <td className="p-3 text-center border-gray-300  ">
                {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.currentBallence || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 text-center  border-gray-300  ">
                  $ {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.threshold || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 text-start  border-gray-300 ">
                  $  {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.totalSpent || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="p-3 border-gray-300 text-center"></td>
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
        <h1 className="text-black text-center d">Old Account Name: <span className="text-blue-700 text-center font-bold" >{modalData.accountName}</span></h1>
        
        <div className="mb-4">
             <label className="block text-gray-500">Date</label>
             <input
               type="date"
               required
               name="date"
               defaultValue={modalData.date}
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
         <div className="mb-4">
           <label className="block text-gray-500">Status</label>
           <select
             name="status"
             defaultValue={modalData.status}
             disabled
             className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
           >
             <option value="Active">Active</option>
             <option value="Disable">Disable</option>
           </select>
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
        </div>
    );
};

export default AdsAccount;