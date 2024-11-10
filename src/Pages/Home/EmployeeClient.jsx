import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUsers from '../../Hook/useUsers';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import useMyCampaingsByEmail from '../../Hook/useMyCampaignByEmail';
import useMyClientsByEmail from '../../Hook/useMyClientsByEmail';
import useMypymentsByEmail from '../../Hook/useMyMPayments';

const EmployeeClient = ({email}) => {
    const [myclients,refetch]=useMyClientsByEmail(email)
    const AxiosPublic = UseAxiosPublic();
    const [mycampaigns]=useMyCampaingsByEmail(email)
    const [Mypayments]=useMypymentsByEmail(email)
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalRCV, setTotalRCV] = useState(0);
    const [totalbill, setTotalBill] = useState(0);

    const [sortedAdsAccounts, setSortedAdsAccounts] = useState([]);
  
      useEffect(() => {
          if (users && email) {
              const fff = users?.find(u => u.email === email);
              setDdd(fff || {}); 
          }
      }, [users, email]);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState('positive'); 

    useEffect(() => {
      const clientsWithBalance = myclients.map(campaign => {
        const totalSpent = mycampaigns
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
            0
          );
  
        const totalReceived = Mypayments
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0);
  
        const balance = totalReceived - totalSpent;
  
        return { ...campaign, balance }; 
      });
  
      const sortedCampaigns = clientsWithBalance.sort((a, b) => {

        if (a.balance > 0 && b.balance <= 0) return -1;
        if (a.balance <= 0 && b.balance > 0) return 1;
  
        if (a.balance < 0 && b.balance === 0) return -1;
        if (a.balance === 0 && b.balance < 0) return 1;
  
        return 0;
      });
  
      setSortedAdsAccounts(sortedCampaigns);
    }, [myclients, mycampaigns, Mypayments]);
  
    const filteredCampaigns = sortedAdsAccounts.filter(campaign => {
      if (selectedStatus === 'positive') return campaign.balance < 0; 
      if (selectedStatus === 'negative') return campaign.balance > 0; 
      if (selectedStatus === 'neutral') return campaign.balance === 0;
      return selectedStatus === 'all'; // Show all data when status is 'all'
    });
    

    const filteredCampaigns2 = sortedAdsAccounts.filter(campaign => {
       return campaign.balance > 0; 
    });

    const filteredCampaigns3 = sortedAdsAccounts.filter(campaign => {
       return campaign.balance < 0; 
    });


    
  useEffect(() => {
      const totalRcv = Mypayments?.reduce((acc, campaign) => {
        const payment = parseFloat(campaign.amount);
        return acc + (isNaN(payment) ? 0 : payment);
      }, 0);
      setTotalRCV(totalRcv);
  
      const tspent = mycampaigns?.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent),
        0
      );
      setTotalSpent(tspent);
  
      const totalBill = mycampaigns?.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
      );
      setTotalBill(totalBill);
  
    }, [mycampaigns,Mypayments, email]);

    const handleaddblog = (e) => {
      e.preventDefault();
      const clientName = e.target.clientName.value;
      const clientPhone = e.target.clientPhone.value;
      const clientEmail = e.target.clientEmail.value;
      const employeeEmail = email;
      const tBudged = 0;
      const tSpent = 0;
      const tBill = 0;
      const tDue = 0;
      const tPaid = 0;
      const date = new Date();
    
      const data = {
        clientName,
        clientEmail,
        clientPhone,
        tBudged,
        employeeEmail,
        tSpent,
        tBill,
        date,
        tDue,
        tPaid,
      };
    
      AxiosPublic.post("/clients", data)
        .then((res) => {
          refetch();
          document.getElementById("my_modal_2").close()
          console.log(res.data);
        })
    };
    
      const handledelete = (id) => {
        // Show confirmation dialog
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
            // Proceed with delete
            AxiosPublic.delete(`/clients/${id}`)
              .then((res) => {
                refetch();
                toast.success("Delete successful");
              })
              .catch((error) => {
                toast.error("Delete failed");
              });
          }
        });
      };

      const handleUpdate2 = (e, id) => {
        e.preventDefault();
    
        const clientName = e.target.clientName.value;
        const clientPhone = e.target.clientPhone.value;
        const body = { clientName, clientPhone };
    
        AxiosPublic.patch(`/client/update/${id}`, body)
            .then((res) => {
              refetch();
              document.getElementById(`modal_${id}`).close();
            })
            .catch((error) => {
                console.error("Error updating campaign:", error);
                toast.error("Failed to update campaign");
            });
    };
    
    return (
        <div className='mx-5 mt-5'>
           <ToastContainer />
             <div className="overflow-x-auto   ">

             <Helmet>
              <title>{ddd?.name ? `${ddd.name} | Digital Network` : "Digital Network"}</title>
             <link rel="canonical" href="https://www.tacobell.com/" />
            </Helmet>



      <div  style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="grid px-4 pt-4 rounded-md lg:grid-cols-5 grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around lg:py-5 mb-4 pb-5">
    
        <div className="px-5 py-10 rounded-2xl bg-[#90a427] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Spent</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"> $ {totalSpent?.toFixed(2) || 0.00}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Bill</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"><span className='font-extrabold lg:text-4x text-md'> ৳ </span>
          {totalbill?.toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"> <span className='font-extrabold lg:text-4x text-md'> ৳ </span> {totalRCV?.toFixed(2) || 0.00}</p>
        </div>

        {/* <div className="px-5 py-10 rounded-2xl bg-[#1d8b6c] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">Total DUE</h2>
  <p className="lg:text-4xl md:text-3xl text-md font-bold mt-2">
    <span className="font-extrabold text-md"> ৳ </span>
    {
    filteredCampaigns3
      .map(client => {
        // Calculate totalReceived from mycampaigns
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
        return  totalReceivedPayments - totalReceivedCampaigns
      })
      .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
      .toFixed(2)}
  </p>
</div> */}


<div className="px-5 py-10 rounded-2xl bg-[#574d87] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">Total Advanced</h2>
  <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
    <span className="font-extrabold text-md"> ৳ {Math.abs(
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
            return   totalReceivedPayments - totalReceivedCampaigns
          })
          .reduce((total, clientTotal) => total + clientTotal, 0) // Sum up all totals
      ).toFixed(2)} 
    </span> 
  </p>
