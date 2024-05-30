import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import useUsers from "../../Hook/useUsers";

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
      setAdsAccounts(adsAccount);
      setFilteredAdsAccounts(adsAccount); // initialize the filtered ads accounts
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
        refetch();
        toast.success("Campaign updated successfully");
        setModalData(null); // Close the modal
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const filtered = adsAccounts.filter(account => account.employeeEmail === selectedEmail);
    setFilteredAdsAccounts(filtered);
  };

  return (
    <div>
      <div className="mt-24 p-4 dark:text-green-800">
        {/* <h6 className="text-center py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 ">
          Ads Account Activities
        </h6> */}

        <form className="flex justify-center items-center" onSubmit={handleFilter}>
          <div className="mb-4 ml-10 mx-auto">
            <label className="block text-gray-500 font-bold">Sort By Employee</label>
            <select
              name="email"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="border rounded p-2 mt-1"
            >
              <option value="">Select an Employee</option>
              {users?.filter(u => u.role === 'employee').map((user) => (
                <option key={user._id} value={user.email}>{user.name}</option>
              ))}
            </select>
            <button className="ml-2 font-avenir px-3 mx-auto py-2 rounded-lg text-white bg-green-800">
              Search
            </button>
          </div>
        </form>

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
                <th className="p-3">Action</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAdsAccounts.map((account, index) => (
                <tr
                  key={account._id}
                  className={`${
                    index % 2 === 0
                      ? "text-gray-500 border-b border-opacity-20"
                      : "text-gray-500 border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 text-center">{account.issueDate}</td>
                  <td className="p-3 text-center">{account.accountName}</td>
                  <td className="p-3 text-center">{account.currentBallence}</td>
                  <td className="p-3 text-center">{account.threshold}</td>
                  <td className="p-3 text-center">{account.totalSpent}</td>
                  <td className="p-3 text-center">{account.status}</td>
                  <td className="p-3 text-center">
                    <button
                      className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white"
                      onClick={() => setModalData(account)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
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
                    defaultValue={modalData.currentBallence}
                    className="w-full border rounded p-2 mt-1 text-gray-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-500">Threshold</label>
                  <input
                    type="number"
                    name="threshold"
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
