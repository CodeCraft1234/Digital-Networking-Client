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
import axios from "axios";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";

const MyCampaigns = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState([]);
  const [clients] = useClients();
  const [campaigns,refetch]=useCampaings()
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);
  const [client,setClient]=useState([])

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.employeeEmail === user?.email
    );
    console.log(filtered);
    setClient(filtered)

  }, [clients, user?.email]);

  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employees = users.filter(u => u.role === 'employee');
      setDdd(employees);
    }
  }, [users, user]);


  useEffect(() => {
    const filtered=campaigns.filter(c=>c?.email === user?.email )
    if (filtered) {
      setFilteredClients(filtered);
      console.log(filtered);
    }
  }, [campaigns,user?.email]);
  console.log(campaigns);


  const handleSort = (email) => {
    if (!email) {
      // If "All Clients" is selected (email is empty), show all campaigns
      setFilteredClients(campaigns);
    } else {
      // Filter campaigns by the selected client's email
      const filtered = campaigns.filter((c) => c.clientEmail === email);
      setFilteredClients(filtered);
    }
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item?._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item?.campaignName.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;


   

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


  const handleUpdate = (e, id) => {
    e.preventDefault();
    const tSpent = e.target.totalSpent.value;
    const dollerRate = e.target.dollerRate.value;
    const tBudged = e.target.tBudged.value;
    const body = { tSpent, dollerRate, tBudged };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/campaings/${id}`,
      body
    )
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
 


  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };

    AxiosPublic.patch(`https://digital-networking-server.vercel.app/campaings/status/${id}`, body)
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

  const AxiosPublic =UseAxiosPublic()
  const handledelete = (id) => {
        AxiosPublic.delete(`/campaigns/${id}`)
        .then((res) => {
          refetch();
          toast.success("campaign delete successful");
        });

    }


    const sortedAdsAccounts = filteredByCategory?.sort((a, b) => {
      return a.campaignName?.localeCompare(b.campaignName);
    });

    
  return (
    <div className="lg:mt-5 mt-5 mb-10 mx-5">
      <Helmet>
        <title>My Campaign | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="flex flex-col mb-0 lg:mb-5 sm:flex-row justify-between items-center gap-5">
  <form
    className="flex justify-center items-center w-full sm:w-auto"
    onSubmit={(e) => {
      e.preventDefault();
      handleSort(e.target.email.value); // Pass the selected email directly
    }}
  >
    <div className=" sm:mb-0 mx-auto w-full sm:w-auto">
      <select
        name="email"
        className="border border-gray-700 text-black bg-white rounded p-1.5 mt-1 w-full sm:w-auto"
        onChange={(e) => {
          handleSort(e.target.value); // Trigger the sort function on selection change
        }}
      >
        <option disabled selected value="">
          All Clients
        </option>
        {client.map((d) => (
          <option key={d._id} value={d.clientEmail}>
            {d.clientName}
          </option>
        ))}
      </select>
    </div>
  </form>

  <div className="flex justify-end w-full mb-5 lg:mb-0 sm:w-auto">
    <input
      type="text"
      placeholder="Search Campaign Name..."
      className="rounded-lg placeholder-black border border-black p-2 text-black text-sm bg-white w-full sm:w-auto"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>





      <div className="mb-5">
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 text-center  border-gray-300">OFF/ON</th>
                {/* <th className="p-3 text-center border-2 border-gray-300">SL</th> */}
                <th className="p-3 text-center  border-gray-300">Date</th>
                <th className="p-3 text-center  border-gray-300">Campaign Name</th>
                <th className="p-3 text-center  border-gray-300">Client Name</th>
                <th className="p-3 text-center  border-gray-300">Page Name</th>
                <th className="p-3 text-center  border-gray-300">Total Budged</th>
                <th className="p-3 text-center  border-gray-300">Total spent</th>
                <th className="p-3 text-center  border-gray-300">Status</th>
                <th className="p-3 text-center  border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
  {sortedAdsAccounts.map((campaign, index) => (
    <tr
      key={campaign._id}
      className={`${
        index % 2 === 0
          ? "bg-white text-black border-b border-opacity-20"
          : "bg-gray-200 text-black border-b border-opacity-20"
      }`}
    >
      
      <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={campaign.status === "Active"}
    onChange={() => {
      const newStatus = campaign.status === "Active" ? "Complete" : "Active";
      handleUpdate2(campaign._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      campaign.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        campaign.status === "Active" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
</td>
      {/* <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td> */}
      <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
  {new Date(campaign.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })}
</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">
        
        {campaign.campaignName}
        

      </td>
      <td className="p-3 border-r-2 border-gray-300 text-center">
       <Link to={`/dashboard/client/${campaign.clientEmail}`}>
       {campaign.pageName}
       </Link>
       
      </td>        
      <td className="p-3 border-r-2 border-gray-300 text-center">
     
        {campaign.clientName}
      
      </td>        
      <td className="p-3 border-r-2 border-gray-300 text-center">
     
      $ {campaign.tBudged}
      
      </td>        
      {/* <td className="p-3 border-r-2 border-gray-300 text-center">
        <div className="relative group flex items-center justify-center">
          <h1>$ {campaign.tBudged}</h1>
          <button
            className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleOpenBudgetModal}
          >
            <FaEdit />
          </button>

          {isBudgetModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <form
                  onSubmit={(e) => {
                    handleUpdateTotalBudget(e, campaign._id);
                    handleCancel();
                  }}
                >
                  <label className="block text-sm font-bold mb-2">Lifetime</label>
                  <input
                    type="number"
                    name="tBudged"
                    step="0.01"
                    defaultValue={campaign.tBudged}
                    className="w-full border rounded p-2 mb-4 text-gray-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-3 py-1 rounded text-white bg-red-800"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded text-white bg-green-800"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </td> */}

      <td className="p-3 border-r-2 border-gray-300 text-center">
       
      $ {campaign.tSpent}
     </td>    

      {/* <td className="p-3 border-r-2 border-gray-300 text-center">
        <div className="relative group flex items-center justify-center">
          <h1></h1>
          <button
            className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleOpenSpentModal}
          >
            <FaEdit />
          </button>

          {isSpentModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <form
                  onSubmit={(e) => {
                    handleUpdateTotalSpent(e, campaign._id);
                    handleCancel();
                  }}
                >
                  <label className="block text-sm font-bold mb-2">Lifetime</label>
                  <input
                    type="number"
                    name="tSpent"
                    step="0.01"
                    defaultValue={campaign.tSpent}
                    className="w-full border rounded p-2 mb-4 text-gray-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-3 py-1 rounded text-white bg-red-800"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded text-white bg-green-800"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </td> */}
     <td
  className={`p-3 text-center ${
    campaign.status === "Active" ? "text-green-800 font-bold" : "text-black font-bold"
  }`}
>
  {campaign.status}
</td>






      <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
      <div className="flex justify-center gap-3">
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
    <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
    <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => document.getElementById(`modal_${index}`).close()}
           >
            <ImCross />
           </h1>
           <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Campaign Name</label>
        <input
          type="text"
          name="campaignName"
          defaultValue={campaign.campaignName}
          disabled
       
          className="w-full bg-white  border-gray-700 border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Budged</label>
        <input
          type="number"
          name="tBudged"
          defaultValue={campaign.tBudged}
          step="0.01"
          className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
        />
      </div>
      

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Spent</label>
        <input
          type="number"
          name="totalSpent"
          defaultValue={campaign.tSpent}
          step="0.01"
          className="w-full bg-white border  border-gray-700 rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Dollars Rate</label>
        <input
          step="0.01"
          type="number"
          name="dollerRate"
          defaultValue={campaign.dollerRate}
          className="w-full bg-white border  border-gray-700 rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Status</label>
        <input
          
          type="text"
          name="status"
          disabled
          defaultValue={campaign.status}
          className="w-full bg-white border  border-gray-700 rounded p-2 mt-1"
        />
      </div>



      <div className="modal-action grid grid-cols-2 gap-3 mt-8">
      <button
          type="button"
          className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white"
          onClick={() =>
            document.getElementById(`modal_${index}`).close()
          }
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
                          Delete
                        </button>
                      </div>
</td>
    </tr>
  ))}
  <tr className="bg-[#05a0db] text-sm text-white font-bold">
    <td className="p-3  border-gray-300 text-right" colSpan="5">
      Total :
    </td>
    <td className="p-3  border-gray-300 text-center">$ {totalBudged}</td>
    <td className="p-3  border-gray-300 text-center">$ {totalSpent}</td> 
    <td className="p-3  border-gray-300 text-start"></td> 
    <td className="p-3  border-gray-300 text-start"></td> 


  </tr>
</tbody>
          </table>  
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;