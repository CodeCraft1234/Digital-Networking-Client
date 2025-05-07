import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import useMyCampaingsByEmail from '../../Hook/useMyCampaignByEmail';
import useMyClientsByEmail from '../../Hook/useMyClientsByEmail';
import useMypymentsByEmail from '../../Hook/useMyMPayments';
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useAllEmployee from '../../Hook/useAllEmployee';


const AllClients = () => {
    const { user }=useContext(AuthContext)
    const [allEmployees]=useAllEmployee()
   
    const [totalRCV, setTotalRCV] = useState(0);
    const [totalbill, setTotalBill] = useState(0);
    const [sortedAdsAccounts, setSortedAdsAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState('all'); 


    const initialTab = localStorage.getItem("activeTabsummeryEmployeess") || "allEmployee";
    
    const [selectedEmployee, setSelectedEmployee] = useState(initialTab);
    const changeTab = (tab) => {
      setSelectedEmployee(tab);
      localStorage.setItem("activeTabsummeryEmployeess", tab); 
    };
  

    const [myclients,refetch]=useMyClientsByEmail(selectedEmployee)
    const AxiosPublic = UseAxiosPublic();
    const [mycampaigns]=useMyCampaingsByEmail(selectedEmployee)
    const [Mypayments]=useMypymentsByEmail(selectedEmployee)

    useEffect(() => {
      const clientsWithBalance = myclients.map(campaign => {
        const totalSpent = mycampaigns
          .filter(payment => payment?.clientEmail === campaign?.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign?.tSpent) * parseFloat(campaign?.dollerRate),
            0
          );
  
        const totalReceived = Mypayments
          .filter(payment => payment?.clientEmail === campaign?.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0);
  
        const balance = totalReceived - totalSpent;
  
        return { ...campaign, balance }; 
      });
      setSortedAdsAccounts(clientsWithBalance);

      const totalRcv = Mypayments
      ?.filter(payment => 
        myclients.some(client => client.clientEmail === payment.clientEmail)
      )
      .reduce((acc, payment) => {
        const amount = parseFloat(payment.amount) || 0;
        return acc + amount;
      }, 0);
  
    setTotalRCV(totalRcv);
  
    const totalBill = mycampaigns
      ?.filter(campaign => 
        myclients.some(client => client.clientEmail === campaign.clientEmail)
      )
      .reduce((acc, campaign) => {
        const spent = parseFloat(campaign.tSpent) || 0;
        const dollarRate = parseFloat(campaign.dollerRate) || 0;
        return acc + (spent * dollarRate);
      }, 0);
  
    setTotalBill(totalBill);
    }, [myclients, mycampaigns, Mypayments,selectedEmployee]);

    const tspent = mycampaigns?.filter(campaign => myclients.some(client => client.clientEmail === campaign?.clientEmail))

    const tPay = Mypayments?.filter(campaign => myclients.some(client => client.clientEmail === campaign?.clientEmail))

    const filteredCampaigns = sortedAdsAccounts.filter(campaign => {
      if (selectedStatus === 'positive') return campaign.balance < 0; 
      if (selectedStatus === 'negative') return campaign.balance > 0; 
      if (selectedStatus === 'all') return true; // Show all data when 'all' is selected
      return campaign.balance === 0; 
    });

    const filteredCampaigns2 = sortedAdsAccounts.filter(campaign => {
       return campaign.balance > 0; 
    });



  const handledelete = (id, clientName) => {
    const datas = {
      title: `Deleted ${clientName} from My Clients`,
      date: new Date(),
      user: user?.displayName,
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
    const clientEmail = e.target.clientEmail.value;
    const body = { clientName, clientEmail, clientPhone };
  
    const datas = {
      title: `Updated ${clientName} in My Clients`,
      date: new Date(),
      user: user?.displayName,
    };
  
    AxiosPublic.patch(`/client/update/${id}`, body)
      .then(() => {
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

  const displayedItems = filteredCampaigns.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredCampaigns.length;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
    return (
        <div className='mx-5 mt-5'>
           <ToastContainer />
             <div className="overflow-x-auto   ">
               <Helmet>
                 <title> All Client | Digital Network</title>
                 <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
      <div className="grid px-4 pt-4 rounded-md lg:grid-cols-5 grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around lg:py-5 mb-4 pb-5">
    
        <div className="px-5 py-10 rounded-2xl bg-[#90a427] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Spent</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
  $ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    tspent.reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Bill</h2>
         
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
  <span className="font-extrabold lg:text-4x text-md"> ৳ </span>
  {new Intl.NumberFormat('en-IN').format(
    tspent
      .reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
      )
      .toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
  <span className="font-extrabold lg:text-4x text-md"> ৳ </span>
  {new Intl.NumberFormat('en-IN').format(
    tPay
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
      .toFixed(0)
  )}
</p>

        </div>

<div className="px-5 py-10 rounded-2xl bg-[#574d87] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">Total Advanced</h2>
  <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
  <span className="font-extrabold text-md"> 
  ৳ {new Intl.NumberFormat('en-IN').format(
    Math.abs(
      filteredCampaigns2
        .map(client => {
          const totalReceivedCampaigns = mycampaigns
            .filter(campaign => campaign.clientEmail === client.clientEmail)
            .reduce(
              (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
              0
            );

          const totalReceivedPayments = Mypayments
            .filter(payment => payment.clientEmail === client.clientEmail)
            .reduce(
              (acc, payment) => acc + parseFloat(payment?.amount || 0),
              0
            );

          // Return the difference between totalReceivedCampaigns and totalReceivedPayments
          return totalReceivedPayments - totalReceivedCampaigns;
        })
        .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
    ).toFixed(0)
  )}
</span>

  </p>
</div>


      <div className="px-5 py-10 rounded-2xl bg-red-900 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Due</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"><span className='font-extrabold lg:text-4x text-md'> ৳ </span>
          {new Intl.NumberFormat('en-IN').format((totalRCV ?? 0) - (totalbill ?? 0).toFixed(0))}
          </p>
        </div>
      </div>
    


     
      <div className='px-4 pt-4 pb-5 rounded-md' >
            <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex justify-between lg:mb-5 items-center w-full lg:w-auto  ">
    <div className="flex lg:justify-center justify-center mb-4 lg:mb-0 text-gray-500 lg:mx-2 pb-1 items-center gap-5">

    <div className="flex mt-1.5  lg:justify-between justify-center ">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2 "
          value={selectedEmployee}
          onChange={(e) => changeTab(e.target.value)}
        >
          {allEmployees.filter((u) => u.role === "employee")?.map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
    </div>
           </div>
          <div className='flex mb-5 lg:mb-5 gap-3 justify-end items-center'>
          <div className="">
        <select
          name="status"
          className="bg-transparent bg-gray-200 border border-black text-black text-sm py-2 px-3 rounded-md focus:outline-none  focus:border-blue-500 group-hover:bg-white group-hover:border-gray-700 group-hover:text-black"
          value={selectedStatus} // Bind value to state
          onChange={(e) => setSelectedStatus(e.target.value)} // Update selected status
        >
          <option value="all">All</option>
          <option value="positive">Due</option>
          <option value="negative">Advanced</option>
          <option value="equal">Clear</option>
        </select>
      </div>
      
<div className="w-full lg:w-auto">
    <input
      type="text"
      style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
      placeholder="Search ...."
      className="rounded-lg w-full  placeholder-black border border-gray-700 p-2 font-bold text-black text-sm bg-white"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  

          </div>
      </div>

          <div  className="overflow-x-auto rounded-xl mx-2 text-center ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >
                 <th className="p-3 text-center">{filteredCampaigns.length}</th>
                 <th className="p-3 text-left">Client Name</th>
                 <th className="p-3 text-left">Contact Number</th>
                 <th className="p-3 text-center">T.Budget</th>
                 <th className="p-3 text-center">T.Spent</th>
                 <th className="p-3 text-center">Total Bill</th>
                 <th className="p-3 text-center">Payment Rcv</th>
                 <th className="p-3 text-center">Total</th>
                 </tr>
                 </thead>
                 <tbody>
                {displayedItems
                    .filter(item => 
                      item?.clientPhone.toLowerCase().includes(searchQuery) ||
                      item?.clientName.toLowerCase().includes(searchQuery)
                    )
                    .sort((a, b) => a.clientName.localeCompare(b.clientName)).map((campaign, index) => (
             <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                  key={campaign._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-200  text-left text-black border-b border-opacity-20"
                  }`}
                >
               <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 border-l text-center ">                      <button
                         className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
                          onClick={() => handledelete(campaign._id,campaign.clientName)}
                        >
                          <ToastContainer></ToastContainer>
                          <span >
                          <FaMinusSquare  />
                          </span>
                          
                        </button>
              </td>

              <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 border-l text-center ">
  
<div className='flex justify-start items-center gap-2  text-start'>
  
   <div >
  <button
 className=" flex justify-center items-center gap-1   px-2 py-1 rounded"
    onClick={() =>
      document.getElementById(`modal_${campaign._id}`).showModal()
    }
  >
     <FaEdit />
  </button>

  <dialog id={`modal_${campaign._id}`} className="modal">
    <div className="modal-box bg-white text-black">
      <form  onSubmit={(e) => handleUpdate2(e, campaign._id, campaign)}>
        <h1 className="text-md mb-5">
          Client Name:{" "}
          <span className="text-blue-600 text-xl font-bold">
            {campaign.clientName}
          </span>
        </h1>

        <div className="mb-4">
          <label className="block text-start text-gray-700">Client Name</label>
          <input
            type="text"
            name="clientName"
            defaultValue={campaign?.clientName}
            className="w-full border-black bg-white border rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-start text-gray-700">Phone</label>
          <input
            type="text"
            name="clientPhone"
            defaultValue={campaign?.clientPhone}
            className="w-full bg-white border-black border rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-start text-gray-700">Email</label>
          <input
            type="email"
            name="clientEmail"
            disabled
            defaultValue={campaign?.clientEmail}
            className="w-full border-black bg-white border rounded p-2 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              document.getElementById(`modal_${campaign._id}`).close()
            }
            type="button"
            className="font-avenir hover:bg-red-700 px-3 py-1 bg-red-600 rounded-lg text-white"
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded-lg text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </dialog>
   </div>

   <Link
  to={`/dashboard/client/${campaign.clientEmail}`}
  className="items-center hover:font-bold flex gap-2"
>
  <span>{campaign.clientName}</span>
  {
    mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .find(f => f.status === 'Active') && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="green"
          viewBox="0 0 24 24"
          className=""
        >
          <circle cx="12" cy="12" r="6" />
        </svg>
      )
  }
</Link>



</div>

              </td>
             <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-start">
              {campaign.clientPhone}
            </td>
             <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">
  $   {
  (
    mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.tBudged || 0), 0).toFixed(2) 
  ) 
}

               </td>
              <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">

 $ {
  (
    mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2) 
  ) 
}

               </td>
               <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">

৳ {
    new Intl.NumberFormat('en-IN').format(
      mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
           ).toFixed(0)
    )
  } 

                </td>

                <td style={{ border: 'var(--border)' }} className="p-3 border-r border-gray-400 text-center">
  ৳ {
    new Intl.NumberFormat('en-IN').format(
      Mypayments
        .filter(payment => payment.clientEmail === campaign.clientEmail)
        .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
        .toFixed(0) // Keep total rounded to 0 decimal places
    )
  }
</td>


                <td style={{ border: 'var(--border)' }} className="p-3 border-r border-gray-400 text-center">
  <span
    className={`w-20 px-2 py-0.5 rounded text-center inline-block ${
      (
        (
          Mypayments
            .filter(payment => payment.clientEmail === campaign.clientEmail)
            .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
        ) 
        -
        (
          mycampaigns
            .filter(payment => payment.clientEmail === campaign.clientEmail)
            .reduce(
              (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
              0
            )
        )
      ) > 0
        ? 'bg-green-500 font-bold text-white'
        : (
            (
              (
                Mypayments
                  .filter(payment => payment.clientEmail === campaign.clientEmail)
                  .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
              ) 
              -
              (
                mycampaigns
                  .filter(payment => payment.clientEmail === campaign.clientEmail)
                  .reduce(
                    (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
                    0
                  )
              )
            ) < 0
          ? 'bg-red-800 font-bold text-white'
          : ' '
        )
    }`}
  >
    <span className='text-sm font-extrabold mr-1'>৳</span>
    {
    new Intl.NumberFormat('en-IN').format( Math.abs(
      (
        Mypayments
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
      ) 
      -
      (
        mycampaigns
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
            0
          )
      )
    ).toFixed(0)
    )
  }
    {
     
    }
  </span>
               </td>
             </tr>
            ))}
            <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=''>
      <td className="p-3"></td>
      <td className="p-3"></td>
        <td className="p-3 text-center font-bold">Total: </td>
       
        
        <td className="p-3 text-center font-bold">
      $ {filteredCampaigns
    .map(client => {
      const totalReceived = mycampaigns
        .filter(payment => payment.clientEmail === client.clientEmail)
        .reduce((acc, payment) => acc + parseFloat(payment?.tBudged || 0), 0);
      return totalReceived;
    })
    .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
    .toFixed(2)}
        </td>

        <td className="p-3 text-center font-bold">
      $ {filteredCampaigns
    .map(client => {
      const totalReceived = mycampaigns
        .filter(payment => payment.clientEmail === client.clientEmail)
        .reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0);
      return totalReceived;
    })
    .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
    .toFixed(2)}
        </td>


        
        <td className="p-3 text-center font-bold">
        ৳ {filteredCampaigns
    .map(client => {
      const totalReceived = mycampaigns
        .filter(payment => payment.clientEmail === client.clientEmail)
        .reduce(
          (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
          0
        )
      return totalReceived;
    })
    .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
    .toFixed(0)}
        </td>

        <td className="p-3 text-center font-bold">
  ৳  { filteredCampaigns
    .map(client => {
      const totalReceived = Mypayments
        .filter(payment => payment.clientEmail === client.clientEmail)
        .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0);
      return totalReceived;
    })
    .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
    .toFixed(0)} 
</td>

<td className="p-3 text-center font-bold">
  ৳ {(

    filteredCampaigns
      .map(client => {
        const totalReceived = Mypayments
          .filter(payment => payment.clientEmail === client.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0);
        return totalReceived;
      })
      .reduce((total, clientTotal) => total + clientTotal, 0) 
      -
      filteredCampaigns
      .map(client => {
        const totalReceived = mycampaigns
          .filter(payment => payment.clientEmail === client.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
            0
          );
        return totalReceived;
      })
      .reduce((total, clientTotal) => total + clientTotal, 0) 
  ).toFixed(0)}
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

export default AllClients;