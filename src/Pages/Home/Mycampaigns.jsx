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

const MyCampaigns = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState([]);
  const [clients] = useClients();
  const [campaigns,refetch]=useCampaings()
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSpentModalOpen, setIsSpentModalOpen] = useState(false);
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


  const handleOpenBudgetModal = () => {
    setIsBudgetModalOpen(true);
  };

  const handleOpenSpentModal = () => {
    setIsSpentModalOpen(true);
  };

  const handleCancel = () => {
    setIsBudgetModalOpen(false);
    setIsSpentModalOpen(false);
  };

  const handleSort = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const filtered = campaigns.filter(c => c.clientEmail === email);
    setFilteredClients(filtered);
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

  const handleUpdateTotalBudget = (e, id) => {
    e.preventDefault();
    const tBudged = e.target.tBudged.value;

    const body = { tBudged: tBudged };
    console.log(body);

    axios
      .put(`https://digital-networking-server.vercel.app/campaings/totalBudged/${id}`, body)
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
      .put(`https://digital-networking-server.vercel.app/campaings/totalSpent/${id}`, body)
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
 
 
  const handleUpdate = (e, id) => {
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
        console.log(res.data);
        refetch();
        toast.success("Campaign updated successfully");
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
        });

    }

  return (
    <div className="mt-5">
      <Helmet>
        <title>My Campaign | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
<div className="flex justify-between items-center ">
<form className="flex justify-center items-center" onSubmit={handleSort}>
        <div className="mb-4 ml-10 mx-auto">
          <label className="block text-gray-700">Sort By Client</label>
          <select name="email" className="border border-gray-700 text-black bg-white  rounded p-2 mt-1">
          <option value="">All Client</option>
            {client.map(d => <option key={d._id} value={d.clientEmail}>{d.clientName}</option>)}
          </select>
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
      </form>
      <div className="flex justify-end ">
                <input
                  type="text"
                  placeholder=" Campaign Name"
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center border-2 border-gray-300">ID</th>
                <th className="p-3 text-center border-2 border-gray-300">Campaign Name</th>
                <th className="p-3 text-center border-2 border-gray-300">Page Name</th>
                <th className="p-3 text-center border-2 border-gray-300">Total Budged</th>
                <th className="p-3 text-center border-2 border-gray-300">Total spent</th>
                <th className="p-3 text-center border-2 border-gray-300">Status</th>
                <th className="p-3 text-center border-2 border-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
  {filteredByCategory.map((campaign, index) => (
    <tr
      key={campaign._id}
      className={`${
        index % 2 === 0
          ? "bg-white text-black border-b border-opacity-20"
          : "bg-gray-200 text-black border-b border-opacity-20"
      }`}
    >
      <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">{campaign._id.slice(-5)}</td>
      
      <td className="p-3 border-r-2 border-gray-300 text-left">
        <Link to={`/client/${campaign.clientEmail}`} className="flex justify-start">
        {campaign.campaignName}
        </Link>
        <div className="flex justify-start gap-3">
        <div>
                      <button
                        className="text-blue-700"
                        onClick={() =>
                          document.getElementById(`modal_${index}`).showModal()
                        }
                      >
                        Edit
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
                            <div className="flex justify-center items-center gap-3">
                              <div className="mb-4">
                                <label className="block text-gray-700">
                                  Total Budged
                                </label>
                                <input
                                  type="number"
                                  name="tBudged"
                                  defaultValue={campaign.tBudged}
                                  step="0.01"
                                  className="w-full bg-white border rounded p-2 mt-1"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700">
                                  Total Spent
                                </label>
                                <input
                                  type="number"
                                  name="totalSpent"
                                  defaultValue={campaign.tSpent}
                                  step="0.01"
                                  className="w-full bg-white border rounded p-2 mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex justify-center items-center gap-3">
                              <div className="mb-4">
                                <label className="block text-gray-700">
                                  Dollers Rate
                                </label>
                                <input
                                  step="0.01"
                                  type="number"
                                  name="dollerRate"
                                  defaultValue={campaign.dollerRate}
                                  className="w-full bg-white border rounded p-2 mt-1"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700">
                                  Status
                                </label>
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
                            </div>

                            <button
                              onClick={() =>
                                document
                                  .getElementById(`modal_${index}`)
                                  .close()
                              }
                              type="submit"
                              className="font-avenir px-3 flex justify-center  mx-auto py-1 bg-green-800  rounded-lg text-white"
                            >
                              Update
                            </button>
                          </form>
                          <div className="modal-action">
                            <button
                              className="p-2 rounded-lg bg-red-600 text-white text-center"
                              onClick={() =>
                                document
                                  .getElementById(`modal_${index}`)
                                  .close()
                              }
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </dialog>
                      </div>
                        <button
                          className="text-start flex justify-start text-red-600"
                          onClick={() => handledelete(campaign._id)}
                        >
                          Delete
                        </button>
                      </div>
      </td>
      <td className="p-3 border-r-2 border-gray-300 text-center">
        <Link to={campaign.pageURL} className="flex justify-center">
        {campaign.pageName}
        </Link>
      </td>        
      <td className="p-3 border-r-2 border-gray-300 text-center">
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
      </td>

      <td className="p-3 border-r-2 border-gray-300 text-center">
        <div className="relative group flex items-center justify-center">
          <h1>$ {campaign.tSpent}</h1>
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
      </td>
      <td className="p-3 border-r-2 border-gray-300 text-center">{campaign.status}</td>
      <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">{campaign.date}</td>
    </tr>
  ))}
  <tr className="bg-green-800 text-sm text-white font-bold">
    <td className="p-3 border-2 border-gray-300 text-right" colSpan="4">
      Total :
    </td>
    <td className="p-3 border-2 border-gray-300 text-center">$ {totalBudged}</td>
    <td className="p-3 border-2 border-gray-300 text-center">$ {totalSpent}</td> 
    <td className="p-3 border-2 border-gray-300 text-center"></td> 
  </tr>
</tbody>
          </table>  
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;