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
  console.log(selectedClientt);


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
  }, [selectedEmployee, sortMonth, selectedDate, selectedClient,selectedClientt]);

  useEffect(() => {
    if (campaigns) {
      setFilteredClients(campaigns);
    }
  }, [campaigns]);

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

  console.log(totalSpent, totalBudged, totalRCV, totalBill);

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

  const handleUpdateTotalBudget = (e, id) => {
    e.preventDefault();
    const tBudged = e.target.tBudged.value;

    const body = { tBudged: tBudged };
    console.log(body);

    axios
      .put(`https://digital-networking-server.vercel.app/campaigns/totalBudged/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Total Budget updated!",
          icon: "success",
        });
        setTotalBudged(null);
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update account!",
        });
      });
  };

  const handleUpdateTotalSpent = (e, id) => {
    e.preventDefault();
    const tSpent = e.target.tSpent.value;

    const body = { tSpent: tSpent };
    console.log(body);

    axios
      .put(`https://digital-networking-server.vercel.app/campaigns/totalSpent/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Total Spent updated!",
          icon: "success",
        });
        setTotalSpent(totalSpent);
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update account!",
        });
      });
  };

  const AxiosPublic = UseAxiosPublic();
  const handleDelete = (id) => {
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
        AxiosPublic.delete(`/campaigns/${id}`).then((res) => {
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

  const [clientss, setClientss] = useState([]);
  console.log(clientss)
  useEffect(() => {
    const clientf = users.filter((f) => f.role === 'employee');
    setClientss(clientf);
  }, [clients, user]);



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
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center">SL</th>
                <th className="p-3 text-center">Campaign Name</th>
                <th className="p-3 text-center">Employeer Name</th>
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
                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    {index + 1}
                  </td>

                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                      <Link to={`/client/${campaign.clientEmail}`} className="">
                        {campaign.campaignName}
                      </Link>
                      <div className="flex justify-start gap-3">
                        <button className="text-blue-600">Edit</button>
                        <button
                          className="text-start flex justify-start text-red-600"
                          onClick={() => handleDelete(campaign._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center ">

                  </td>

                  <td className="p-3 border-r-2 border-gray-300 text-center ">
                    <div className="relative group flex items-center justify-center ">
                      <h1>$ {campaign.tBudged}</h1>
                      <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_1`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id={`my_modal_1`} className="modal">
                        <div className="modal-box">
                          <form
                            onSubmit={(e) =>
                              handleUpdateTotalBudget(e, campaign._id)
                            }
                          >
                            <input
                              type="number"
                              name="tBudged"
                              step="0.01"
                              defaultValue={campaign.tBudged}
                              className="w-full border rounded p-2 mt-1 text-gray-500"
                            />
                            <button
                              type="submit"
                              className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
                            >
                              Update
                            </button>
                          </form>

                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
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
                        onClick={() =>
                          document.getElementById(`my_modal_2`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id={`my_modal_2`} className="modal">
                        <div className="modal-box">
                          <form
                            onSubmit={(e) =>
                              handleUpdateTotalSpent(e, campaign._id)
                            }
                          >
                            <input
                              type="number"
                              name="tSpent"
                              step="0.01"
                              defaultValue={campaign.tSpent}
                              className="w-full border rounded p-2 mt-1 text-gray-500"
                            />
                            <button
                              type="submit"
                              className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
                            >
                              Update
                            </button>
                          </form>

                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                        </div>
                      </dialog>
                    </div>
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
                  <td className="p-3 border-l-2 border-r-2 border-gray-300 ">
                  {new Date(campaign?.date).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-800 text-sm text-white font-bold">
                <td
                  className="p-3 border-2 border-black text-right"
                  colSpan="3"
                >
                  Total :
                </td>
                <td className="p-3 border-2 border-black text-center">
                  $ {totalBudged}
                </td>
                <td className="p-3 border-2 border-black text-center">
                  $ {totalSpent}
                </td>
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