</div>


      <div className="px-5 py-10 rounded-2xl bg-red-900 text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Due</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"><span className='font-extrabold lg:text-4x text-md'> ৳ </span>
          { totalRCV?.toFixed(0) - totalbill?.toFixed(0) || 0.00}
          </p>
        </div>
      </div>
    


     
      <div className='px-4 pt-4 pb-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="flex flex-col lg:flex-row justify-between items-center">
  <div className="flex justify-between lg:mb-5 items-center w-full lg:w-auto  ">
    <div className="flex lg:justify-center justify-center mb-4 lg:mb-0 text-gray-500 lg:mx-2 pb-1 items-center gap-5">
    <div className='flex justify-center'>
    {
        ddd?.role === 'admin' ? null : (
          <div>
            <button
              className="font-avenir hover:bg-red-700 px-3 text-sm mx-auto py-1.5 bg-[#05a0db] rounded-lg text-white"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              Add Client
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box bg-white text-black font-bold">
                <form onSubmit={handleaddblog}>
                  <div className="mb-4">
                    <h1
                      className="text-black flex hover:text-red-500 justify-end text-end"
                      onClick={() => document.getElementById("my_modal_2").close()}
                    >
                      <ImCross />
                    </h1>
                    <label className="block text-black">Client Name</label>
                    <input
                      id="name"
                      name="clientName"
                      type="text"
                      required
                      className="w-full bg-white border-2 border-black rounded p-2 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-black">Client Phone</label>
                    <input
                      id="clientPhone"
                      name="clientPhone"
                      type="number"
                      required
                      className="w-full bg-white border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-black">Client Email</label>
                    <input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      required
                      className="w-full bg-white border-2 border-black rounded p-2 mt-1"
                    />
                  </div>

                  <div className="grid mt-8 grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById("my_modal_2").close()}
                      className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded text-white"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
        )
      }
     </div>
      <div>
        <Link to={'/dashboard/AddClients'}>
          <button
            className="font-avenir hover:bg-red-700 px-3 mx-auto py-1 bg-[#f89320] rounded-lg text-white"
          >
            Client Access
          </button>
        </Link>
      </div>
    </div>
  </div>



