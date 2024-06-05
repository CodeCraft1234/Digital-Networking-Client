import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
// import { toast } from "react-toastify";
import useUsers from "../../Hook/useUsers";
import Swal from 'sweetalert2'
import { IoIosSearch } from "react-icons/io";
import { Helmet } from "react-helmet-async";

const AllAdsAccount = () => {
  const [adsAccount, refetch] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);
  const [filteredAdsAccounts, setFilteredAdsAccounts] = useState([]);
  const [modalData, setModalData] = useState(null); // to store the current account data for the modal
  const [selectedEmail, setSelectedEmail] = useState(""); // to store the selected employee email
  const [users] = useUsers(); // to get the list of users
  const AxiosPublic = UseAxiosPublic();

  useEffect(() => {
    if (adsAccount) {
      const sortedAccounts = adsAccount.slice().sort((a, b) => {
        if (a.status === 'Active' && b.status !== 'Active') return -1;
        if (a.status !== 'Active' && b.status === 'Active') return 1;
        return 0;
      });
      setAdsAccounts(sortedAccounts);
      setFilteredAdsAccounts(sortedAccounts); // initialize the filtered ads accounts
    }
  }, [adsAccount]);

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const status = e.target.status.value;

    const body = { currentBallence, threshold, totalSpent, status };

    AxiosPublic.patch(`https://digital-networking-server.vercel.app/adsAccount/${id}`, body)
      .then((res) => {
        console.log(res.body);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Add Account success!",
          icon: "success"
        });

        setModalData(null); // Close the modal
      })
      .catch(error => {
        console.error("Error adding account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add account!",
        });
      });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const filtered = adsAccounts.filter(account => account.employeeEmail === selectedEmail);
    const sortedFiltered = filtered.slice().sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return 0;
    });
    setFilteredAdsAccounts(sortedFiltered);
  };

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalCurrentBallence, setTotalCurrentBallence] = useState(0);
  const [totalThreshold, setTotalThreshold] = useState(0);

  useEffect(() => {
    const tspent = filteredAdsAccounts.reduce(
      (acc, campaign) => {
        const currentBallence = parseFloat(campaign.currentBallence);
        return acc + (isNaN(currentBallence) ? 0 : currentBallence);
      },
      0
    );
    setTotalCurrentBallence(tspent);

    const total = filteredAdsAccounts.reduce(
      (acc, campaign) => {
        const threshold = parseFloat(campaign.threshold);
        return acc + (isNaN(threshold) ? 0 : threshold);
      },
      0
    );
    setTotalThreshold(total);

    const totalBill = filteredAdsAccounts.reduce(
      (acc, campaign) => {
        const totalSpent = parseFloat(campaign.totalSpent);
        return acc + (isNaN(totalSpent) ? 0 : totalSpent);
      },
      0
    );
    setTotalSpent(totalBill);
  }, [filteredAdsAccounts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems =  filteredAdsAccounts.filter((item) =>
    item.accountName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;


    const handleDelete=(id)=>{
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
          AxiosPublic.delete(`/adsAccount/${id}`)
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
    }
  return (
    <div>
       <Helmet>
              <title> Digital Network | Ads Account</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
      <div className="mt-24 p-4 dark:text-green-800">
      

       <div className="flex justify-between items-center ">
       <form className="flex justify-center items-center" onSubmit={handleFilter}>
          <div className="mb-4 ml-10 mx-auto">
            <label className="block text-gray-500 font-bold">Sort By Employee</label>
            <select
              name="email"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="border rounded p-2 mt-1"
            >
              <option disabled value="">All</option>
              {users?.filter(u => u.role === 'employee').map((user) => (
                <option key={user._id} value={user.email}>{user.name}</option>
              ))}
            </select>
            <button className="ml-2 font-avenir px-3 mx-auto py-2 rounded-lg text-white bg-green-800">
              Search
            </button>
          </div>
        </form>

        <div className="flex justify-end ">
        
                <input
                  type="text"
                  placeholder="Ads Account Name..."
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

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Ad Account Name</th>
                <th className="p-3">Current Balance</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3">Status</th>
                <th className="p-3">Edit</th>
                <th className="p-3">Action</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredByCategory.map((account, index) => (
                <tr
                key={account._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-gray-500 border-b border-opacity-20"
                    : "bg-gray-200 text-gray-500 border-b border-opacity-20"
                }`}
              >
                <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">{account.issueDate}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">{account.accountName}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">$ {account.currentBallence}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">$ {account.threshold}</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">$ {account.totalSpent}</td>
                <td className={`p-3 border-r-2 border-gray-300 text-center ${account.status === 'Active' ? 'text-green-900 font-bold' : 'text-red-600 font-bold'}`}>
  {account.status}
</td>
                <td className="p-3 border-r-2 border-gray-300 text-center">
                  <button
                    className="font-avenir px-3  mx-auto py-1 bg-green-800 rounded-lg text-white"
                    onClick={() => setModalData(account)}
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 border-r-2 border-gray-300 text-center">

                  <button
                    className="font-avenir px-3  mx-auto py-1 bg-green-800 rounded-lg text-white"
                    onClick={()=>handleDelete(account._id)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
              

              ))}
                  <tr className="bg-green-800 text-sm text-white font-bold">
      
      <td className="p-3 border-2 border-black text-right" colSpan="2">
        Total :
      </td>
      <td className="p-3 border-2 border-black text-center">$ {totalCurrentBallence}</td>
      <td className="p-3 border-2 border-black text-center">$ {totalThreshold}</td>
      <td className="p-3 border-2 border-black text-center">$ {totalSpent}</td>
      <td className="p-3 border-2 border-black text-center"></td>
      <td className="p-3 border-2 border-black text-center"></td>
      <td className="p-3 border-2 border-black text-center"></td>
      
    </tr>
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <dialog className="modal" open>
          <div className="modal-box">
            <form onSubmit={(e) => handleUpdate(e, modalData._id)}>
              <div className="flex justify-center items-center gap-3">
                <div className="mb-4">
                  <label className="block text-gray-500">Current Balance</label>
                  <input
                    type="number"
                    name="currentBallence"
                    step="0.01"
                    defaultValue={modalData.currentBallence}
                    className="w-full border rounded p-2 mt-1 text-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    step="0.01"
                    defaultValue={modalData.threshold}
                    className="w-full border rounded p-2 mt-1 text-gray-500"
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
                    className="w-full border rounded p-2 mt-1 text-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Status</label>
                  <select
                    name="status"
                    defaultValue={modalData.status}
                    className="w-full border rounded p-2 mt-1 text-gray-500"
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
              <button className="p-2 rounded-lg bg-red-600 text-white text-center" onClick={() => setModalData(null)}>
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
