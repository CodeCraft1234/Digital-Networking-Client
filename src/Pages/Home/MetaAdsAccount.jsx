import { FaEdit, FaMinusSquare, FaMoneyBillWave, FaPlusCircle } from "react-icons/fa";
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
import { Link } from "react-router-dom";
import useRates from "../../Hook/useRates";

const MetaAdsAccount = ({data1}) => {
  const { user } = useContext(AuthContext);
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
    const [allEmployees] = useAllEmployee();

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
      const ids=generateRandomId()
   
      const totalSpentt = parseFloat(totalSpent);
      const data5 = { totalSpent:totalSpentt,date }

      const monthlySpent = {
        ids,
        totalSpentt,
        accountName,
        date,
        role: data1 === 'meta' ? `${e.target.role.value}Spend` : `${data1}Spend`,
        employeeName
      };

 

      const monthlySpent2 = {
        ids,
        totalSpentt,
        accountName,
        date,
        role:data1 === 'meta' ? `${e.target.role.value}Spend` : `${data1}Spend`,
        employeeName
      };

     
      if(data1 === 'contributor'){
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
      const employeerName = allEmployees.find((e) => e.email === employeeEmail)?.name || userr?.name;
    
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
    
      AxiosPublic.post("/adsAccount", data)
        .then((res) => {
          toast.success("Post created successfully!");
          console.log(res.data);
          refetch();
          document.getElementById("my_modal_3").close();
        })
        .catch((err) => {
          // Check for duplicate accountName error
          if (err.response?.status === 400 && err.response?.data?.message) {
            alert(err.response.data.message); // Display the alert message
          } else {
            console.error("Error posting data:", err);
            toast.error("Failed to create post. Please try again.");
          }
        });
    };
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; 


    const data=myAdsAccount
    ?.filter(f => f.role === `${data1 || 'contributor'}AdsAccount`)
       ?.filter((account) =>
        (selectedStatus ? account.status === selectedStatus : true) &&
        (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
      )
?.sort((a, b) =>
a.accountName.localeCompare(b.accountName, undefined, { sensitivity: 'base' })
)
const { rates } = useRates();
    return (
        <div  className=" ">
 
           <Helmet>
            <title>
              {`${(data1 ? data1.charAt(0).toUpperCase() + data1.slice(1).toLowerCase() : 'Contributor')} Ads Account | Digital Network`}
            </title>
            <link rel="canonical" href="https://www.example.com/" />
          </Helmet>



          <div className="hidden lg:block">

           <div  className=" rounded-lg ">


            <div className="flex justify-between lg:justify-between    my-5  mx-auto   items-center gap-3 ">
            <div>
  {userr?.role !== "contributor" && (
    <button
      className="add f-center"
      onClick={() => document.getElementById("my_modal_3").showModal()}
    >
      <span className="font-bold text-lg">
        <IoIosAddCircleOutline />
      </span>
      <span className="inline">
  Add {data1.charAt(0).toUpperCase() + data1.slice(1)} Ads Account
</span>

    </button>
  )}


</div>


<div className="f-center flex flex-col lg:flex-row flex-wrap gap-3 mr-5  items-center justify-center">
  {/* Employee Selector for Admin */}
  {userr?.role === "admin" && (
    <div className="w-full lg:w-auto flex justify-center">
      <select
        className="select2 "
        value={selectedEmployee3}
        onChange={(e) => changeTab3(e.target.value)}
      >
        <option value="all">
          {data1 === "contributor" ? "Select Contributor" : "Select Digital Marketer"}
        </option>
        {allEmployees
          ?.filter((u) =>
            u.role === (data1 === "contributor" ? "contributor" : "employee")
          )
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  )}

  {/* Status Selector */}
  <div className="w-full lg:w-auto flex justify-center">
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

  {/* Search Input */}
  <div className="w-full lg:w-auto flex justify-center">
    <input
      type="text"
      placeholder="Search by campaign name"
      className="input2 "
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>


            </div>
          
            </div>
         
            <div  className="table-div " >
          <table className="min-w-full rounded-lg text-center ">
            <thead>
              <tr className="tr1">
              {
                  userr?.role !== 'contributor' ? 
                <th className="text-center" >
                 {data?.length}  
                </th> : <th className="text-center">SL</th> }

                {
            userr?.role === 'admin' && 
                <th className="flex justify-start items-center">Employee</th>
}
                <th>Ads Account</th>
                <th>Threshold</th>
                <th>Current Balance</th>
                <th className="text-center">Spend</th>
                <th>Payment Date</th>
                <th>Status</th>
                
              
              </tr>
            </thead>
            <tbody>
            {data?.map((account, index) => (
                    <tr 
                    key={account.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white text-left text-black border-b border-opacity-20"
                        : "bg-gray-100  text-left text-black border-b border-opacity-20"
                    }`}
                  >
                      
                  <td>{index + 1}</td>
                   {
            userr?.role === 'admin' &&   <td>
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={allEmployees?.find(f => f.email === account.employeeEmail)?.photo || 'https://via.placeholder.com/40'}
                alt={account.employeerName}
              />
              <div>
                <h4 className="font-semibold text-gray-800">{account.employeerName}</h4>
                <div className="flex items-center gap-2 mt-1">
                
                  {/* <button
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => handleDelete(account._id)}
                  >
                    <FaMinusSquare />
                  </button> */}
                 
                </div>
              </div>
            </div>
          </td>
          
          }
                 
                 <td>
                 <button   onClick={() => setModalData(account)} className="flex justify-start items-center gap-2">
                 <button
                    className="text-blue-500 hover:text-blue-700 text-lg"
                  
                  >
                    <FaEdit />
                  </button>
  <h1>{account.accountName}</h1>
                 </button>
  
</td>


                 
                  <td>  <h1 className=""><span className="amount-doller">$</span> {account.threshold} </h1></td>
                  <td > <h1 className=""><span className="amount-doller">$</span> {account.currentBallence} </h1> </td>
                  <td className="">
                  <div className="relative group flex items-center justify-between">
  <h1 className="flex items-center gap-2">
   
    <span className="amount-doller">$</span> {account.totalSpent}
  </h1>

  {userr?.role === 'admin' && (
    <button
      className="text-black opacity-0 group-hover:opacity-100 transition duration-300 ml-2 text-lg"
      onClick={() => setModalData2(account)}
    >
      <FaPlusCircle />
    </button>
  )}
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
               
                {
            userr?.role === 'admin' ?  <td className="  text-right" colSpan="3">
            Total  </td> :  <td className="  text-right" colSpan="2">
                  Total :
                </td>
           }

                <td >
                <span className="amount-doller">$</span> {data?.reduce(
        (acc, account) => acc + parseFloat(account.currentBallence || 0),
        0
      ).toFixed(2)}
                </td>

                <td>
                <span className="amount-doller">$</span> {data?.reduce(
        (acc, account) => acc + parseFloat(account.threshold || 0),
        0
      ).toFixed(2)}
                </td>
                <td className="text-center">
                <span className="amount-doller">$</span> {data?.reduce(
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

            <div className="bg-white font-sans py-20   lg:hidden mx-auto text-sm">
          
                {data?.map((payment) => (
                  <div key={payment._id} className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-start text-start gap-2 sm:gap-3">
                          {/* Image */}
                          <div className="flex-shrink-0 mt-1.5">
                            <img
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                              src={allEmployees?.find(u => u.email === payment?.employeeEmail)?.photo}
                              alt=""
                            />
                          </div>
          
                          {/* Names */}
                          <div className="flex flex-col text-start justify-start items-start">
                            <div className="flex justify-start text-start items-center gap-1">
                              <Link
                                to={`/client/${payment?.clientEmail}`}
                                className="text-black  text-sm sm:text-base hover:text-blue-800 transition-colors"
                              >
                                {allEmployees.find(f => f.email === payment.employeeEmail)?.name}
                              </Link>
                             
                            </div>
                            <p
                             
                                className="text-black text-xs sm:text-base hover:text-blue-800 transition-colors"
                              >
                                {payment.accountName}
                              </p>
                            <div className="flex justify-start text-start items-center gap-1">
                              <p className="text-[10px] sm:text-xs text-gray-500">
                              {new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            
                          </div>
                        </div>
          
                     
                      </div>
          
                      {/* Right Content */}
                      <div className="text-right">
                        {/* Amount and Date */}
                        <div>
                          <h3 className="font-semibold text-red-800 text-sm sm:text-base">
                            Spend : <span className="amount-doller">$ </span>
            {payment.totalSpent}
                          </h3>
          
                          <h3 className="font-medium text-emerald-600 text-sm sm:text-base">
                            Balance : <span className="amount-taka">৳ </span>
            {payment.currentBallence}
                          </h3>
                          
                        </div>
          
                       
          
                      </div>
                    </div>
                  </div>
                ))}
          
          
          
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
               className="input2"
             />
           </div>
         <div className="mb-4">
           <label className="block text-gray-500">Account Name</label>
           <input
             type="text"
             name="accountName"
             required
             defaultValue={modalData.accountName}
             className="input2"
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
             className="input2"
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-500">Threshold</label>
           <input
             type="number"
             name="threshold"
             step="0.01"
             defaultValue={modalData.threshold}
             className="input2"
           />
         </div>
            </div>

         <div className="grid grid-cols-2 gap-3">
         <button
             className="close"
             onClick={() => setModalData(null)}
           >
             Close
           </button>
           <button
             type="submit"
             className="add"
           >
             Update
           </button>
          
         </div>
       </form>
     </div>
   </dialog>
      )}

<dialog id="my_modal_3" className="modal">
    <div className="modal-box bg-white">
      <form onSubmit={handleAddAdsAcount}>
        <div className="mb-4">
          <h1
            className="text-black hover:text-red-500 f-end"
            onClick={() => document.getElementById("my_modal_3").close()}
          >
            <ImCross />
          </h1>

          {/* Date Input */}
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

          {/* Employee Selector */}
          {userr?.role === "admin" && (
            <div className="col-span-1 mt-4 w-full">
              <label className="block text-black">
                Select {data1 !== "contributor" ? "employee" : data1}
              </label>
              <select required className="select2 w-full" name="employeeEmail">
                <option disabled selected value="">
                  Select {data1 !== "contributor" ? "employee" : data1}
                </option>
                {allEmployees
                  ?.filter(
                    (f) => f.role === (data1 !== "contributor" ? "employee" : data1)
                  )
                  .map((employee) => (
                    <option key={employee._id} value={employee.email}>
                      {employee.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Account Name Input */}
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

        {/* Modal Actions */}
        <div className="modal-action grid grid-cols-2 gap-2">
          <button
            type="button"
            className="close"
            onClick={() => document.getElementById("my_modal_3").close()}
          >
            Close
          </button>
          <button type="submit" className="add">
            Submit
          </button>
        </div>
      </form>
    </div>
  </dialog>

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
  className=" bg-white  rounded-lg max-w-xl mx-auto "
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

    {
      data1 === 'meta' ? 

  <div className="mb-6">

    <div className="mb-6 text-black">

    <div className="flex space-x-4">
  <label className="inline-flex items-center">
    <input
      type="radio"
      name="role"
      value="meta" // Value for "Meta" role
      required
      defaultChecked // Ensures "Meta" is selected by default
      className="radio radio-primary"
    />
    <span className="ml-2">Meta</span>
  </label>

  {/* Page Radio Button */}
  <label className="inline-flex items-center">
    <input
      type="radio"
      name="role"
      value="page" // Value for "Page" role
      className="radio radio-primary"
    />
    <span className="ml-2">Page</span>
  </label>
</div>

</div>

  </div> : <></> }


  <div className="grid lg:grid-cols-2 gap-3 items-center">
    <button
     
      className="close"
      onClick={() => setModalData2(null)}
     >

      Close
    </button>

    <button
      type="submit"
      className="add"
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