import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import useMyClientsByEmail from '../../Hook/useMyClientsByEmail';
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from '../../Hook/useUser';
import useUsers from '../../Hook/useUsers';
import SummaryCard from './SummeryCard';

const Clients = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email); 
  const [users] = useUsers(); 
  
  const initialTab3 =
  userr?.role === "admin"
    ? localStorage.getItem(`activeTabag${user?.email}`) || "all" 
    : localStorage.getItem(`activeTabag${user?.email}`) || user?.email; 


  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  const [myclients, refetch] = useMyClientsByEmail(selectedEmployee3);
  console.log(selectedEmployee3,user?.email);
  
  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab);
    localStorage.setItem(`activeTabag${user?.email}`, tab);
    refetch(); 
  };
  
  const AxiosPublic = UseAxiosPublic();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('all'); 


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
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Determine the items to display based on the current page
  const displayedItems = myclients?.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < myclients.length;
  console.log(myclients,displayedItems);

  useEffect(() => {
    // Automatically load more items every second
    const interval = setInterval(() => {
      if (isMoreItems) {
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        clearInterval(interval); // Clear interval when all items are loaded
      }
    }, 1000); // Load 20 more items every second

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [isMoreItems]); // Re-run effect if `isMoreItems` changes

// Function to calculate total values based on a callback
const calculate = (callback) =>
  displayedItems.reduce((acc, client) => acc + callback(client), 0);

// Format numbers to a specified decimal precision
const formatValue = (value, decimals = 2) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

// Total spent on campaigns
const totalSpent = calculate(client =>
  (client.campaings || []).reduce((sum, c) => sum + parseFloat(c?.tSpent || 0), 0)
);

// Total bill combining campaigns and page services
const totalBill = calculate(client => {
  // Campaigns total
  const campaignTotal = (client.campaings || []).reduce((sum, c) => {
    const tSpent = parseFloat(c?.tSpent || 0);
    const dollerRate = parseFloat(c?.dollerRate || 0);
    return sum + tSpent * dollerRate;
  }, 0);

  // Page services total
  const pageServiceTotal = (client.pageService || []).reduce((sum, service) => {
    const totalBill = parseFloat(service?.totalBill || 0);
    return sum + totalBill;
  }, 0);

  return campaignTotal + pageServiceTotal;
});

// Total paid by clients
const totalPaid = calculate(client =>
  (client.payments || []).reduce((sum, p) => sum + parseFloat(p?.amount || 0), 0)
);

// Total advance payment (when total paid exceeds total bill)
const totalAdvanced = calculate(client => {
  const clientTotalBill = (client.campaings || []).reduce((sum, c) => {
    const tSpent = parseFloat(c?.tSpent || 0);
    const dollerRate = parseFloat(c?.dollerRate || 0);
    return sum + tSpent * dollerRate;
  }, 0) + 
  (client.pageService || []).reduce((sum, service) => {
    const totalBill = parseFloat(service?.totalBill || 0);
    return sum + totalBill;
  }, 0);

  const clientTotalPaid = (client.payments || []).reduce(
    (sum, p) => sum + parseFloat(p?.amount || 0),
    0
  );

  return clientTotalPaid > clientTotalBill
    ? clientTotalPaid - clientTotalBill
    : 0; // Only include advance payments
});

    return (
        <div >
           <ToastContainer />
             <div className="overflow-x-auto">
               <Helmet>
                 <title>Clients | Digital Network</title>
                 <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>

               <div className="grid mb-2 rounded-md lg:grid-cols-5 grid-cols-2 sm:grid-cols-2 gap-3     lg:gap-5 justify-around pb-3">
                  <SummaryCard title="Total Spent" value={formatValue(totalSpent)} />
                  <SummaryCard title="Total Bill" value={formatValue(totalBill, 0)} />
                  <SummaryCard title="Total Paid" value={formatValue(totalPaid,0)} />
                  <SummaryCard title="Total Advanced" value={formatValue(totalAdvanced, 0)} />
                  <SummaryCard title="Total Due" value={formatValue(totalBill - totalPaid , 0)} />
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
      {users
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
            <th className='text-center'>{myclients?.length} Items</th>
            <th>Client Name</th>
            <th>Contact Number</th>
            <th>Total Budget</th>
            <th>Total Spent</th>
            <th>Total Bill</th>
            <th>Payment RCV</th>
            <th className='text-center'>Total</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems
            .filter(item =>
              item.clientPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => a.clientName.localeCompare(b.clientName))
            .map(campaign => (
              <tr key={campaign._id} className="tr2">
                <td className='text-center'>
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
                      onSubmit={e => handleUpdate2(e, campaign._id, campaign)}
                    >
                      <h1 className="text-md mb-5">
                        Client Name: <span className="text-blue-600 text-xl font-bold">{campaign.clientName}</span>
                      </h1>
                      {['clientName', 'clientPhone'].map(field => (
                        <div className="mb-4" key={field}>
                          <label className="block text-gray-700 text-start capitalize">{field.replace('client', '')}</label>
                          <input
                            type={field === 'email' || 'text'}
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
                        <button
                          type="submit"
                          className="add"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </dialog>
                </td>
                <td>
                  <Link to={`/client/${campaign.id}`} className="flex gap-2 items-center hover:font-bold">
                    {campaign.clientName}
                    {campaign.campaings?.some(({ status }) => status === 'Active') && (
                      <svg width="20" height="20" fill="green" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                    )}
                    
                  </Link>
                </td>
                <td>{campaign.clientPhone}</td>
                {['tBudged', 'tSpent'].map(key => (
                  <td key={key}>
                    $ {campaign.campaings?.reduce((acc, item) => acc + parseFloat(item[key] || 0), 0).toFixed(2) || 0}
                  </td>
                ))}
              <td>
  ৳ {(
    (campaign.campaings?.reduce(
      (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
      0
    ) || 0) +
    (campaign?.pageService?.reduce((acc, payment) => {
      const amount = payment?.totalBill ? parseFloat(payment.totalBill) : 0;
      return acc + amount;
    }, 0) || 0)
  ).toFixed(2)}
</td>

                
                <td>
                  ৳ {campaign?.payments?.reduce((acc, payment) => {
                    const amount = payment?.amount ? parseFloat(payment.amount) : 0;
                    return acc + amount;
                  }, 0).toFixed(2) || '0.00'}
                </td>

                <td className="text-center">
  <span
    className={`w-20 px-2 py-0.5 rounded text-center inline-block ${(() => {
      // Calculate total payments
      const totalPayments = campaign?.payments?.reduce((acc, payment) => {
        const amount = payment?.amount ? parseFloat(payment.amount) : 0; // Safely parse amount
        return acc + amount;
      }, 0) || 0;

      // Calculate total expenses (campaings + pageService)
      const totalCampaignExpenses = campaign?.campaings?.reduce((acc, { tSpent = 0, dollerRate = 0 }) => {
        return acc + (parseFloat(tSpent) || 0) * (parseFloat(dollerRate) || 0);
      }, 0) || 0;

      const totalPageServiceExpenses = campaign?.pageService?.reduce((acc, service) => {
        const bill = service?.totalBill ? parseFloat(service.totalBill) : 0; // Safely parse totalBill
        return acc + bill;
      }, 0) || 0;

      const totalExpenses = totalCampaignExpenses + totalPageServiceExpenses;

      // Calculate the difference
      const difference = totalPayments - totalExpenses;

      // Return the appropriate class based on the difference
      return difference > 0
        ? 'bg-green-500 font-bold text-white'
        : difference < 0
        ? 'bg-red-800 font-bold text-white'
        : 'bg-yellow-300 font-bold text-black';
    })()}`}
  >
    <div className="flex justify-center items-center gap-1">
      <span className="font-bold text-lg">৳</span>
      <span>
        {(
          Math.abs(
            (
              (campaign.payments && Array.isArray(campaign.payments))
                ? campaign.payments.reduce((acc, payment) => {
                    const amount = payment?.amount ? parseFloat(payment.amount) : 0;
                    return acc + amount;
                  }, 0)
                : 0
            ) -
            (
              (campaign.campaings && Array.isArray(campaign.campaings))
                ? campaign.campaings.reduce((acc, { tSpent = 0, dollerRate = 0 }) => {
                    return acc + (parseFloat(tSpent) || 0) * (parseFloat(dollerRate) || 0);
                  }, 0)
                : 0
            ) -
            (
              (campaign.pageService && Array.isArray(campaign.pageService))
                ? campaign.pageService.reduce((acc, service) => {
                    const bill = service?.totalBill ? parseFloat(service.totalBill) : 0;
                    return acc + bill;
                  }, 0)
                : 0
            )
          ) || 0
        ).toFixed(0)}
      </span>
    </div>
  </span>
</td>

              </tr>
            ))}
          <tr className="tr1 font-bold">
            <td></td>
            <td></td>
            <td className='text-right'>Total:</td>
            {['tBudged', 'tSpent'].map(key => (
              <td key={key}>
                $ {displayedItems.reduce((acc, client) => acc + (client.campaings || []).reduce((sum, item) => sum + parseFloat(item[key] || 0), 0), 0).toFixed(2)}
              </td>
            ))}
<td>
  ৳ {displayedItems.reduce(
    (acc, client) => {
      // Calculate the total from campaigns
      const campaignTotal = (client.campaings || []).reduce((sum, { tSpent = 0, dollerRate = 0 }) => {
        return sum + tSpent * dollerRate;
      }, 0);

      // Calculate the total from pageService
      const pageServiceTotal = (client.pageService || []).reduce((sum, { totalBill = 0 }) => {
        return sum + parseFloat(totalBill || 0);
      }, 0);

      // Add both totals to the accumulator
      return acc + campaignTotal + pageServiceTotal;
    },
    0
  ).toFixed(2)}
</td>

            <td>
  ৳ {displayedItems.reduce(
    (acc, client) => {
      // Check if client.payments is an array and handle null values safely
      const totalPayments = (client.payments && Array.isArray(client.payments))
        ? client.payments.reduce((sum, payment) => {
            const { amount = 0 } = payment || {}; // Safe destructuring
            return sum + (parseFloat(amount) || 0); // Safely parse amount
          }, 0)
        : 0;
        
      return acc + totalPayments;
    },
    0
  ).toFixed(2)}
</td>

<td className="text-center">
  ৳ {(
    displayedItems.reduce(
      (acc, client) =>
        acc +
        // Calculate total from campaigns
        (client.campaings && Array.isArray(client.campaings)
          ? client.campaings.reduce(
              (sum, { tSpent = 0, dollerRate = 0 }) => sum + (parseFloat(tSpent) || 0) * (parseFloat(dollerRate) || 0),
              0
            )
          : 0) +
        // Calculate total from pageService
        (client.pageService && Array.isArray(client.pageService)
          ? client.pageService.reduce(
              (sum, { totalBill = 0 }) => sum + parseFloat(totalBill) || 0,
              0
            )
          : 0),
      0
    ) -
    // Calculate total from payments
    displayedItems.reduce(
      (acc, client) =>
        acc +
        (client.payments && Array.isArray(client.payments)
          ? client.payments.reduce((sum, payment) => {
              const { amount = 0 } = payment || {}; // Safe destructuring
              return sum + (parseFloat(amount) || 0); // Safely parse amount
            }, 0)
          : 0),
      0
    )
  ).toFixed(2)}
</td>

          </tr>
        </tbody>
      </table>
         </div>
       </div>
     </div>
     </div>
    );
};

export default Clients;