import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useCampaings from "../../Hook/useCampaign";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const Campaigns = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [clients] = useClients();
  const [campaigns, refetch] = useCampaings();
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClientt, setSelectedClientt] = useState("");
  const initialTab = localStorage.getItem("activeTaballcampaignClient") ;
  const [selectedClient, setSelectedClient] = useState(initialTab);
  

  const changeTab = (tab) => {
    setSelectedClient(tab);
    localStorage.setItem("activeTaballcampaignClient", tab); 
  };

  const initialTab2 = localStorage.getItem("activeTaballcampaignmonthsss") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || '' );
  

  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballcampaignmonthsss", tab); 
  };
  
  useEffect(() => {
    let filtered = campaigns;

    const currentMonth = new Date().getMonth() + 1;
    if (!sortMonth) {
      setSortMonth(currentMonth.toString());
    }
    if (sortMonth !== "") {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedClient) {
      filtered = filtered.filter((c) => c.email === selectedClient);
    }

    if (selectedClientt) {
      filtered = filtered.filter((c) => c.clientEmail === selectedClientt);
    }

    setFilteredClients(filtered);
  }, [sortMonth,  selectedClient, selectedClientt, campaigns]);

  const handleSort = (e) => {
    e.preventDefault();
    const status = e.target.status.value;
    const filtered = campaigns.filter((c) => c.status === status);
    setFilteredClients(filtered);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredByCategory = filteredClients.filter((item) =>
    item.campaignName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);

  useEffect(() => {
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
  }, [filteredByCategory]);

  const handleUpdate = (e, id, index) => {
    e.preventDefault();
    const tSpent = e.target.totalSpent.value;
    const status = e.target.status.value;
    const dollerRate = e.target.dollerRate.value;
    const tBudged = e.target.tBudged.value;
    const body = { tSpent, status, dollerRate, tBudged };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/campaings/${id}`,
      body
    )
      .then((res) => {
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Campaign updated successfully!",
          icon: "success",
        });
        document.getElementById(`modal_${index}`).close(); // Auto close the modal
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update campaign",
        });
      });
  };

  const AxiosPublic = UseAxiosPublic();
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You want to delete <strong style="color: #ff0000;">${name}</strong>`, // Apply color to `${name}`
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/campaigns/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "The campaign has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };
  
  const [clientss, setClientss] = useState([]);
  useEffect(() => {
    const clientf = users.filter((f) => f.role === 'employee');
    setClientss(clientf);
  }, [clients, users]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(filteredByCategory.length / itemsPerPage);
  const paginatedItems = filteredByCategory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const maxPagesToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust start page if we're too close to the end of the total pages
  const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };
    AxiosPublic.patch(`https://digital-networking-server.vercel.app/campaings/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };

  const sortByDateDescending = (items) => {
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  const sortedItems = sortByDateDescending(paginatedItems);

  return (
    <div className="my-5">
     <Helmet>
        <title>All Campaigns | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="lg:flex lg:mb-5 text-black lg:justify-end gap-5 items-center mr-5">
        <form
          className="lg:flex lg:justify-center items-center"
          onSubmit={handleSort}
        >
         
        <div className="flex justify-center lg:mr-5 gap-2">
        <div >
              <select
                className="bg-white border text-black border-gray-400 rounded p-2 mt-1"
                value={selectedClient}
                onChange={(e) => changeTab(e.target.value)}
              >
                <option value="">Select an employee</option>
                {clientss.map((client) => (
                  <option key={client.name} value={client.email}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
           
        </div>
        <div className="flex justify-center  lg:mr-5 mt-5 lg:mt-0">
            <select
  className="bg-white border text-black border-gray-400 rounded p-2 mt-1"
  value={selectedClient}
  onChange={(e) => setSelectedClientt(e.target.value)}
>
  <option value="">Select a Client</option>
  {clients
    .filter(client => !selectedClient || client.employeeEmail === selectedClient)
    .map((client) => (
      <option key={client.clientEmail} value={client.clientEmail}>
        {client.clientName}
      </option>
    ))}
</select>

            </div>
        <div className="flex justify-center gap-5 lg:my-0 my-5">
        <div className="flex flex-col justify-center items-start">
            <select
              className="border bg-white text-black border-gray-400 rounded p-2 mt-1"
              value={sortMonth}
              onChange={(e) => changeTab2(e.target.value)}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

    <div className="ml-5 flex mb-5 lg:mb-0 justify-center">
   <input
     type="text"
     placeholder="Search by campaign name"
     className="border bg-white  text-black placeholder-gray-500 border-gray-700 rounded-l-lg p-2 flex-1"
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button
     className="bg-black  text-white border border-black shadow-2xl rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
     onClick={() => {/* Add search functionality here */}}
    >
     Search
    </button>
  </div>
        </form>
      </div>
      
      <div className="px-5 ">
        <div className="overflow-x-auto rounded-xl  text-black  border-l border-gray-400">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 text-center">OFF/ON</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Campaign Name</th>
                <th className="p-3 text-center">Client Name</th>
                <th className="p-3 text-center">Total Budged</th>
                <th className="p-3 text-center">Total spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((campaign, index) => (
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
                  <td className="p-3 border-l-2 border-r-2 border-gray-300 ">
                  {new Date(campaign?.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                    
                        {campaign.campaignName}
                    </div>
                  </td>
               <td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-center ">
                   <Link to={`/dashboard/client/${campaign.clientEmail}`} className="">
                       {campaign.clientName}
                   </Link>
                 </td>

                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                  $ {campaign.tBudged}
                  
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                  $ {campaign.tSpent}
                 
                  </td>

                  <td
                    className={`p-3 border-r-2 text-center border-gray-300 ${
                      campaign.status === "Active"
                        ? " text-green-900 font-bold"
                        : campaign.status === "In Review"
                        ? " text-red-600 font-bold"
                        : campaign.status === "Complete"
                        ? " text-blue-600 font-bold"
                        : ""
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
      <div className="mb-4">
        <label className="block text-start   font-bold text-gray-700">Campaign Name</label>
        <input
          type="text"
          name="tBudged"
          value={campaign.campaignName}
          disabled
          className="w-full bg-white border border-gray-400 rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-start   font-bold text-gray-700">Total Budged</label>
        <input
          type="number"
          name="tBudged"
          defaultValue={campaign.tBudged}
          step="0.01"
          className="w-full bg-white border border-gray-400 rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Spent</label>
        <input
          type="number"
          name="totalSpent"
          defaultValue={campaign.tSpent}
          step="0.01"
          className="w-full bg-white border-gray-400 border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Dollars Rate</label>
        <input
          step="0.01"
          type="number"
          name="dollerRate"
          defaultValue={campaign.dollerRate}
          className="w-full bg-white border-gray-400 border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Status</label>
        <select
          defaultValue={campaign.status}
          name="status"
          className="w-full bg-white border-gray-400 border rounded p-2 mt-1"
        >
          <option value="In Review">In Review</option>
          <option value="Active">Active</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      <div className="modal-action grid grid-cols-2 gap-3 mt-4">
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
                          onClick={() => handleDelete(campaign._id,campaign.campaignName)}
                        >
                          Delete
                        </button>
                      </div>
</td>
                  
                </tr>
              ))}
              <tr className="bg-[#05a0db] text-sm text-white font-bold">
                <td
                  className="p-3 border border-black text-right"
                  colSpan="4"
                >
                  Total :
                </td>
                <td className="p-3 border border-black text-center">
                  $ {totalBudged.toFixed(2) || 0}
                </td>
                <td className="p-3 border border-black text-center">
  {`$ ${totalSpent.toFixed(2)}`}
</td>
                <td className="p-3 border border-black text-center"></td>
                <td className="p-3 border border-black text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
      >
        Previous
      </button>
      {[...Array(endPage - adjustedStartPage + 1).keys()].map((pageIndex) => {
        const page = adjustedStartPage + pageIndex;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded mr-2 ${
              currentPage === page ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
      >
        Next
      </button>
    </div>
    </div>
  );
};

export default Campaigns;
