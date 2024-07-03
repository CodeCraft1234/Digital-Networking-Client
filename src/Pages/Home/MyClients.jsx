import React, { useContext, useEffect, useState } from 'react';
import useClients from '../../Hook/useClient';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUsers from '../../Hook/useUsers';
import { IoIosSearch } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const MyClients = () => {
    const { user }=useContext(AuthContext)
    const [clients, refetch] = useClients();
    const AxiosPublic = UseAxiosPublic();
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  
  
  
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
      const date = new Date()
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
      console.log(data);
  
      AxiosPublic.post("https://digital-networking-server.vercel.app/clients", data)
      .then((res) => {
        // toast.success("Client Added successfully");
        console.log(res.data);
        refetch();
        Swal.fire({
            icon: "success",
            title: "success",
            text: "Client add successfully",
          });
        toast.success("");
        
    })
    .catch(error => {
        console.error("Error adding client:", error);
        // toast.error("Failed to update campaign");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add client!",
        });
   
     })
     
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
      item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const filteredByCategory = selectedCategory
      ? filteredItems.filter(
          (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : filteredItems;
  
  
      const handleUpdate = (e, id) => {
        e.preventDefault();
      
        const clientName = e.target.clientName.value;
        const clientPhone = e.target.clientPhone.value;
        const data = { clientName, clientPhone };
      
        AxiosPublic.patch(`https://digital-networking-server.vercel.app/clients/${id}`, data)
          .then(res => {
            console.log(res.data);
            refetch(); // Ensure this function is defined and correct
            toast.success("Client updated successfully");
          })
          .catch(error => {
            console.error("Error updating client:", error);
            toast.error("Failed to update client");
          });
      };
  
  
  
  
    return (
        <div>
             <div className="overflow-x-auto ml-4  mt-28">

        
<div className="flex justify-between items-center ">

<div className="flex justify-start mb-5 text-gray-500 border-b border-opacity-20 mx-2 pb-1 items-center gap-3">
{
  ddd?.role === 'admin' ? <></> : <div>
  <button
    className="font-avenir px-3 mx-auto py-1 bg-green-800 ml-5 rounded-lg text-white"
    onClick={() => document.getElementById("my_modal_2").showModal()}
  >
    Add Client
  </button>
  <dialog id="my_modal_2" className="modal">
    <div className="modal-box text-black font-bold">
      <form o onSubmit={handleaddblog}>
        <div className="flex justify-center items-center gap-3">
          <div className="mb-4">
            <label className="block text-black">Client Name</label>
            <input
              id="name"
              name="clientName"
              type="text"
              required
              className="w-full border-2 border-black rounded p-2 mt-1 "
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div className="mb-4">
            <label className="block text-black">Client Phone</label>
            <input
              id="clientPhone"
              name="clientPhone"
              type="number"
              required
              className="w-full  border-2 border-black rounded p-2 mt-1 "
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Client Email</label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required

              className="w-full  border-2 border-black rounded p-2 mt-1 "
            />
          </div>
        </div>
        <button type="submit" className="font-avenir  flex justify-center px-3 mx-auto py-1 bg-green-800 rounded text-white">
          Submit
        </button>
      </form>
      <div className="modal-action flex justify-end">
        <form method="dialog">
          <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</div>

}
 
</div>
<div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder=" Client Phone Number"
            className=" rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className=" w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
          >
            <IoIosSearch className="mx-auto font-bold w-6 h-6" />
          </button>
</div>
</div>


<table className="min-w-full bg-white">
<thead className="bg-red-800 text-white">
<tr>
<th className="p-3 text-center">SL</th>
<th className="p-3 text-center">Client Name</th>
<th className="p-3 text-center">Client Phone</th>
{/* <th className="p-3 text-center">Client Email</th> */}
<th className="p-3 text-center">T.Budget</th>
<th className="p-3 text-center">T.Spent</th>
<th className="p-3 text-center">Total Bill</th>
<th className="p-3 text-center">Total Payment Rcv</th>
<th className="p-3">Edit</th>
</tr>
</thead>
<tbody>
{filteredByCategory.map((campaign, index) => (
<tr
  key={campaign._id}
  className={`${
    index % 2 === 0
      ? "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
      : "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
  }`}
>
  <td className="p-3 border-r border-gray-400 border-l text-center">{index + 1}</td>

  <Link to={`/dashboard/client/${campaign.clientEmail}`}>
    <td className="p-3 border-r border-gray-400 flex justify-center text-center">{campaign.clientName}</td>
  </Link>
  <td className="p-3 border-r border-gray-400 text-center">{campaign.clientPhone}</td>
  <td className="p-3 border-r border-gray-400 text-center">$ {campaign.tBudged}</td>
  <td className="p-3 border-r border-gray-400 text-center">$ {campaign.tSpent}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {campaign.tBill}</td>
  <td className="p-3 border-r border-gray-400 text-center">৳ {campaign.tPayment}</td>
  <td className="p-3 border-r border-gray-400">

  <button
      className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_7").showModal()}
    >
      Edit
    </button>
    <dialog id="my_modal_7" className="modal">
      <div className="modal-box">
        <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
          <div className="flex justify-center items-center gap-3">
            <div className="mb-4">
              <label className="block text-gray-250">
                Client Name
              </label>
              <input
                required
                type="text"
                defaultValue={campaign.clientName}
                name="clientName"
                placeholder="type here...."
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-250">Client Phone</label>
              <input
              required
                type="number"
                name="clientPhone"
                defaultValue={campaign.clientPhone}
                placeholder="type here...."
                className="w-full border rounded p-2 mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800"
          >
            Update
          </button>
        </form>
        <div className="modal-action">
          <form method="dialog">
            <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </td>
</tr>
))}
<tr className="bg-green-800 text-sm text-white font-bold">
<td className="p-3 text-center"></td>

<td className="p-3 border-r border-gray-400 text-right" colSpan="2">
  Total :
</td>
<td className="p-3 border-r border-gray-400 text-center">$ {totalBudged}</td>
<td className="p-3 border-r border-gray-400 text-center">$ {totalSpent}</td>
<td className="p-3 border-r border-gray-400 text-center">৳ {totalbill}</td>
<td className="p-3 border-r border-gray-400 text-center">৳ {totalRCV}</td>
<td className="p-3 border-r border-gray-400"></td>
</tr>
</tbody>
</table>

  </div>
        </div>
    );
};

export default MyClients;