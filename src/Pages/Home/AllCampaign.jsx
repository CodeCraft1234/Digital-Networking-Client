import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import useCampaings from "../../Hook/useCampaign";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaEdit } from "react-icons/fa";

const Campaigns = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState([]);
  const [clients] = useClients();
  const [campaigns,refetch]=useCampaings()
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employees = users.filter(u => u.role === 'employee');
      setDdd(employees);
    }
  }, [users, user]);

  useEffect(() => {
    if (campaigns) {
      setFilteredClients(campaigns);
    }
  }, [campaigns]);

  const handleSort = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const filtered = campaigns.filter(c => c.status === email);
    setFilteredClients(filtered);
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;


  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  console.log(totalSpent, totalBudged, totalRCV, totalbill);

  useEffect(() => {


    const totalRcv = filteredByCategory.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);
    }, 0);
    setTotalRCV(totalRcv);

    const tspent = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(tspent);

    const total = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);

    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBill),
      0
    );
    setTotalBill(totalBill);

  }, [filteredByCategory]);


  const AxiosPublic =UseAxiosPublic()
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete blog",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/campaigns/${id}`)
        .then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    if (activeDropdown === orderId) {
        setActiveDropdown(null);
    } else {
        setActiveDropdown(orderId);
    }
};


  return (
    <div className="mt-24">
      <Helmet>
              <title> Digital Network | All Campaign</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
<div className="flex justify-between items-center ">
<form className="flex justify-center items-center" onSubmit={handleSort}>
        <div className="mb-4 ml-10 mx-auto">
          <label className="block text-gray-700">Sort By Status</label>
          <select name="email" className="border rounded p-2 mt-1">
          <option disabled value="">Status</option>
            <option  value='Active'>Active</option>
            <option  value='Complete'>Complete</option>
            <option  value='In Review'>In Review</option>
          </select>
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
      </form>
      <div className="flex justify-end ">
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




      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto border-2 border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center">SL</th>
                <th className="p-3 text-center">Campaign Name</th>
                <th className="p-3 text-center">Total Budged</th>
                <th className="p-3 text-center">Total spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Date</th>
              
              </tr>
            </thead>
            <tbody>
  {filteredByCategory.map((campaign, index) => (
    <tr
      key={campaign._id}
      className={`${
        index % 2 === 0
          ? "bg-white text-gray-500 border-b border-opacity-20"
          : "bg-gray-200 text-gray-500 border-b border-opacity-20"
      }`}
    >
      <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">{index + 1}</td>


      <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                   
                   <div className="">
                   <Link to={`/client/${campaign.clientEmail}`} className="">
        {campaign.campaignName}
        </Link>
                  <div className="flex justify-start gap-3">
                  <button
   className="text-blue-600"
  
 >
   Edit
 </button>
                   <button
                     className="text-start flex justify-start text-red-600"
                     onClick={() => handledelete(campaign._id)}
                   >
                     Delete
                   </button>
                  </div>
                   </div>
             </td>

             <td className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                    <h1>$ {campaign.tBudged}</h1>
                    <button
    className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    onClick={() => document.getElementById(`my_modal_1`).showModal()}
  >
   <FaEdit />
  </button>
  
  <dialog id={`my_modal_1`} className="modal">
    <div className="modal-box">
      <input
        type="number"
        name="currentBallence"
        step="0.01"
        defaultValue={campaign.tBudged}
        className="w-full border rounded p-2 mt-1 text-gray-500"
      />
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    </div>
  </dialog>
                    </div>
            </td>
             <td className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                    <h1>$ {campaign.tSpent}</h1>
                    <button
    className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    onClick={() => document.getElementById(`my_modal_2`).showModal()}
  >
   <FaEdit />
  </button>
  
  <dialog id={`my_modal_2`} className="modal">
    <div className="modal-box">
      <input
        type="number"
        name="currentBallence"
        step="0.01"
        defaultValue={campaign.tSpent}
        className="w-full border rounded p-2 mt-1 text-gray-500"
      />
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    </div>
  </dialog>
                    </div>
            </td>


      <td className="p-3 border-r-2 border-gray-300 text-center">{campaign.status}</td>
      <td className="p-3 border-l-2 border-r-2 border-gray-300 ">{campaign.date}</td>
 

     
    </tr>
  ))}
  <tr className="bg-green-800 text-sm text-white font-bold">
    <td className="p-3 border-2 border-black text-right" colSpan="1">
      Total :
    </td>
    <td className="p-3 border-2 border-black text-center">$ {totalBudged}</td>
    <td className="p-3 border-2 border-black text-center">$ {totalSpent}</td> 
    <td className="p-3 border-2 border-black text-center"></td> 
    <td className="p-3 border-2 border-black text-center"></td> 

  </tr>
</tbody>

          </table>
          
        </div>
      </div>
      
    </div>
  );
};

export default Campaigns;