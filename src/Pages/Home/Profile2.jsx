import { useContext, useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { AuthContext } from "../../Security/AuthProvider";
import { FaEdit, FaMinusSquare } from "react-icons/fa";

const Profile2 = () => {
  const [users] = useUsers();
  const {user}=useContext(AuthContext)
  const [ddd, setDdd] = useState(null);
  const [currentTotal,setCurrentTotal]=useState(0)
  const [tSpent,setthreshold]=useState(0)
  const [adsAccount, refetch] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [modalData, setModalData] = useState(null);
  const AxiosPublic=UseAxiosPublic()
  const [searchQuery, setSearchQuery] = useState("");

  const initialTab = localStorage.getItem("activeTabMyadsAccountStatuss") || "Active";
  const [selectedStatus, setSelectedStatus] = useState(initialTab);
    
  const changeTab = (tab) => {
    setSelectedStatus(tab);
    localStorage.setItem("activeTabMyadsAccountStatuss", tab); 
  };

  const sortedAdsAccounts = adsAccounts.filter((account) =>
    (selectedStatus ? account.status === selectedStatus : true) &&
    (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  ).sort((a, b) => a.accountName.localeCompare(b.accountName));

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  // "YYYY-MM-DD" format


  useEffect(() => {
    const fff = users.find((u) => u.email === user?.email);
    setDdd(fff || {});
  
    const filterdata = adsAccount.filter((m) => m.employeeEmail === user?.email);
    setAdsAccounts(filterdata);
  
    const total = sortedAdsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.currentBallence),
      0
    );
    setCurrentTotal(total);
  
    const totalBill = sortedAdsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.threshold),
      0
    );
    setthreshold(totalBill);
  }, [users, user?.email,sortedAdsAccounts, adsAccount]); 

  const handleAddAdsAcount = (e) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const paymentDate = e.target.paymentDate.value;
    const employeeEmail = user?.email;
    const employeerName = ddd?.name;
    const currentBallence=0
    const threshold=0
    const totalSpent=0
    const status='Active'
    const data = { accountName,totalSpent,currentBallence,threshold, paymentDate,status, employeeEmail,employeerName };

    const datas = {
      title: `added ${accountName} in My AdsAccount`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.post("/adsAccount", data).then((res) => {
      toast.success("Post created successfully!");
      refetch()
      AxiosPublic.post("/activity", datas).then(() => {
        toast.success(`${accountName} has been successfully added`);
      });
      document.getElementById("my_modal_3").close()
    });
  };

const handleUpdate = (e, id) => {
  e.preventDefault();
  const accountName = e.target.accountName.value;
  const paymentDate = e.target.paymentDate.value;
  const currentBallence = e.target.currentBallence.value;
  const threshold = e.target.threshold.value;
  const body = { accountName,currentBallence,paymentDate, threshold };

  const datas = {
    title: `Updated ${accountName} in My AdsAccount`,
    date: new Date(),
    user: user?.displayName,
    email:user?.email
  };
  AxiosPublic.patch(`/adsAccount/${id}`,body
  )
    .then((res) => {
      console.log(res.data);
      AxiosPublic.post("/activity", datas).then(() => {
        toast.success(`${accountName} has been successfully updated`);
      });
      refetch()
      setModalData(null)
    });
};

const handleDelete = (id,accountName) => {

  const datas = {
    title: `Deleted ${accountName} from My AdsAccount`,
    date: new Date(),
    user: user?.displayName,
    email:user?.email
  };

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {

      AxiosPublic.delete(`/adsAccount/${id}`)
        .then((res) => {
          toast.success("Ads Account deleted successfully!");
          refetch();
          console.log(res.data);
          AxiosPublic.post("/activity", datas).then(() => {
            document.getElementById("my_modal_2").close();
            toast.success(`Successfully added ${accountName}`);
          });
        })
    }
  });
};

