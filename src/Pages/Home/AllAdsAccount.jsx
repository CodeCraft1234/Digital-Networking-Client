import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import Swal from "sweetalert2";
import { IoIosSearch } from "react-icons/io";
import { Helmet } from "react-helmet-async";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const AllAdsAccount = () => {
  const [adsAccount, refetch] = useAdsAccount()
  console.log(adsAccount);
  console.log(adsAccount);
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [filteredAdsAccounts, setFilteredAdsAccounts] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [users] = useUsers();
  const AxiosPublic = UseAxiosPublic();
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (adsAccount) {
      const sortedAccounts = adsAccount.slice().sort((a, b) => {
        if (a.status === "Active" && b.status !== "Active") return -1;
        if (a.status !== "Active" && b.status === "Active") return 1;
        return 0;
      });
      setAdsAccounts(sortedAccounts);
      setFilteredAdsAccounts(sortedAccounts);
    }
  }, [adsAccount]);

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const status = e.target.status.value;
    const body = { accountName,currentBallence, threshold, totalSpent, status };
    AxiosPublic.patch(`/adsAccount/${id}`,body
    )
      .then((res) => {
        console.log(res.body);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Add Account success!",
          icon: "success",
        });

        setModalData(null);
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add account!",
        });
      });
  };

  // current balance update

  const handleFilter = () => {
    let filtered = adsAccounts;
    if (selectedEmail) {
      filtered = filtered.filter(
        (account) => account.employeeEmail === selectedEmail
      );
    }
    if (selectedStatus) {
      filtered = filtered.filter(
        (account) => account.status === selectedStatus
      );
    }
    const sortedFiltered = filtered.slice().sort((a, b) => {
      if (a.status === "Active" && b.status !== "Active") return -1;
      if (a.status !== "Active" && b.status === "Active") return 1;
      return 0;
    });
    setFilteredAdsAccounts(sortedFiltered);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedEmail, selectedStatus]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalCurrentBallence, setTotalCurrentBallence] = useState(0);
  const [totalThreshold, setTotalThreshold] = useState(0);

  useEffect(() => {
    const tspent = filteredAdsAccounts.reduce((acc, campaign) => {
      const currentBallence = parseFloat(campaign.currentBallence);
      return acc + (isNaN(currentBallence) ? 0 : currentBallence);
    }, 0);
    setTotalCurrentBallence(tspent);

    const total = filteredAdsAccounts.reduce((acc, campaign) => {
      const threshold = parseFloat(campaign.threshold);
      return acc + (isNaN(threshold) ? 0 : threshold);
    }, 0);
    setTotalThreshold(total);

    const totalBill = filteredAdsAccounts.reduce((acc, campaign) => {
      const totalSpent = parseFloat(campaign.totalSpent);
      return acc + (isNaN(totalSpent) ? 0 : totalSpent);
    }, 0);
    setTotalSpent(totalBill);
  }, [filteredAdsAccounts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // const filteredItems = filteredAdsAccounts.filter((item) =>
  //   item?.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredByCategory = selectedCategory
    ? filteredAdsAccounts.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredAdsAccounts;

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
        AxiosPublic.delete(`/adsAccount/${id}`).then((res) => {
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

  const handleSort = () => {
    const sortedAds = [...filteredAdsAccounts].sort((a, b) => {
      if (sortOrder === "desc") {
        return a.status.localeCompare(b.status);
      } else {
        return b.status.localeCompare(a.status);
      }
    });
    setFilteredAdsAccounts(sortedAds);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleUpdateCurrentBalance = (e, id) => {
    e.preventDefault();
    const currentBallence = e.target.currentBalance.value;

    const body = { currentBallence: currentBallence };
    console.log(body);

    axios
      .put(`https://digital-networking-server.vercel.app/adsAccount/currentBalance/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        setModalData(null);
      })
  };

  const handleUpdateThreshold = (e, id) => {
    e.preventDefault();
    const threshold = e.target.threshold.value;
    const body = { threshold: threshold };
    console.log(body);
    axios
      .put(`https://digital-networking-server.vercel.app/adsAccount/threshold/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        setModalData(null);
      })
    }

  const handleUpdateTotalSpent = (e, id) => {
    e.preventDefault();
    const totalSpent = e.target.totalSpent.value;

    const body = { totalSpent: totalSpent };
    console.log(body);

    axios
      .put(`https://digital-networking-server.vercel.app/adsAccount/totalSpent/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
     
        setModalData(null);
      })
  };

  return (
    <div>
      <Helmet>
        <title>All Ads Accounts | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="mt-5 p-4 ">
        <div className="flex justify-between items-center ">
          <div className="flex justify-center items-center">
            <div className=" ml-10 flex justify-start mb-5 items-center gap-5 ">
              <div>
                <label className="block text-black font-bold">
                  Sort By Employee
                </label>
                <select
                  name="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="border rounded p-2 mt-1"
                >
                  <option disabled value="">
                    All
                  </option>
                  {users
                    ?.filter((u) => u.role === "employee")
                    .map((user) => (
                      <option key={user._id} value={user.email}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-black font-bold">
                  Sort By Status
                </label>
                <select
                  name="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded p-2 mt-1"
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Disable">Disable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end ">
            <input
              type="text"
              placeholder="Ads Account Name..."
              className="rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
            >
              <IoIosSearch className="mx-auto font-bold w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto  text-center border border-black">
          <table className="min-w-full  text-center bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3">SL</th>
                <th className="p-3">Ad Account Name</th>
                <th className="p-3">Employeer Name</th>
                <th className="p-3">Current Balance</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3 cursor-pointer" onClick={handleSort}>
                  Status
                </th>
                <th className="p-3">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredByCategory.map((account, index) => (
                <tr
                  key={account._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                      : "bg-gray-200  text-left text-gray-500 border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 border-r-2  border-gray-300 text-center px-5 ">{index + 1}</td>
                  <td className="p-3 border-r-2  border-gray-300 text-start px-5 ">
                    <div className="">
                      <h1> {account.accountName}</h1>
                      <div className="flex justify-start gap-3">
                        <button
                          className="text-blue-600"
                          onClick={() => setModalData(account)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-start flex justify-start text-red-600"
                          onClick={() => handleDelete(account._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-r-2  border-gray-300 text-center px-5 ">
                  {account.employeerName}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    <div className="relative group flex items-center justify-center">
                      <h1>$ {account.currentBallence}</h1>
                      <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_1`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white">
                          <form
                            onSubmit={(e) =>
                              handleUpdateCurrentBalance(e, account._id)
                            }
                          >
                            <input
                              type="number"
                              name="currentBalance"
                              step="0.01"
                              defaultValue={account?.currentBallence}
                              className="w-full  rounded p-2 mt-3 bg-white text-black border border-gray-700"
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
                    <div className="relative group flex items-center justify-between">
                      <h1>$ {account.threshold}</h1>
                      <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_2`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id={`my_modal_2`} className="modal">
                        <div className="modal-box py-4 bg-white">
                          <form
                            onSubmit={(e) =>
                              handleUpdateThreshold(e, account._id)
                            }
                          >
                            <input
                              type="number"
                              name="threshold"
                              step="0.01" 
                              defaultValue={account.threshold}
                              className="w-full  rounded p-2 mt-5 bg-white text-black border border-gray-700 "
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
                    <div className="relative group flex items-center justify-between">
                      <h1>$ {account.totalSpent}</h1>
                      <button
                        className=" text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document
                            .getElementById(`my_modal_${account._id}`)
                            .showModal()
                        }
                      >
                        <FaEdit />
                      </button>

                      <dialog id={`my_modal_${account._id}`} className="modal">
                        <div className="modal-box bg-white">
                          <form
                            onSubmit={(e) =>
                              handleUpdateTotalSpent(e, account._id)
                            }
                          >
                            <input
                              type="number"
                              name="totalSpent"
                              step="0.01"
                              defaultValue={account?.totalSpent}
                              className="w-full  rounded p-2 mt-3 bg-white text-black border border-gray-700 "
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
                    className={`p-3 border-r-2  text-center border-gray-300  ${
                      account.status === "Active"
                        ? "text-green-900 font-bold"
                        : "text-red-600 font-bold"
                    }`}
                  >
                    {account.status}
                  </td>

                  <td className="p-3 border-l-2 border-r-2 text-center border-gray-300 ">
                    {new Date(account.paymentDate).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-800   text-sm text-white font-bold">
                <td className="p-3  text-right" colSpan="3">
                  Total :
                </td>
                <td className="p-3 border-2 border-gray-300  text-center">
                  $ {totalCurrentBallence}
                </td>
                <td className="p-3 border-2 border-gray-300  text-center">
                  $ {totalThreshold}
                </td>
                <td className="p-3 border-2 border-gray-300 text-center">
                  $ {totalSpent}
                </td>
                <td className="p-3 border-2 border-gray-300 text-center"></td>
                <td className="p-3 border-2 border-gray-300 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <dialog className="modal" open>
          <div className="modal-box bg-white text-black">
            <form onSubmit={(e) => handleUpdate(e, modalData._id)}>
              <div className="flex justify-center items-center gap-3">
              <div className="mb-4">
                          <label className="block text-gray-500">
                          Account Name
                          </label>
                          <input
                            type="text required"
                            name="accountName" 

                            defaultValue={modalData.accountName}
                            className="w-full border-2 border-black rounded p-2 mt-1 bg-white text-black"
                          />
                        </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Current Balance</label>
                  <input
                    type="number"
                    name="currentBallence"
                    step="0.01"
                    defaultValue={modalData.currentBallence}
                    className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    step="0.01"
                    defaultValue={modalData.threshold}
                    className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <div className="mb-4">
                  <label className="block text-gray-500">Total Spent</label>
                  <input
                    type="number"
                    name="totalSpent"
                    step="0.01"
                    defaultValue={modalData.totalSpent}
                    className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Status</label>
                  <select
                    name="status"
                    defaultValue={modalData.status}
                    className="w-full border rounded p-2 mt-1 text-black bg-white border-gray-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
              >
                Update
              </button>
            </form>
            <div className="modal-action">
              <button
                className="p-2 rounded-lg bg-red-600 text-white text-center"
                onClick={() => setModalData(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};
export default AllAdsAccount;