<div className='flex mb-5 lg:mb-5 gap-3 justify-end items-center'>

<div className="">
        <select
          name="status"
          className="bg-transparent bg-gray-200 border border-black text-black text-sm py-2 px-3 rounded-md focus:outline-none  focus:border-blue-500 group-hover:bg-white group-hover:border-gray-700 group-hover:text-black"
          style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
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


<div  className="overflow-x-auto rounded-xl  text-center " style={{ }}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{backgroundColor: 'var(--bg-color)' ,border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
<th className="p-3 text-center">SL</th>
<th className="p-3 text-center">Client Name</th>
<th className="p-3 text-center">Client Phone</th>
<th className="p-3 text-center">T.Budget</th>
<th className="p-3 text-center">T.Spent</th>
<th className="p-3 text-center">Total Bill</th>
<th className="p-3 text-center">Payment Rcv</th>
<th className="p-3 text-center">Total Due</th>
<th className="p-3">Action</th>
</tr>
</thead>
<tbody>
{filteredCampaigns.map((campaign, index) => (
  <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                  key={campaign._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-black border-b border-opacity-20"
                      : "bg-gray-200  text-left text-black border-b border-opacity-20"
                  }`}
                >
  <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 border-l text-center ">{index + 1}</td>

  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2  hover:font-bold text-start border-gray-300 ">
  <Link to={`/dashboard/client/${campaign.clientEmail}`} className="flex justify-start items-center">
    {campaign.clientName}
    {
      (() => {
        const balance = (
          (
            mycampaigns
              .filter(payment => payment.clientEmail === campaign.clientEmail)
              .reduce(
                (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
                0
              )
          ) -
          (
            Mypayments
              .filter(payment => payment.clientEmail === campaign.clientEmail)
              .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
          )
        ).toFixed(2);

        if (balance > 0) {
          return <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">Due</span>;
        } else if (balance < 0) {
          return <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">Advance</span>;
        } else {
          return <span className="ml-2 px-2 py-1 bg-blue-200 text-green-600 text-xs font-semibold rounded-full">Clear</span>
        }
      })()
    }
  </Link>
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

  {
  (
    mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2) 
  ) 
}

</td>
<td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">

৳ 
  {
  (
    mycampaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
           ).toFixed(2)
   )
}

</td>
<td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">

  ৳ 
  {
  (
    Mypayments
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2) 
  ) 
}
</td>

<td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">
  ৳
  {
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
    ).toFixed(2)
  }
</td>



  <td style={{  border: 'var(--border)'}} className="p-3 border-r text-center border-gray-400">
  <div className="flex justify-center  items-center gap-3">
  <div>
  <button
 className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
    onClick={() =>
      document.getElementById(`modal_${campaign._id}`).showModal()
    }
  >
    Edit
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

                      <button
                           className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          onClick={() => handledelete(campaign._id)}
                        >
                          <ToastContainer></ToastContainer>
                          Delete
                        </button>
                      </div>

  </td>
</tr>
))}

      <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className=''>
      <td className="p-3"></td>
      <td className="p-3"></td>
        <td className="p-3 text-center font-bold">Total</td>
       
        
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
    .toFixed(2)}
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
    .toFixed(2)} 
</td>

<td className="p-3 text-center font-bold">
  ৳ 
  {(

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
  ).toFixed(2)}
</td>


        <td className="p-3"></td>
      </tr>
 
</tbody>
</table>

  </div>
  </div>

        </div>
  
        </div>
    );
};

export default EmployeeClient;