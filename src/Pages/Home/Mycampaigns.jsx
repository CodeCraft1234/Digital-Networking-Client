import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useCampaings from "../../Hook/useCampaign";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";

const MyCampaigns = () => {
  const { user } = useContext(AuthContext);
  const [clients] = useClients();
  const [campaigns, refetch] = useCampaings();
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [client, setClient] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  useEffect(() => {
    if (clients.length && user?.email) {
      const filtered = clients.filter(campaign => campaign.employeeEmail === user.email);
      setClient(filtered);
    }
  }, [clients, user?.email]);
  
  // useEffect to filter campaigns based on user email
  useEffect(() => {
    if (campaigns.length && user?.email) {
      const filtered = campaigns.filter(c => c?.email === user.email);
      setFilteredClients(filtered);
    }
  }, [campaigns, user?.email]);
  
  // Sorting campaigns based on client email
  const handleSort = (email) => {
    if (!email) {
      setFilteredClients(campaigns); // Reset to all campaigns
    } else {
      const filtered = campaigns.filter(c => c.clientEmail === email);
      setFilteredClients(filtered);
    }
  };
  
  // Filter campaigns based on search query
  const filteredItems = filteredClients.filter(item =>
    item?._id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter by category if selected
  const filteredByCategory = selectedCategory
    ? filteredItems.filter(item =>
        item?.campaignName.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;
  
  // useEffect to calculate total spent and budged
  useEffect(() => {
    if (filteredByCategory.length) {
      const totals = filteredByCategory.reduce(
        (acc, { tSpent, tBudged }) => ({
          spent: acc.spent + parseFloat(tSpent),
          budged: acc.budged + parseFloat(tBudged),
        }),
        { spent: 0, budged: 0 }
      );
      setTotalSpent(totals.spent);
      setTotalBudged(totals.budged);
    }
  }, [filteredByCategory]);
  
  // Sort campaigns by name
  const sortedAdsAccounts = filteredByCategory?.sort((a, b) =>
    a.campaignName?.localeCompare(b.campaignName)
  );
  

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const tSpent = e.target.totalSpent.value;
    const dollerRate = e.target.dollerRate.value;
    const campaignName= e.target.campaignName.value;
    const tBudged = e.target.tBudged.value;
    const body = { tSpent, dollerRate, tBudged,campaignName };

    AxiosPublic.patch(`/campaings/${id}`,
      body
    )
      .then((res) => {
        refetch();
        document.getElementById(`modal_${id}`).close()
        toast.success(`Campaign updated successfully`);
      })
  };
 
  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };

    AxiosPublic.patch(`/campaings/status/${id}`, body)
      .then((res) => {
        refetch();
        toast.success(`Campaign updated successfully`);
      })
  };

  const AxiosPublic =UseAxiosPublic()
  const handledelete = (id) => {
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
        AxiosPublic.delete(`/campaigns/${id}`)
          .then((res) => {
            refetch();
            toast.success("Campaign deleted successfully");
          })
      }
    });
  };

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
                          document.getElementById(`modal_${campaign._id}`).showModal()
                        }
                      >
                        Edit
                      </button>
                      <dialog id={`modal_${campaign._id}`} className="modal">
  <div className="modal-box bg-white text-black">
    <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
    <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => document.getElementById(`modal_${campaign._id}`).close()}
           >
            <ImCross />
           </h1>
           <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Campaign Name</label>
        <input
          type="text"
          name="campaignName"
          defaultValue={campaign.campaignName}
       
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
     



      <div className="modal-action grid grid-cols-2 gap-3 mt-8">
      <button
          type="button"
          className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white"
          onClick={() =>
            document.getElementById(`modal_${campaign._id}`).close()
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