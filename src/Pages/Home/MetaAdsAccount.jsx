import { Link } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUsers from "../../Hook/useUsers";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { ImCross } from "react-icons/im";
import { Helmet } from "react-helmet-async";
import { IoIosAddCircleOutline } from "react-icons/io";
import useAllEmployee from "../../Hook/useAllEmployee";
import useMyAdsAccountByEmail from "../../Hook/useMyAdsAccountNyEmail";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";

const MetaAdsAccount = () => {
  const { user } = useContext(AuthContext);
  const [users]=useUsers()
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("a2") || "all" 
  : localStorage.getItem("a2") || user?.email; 

const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem("a2", tab); 
  };

    const [adsAccount] = useAdsAccount();
    const [searchQuery, setSearchQuery] = useState("");
    const AxiosPublic = UseAxiosPublic();
    const [modalData, setModalData] = useState(null);
    const [modalData2, setModalData2] = useState(null);
    const initialTab = localStorage.getItem("activeTabAlladsAccountStatus") || "Active";
    const [myAdsAccount,refetch]=useMyAdsAccountByEmail(selectedEmployee3)
    const [selectedStatus, setSelectedStatus] = useState(initialTab);
    const [allEmployees] = useAllEmployee([]);

    const changeTab = (tab) => {
      setSelectedStatus(tab);
      localStorage.setItem("activeTabAlladsAccountStatus", tab); 
    };
    

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
      const ids=generateRandomId()
   

      const totalSpentt = parseFloat(totalSpent);
      const monthlySpent = {
        ids,
        totalSpentt,
        accountName,
        date,
        role:'metaSpend',
        employeeName
      };
  
      AxiosPublic.post('/users/update', { email: employeeEmail, monthlySpent })
        .then(res => {
          console.log(res.data);
          setModalData2(null);
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

    const handleAddAdsAcount = (e) => {
      e.preventDefault();
      const accountName = e.target.accountName.value;
      const paymentDate = e.target.paymentDate.value;
      const employeeEmail = e.target.employeeEmail.value;
      const employeerName = allEmployees.find(e=>e.email === employeeEmail).name;
      const currentBallence=0
      const threshold=0
      const totalSpent=0
      const status='Active'
      
      const data = { accountName,totalSpent,currentBallence,threshold,role:'metaAdsAccount', paymentDate,status, employeeEmail,employeerName };
  
      console.log(data);
      AxiosPublic.post("/adsAccount", data).then((res) => {
        toast.success("Post created successfully!");
        console.log(res.data);
        refetch()
        document.getElementById("my_modal_3").close()
      });
    };

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; 

    return (
        <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className=" rounded-lg ">
 
          

          <div>

           <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)'}} className=" rounded-lg ">


            <div className="flex justify-between lg:justify-between  ml-5  my-5  mx-auto   items-center gap-3 ">
            <div>
                 <button 
                     className="add f-center"
                      onClick={() => document.getElementById("my_modal_3").showModal()}
                        >
                     <IoIosAddCircleOutline /> <span className="inline">Add Meta Account</span>
                      </button>
    
                      <dialog id="my_modal_3" className="modal">
      <div className="modal-box bg-white">
        <form onSubmit={(e) => handleAddAdsAcount(e)}>
          <div className="mb-4">
            <h1
              className="text-black hover:text-red-500 f-end"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              <ImCross />
            </h1>
              <div className="grid lg:grid-cols-2 items-center gap-3">
              <div className="col-span-1">
           <label className="block text-black">Date</label>
            <input
              required
              type="date"
              name="paymentDate"
              defaultValue={formattedDate}
              className="input2"
            />
           </div>

        <div className="col-span-1 w-full">
          <label className="block text-black">Select Employee</label>
         <select
          
           className="select2 w-full"
           name="employeeEmail"
         >
           {allEmployees?.filter(f=>f.role === 'employee').map((employee) => (
             <option key={employee._id} value={employee.email}>
               {employee.name}
             </option>
           ))}
         </select>
       </div>
              </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-black">Account Name</label>
            <input
              type="text"
              required
              name="accountName"
              placeholder="type here..."
              className="input2"
            />
          </div>
          
          <div className="modal-action grid grid-cols-2 gap-4">
            <button
              type="button"
              className="close"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="add"
            >
              Send
            </button>
          </div>
        </form>
      </div>
               </dialog>
          </div>

            <div className="f-center">
            <div className="w-full lg:w-auto f-start ">
  {userr?.role === "admin" ? (
    <div className="flex  justify-center">
      <select
        
        className="select2"
        value={selectedEmployee3}
        onChange={(e) => changeTab3(e.target.value)}
      >
        <option value="all">All Employees</option>
        {users
          .filter((u) => u.role === "employee")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  ) : (
   <></>
  )}
</div>
            <div className="flex text-sm lg:mb-0  justify-center">
                <select
                 
                  name="status"
                  value={selectedStatus}
                  onChange={(e) => changeTab(e.target.value)}
                  className="select2 "
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>

              <div className=" f-center">
   <input
   
     type="text"
     placeholder="Search by campaign name"
     className="input2"
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
          
            </div>
            </div>
          


            </div>
         
            <div  className="table-div px-4 pb-4" >
          <table className="min-w-full text-center ">
            <thead>
              <tr className="tr1">
                <th className="text-center" >
                  Items {myAdsAccount.length}
                </th>
                <th>Meta Account Name</th>
                <th>Employeer Name</th>
                <th>Current Balance</th>
                <th>Threshold</th>
                <th>Spend</th>
                <th>Payment Date</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
            {myAdsAccount
            ?.filter(f=>f.role === 'metaAdsAccount')
             ?.filter((account) =>
              (selectedStatus ? account.status === selectedStatus : true) &&
              (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            )
  ?.sort((a, b) =>
    a.accountName.localeCompare(b.accountName, undefined, { sensitivity: 'base' })
  )
  ?.map((account, index) => (
                     <tr
                     key={account._id}
                    className={`tr2`}
                   >
                  <td
                    className={`text-center  `}>
                        <button
                          className="delete"
                          onClick={() => handleDelete(account._id)}
                        >
                          <FaMinusSquare  />
                        </button>
                   </td> 
                  <td>
                    <button
                         className="f-start edit"
                          onClick={() => setModalData(account)}
                        >
                          <FaEdit />
                           <h1> {account.accountName}</h1>
                        </button>
                  </td>
                  <td>
                    <Link to={`/dashboard/userInfo/${account?.employeeEmail}`}>
                    {account.employeerName}
                    </Link>
                
                  </td>
                  <td>৳ {account.currentBallence} </td>
                  <td> ৳ {account.threshold}</td>
                  <td>
                    <div className="relative group flex items-center justify-center ">
                      <h1><span className=" text-xm font-extrabold">৳</span> {account.totalSpent}</h1>
                      <button
                      className="edit"
                     onClick={() => setModalData2(account)}
                   >
                <FaEdit />
               </button>

                    </div>
                  </td>
                  <td>
                    {new Date(account.paymentDate).toLocaleDateString("en-GB")}
                  </td>
                  <td  className="text-center"> 

                  <label className="status-label">
  <input
    type="checkbox"
    checked={account.status === "Active"}
    onChange={() => {
      const newStatus = account.status === "Active" ? "Disable" : "Active";
      handleUpdate2(account._id, newStatus);
    }}
  />
  <div className={account.status === "Active" ? "active" : "inactive"}>
    <span className={account.status === "Active" ? "active" : ""}></span>
  </div>
</label>

                 </td>
                </tr>
              ))}

                <tr  className="font-bold tr1">
                <td className="  text-right" colSpan="3">
                  Total :
                </td>
                <td >
                $ {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.currentBallence || 0),
        0
      ).toFixed(2)}
                </td>
                <td>
               $ {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.threshold || 0),
        0
      ).toFixed(2)}
                </td>
                <td >
               $ {adsAccount.reduce(
        (acc, account) => acc + parseFloat(account.totalSpent || 0),
        0
      ).toFixed(2)}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          </div>
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

export default MetaAdsAccount;