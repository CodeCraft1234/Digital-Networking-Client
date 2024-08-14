import { useContext, useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
// import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { ImCross } from "react-icons/im";

const UserAdAccount = ({email}) => {


  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);
  console.log(ddd);

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === email);
          console.log(fff);
          setDdd(fff || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  

  const [adsAccount, refetch] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);

  useEffect(() => {
    const filterdata = adsAccount.filter((m) => m.employeeEmail === email);
    console.log(filterdata);
    setAdsAccounts(filterdata);

  }, [adsAccount, email]);

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

const AxiosPublic=UseAxiosPublic()

const [currentTotal,setCurrentTotal]=useState(0)
const [tSpent,setthreshold]=useState(0)
 const [TSpent,setTSpent]=useState(0)

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

const [modalData, setModalData] = useState(null);
const handleUpdate = (e, id) => {
  e.preventDefault();
  const accountName = e.target.accountName.value;
  const currentBallence = e.target.currentBallence.value;
  const threshold = e.target.threshold.value;
  const totalSpent = e.target.totalSpent.value;
  const status = e.target.status.value;
  const paymentDate=new Date()
  const body = { accountName,currentBallence,paymentDate, threshold, totalSpent, status };
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
const [searchQuery, setSearchQuery] = useState("");
// Filter ads accounts based on the search query
const filteredAdsAccounts = adsAccounts.filter(account =>
  account.accountName.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
    <div className=" p-5 dark:text-green-800">
       <ToastContainer />
       <Helmet>
        <title>Ads Account | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
     


      <div className="flex justify-between mb-5 text-gray-500 pb-1 items-center gap-3">
       <div>
         <button
          className="font-avenir px-3 py-1 rounded-lg text-white bg-[#05a0db]"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Add an Ads Account
        </button>
        
        <dialog id="my_modal_3" className="modal">
  <div className="modal-box bg-white">
    <form onSubmit={(e) => handleAddAdsAcount(e)}>
      <div className="mb-4">
      <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => document.getElementById(`my_modal_3`).close()}
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
      <form method="dialog" className="w-full">
          <button className="p-2 rounded-lg bg-red-600 text-white text-center w-full">
            Close
          </button>
        </form>
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
     <div className="flex  justify-end">
          <input
           type="text"
           placeholder="Search by account name..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)} 
            className="rounded-lg placeholder-black border-2 border-black p-2 font-bold text-black  bg-white"
          
          />
        
        </div>

      </div>    
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white">
        <thead className="bg-[#05a0db] text-white">
          <tr>
            <th className="p-3">SL</th>
            <th className="p-3">Payment Date</th>
            <th className="p-3">Ad Account Name</th>
            <th className="p-3">Current Balance</th>
            <th className="p-3">Threshold</th>
            <th className="p-3">Spent</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
        
          </tr>
        </thead>
        <tbody>
          {filteredAdsAccounts.map((account, index) => (
            <tr
            key={account._id}
            className={`${
              index % 2 === 0
                ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                : "bg-gray-200  text-left text-gray-500 border-b border-opacity-20"
            }`}
            >
              <td className="p-3 border-r-2 border-l-2 border-gray-300 text-center">{index + 1}</td>
              <td className="p-3 border border-gray-300 text-center"> {new Date(account?.paymentDate).toLocaleDateString("en-GB")}</td>
              <td className="p-3 border-r-2  border-gray-300 text-center px-5 ">
                    <div className="">
                      <h1> {account.accountName}</h1>
                  
                    </div>
                  </td>
              <td className="p-3 border border-gray-300  text-center">$ {account.currentBallence}</td>
              <td className="p-3 border border-gray-300 text-center">$ {account.threshold}</td>
              <td className="p-3 border border-gray-300 text-center">$ {account.totalSpent}</td>
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
                          className="text-blue-600 text-3xl"
                          onClick={() => setModalData(account)}
                        >
                         <MdEditSquare />
                        </button>
                        <button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handleDelete(account._id)}
                        >
                          <MdDelete />
                        </button>
                        
                      </div>
              </td>

            </tr>
          ))}
          <tr className="bg-[#05a0db] text-sm text-white font-bold">
    
    <td className="p-3  text-right" colSpan="3">
      Total :
    </td>
    <td className="p-3  border-gray-300 text-center">$ {currentTotal}</td>
    <td className="p-3  text-center">$ {tSpent}</td> 
    <td className="p-3  text-center">$ {TSpent}</td> 
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
             <label className="block text-gray-500">Account Name</label>
             <input
               type="text"
               required
               name="accountName"
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
             <label className="block text-gray-500">Total Spent</label>
             <input
               type="number"
               name="totalSpent"
               step="0.01"
               defaultValue={modalData.totalSpent}
               className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
             />
           </div>
           <div className="mb-4">
             <label className="block text-gray-500">Status</label>
             <select
               name="status"
               defaultValue={modalData.status}
               className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
             >
               <option value="Active">Active</option>
               <option value="Disable">Disable</option>
             </select>
           </div>
     
           <div className="modal-action grid grid-cols-2 gap-4">
           <button
               className="p-2 rounded-lg bg-red-600 text-white text-center w-full"
               onClick={() => setModalData(null)}
             >
               Close
             </button>
             <button
               type="submit"
               className="font-avenir px-3 py-2 text-center rounded-lg text-white bg-[#05a0db] w-full"
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

export default UserAdAccount;
