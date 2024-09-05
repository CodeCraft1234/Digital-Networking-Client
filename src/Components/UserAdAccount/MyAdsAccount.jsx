import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";

const MyAdsAccount = ({email}) => {
  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);
  const [currentTotal,setCurrentTotal]=useState(0)
  const [tSpent,setthreshold]=useState(0)
  const [TSpent,setTSpent]=useState(0)
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

  useEffect(() => {
          const fff = users.find(u => u.email === email);
          setDdd(fff || {}); 
          const filterdata = adsAccount.filter((m) => m.employeeEmail === email);
          setAdsAccounts(filterdata);
  }, [users, email,adsAccount]);



  useEffect(() => {
 
    const total = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.currentBallence),
      0
    );
    setCurrentTotal(total);
  
    const totalBill = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.threshold),
      0
    );
    setthreshold(totalBill);
  
    const totalBilll = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.totalSpent),
      0
    );
    setTSpent(totalBilll);
  
  }, [adsAccounts]);


  const sortedAdsAccounts = adsAccount.filter((account) =>
    (selectedStatus ? account.status === selectedStatus : true) &&
    (searchQuery ? account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  ).sort((a, b) => a.accountName.localeCompare(b.accountName));




  const handleAddAdsAcount = (e) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const paymentDate = e.target.paymentDate.value;
    const employeeEmail = email;
    const employeerName = ddd?.name;
    const currentBallence=0
    const threshold=0
    const totalSpent=0
    const status='Active'

    const data = { accountName,totalSpent,currentBallence,threshold, paymentDate,status, employeeEmail,employeerName };

    AxiosPublic.post("/adsAccount", data).then((res) => {
      console.log(res.data);
      // toast.success("add successful");
      toast.success("Post created successfully!");
      refetch()
      
    });
  };






const handleUpdate = (e, id) => {
  e.preventDefault();
  const accountName = e.target.accountName.value;
  const paymentDate = e.target.paymentDate.value;
  const currentBallence = e.target.currentBallence.value;
  const threshold = e.target.threshold.value;
  const status = e.target.status.value;
  const body = { accountName,currentBallence,paymentDate, threshold, status };
  AxiosPublic.patch(`/adsAccount/${id}`,body
  )
    .then((res) => {
      toast.success("Ads Account Update successful!");
      refetch()
    });
};

const handleDelete=(id)=>[
  AxiosPublic.delete(`/adsAccount/${id}`)
    .then(res=>{
      console.log(res.data);
      toast.success("Ads Account Delete successful!");
      refetch()
      })
]



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
    <div className=" px-5 dark:text-green-800">
       <ToastContainer />
       <Helmet>
        <title>My Ads Account | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     


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
 
    <div className="flex w-full sm:w-auto justify-end">
    <input
      type="text"
      placeholder="Search by account name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="rounded-lg placeholder-black border border-black p-2 text-black bg-white w-full sm:w-auto"
    />
  </div>
  </div>
  

</div>

    

    <div className="overflow-x-auto mt-5 rounded-xl ">
      <table className="min-w-full bg-white">
        <thead className="bg-[#05a0db] text-white">
          <tr>
            <th className="p-3">OFF/ON</th>
            <th className="p-3">Payment Date</th>
            <th className="p-3">Ad Account Name</th>
            <th className="p-3">Current Balance</th>
            <th className="p-3">Threshold</th>
            {/* <th className="p-3">Spent</th> */}
            <th className="p-3">Status</th>
       
   
      <th className="p-3">Action</th>
     
        
          </tr>
        </thead>
        <tbody>
          {sortedAdsAccounts.map((account, index) => (
            <tr
            key={account._id}
            className={`${
              index % 2 === 0
                ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                : "bg-gray-200  text-left text-gray-500 border-b border-opacity-20"
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
              <td className="p-3 border border-gray-300 text-center"> {new Date(account?.paymentDate).toLocaleDateString("en-GB")}</td>
              <td className="p-3 border-r-2  border-gray-300 text-center px-5 ">
                    <div className="">
                      <h1> {account.accountName}</h1>
                  
                    </div>
                  </td>
              <td className="p-3 border border-gray-300  text-center">$ {account.currentBallence}</td>
              <td className="p-3 border border-gray-300 text-center">$ {account.threshold}</td>
              {/* <td className="p-3 border border-gray-300 text-center">$ {account.totalSpent}</td> */}
              <td className={`p-3 border  text-center border-gray-300  ${
                      account.status === "Active"
                        ? "text-green-700 font-bold"
                        : "text-red-600 font-bold"
                    }`}
                  >
                    {account.status} 
                    </td>
                 
      <td className="p-3 border border-gray-300 text-center"> 
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
          <tr className="bg-[#05a0db] text-sm text-white font-bold">
    
    <td className="p-3  text-right" colSpan="3">
      Total :
    </td>
    <td className="p-3  border-gray-300 text-center">$ {currentTotal.toFixed(2)}</td>
    <td className="p-3  text-center">$ {tSpent.toFixed(2)}</td> 
    {/* <td className="p-3  text-center">$ {TSpent.toFixed(2)}</td>  */}
    <td className="p-3  text-center"></td> 
  

      <td className="p-3  text-center"></td> 
      
   

   
    

  </tr>
        </tbody>
      </table>
    </div>
    {modalData && (
       <dialog className="modal" open>
       <div className="modal-box bg-white text-black">
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

export default MyAdsAccount;
