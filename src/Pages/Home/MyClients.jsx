import { useContext, useEffect, useState } from 'react';
import useClients from '../../Hook/useClient';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUsers from '../../Hook/useUsers';
import { Link, } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import useCampaings from '../../Hook/useCampaign';
import useMpayment from '../../Hook/UseMpayment';

const MyClients = () => {
    const { user }=useContext(AuthContext)
    const [clients, refetch] = useClients();
    const AxiosPublic = UseAxiosPublic();
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [campaigns]=useCampaings()
    const [Mpayment]=useMpayment()
  
  
  
      const [users] = useUsers();
      const [ddd, setDdd] = useState(null);
  
      useEffect(() => {
          if (users && user) {
              const fff = users.find(u => u.email === user?.email);
              console.log(fff);
              setDdd(fff || {}); // Update state with found user or an empty object
          }
      }, [users, user]);
  
     
  
  
     
   
  
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalBudged, setTotalBudged] = useState(0);
    const [totalRCV, setTotalRCV] = useState(0);
    const [totalbill, setTotalBill] = useState(0);
    const totalDue = totalbill - totalRCV;
  

  
    useEffect(() => {
      const filtered = clients.filter(
        (campaign) => campaign.employeeEmail === user?.email
      );
      console.log(filtered);
  
      const totalRcv = filtered.reduce((acc, campaign) => {
        const payment = parseFloat(campaign.tPayment);
        return acc + (isNaN(payment) ? 0 : payment);
      }, 0);
      setTotalRCV(totalRcv);
  
      const tspent = filtered.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent),
        0
      );
      setTotalSpent(tspent);
  
      const total = filtered.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tBudged),
        0
      );
      setTotalBudged(total);
  
      const totalBill = filtered.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tBill),
        0
      );
      setTotalBill(totalBill);
  
      setFilteredCampaigns(filtered);
    }, [clients, user?.email]);
  
  
    const handleaddblog = (e) => {
      e.preventDefault();
      const clientName = e.target.clientName.value;
      const clientPhone = e.target.clientPhone.value;
      const clientEmail = e.target.clientEmail.value;
      const employeeEmail = user?.email;
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
    
      AxiosPublic.post("https://digital-networking-server.vercel.app/clients", data)
        .then((res) => {
          refetch();
          window.location.reload();
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            alert("Client with the same email or phone number already exists.");
          } else {
            console.error("Error adding client:", error);
          }
        });
    };
    


    const [bkashMarcent,setBkashMarcentTotal]=useState(0)
    const [nagadPersonal,setNagadPersonalTotal]=useState(0)
    const [bkashPersonal,setBkashPersonalTotal]=useState(0)
    const [rocketPersonal,setRocketPersonalTotal]=useState(0)
    console.log(bkashMarcent,rocketPersonal,nagadPersonal,bkashPersonal)
  
    useEffect(()=>{
        AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
        .then(res => {
            console.log('sdjkhagjijkhgjkhdsajljkhgdsjkajkjkfjldfgjkgjkgd',res.data);
            const da=res.data
            const filtered=da.filter(f=> f.employeeEmail === user?.email) 
  
            const filter2=filtered.filter(d=>d.paymentMethod === 'bkashMarchent')
            const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
            setBkashMarcentTotal(total)
  
            const filter3=filtered.filter(d=>d.paymentMethod === 'nagadPersonal')
            const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
            setNagadPersonalTotal(total3)
  
            const filter4=filtered.filter(d=>d.paymentMethod === 'bkashPersonal')
            const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
            setBkashPersonalTotal(total4)
  
            const filter5=filtered.filter(d=>d.paymentMethod === 'rocketPersonal')
            const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
            setRocketPersonalTotal(total5)
        })
    },[user?.email])
  
    
  
  
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
  
    const filteredItems = filteredCampaigns.filter((item) =>
      item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  
    const filteredByCategory = selectedCategory
      ? filteredItems.filter(
          (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : filteredItems;
  
  
  
      const handledelete = (id) => {
        AxiosPublic.delete(`/clients/${id}`).then((res) => {
          refetch();
          toast.success("delete successful");
        });

     }
       const handleUpdate2 = (e, id) => {
        e.preventDefault();
        const clientName = e.target.clientName.value;
        const clientPhone = e.target.clientPhone.value;
        const clientEmail = e.target.clientEmail.value;
        const body = { clientName, clientEmail,  clientPhone };
    
        AxiosPublic.patch(
          `https://digital-networking-server.vercel.app/client/update/${id}`,
          body
        )
          .then((res) => {
            refetch();
            toast.success("client updated successfully");
          })
          .catch((error) => {
            console.error("Error updating campaign:", error);
            toast.error("Failed to update campaign");
          });
      };
     
      const sortedAdsAccounts = filteredByCategory.sort((a, b) => {
        return a.clientName.localeCompare(b.clientName);
      });


      
    return (
        <div className='mx-5 mt-5'>
           <ToastContainer />
             <div className="overflow-x-auto   ">

      <Helmet>
        <title> My Client | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>



      <div className="grid lg:grid-cols-4 grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around lg:py-5 pb-5">
        <div className="px-5 py-10 rounded-2xl bg-[#b7cc50] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Spent</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"> $ {totalSpent.toFixed(2) || 0.00}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Bill</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"><span className='font-extrabold lg:text-4x text-md'> ৳ </span>
          {totalbill.toFixed(2)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2"> <span className='font-extrabold lg:text-4x text-md'> ৳ </span> {totalRCV.toFixed(2) || 0.00}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total DUE</h2>
          <p className="lg:text-4x md:text-3xl text-md font-bold mt-2">
          <span className='font-extrabold text-md'> ৳ </span>{totalDue.toFixed(2) || 0.00} 
          </p>
        </div>
      </div>


     

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

  <div className="w-full lg:w-auto">
    <input
      type="text"
      placeholder="Search ...."
      className="rounded-lg w-full mb-5 lg:mb-5 placeholder-black border border-gray-700 p-2 font-bold text-black text-sm bg-white"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>


<div className="overflow-x-auto text-black mb-5 rounded-lg border-black">
<table className="min-w-full rounded-xl">
<thead className="bg-[#05a0db] text-white">
<tr>
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
{sortedAdsAccounts.map((campaign, index) => (
<tr
  key={campaign._id}
  className={`${
    index % 2 === 0
      ? "text-black border-b border-opacity-20 hover:text-blue-600"
      : "text-black border-b border-opacity-20 hover:text-blue-600"
  }`}
>
  <td className="p-3 border-r border-gray-400 border-l text-center ">{index + 1}</td>

  <td className="p-3 border-r border-gray-400 flex hover:font-bold hover:text-blue-700 justify-start text-start">
  <Link to={`/dashboard/client/${campaign.clientEmail}`} className="w-full">

   
    <h1 className='text-black'>
      {campaigns.filter(ca => ca.clientEmail === campaign.clientEmail && ca.status === 'Active').length > 0 
        ?   <div className='flex justify-start items-center gap-2'> <div >
       
       <span> {campaign.clientName}</span>
        </div>
        <span><img className='h-5 w-5   rounded-full' src="https://i.ibb.co/C6CGqfk/check-512.webp" alt="" /></span>

  </div> 
        :   <span className='flex justify-start gap-2'> {campaign.clientName}</span>
      }
    </h1>
  </Link>
</td>


  
  <td className="p-3 border-r border-gray-400 text-start">
    {campaign.clientPhone}
    </td>
<td className="p-3 border-r border-gray-400 text-center">
  $ {Number(campaign.tBudged).toFixed(2)} 
{/* || 
{
  (
    campaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.tBudged || 0), 0) 
  ) 
} */}

</td>
<td className="p-3 border-r border-gray-400 text-center">

  {/* $ {Number(campaign.tSpent).toFixed(2)}
 */}

  {
  (
    campaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2) 
  ) 
}

</td>
<td className="p-3 border-r border-gray-400 text-center">
  {/* ৳ {Number(campaign.tBill).toFixed(2) || 0.00}

  ------------ */}

৳ 
  {
  (
    campaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
           ).toFixed(2)
   )
}

</td>
<td className="p-3 border-r border-gray-400 text-center">
  {/* ৳ {Number(campaign.tPayment || 0).toFixed(2) || '0.00'}
  ------- */}
  ৳ 
  {
  (
    Mpayment
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2) 
  ) 
}
</td>

<td className="p-3 border-r border-gray-400 text-center">
  ৳
  {
    (
      (
        campaigns
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
            0
          )
      )
      -
      (
        Mpayment
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
      )
    ).toFixed(2)
  }
</td>



  <td className="p-3 border-r text-center border-gray-400">
  <div className="flex justify-center  items-center gap-3">
  <div>
  <button
 className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
    onClick={() =>
      document.getElementById(`modal_${index}`).showModal()
    }
  >
    Edit
  </button>

  <dialog id={`modal_${index}`} className="modal">
    <div className="modal-box bg-white text-black">
      <form onSubmit={(e) => handleUpdate2(e, campaign._id)}>
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
              document.getElementById(`modal_${index}`).close()
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

      <tr className='bg-[#05a0db] text-white'>
        <td className="p-3 text-center font-bold">Total</td>
        <td className="p-3"></td>
        <td className="p-3"></td>
        <td className="p-3 text-center font-bold">
          $ {sortedAdsAccounts.reduce((acc, campaign) => acc + parseFloat(campaign.tBudged || 0), 0).toFixed(2)}
        </td>
        <td className="p-3 text-center font-bold">
          {sortedAdsAccounts.reduce((acc, campaign) => acc + campaigns
            .filter(payment => payment.clientEmail === campaign.clientEmail)
            .reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0), 0).toFixed(2)}
        </td>
        <td className="p-3 text-center font-bold">
          ৳ {sortedAdsAccounts.reduce((acc, campaign) => acc + campaigns
            .filter(payment =>  payment.email === user?.email)
            .reduce(
              (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
              0
            ), 0).toFixed(2)}
        </td>
        <td className="p-3 text-center font-bold">
          ৳ { Mpayment
            .filter(payment => payment.employeeEmail === user?.email)
            .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2)
            }
        </td>
        <td className="p-3 text-center font-bold">
  ৳ {(
    sortedAdsAccounts.reduce((acc, campaign) => 
      acc + campaigns
        .filter(payment => payment.email === user?.email)
        .reduce(
          (innerAcc, campaign) => innerAcc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
          0
        ),
      0
    ) - 
    Mpayment
      .filter(payment => payment.employeeEmail === user?.email)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
  ).toFixed(2)}
</td>



        <td className="p-3"></td>
      </tr>
 
</tbody>
</table>

  </div>
  </div>
  
        </div>
    );
};

export default MyClients;