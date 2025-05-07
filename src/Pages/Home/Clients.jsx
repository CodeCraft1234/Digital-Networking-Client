import { useContext, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import { FaEdit, FaMinusSquare, FaPhone, FaShare } from "react-icons/fa";
import useUserr from '../../Hook/useUser';
import SummaryCard from './SummeryCard';
import useClientsPage from '../../Hook/useClientsPage';
import useMyClientsTotal from '../../Hook/useMyClientsTotal';
import useAllEmployee from '../../Hook/useAllEmployee';
import useClientsDueAvance from '../../Hook/useClientDueAvance';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Dialog } from '@headlessui/react';
import { MdSearch, MdTune } from 'react-icons/md';
import { format } from 'date-fns';

const InfoRow = ({ label, value, color = "text-gray-700" }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium flex items-center gap-1">{label}</span>
    <span className={`text-right break-words font-semibold ${color}`}>{value}</span>
  </div>
);


const Clients = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email); 

  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`activeTabag${user?.email}`) || "all" 
  : localStorage.getItem(`activeTabag${user?.email}`) || user?.email; 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [client, totalItems, totalPages, , refetch] = useClientsPage(
    selectedEmployee3,
    currentPage,
    searchQuery
  );
  


  const [myClientsTotal] = useMyClientsTotal(selectedEmployee3);
  const { clientsDueAdvance } = useClientsDueAvance(selectedEmployee3);
  const AxiosPublic = UseAxiosPublic();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [allEmployees] = useAllEmployee();

  const formatValue = (value, decimals = 2) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };
  
  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab);
    localStorage.setItem(`activeTabag${user?.email}`, tab);
    refetch(); 
  };
  
    const generateRandomId = () => {
      let randomId = '';
      for (let i = 0; i < 20; i++) {
        randomId += Math.floor(Math.random() * 10); // Append a random digit (0-9)
      }
      return randomId;
    };
    
    const handleAddClient = (e) => {
      e.preventDefault();
      
      const clientName = e.target.clientName.value;
      const clientPhone = e.target.clientPhone.value;
    
      let employeeEmail = user?.email; // Default to the user's email
    
      // Only get employeeEmail if the role is admin
      if (userr?.role === 'admin') {
        employeeEmail = e.target.employeeEmail.value;
      }
    
      const date = new Date();
    
      const data = {
        clientName,
        clientPhone,
        id: generateRandomId(),
        employeeEmail,
        date,
      };
    
      const datas = {
        title: `Added ${clientName} as a client`,
        date: new Date(),
        user: user?.displayName,
        photo: user?.photoURL,
        email: user?.email,
      };
    
      AxiosPublic.post("/clients", data)
        .then((res) => {
          refetch();
          console.log(res.data);
          AxiosPublic.post("/activity", datas)
            .then(() => {
              document.getElementById("my_modal_2").close();
              toast.success(`Successfully added ${clientName}`);
            })
            .catch((error) => {
              toast.error("Failed to add activity");
              console.error(error);
            });
        })
        .catch((error) => {
          toast.error("Failed to add client");
          console.error(error);
        });
    };
    
    
    const handledelete = (id, clientName) => {
    const datas = {
      title: `Deleted ${clientName} from My Clients`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };
  
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${clientName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/clients/${id}`)
          .then(() => {
            AxiosPublic.post("/activity", datas).then(() => {
              refetch();
              toast.success(`${clientName} has been successfully deleted`);
            });
          })
          .catch((error) => {
            toast.error("Failed to delete client");
            console.error(error);
          });
      }
    });
    };
  
    const handleUpdate2 = (e, id) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const clientPhone = e.target.clientPhone.value;
    const body = { clientName, clientPhone };
  
    const datas = {
      title: `Updated ${clientName} in My Clients`,
      date: new Date(),
      user: user?.displayName,
      photo: user?.photoURL,
      email:user?.email
    };
  
    AxiosPublic.patch(`/clients/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        AxiosPublic.post("/activity", datas).then(() => {
          document.getElementById(`modal_${id}`).close();
          toast.success(`${clientName} has been successfully updated`);
        });
      })
      .catch((error) => {
        toast.error("Failed to update client");
        console.error(error);
      });
    };

      const [payment2, setModalData2] = useState(null);
      const [showModal, setShowModal] = useState(false);
      
    return (
        <div >
           <ToastContainer />
             <div className="overflow-x-auto">
               <Helmet>
                 <title>Clients | Digital Network</title>
                 <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>

               <div className='lg:block hidden'>

             

               <div className="grid mb-2 rounded-md lg:grid-cols-5 grid-cols-2 gap-3 lg:gap-5 justify-around pb-3">
      <SummaryCard title="Total Spend" value={formatValue(myClientsTotal?.spendTotal || 0)} />
      <SummaryCard title="Total Bill" value={formatValue(myClientsTotal?.spendBill || 0, 0)} />
      <SummaryCard title="Total Paid" value={formatValue(myClientsTotal?.total || 0, 0)} />
      <SummaryCard title="Total Advance" value={formatValue(clientsDueAdvance?.totalAdvance || 0, 0)} />
      <SummaryCard title="Total Due" value={formatValue(clientsDueAdvance?.totalDue || 0, 0)} />


       </div>
    

          <div className='' >

              <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex justify-between lg:mb-5 items-center w-full lg:w-auto">
  <div className="flex justify-center items-center gap-5 text-gray-500 ">

    <button
      className="add"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
          <span className="font-bold text-lg">
             <IoIosAddCircleOutline />
           </span>
           <span className="inline ml-1">
           Add New Client
</span> 
    </button>

    <dialog id="my_modal_2" className="modal">
      <div className="modal-box bg-white text-black font-bold">
        <form onSubmit={handleAddClient}>
          <h1
            className="text-black flex justify-end hover:text-red-500"
            onClick={() => document.getElementById("my_modal_2").close()}
          >
            <ImCross />
          </h1>
          {userr?.role === "admin" && (
                <div >
                  <label className="block text-black" >Select Employee</label>
                  <select name="employeeEmail" className="select2 w-full">
                    {allEmployees?.filter(f=>f.role === 'employee')
                      .map((employee) => (
                        <option key={employee._id} value={employee.email}>
                          {employee.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
          {[
            { label: "Client Name", name: "clientName", type: "text" },
            { label: "Client Phone", name: "clientPhone", type: "number" },
          ].map((field, i) => (
            <div className="my-4" key={i}>
              <label className="block">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                required
                className="w-full bg-white border-2 border-black rounded p-2 mt-1"
              />
            </div>
          ))}
          <div className="grid mt-8 grid-cols-2 gap-3">
            <button
              type="button"
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              onClick={() => document.getElementById("my_modal_2").close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#05a0db] hover:bg-indigo-700 rounded text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
              </div>

              <div className="flex mb-5 lg:mb-5 gap-3 justify-end items-center">
  {userr?.role === "admin" && (
    <select
      className="select2"
      value={selectedEmployee3}
      onChange={(e) => changeTab3(e.target.value)}
    >
      <option value="all">Select Digital Marketer</option>
      {allEmployees
        .filter((u) => u.role === "employee")
        .map(({ _id, email, name }) => (
          <option key={_id} value={email}>
            {name}
          </option>
        ))}
    </select>
  )}

  <select
    name="status"
    className="select2"
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
  >
    <option value="all">Select Status</option>
    <option value="positive">Due</option>
    <option value="negative">Advanced</option>
    <option value="equal">Clear</option>
  </select>

  <input
  type="text"
  placeholder="Search by name or phone..."
  className="input2"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to first page when searching
  }}
/>

              </div>
              </div>

              <div className="overflow-x-auto rounded-xl text-center">
 <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
      <th className="text-center">{client?.length} Items</th>
    
      <th className='flex justify-start ml-12 text-center'>Client Name</th>
      <th className='  text-start'>Phone</th>
      <th>Budget</th>
      <th>Spend</th>
      <th>Bill</th>
      <th>Payment</th>
      <th className="text-center">Due/Adv.</th>
    </tr>
  </thead>
  <tbody>
    {client
        .sort((a, b) => parseInt(a.id?.slice(-5) || "0", 16) - parseInt(b.id?.slice(-5) || "0", 16))
      .map((campaign,index) => (
       
        <tr 
                key={campaign.id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-100  text-left text-black border-b border-opacity-20"
                }`}
              >

<td>{index + 1}</td>
   {/* <button
              className="text-red-500 hover:text-red-700 text-lg"
              onClick={() => handledelete(campaign._id, campaign.clientName)}
            >
              <FaMinusSquare />
            </button> */}

<td className="align-top py-3 px-4 text-sm text-gray-800 text-left">
  <div className="flex flex-col space-y-1">
  <div className="flex justify-start items-center gap-3">
  {/* Employee Photo */}
  <img
    className="h-10 w-10 rounded-full object-cover"
    src={campaign?.image || allEmployees.find((f) => f.email === campaign.employeeEmail)?.photo}
    alt=""
  />

  {/* Right Side: Name + Status + Date + Edit */}
  <div className="flex flex-col gap-1 text-left">
    
    {/* Name & Status */}
    <Link
      to={`/client/${campaign.id}`}
      className="text-base font-semibold text-blue-700 hover:underline flex items-center gap-1"
    >
      {campaign.clientName}
      {campaign.status && (
        <svg width="16" height="16" fill="green" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="6" />
        </svg>
      )}
    </Link>

    {/* Date + Edit */}
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() =>
          document.getElementById(`modal_${campaign._id}`).showModal()
        }
        title="Edit"
      >
        <FaEdit />
      </button>
      {campaign?.date ? format(new Date(campaign.date), "dd-MM-yyyy") : ""}
    </div>
  </div>
</div>

    {/* Name + Status */}


   

    {/* Modal */}
    <dialog id={`modal_${campaign._id}`} className="modal">
      <form
        className="modal-box bg-white text-black"
        onSubmit={(e) => handleUpdate2(e, campaign._id, campaign)}
      >
        <h1 className="text-md mb-5">
          Client Name:{" "}
          <span className="text-blue-600 text-xl font-bold">
            {campaign.clientName}
          </span>
        </h1>
        {["clientName", "clientPhone"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 capitalize mb-1">
              {field.replace("client", "")}
            </label>
            <input
              type="text"
              name={field}
              defaultValue={campaign[field]}
              className="input2"
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            className="close"
            onClick={() =>
              document.getElementById(`modal_${campaign._id}`).close()
            }
          >
            Close
          </button>
          <button type="submit" className="add">
            Update
          </button>
        </div>
      </form>
    </dialog>
  </div>
</td>



          <td>
          <p className="text-sm flex justify-start items-center gap-1 ">{campaign.clientPhone}</p>
          </td>
          <td>
          <span><span className="amount-doller">$</span><span className="ml-1">{campaign.totalBudget.toFixed(2)}</span></span>
          </td>
          <td>
          <span><span className="amount-doller">$</span><span className="ml-1">{campaign.totalSpent.toFixed(2)}</span></span>
          </td>
          <td>
          <span><span className="amount-taka">৳</span><span className="ml-1">{campaign.totalBill.toFixed(0)}</span></span>
          </td>
          <td>
          <span><span className="amount-taka">৳</span><span className="ml-1">{campaign.paymentReceived.toFixed(0)}</span></span>
          </td>




         
          <td className="text-center">
          <Link
       
       to={`/client/${campaign.id}`}
     >
            <span
              className={`w-20 px-2 py-0.5 rounded text-center inline-block ${
                campaign.total > 0
                  ? "bg-red-800 font-bold text-white"
                  : campaign.total < 0
                  ? "bg-green-800 font-bold text-white"
                  : "bg-yellow-300 font-bold text-black"
              }`}
            >
              <div className="flex justify-center items-center gap-1">
                <span className="amount-taka">৳</span>
                <span>{Math.abs(campaign.total).toFixed(0)}</span>
              </div>
            </span>
           </Link></td>

           
       
        </tr>
      ))}
    <tr className="tr1 font-bold">
   
      <td></td>
      <td></td>

      <td className="text-right">Total:</td>
      <td>
      <span><span className="amount-doller">$</span><span className="ml-1">{client.reduce((acc, client) => acc + client.totalBudget, 0).toFixed(2)}</span></span>
      </td>
      <td>
      <span><span className="amount-doller">$</span><span className="ml-1">{client.reduce((acc, client) => acc + client.totalSpent, 0).toFixed(2)}</span></span>
      </td>
      <td>
      <span><span className="amount-taka">৳</span><span className="ml-1">{client.reduce((acc, client) => acc + client.totalBill, 0).toFixed(2)}</span></span>
      </td>
      <td>
      <span><span className="amount-taka">৳</span><span className="ml-1">{client.reduce((acc, client) => acc + client.paymentReceived, 0).toFixed(2)}</span></span>
      </td>


      <td className="text-center">
        <span className="amount-taka">৳</span> {client.reduce((acc, client) => acc + client.total, 0).toFixed(2)}
      </td>
   
    </tr>
  </tbody>
</table>


<div className="flex items-center justify-center my-5 space-x-2">
  {/* Previous Button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md ${
      currentPage === 1
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Previous
  </button>

  {/* Page Numbers */}
  {(() => {
    const buttons = [];
    let startPage, endPage;

    // Always show 5 buttons, with the current page in the middle
    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages to keep the current page in the middle
      startPage = Math.max(currentPage - 2, 1);
      endPage = Math.min(currentPage + 2, totalPages);

      // Adjust if the current page is near the start or end
      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
    }

    // Generate buttons for the calculated range
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md ${
            currentPage === i
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-red-600 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  })()}

  {/* Next Button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-md ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Next
  </button>
</div>



         </div>
       </div>

       </div>

      {/* ///////////////////////////mobile page////////////////////////// */}

      <div className="text-xs  text-gray-700  lg:hidden">
      
      
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Pink Top Bar */}
        <div className="bg-[#f3a62b]  text-white flex items-center justify-between px-4 py-3 shadow-md">
          <p></p>
          <h1 className="text-lg text-center font-bold">ক্লায়েন্টস</h1>

          <div className="relative">
            <img
              src="https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"
              alt="Icon"
              className="w-6 h-6"
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      
        {/* White Tabs + Search Section */}
        <div className="bg-white shadow-md pt-2">
          {/* Tabs */}
      
          <div className="flex justify-around items-center relative">
      

      </div>
      
      
      
          {/* Search and Filter Section */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white">
        {/* Search Box */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full flex-1 px-4 py-2 shadow-sm">
          <MdSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="নাম অথবা মোবাইল নাম্বার দিয়ে খুঁজুন"
            className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      
        {/* Filter Button */}
        <button    onClick={() => setShowModal(true)} className="flex items-center gap-2 text-pink-600 border border-pink-600 hover:bg-pink-600 hover:text-white transition-all rounded-full px-4 py-2 text-sm shadow-sm">
          <MdTune className="text-lg" />
          ফিল্টার
        </button>
      </div>
        </div>
      </div>
      
      
          </div>


  <div className="bg-white pt-32 pb-16  font-sans  lg:max-w-2xl lg:hidden mx-auto text-sm">

      {client
      .filter(
        (item) =>
          item.clientPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((payment) => (
        <div
        key={payment._id}
        className="px-4 py-3 sm:px-6 sm:py-4 border-b hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left Content */}
          <div className="flex items-start gap-3 flex-1">
            {/* Image */}
            <img
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
              src={allEmployees.find(f => f.email === payment.employeeEmail)?.photo}
              alt="Employee"
            />
      
            {/* Info */}
            <div className="flex flex-col gap-1 text-sm">
              {/* Client Name */}
              <Link
                  to={`/client/${payment.id}`}
                className="text-gray-900 font-semibold hover:text-blue-700"
              >
                {payment?.clientName}
              </Link>
      
              {/* Employee Name */}
              <Link
                to={`/client/${payment?.clientEmail}`}
                className="text-gray-600 hover:text-blue-600 text-xs"
              >
                {allEmployees.find(f => f.email === payment.employeeEmail)?.name}
              </Link>
      
              {/* Date */}
              <p className="text-gray-500 text-xs">
                {new Date(payment.date).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </p>
            </div>
          </div>
      
          {/* Right Content */}
          <div className="text-right space-y-1 text-sm sm:text-base">
            <p className="text-gray-800">
              <span className="font-medium text-gray-600">Payment:</span>{" "}
              <span className="text-emerald-600 font-bold"><span className="amount-taka">৳</span>{" "} {payment?.paymentReceived?.toLocaleString()}</span>
            </p>
            <p className="text-gray-800">
              <span className="font-medium text-gray-600">Bill:</span>{" "}
              <span className="text-red-600 font-bold"><span className="amount-taka">৳</span>{" "} {payment?.totalBill?.toLocaleString()}</span>
            </p>
           
            <button
                        onClick={() => setModalData2(payment)}
                        className="text-emerald-600 hover:text-emerald-800 transition"
                        title="বিস্তারিত দেখুন"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-gray-100 text-black p-1 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
          </div>
        </div>
      </div>
      
      ))}

      {/* Modal */}


      {payment2 && (
 <Dialog open={!!payment2} onClose={() => setModalData2(null)} className="relative z-50">
 {/* Overlay */}
 <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

 {/* Modal Panel */}
 <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-4">
   <Dialog.Panel className="w-full max-w-md bg-white rounded-t-2xl p-6 shadow-2xl">

     {/* Header */}
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
       <button onClick={() => setModalData2(null)} className="text-red-500 font-semibold text-sm hover:underline">
         ✖️ Close
       </button>
     </div>

     {/* Transaction Summary */}
     <div className="text-center mb-6">
       <p className="text-gray-500 text-sm">Total Received</p>
       <p className="text-4xl font-extrabold text-pink-600 mt-2">৳ {payment2?.paymentReceived?.toLocaleString()}</p>
       {payment2?.status && (
         <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
           ✅ verified Client
         </div>
       )}
     </div>

     {/* Divider */}
     <div className="border-t border-gray-200 my-4" />

     {/* Detailed Information */}
     <div className="space-y-4 text-sm text-gray-800">
     <InfoRow label="🧾 Client ID" value={payment2?.id?.slice(0, 6) || "N/A"} />
       <InfoRow label="👤 Client Name" value={payment2?.clientName} />
       <InfoRow label="📞 Client Phone" value={payment2?.clientPhone} />
       <InfoRow label="📧 Employee Email" value={payment2?.employeeEmail} />
       <InfoRow
         label="📅 Date & Time"
         value={new Date(payment2?.date).toLocaleString("en-GB", {
           day: "2-digit",
           month: "short",
           year: "numeric",
           hour: "2-digit",
           minute: "2-digit",
           hour12: true,
         })}
       />
       <InfoRow label="💸 Total Bill" value={`৳ ${payment2?.totalBill?.toLocaleString()}`} color="text-red-600" />
       <InfoRow label="📊 Budget" value={`৳ ${payment2?.totalBudget?.toLocaleString()}`} color="text-blue-600" />
       <InfoRow label="💰 Spent" value={`৳ ${payment2?.totalSpent?.toLocaleString()}`} color="text-orange-500" />
       <InfoRow label="📦 Total (Net)" value={`৳ ${payment2?.total?.toLocaleString()}`} color="text-gray-800" />
     </div>

     {/* Divider */}
     <div className="border-t border-gray-200 my-6" />

     {/* Share Button */}
     <button className="flex items-center justify-center w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
       <FaShare className="mr-2" />
       Share Transaction
     </button>
   </Dialog.Panel>
 </div>
</Dialog>

)}




    </div>



    {showModal && (
  <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

    {/* Bottom Sheet */}
    <div className="fixed bottom-0 left-0 right-0 flex justify-center  pb-6">
      <Dialog.Panel className="w-full  bg-white rounded-t-xl p-5 shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">ফিল্টার করুন</h2>
          <button onClick={() => setShowModal(false)} className="text-red-500 font-semibold text-sm">
            ✖️ Close
          </button>
        </div>

        {/* Employee List with Radio Buttons */}
        <div className="space-y-3 text-sm text-gray-700">
          {/* Default "All" option */}
          <label
            className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${
              selectedEmployee3 === "" || selectedEmployee3 === null
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
           <input
  type="radio"
  name="employeeSelect"
  value="all"
  checked={selectedEmployee3 === "all"}
  onChange={(e) => {
    changeTab3(e.target.value);
    setShowModal(false);
  }}
  className="w-5 h-5 accent-blue-600 border-2 border-gray-300 rounded-full transition-all"
/>

            <span className="text-base">সব</span>
          </label>

          {/* Dynamic employee options */}
          {allEmployees
            ?.filter((u) => u.role === "employee")
            .map(({ _id, email, name }) => (
              <label
                key={_id}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${
                  selectedEmployee3 === email
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="employeeSelect"
                  value={email}
                  checked={selectedEmployee3 === email}
                  onChange={(e) => {
                    changeTab3(e.target.value);
                    setShowModal(false);
                  }}
                  className="w-5 h-5 accent-blue-600 border-2 border-gray-300 rounded-full transition-all"
                />
                <span className="text-base">{name}</span>
              </label>
            ))}
        </div>

       

      </Dialog.Panel>
    </div>
  </Dialog>
)}







     </div>
     </div>
    );
};

export default Clients;