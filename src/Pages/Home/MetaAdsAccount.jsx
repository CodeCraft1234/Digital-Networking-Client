import { Link } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUsers from "../../Hook/useUsers";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { ImCross } from "react-icons/im";
import { IoIosAddCircleOutline } from "react-icons/io";
import useAllEmployee from "../../Hook/useAllEmployee";
import useMyAdsAccountByEmail from "../../Hook/useMyAdsAccountNyEmail";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const MetaAdsAccount = ({data1}) => {
  const { user } = useContext(AuthContext);
  const [users]=useUsers()
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
    ? localStorage.getItem(`activeTabag2${user?.email}`) || "all" 
    : localStorage.getItem(`activeTabag2${user?.email}`) || user?.email; 

    const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
    const [myAdsAccount,refetch]=useMyAdsAccountByEmail(selectedEmployee3)

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem(`activeTabag2${user?.email}`, tab); 
  };

    const [searchQuery, setSearchQuery] = useState("");
    const AxiosPublic = UseAxiosPublic();
    const [modalData, setModalData] = useState(null);
    const [modalData2, setModalData2] = useState(null);
    const initialTab = localStorage.getItem("activeTabAlladsAccountStatus") || "Active";

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
        // Show SweetAlert2 confirmation dialog
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // If confirmed, proceed with the delete request
            AxiosPublic.delete(`/adsAccount/${id}`).then((res) => {
              // Show success message
              Swal.fire("Deleted!", "The item has been deleted.", "success");
              refetch(); // Refetch the data
            });
          }
        });
      };
      
  
    const generateRandomId = () => {
      return Math.floor(Math.random() * 1e13); 
    };


    const handleUpdateTotalSpent = (e, id,  accountName, employeeEmail, employeeName) => {
      e.preventDefault();
      const totalSpent = e.target.totalSpent.value;
      const date = e.target.date.value;
      const role = e.target.role.value;
      const ids=generateRandomId()
   

      const totalSpentt = parseFloat(totalSpent);
      const data5 = { totalSpent:totalSpentt }

      const monthlySpent = {
        ids,
        totalSpentt,
        accountName,
        date,
        role:`${role}Spend`,
        employeeName
      };

      const monthlySpent2 = {
        ids,
        totalSpentt,
        accountName,
        date,
        role:`${role}Spend`,
        employeeName
      };

     
      if(role === 'contributor'){
        AxiosPublic.post('/users/update2', { email: employeeEmail, monthlySpent2 })
        .then(res => {
          console.log(res.data);
          setModalData2(null);
        })
        .catch(error => {
          console.error("Error posting user data:", error);
        });
      }else{
        AxiosPublic.post('/users/update', { email: employeeEmail, monthlySpent })
        .then(res => {
          console.log(res.data);

          AxiosPublic.patch(`/adsAccount/spend/${id}`, data5)
          .then(res=>{
            refetch();
            console.log(res.data)})


          setModalData2(null);
        })
        .catch(error => {
          console.error("Error posting user data:", error);
        });
      }
  
      
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
    
      const employeeEmail = e.target.employeeEmail?.value || userr?.email;
    
      const employeerName =
        allEmployees.find((e) => e.email === employeeEmail)?.name || userr?.name;
    
      const currentBallence = 0;
      const threshold = 0;
      const totalSpent = 0;
      const status = "Active";
    
      const data = {
        accountName,
        totalSpent,
        currentBallence,
        threshold,
        role: `${data1}AdsAccount`,
        paymentDate,
        status,
        employeeEmail,
        employeerName,
      };
    
      console.log(data);
    
      AxiosPublic.post("/adsAccount", data)
        .then((res) => {
          toast.success("Post created successfully!");
          console.log(res.data);
          refetch();
          document.getElementById("my_modal_3").close();
        })
        .catch((err) => {
          console.error("Error posting data:", err);
          toast.error("Failed to create post. Please try again.");
        });
    };
    

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; 

    return (
        <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className=" rounded-lg ">
 
           <Helmet>
            <title>
              {`${(data1 ? data1.charAt(0).toUpperCase() + data1.slice(1).toLowerCase() : 'Contributor')} Ads Account | Digital Network`}
            </title>
            <link rel="canonical" href="https://www.example.com/" />
          </Helmet>



          <div>

           <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)'}} className=" rounded-lg ">


            <div className="flex justify-between lg:justify-between  ml-5  my-5  mx-auto   items-center gap-3 ">
            <div>

              {
                userr?.role !== 'contributor' &&  <button 
                className="add f-center"
                 onClick={() => document.getElementById("my_modal_3").showModal()}
                   >
                <span className="font-bold text-lg"><IoIosAddCircleOutline /></span> <span className="inline">Add {data1} Account</span>
                 </button>
              }
                    
    
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

          {
            userr?.role === 'admin' && <div className="col-span-1 mt-4 w-full">
            <label className="block text-black">Select {(data1 !== 'contributor' ? 'employee' : data1)}</label>
           <select
            required
             className="select2 w-full"
             name="employeeEmail"
           >
             <option disabled selected value=''>
                Select {(data1 !== 'contributor' ? 'employee' : data1)}
               </option>
               {allEmployees
?.filter((f) => f.role === (data1 !== 'contributor' ? 'employee' : data1))
  .map((employee) => (
    <option key={employee._id} value={employee.email}>
      {employee.name}
    </option>
  ))}

           </select>
         </div>
          }

           
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
      <option value="all">
  {data1 === "contributor" ? "Select Contributor" : "Select Digital Marketer"}
