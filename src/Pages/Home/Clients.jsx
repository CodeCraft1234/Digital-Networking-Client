import { useContext, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from '../../Hook/useUser';
import SummaryCard from './SummeryCard';
import useClientsPage from '../../Hook/useClientsPage';
import useMyClientsTotal from '../../Hook/useMyClientsTotal';
import useAllEmployee from '../../Hook/useAllEmployee';

const Clients = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email); 

  const initialTab3 =
  userr?.role === "admin"
    ? localStorage.getItem(`activeTabag${user?.email}`) || "all" 
    : localStorage.getItem(`activeTabag${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  const [currentPage, setCurrentPage] = useState(1);
  const [myClientsTotal] = useMyClientsTotal(selectedEmployee3);
  const [client, totalItems, totalPages, , refetch] = useClientsPage(selectedEmployee3, currentPage);
  const AxiosPublic = UseAxiosPublic();
  const [searchQuery, setSearchQuery] = useState("");
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
      const employeeEmail = user?.email;
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
          AxiosPublic.post("/activity", datas).then(() => {
            document.getElementById("my_modal_2").close();
            toast.success(`Successfully added ${clientName}`);
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
  
    return (
        <div >
           <ToastContainer />
             <div className="overflow-x-auto">
               <Helmet>
                 <title>Clients | Digital Network</title>
                 <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>

               <div className="grid mb-2 rounded-md lg:grid-cols-4 grid-cols-2 gap-3 lg:gap-5 justify-around pb-3">
      <SummaryCard title="Total Spend" value={formatValue(myClientsTotal?.spendTotal || 0)} />
      <SummaryCard title="Total Bill" value={formatValue(myClientsTotal?.spendBill || 0, 0)} />
      <SummaryCard title="Total Paid" value={formatValue(myClientsTotal?.total || 0, 0)} />
      <SummaryCard 
  title={
    myClientsTotal?.spendBill - myClientsTotal?.total > 0
      ? "Total Due"
      : myClientsTotal?.spendBill - myClientsTotal?.total < 0
      ? "Total Advanced"
      : "Clear"
  } 
  value={formatValue(Math.abs(myClientsTotal?.spendBill - myClientsTotal?.total || 0), 0)} 
/>

    </div>
    

          <div className='px-4 pt-4 pb-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

              <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex justify-between lg:mb-5 items-center w-full lg:w-auto">
  <div className="flex justify-center items-center gap-5 text-gray-500 lg:mx-2">
    <button
      className="add"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add Client
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
          {[
            { label: "Client Name", name: "clientName", type: "text" },
            { label: "Client Phone", name: "clientPhone", type: "number" },
          ].map((field, i) => (
            <div className="mb-4" key={i}>
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
    <option value="all">All</option>
    <option value="positive">Due</option>
    <option value="negative">Advanced</option>
    <option value="equal">Clear</option>
  </select>

  <input
    type="text"
    placeholder="Search ...."
    className="input2"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
              </div>
              </div>

              <div className="overflow-x-auto rounded-xl text-center">
 <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
      <th className="text-center">{client?.length} Items</th>
    

      {
        userr?.role === 'admin' && 
      <th>Employee Name</th>
       }
      <th>Client Name</th>
      <th>Mob Number</th>
      <th>Total Budget</th>
      <th>Total Spend</th>
      <th>Total Bill</th>
      <th>Payment RCV</th>
      <th className="text-center">Total</th>
    </tr>
  </thead>
  <tbody>
    {client
      .filter(
        (item) =>
          item.clientPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((campaign) => (
       
        <tr  key={campaign._id} className="tr2">

          <td className="text-center">
            <button
              className="hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
              onClick={() => handledelete(campaign._id, campaign.clientName)}
            >
              <FaMinusSquare />
            </button>
            <button
              className="px-2 py-1 rounded"
              onClick={() => document.getElementById(`modal_${campaign._id}`).showModal()}
            >
              <FaEdit />
            </button>
            <dialog id={`modal_${campaign._id}`} className="modal">
              <form
                className="modal-box bg-white text-black"
                onSubmit={(e) => handleUpdate2(e, campaign._id, campaign)}
              >
                <h1 className="text-md mb-5">
                  Client Name:{" "}
                  <span className="text-blue-600 text-xl font-bold">{campaign.clientName}</span>
                </h1>
                {["clientName", "clientPhone"].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-gray-700 text-start capitalize">
                      {field.replace("client", "")}
                    </label>
                    <input
                      type={field === "email" || "text"}
                      name={field}
                      defaultValue={campaign[field]}
                      className="input2"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="close"
                    onClick={() => document.getElementById(`modal_${campaign._id}`).close()}
                  >
                    Close
                  </button>
                  <button type="submit" className="add">
                    Update
                  </button>
                </div>
              </form>
            </dialog>
          </td>

          {
            userr?.role === 'admin' &&    <td>  <Link
       
            to={`/client/${campaign.id}`}
          >
              <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === campaign.employeeEmail)?.photo} alt="" />
              <h1> {allEmployees.find(f => f.email === campaign.employeeEmail)?.name || 'N/A'}</h1>
              </div>
              </Link>
          </td>
          }

          <td>
            <Link
              to={`/client/${campaign.id}`}
              className="flex gap-2 items-center hover:font-bold"
            >
              {campaign.clientName}
              {campaign.campaings?.some(({ status }) => status === "Active") && (
                <svg width="20" height="20" fill="green" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6" />
                </svg>
              )}
            </Link>
          </td>

          
          <td> <Link
       
       to={`/client/${campaign.id}`}
     >{campaign.clientPhone}
      </Link>
     </td>
          <td><Link
       
       to={`/client/${campaign.id}`}
     >$ {campaign.totalBudget.toFixed(2)} </Link></td>
          <td><Link
       
       to={`/client/${campaign.id}`}
     >$ {campaign.totalSpent.toFixed(2)} </Link></td>
          <td><Link
       
       to={`/client/${campaign.id}`}
     >৳ {campaign.totalBill.toFixed(0)} </Link></td>
          <td><Link
       
       to={`/client/${campaign.id}`}
     >৳ {campaign.paymentReceived.toFixed(0)} </Link></td>
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
                <span className="font-bold text-lg">৳</span>
                <span>{Math.abs(campaign.total).toFixed(0)}</span>
              </div>
            </span>
           </Link></td>
       
        </tr>
      ))}
    <tr className="tr1 font-bold">
      <td></td>
      <td></td>

      {
            userr?.role === 'admin' && <td></td>  

      }
      <td className="text-right">Total:</td>
      <td>$ {client.reduce((acc, client) => acc + client.totalBudget, 0).toFixed(2)}</td>
      <td>$ {client.reduce((acc, client) => acc + client.totalSpent, 0).toFixed(2)}</td>
      <td>৳ {client.reduce((acc, client) => acc + client.totalBill, 0).toFixed(2)}</td>
      <td>৳ {client.reduce((acc, client) => acc + client.paymentReceived, 0).toFixed(2)}</td>
      <td className="text-center">
        ৳ {client.reduce((acc, client) => acc + client.total, 0).toFixed(2)}
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
     </div>
    );
};

export default Clients;