const handleUpdate2 = (id, newStatus) => {
  const body = { status: newStatus };
  const datas = {
    title: `Updated ${newStatus} in My AdsAccount`,
    date: new Date(),
    user: user?.displayName,
    email:user?.email
  };
  AxiosPublic.patch(`/adsAccount/status/${id}`, body)
    .then((res) => {
      refetch();
      console.log(res.data);
      AxiosPublic.post("/activity", datas).then(() => {
        toast.success(`${newStatus} has been successfully updated`);
      });
     
    })
};

  return (
    <div className=" px-5 mt-5 dark:text-green-800">
       <ToastContainer />
       <Helmet>
        <title>My Ads Account | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className='px-4 py-4  rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-5 text-gray-500">
  <div className="w-full sm:w-auto">
    <button
      className="font-avenir hover:bg-red-700 px-6 p-2 rounded-lg text-white bg-[#05a0db] w-full sm:w-auto"
      onClick={() => document.getElementById("my_modal_3").showModal()}
    >
      Add an Ads Account
    </button>
    
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box bg-white">
        <form onSubmit={(e) => handleAddAdsAcount(e)}>
          <div className="mb-4">
            <h1
              className="text-black flex hover:text-red-500 justify-end"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              <ImCross />
            </h1>
            <label className="block text-black">Date</label>
            <input
              required
              type="date"
              name="paymentDate"
              defaultValue={formattedDate}
              className="w-full border bg-green-300 border-gray-600 text-black rounded p-2 mt-1"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-black">Account Name</label>
            <input
              type="text"
              required
              name="accountName"
              placeholder="type here..."
              className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
            />
          </div>
          
          <div className="modal-action grid grid-cols-2 gap-4">
            <button
              type="button"
              className="p-2 rounded-lg bg-red-600 text-white text-center w-full"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="font-avenir px-3 py-2 rounded-lg text-white bg-[#05a0db] w-full"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>

  <div className="flex justify-end items-center gap-3">
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
 
              <div className="ml-5 flex mb-5 lg:mb-0 justify-center">
   <input
    style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
     type="text"
     placeholder="Search by campaign name"
     className="border bg-white    rounded-l-lg p-1 flex-1"
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button
     className="bg-black  text-white border border-black shadow-2xl rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
     onClick={() => {/* Add search functionality here */}}
    >
     Search
    </button>
  </div>
  </div>
  

</div>

    

<div  className="overflow-x-auto rounded-xl mt-5 text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th className="p-3">Action</th>
            <th style={{  border: 'var(--border)'}} className="p-3">Ad Account Name</th>
            <th style={{  border: 'var(--border)'}} className="p-3">Threshold</th>
            <th style={{  border: 'var(--border)'}} className="p-3">Current Balance</th>
            <th style={{  border: 'var(--border)'}} className="p-3">Payment Date</th>
            <th style={{  border: 'var(--border)'}} className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedAdsAccounts.map((account, index) => (
           <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
           key={account._id}
           className={`${
             index % 2 === 0
               ? "bg-white text-left text-black border-b border-opacity-20"
               : "bg-gray-200  text-left text-black border-b border-opacity-20"
           }`}
         >

          <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300 text-center"> 
               <div className="flex justify-center gap-3">
                 <button
                   className=" flex text-red-600 text-xl justify-center items-center gap-1   px-2 py-1 rounded"
                  onClick={() => handleDelete(account._id,account.accountName)}
                >
                   <FaMinusSquare  />
                </button>
              </div>
            </td>
         
             
              <td style={{  border: 'var(--border)'}} className="p-3 border-r-2  border-gray-300 text-center px-5 ">
                    <div className="flex justify-start items-center gap-2">
                    <button
                   className=" flex  justify-center items-center gap-1   px-2 py-1 rounded"
                  onClick={() => setModalData(account)}
                >
                   <FaEdit />
                   <h1> {account.accountName}</h1>
                </button>
                     
                  
                    </div>
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300 text-center">$ {account.threshold}</td>
              <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300  text-center">$ {account.currentBallence}</td>
              
              {/* <td className="p-3 border border-gray-300 text-center">$ {account.totalSpent}</td> */}
            
              <td style={{  border: 'var(--border)'}} className="p-3 border border-gray-300 text-center"> {new Date(account?.paymentDate).toLocaleDateString("en-GB")}</td>
                 
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
          <tr style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className="font-bold">
    <td></td>
 
    <td></td>
    <td style={{  border: 'var(--border)'}} className="p-3  text-center" >
      Total :
    </td>
    <td style={{  border: 'var(--border)'}} className="p-3  text-center">$ {tSpent.toFixed(2)}</td> 
    <td style={{  border: 'var(--border)'}} className="p-3  border-gray-300 text-center">$ {currentTotal.toFixed(2)}</td>
    <td style={{  border: 'var(--border)'}} className="p-3  text-center"></td> 
  

     
      
   

   
    

  </tr>
        </tbody>
      </table>
    </div>
    </div>
    {modalData && (
       <dialog className="modal" open>
       <div className="modal-box bg-white text-black">
        <h1 className="text-center font-bold text-xl">{modalData.accountName}</h1>
         <form onSubmit={(e) => handleUpdate(e, modalData._id)}>
         <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => setModalData(null)}
           >
            <ImCross />
           </h1>
           <div className="mb-4">
             <label className="block text-gray-500">Date</label>
             <input
               type="date"
               name="paymentDate"
               defaultValue={modalData.paymentDate}
               className="w-full border-2 border-gray-400 rounded p-2 mt-1 bg-green-300 text-black"
             />
           </div>
           <div className="mb-4">
             <label className="block text-gray-500">Account Name</label>
             <input
               type="text"
               required
               name="accountName"
               disabled
               defaultValue={modalData.accountName}
               className="w-full border-2 border-gray-400 rounded p-2 mt-1 bg-white text-black"
             />
           </div>
          <div className="grid lg:grid-cols-2 gap-3">
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
             <label className="block text-gray-500">Current Balance</label>
             <input
               type="number"
               name="currentBallence"
               step="0.01"
               defaultValue={modalData.currentBallence}
               className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
             />
           </div>
          </div>
         

         
     
           <div className="modal-action grid grid-cols-2 gap-4">
           <button
               className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center w-full"
               onClick={() => setModalData(null)}
             >
               Close
             </button>
             <button
               type="submit"
               className="font-avenir hover:bg-indigo-700 px-3 py-2 text-center rounded-lg text-white bg-[#05a0db] w-full"
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

export default Profile2;
