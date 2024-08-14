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
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { MdDelete, MdEditSquare } from "react-icons/md";

const Campaigns = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [clients] = useClients();
  const [campaigns, refetch] = useCampaings();
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientt, setSelectedClientt] = useState("");
  
  useEffect(() => {
    let filtered = campaigns;

    if (selectedEmployee) {
      filtered = filtered.filter((c) => c.status === selectedEmployee);
    }

    if (sortMonth) {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((c) => {
        const paymentDate = new Date(c.date);
        const selected = new Date(selectedDate);
        return (
          paymentDate.getDate() === selected.getDate() &&
          paymentDate.getMonth() === selected.getMonth() &&
          paymentDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    if (selectedClient) {
      filtered = filtered.filter((c) => c.email === selectedClient);
    }

    if (selectedClientt) {
      filtered = filtered.filter((c) => c.clientEmail === selectedClientt);
    }

    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth, selectedDate, selectedClient, selectedClientt, campaigns]);

  const handleSort = (e) => {
    e.preventDefault();
    const status = e.target.status.value;
    const filtered = campaigns.filter((c) => c.status === status);
    setFilteredClients(filtered);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item.campaignName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalBill, setTotalBill] = useState(0);

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
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Campaign!",
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

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    if (activeDropdown === orderId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(orderId);
    }
  };

  const [clientss, setClientss] = useState([]);
  useEffect(() => {
    const clientf = users.filter((f) => f.role === 'employee');
    setClientss(clientf);
  }, [clients, user]);

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

  return (
    <div className="mt-5">
     <Helmet>
        <title>All Campaigns | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="flex text-black justify-between gap-4 items-center ">

        
        <form
          className="flex justify-center items-center"
          onSubmit={handleSort}
        >

          
          <div className="flex justify-center items-center gap-5 mb-4 ml-5 mx-auto">
          <div className="flex flex-col justify-center items-center">
              <label className="">By Employee</label>
              <select
                className="bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Select an employee</option>
                {clientss.map((client) => (
                  <option key={client.name} value={client.email}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center items-center">
              <label className="">By Client</label>
              <select
                className="bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
                value={selectedClient}
                onChange={(e) => setSelectedClientt(e.target.value)}
              >
                <option value="">Select an Client</option>
                {clients.map((client) => (
                  <option key={client.name} value={client.clientEmail}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center items-center">
              <label className="">Sort By Status</label>
              <select
                name="status"
                className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option disabled value="">
                  Status
                </option>
                <option value="Active">Active</option>
                <option value="Complete">Complete</option>
                <option value="In Review">In Review</option>
              </select>
            </div>

            <div className="flex flex-col justify-center items-center">
            <label className="">By Month</label>
            <select
              className="border bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
              value={sortMonth}
              onChange={(e) => setSortMonth(e.target.value)}
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

            <div className="flex flex-col justify-center items-center">
              <label className="">By Date</label>
              <input
                type="date"
                className="bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

           

           

            <div className="flex flex-col justify-center items-center">
              <label className="">Search</label>
              <input
                type="text"
                placeholder="Search by campaign name"
                className="bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto border-2 border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 text-center">SL</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Campaign Name</th>
                <th className="p-3 text-center">Employeer Name</th>
                <th className="p-3 text-center">Total Budged</th>
                <th className="p-3 text-center">Total spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((campaign, index) => (
                <tr
                  key={campaign._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-gray-500 border-b border-opacity-20"
                      : "bg-gray-200 text-gray-500 border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    {index + 1}
                  </td>
                  <td className="p-3 border-l-2 border-r-2 border-gray-300 ">
                  {new Date(campaign?.date).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                      <Link to={`/client/${campaign.clientEmail}`} className="">
                        {campaign.campaignName}
                      </Link>
                     
                    </div>
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">

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
                        className="text-blue-700  text-3xl"
                        onClick={() =>
                          document.getElementById(`modal_${index}`).showModal()
                        }
                      >
                        <MdEditSquare />
                      </button>
                      <dialog id={`modal_${index}`} className="modal">
  <div className="modal-box bg-white text-black">
    <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
      <h1 className="text-md mb-5">
        Ads Account:{" "}
        <span className="text-blue-600 text-xl font-bold">
          {campaign.adsAccount}
        </span>
      </h1>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Budged</label>
        <input
          type="number"
          name="tBudged"
          defaultValue={campaign.tBudged}
          step="0.01"
          className="w-full bg-white border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Spent</label>
        <input
          type="number"
          name="totalSpent"
          defaultValue={campaign.tSpent}
          step="0.01"
          className="w-full bg-white border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Dollars Rate</label>
        <input
          step="0.01"
          type="number"
          name="dollerRate"
          defaultValue={campaign.dollerRate}
          className="w-full bg-white border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Status</label>
        <select
          defaultValue={campaign.status}
          name="status"
          className="w-full bg-white border rounded p-2 mt-1"
        >
          <option value="In Review">In Review</option>
          <option value="Active">Active</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      <div className="modal-action grid grid-cols-2 gap-3 mt-4">
      <button
          type="button"
          className="p-2 rounded-lg bg-red-600 text-white"
          onClick={() =>
            document.getElementById(`modal_${index}`).close()
          }
        >
          Close
        </button>
        <button
          type="submit"
          className="font-avenir px-3 py-1 bg-[#05a0db] rounded-lg text-white"
        >
          Update
        </button>
       
      </div>
    </form>
  </div>
</dialog>

                      </div>
                        <button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handleDelete(campaign._id)}
                        >
                          <MdDelete />
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
                  $ {totalBudged || 0}
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