</option>

        {users
         ?.filter((u) =>u.role === (data1 === "contributor" ? "contributor" : "employee"))
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
                  <option value="">Select Status</option>
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
         
            <div  className="table-div m-4" >
          <table className="min-w-full rounded-lg text-center ">
            <thead>
              <tr className="tr1">
              {
                  userr?.role !== 'contributor' ? 
                <th className="text-center" >
                 {myAdsAccount
          ?.filter(f => f.role === `${data1 || 'contributor'}AdsAccount`)
             ?.filter((account) =>
              (selectedStatus ? account.status === selectedStatus : true) &&
              (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            )
  ?.sort((a, b) =>
    a.accountName.localeCompare(b.accountName, undefined, { sensitivity: 'base' })
  )
  ?.length} Items 
                </th> : <th className="text-center">SL</th> }
                <th>Employeer Name</th>
                <th>{data1.charAt(0).toUpperCase() + data1.slice(1)} Account Name</th>
                <th>Threshold</th>
                <th>Current Balance</th>
                <th className="text-center">Spend</th>
                <th>Payment Date</th>
                {
                  userr?.role !== 'contributor' &&    <th className="text-center">Status</th>
                }
              
              </tr>
            </thead>
            <tbody>
            {myAdsAccount
          ?.filter(f => f.role === `${data1 || 'contributor'}AdsAccount`)
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
                     {
                  userr?.role !== 'contributor' ?
                  <td
                    className={`text-center  `}>
                        <div className="f-center ">
                        <button
                          className="delete"
                          onClick={() => handleDelete(account._id)}
                        >
                          <FaMinusSquare  />
                        </button>

                        <button
                         className="f-start edit"
                          onClick={() => setModalData(account)}
                        >
                          <FaEdit />
                          
                        </button>
                        </div>
                   </td> : <td className="text-center">{index + 1}</td> }
                   <td>
                  
                  {account.employeerName}
                
              
                </td>
                  <td>
                  <h1> {account.accountName}</h1>
                  
                  </td>
                 
                  <td>$ {account.threshold}</td>
                  <td>$ {account.currentBallence} </td>
                  <td className="text-center">
  <div className="relative group flex items-center justify-center">
    <h1>
      <span className="text-xm font-extrabold">$</span> {account.totalSpent}
    </h1>
    {userr?.role === 'admin' &&  <button
      className="edit opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2"
      onClick={() => setModalData2(account)}
    >
      <FaEdit />
    </button>}
   
  </div>
</td>

                  <td>
                    {new Date(account.paymentDate).toLocaleDateString("en-GB")}
                  </td>
                  {
                  userr?.role !== 'contributor' && 
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

                 </td>}
                </tr>
              ))}

                <tr  className="font-bold tr1">
                <td className="  text-right" colSpan="3">
                  Total :
                </td>
                <td >
                $ {myAdsAccount
            ?.filter(f=>f.role === `${data1}AdsAccount`).reduce(
        (acc, account) => acc + parseFloat(account.currentBallence || 0),
        0
      ).toFixed(2)}
                </td>

                <td>
               $ {myAdsAccount
            ?.filter(f=>f.role === `${data1}AdsAccount`).reduce(
        (acc, account) => acc + parseFloat(account.threshold || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="text-center">
               $ {myAdsAccount
            ?.filter(f=>f.role === `${data1}AdsAccount`).reduce(
        (acc, account) => acc + parseFloat(account.totalSpent || 0),
        0
      ).toFixed(2)}
                </td>
                <td></td>
                {
                  userr?.role !== 'contributor' && 
                <td></td> }
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
    handleUpdateTotalSpent(
      e,
      modalData2._id,
      modalData2.accountName,
      modalData2.employeeEmail,
      modalData2.employeerName
    )
  }
  className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto border border-gray-300"
>
  {/* Form Header */}
  <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
    {modalData2.accountName}
  </h1>

  {/* Form Grid */}
  <div className="grid lg:grid-cols-2 gap-3 mb-6">
    {/* Date Input */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Date
      </label>
      <input
        type="date"
        name="date"
        required
        defaultValue={formattedDate}
        className="input2"
      />
    </div>

    {/* Total Spent Input */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Total Spent
      </label>
      <input
        type="number"
        name="totalSpent"
        step="0.01"
        placeholder="0"
        className="input2"
      />
    </div>
  </div>

  {/* Role Select Option */}
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Role
    </label>

    <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="Mobile Banking"
                      {...register("bankingType", { required: true })}
                      className="radio radio-primary"
                    />
                    <span className="ml-2">Mobile Banking</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                       name="role"
                      className="radio radio-primary"
                    />
                    <span className="ml-2">Bank</span>
                  </label>
                </div>

    <select
      name="role"
      required
      className="select2 w-full"
    >
      <option value="" disabled>
        Select Role
      </option>
      <option value="meta">Meta</option>
      <option value="page">Page</option>
    </select>
  </div>

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="w-full lg:w-auto px-6 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

export default MetaAdsAccount;