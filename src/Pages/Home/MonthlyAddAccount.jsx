import  { useState } from "react";
import { FaEdit } from "react-icons/fa";
import useUserAdAccount from "../../Hook/useUserAdAccount";
import { NavLink } from "react-router-dom";

const MonthlyAdAccount = () => {
  const [userAdAccounts, refetch] = useUserAdAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleUpdate = () => {
    // Add your update logic here
    // For example, you might want to send a request to update the account in the backend
    // After updating, refetch the data and close the modal
    refetch();
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  return (
    <div className="mt-24 p-2  sm:p-4 dark:bg-green-800">
      <h6 className="text-center font-bold uppercase text-3xl md:text-5xl bg-green-800 text-white p-3 sm:p-3">
        Monthly Ads Account Activities
      </h6>
      <div className="overflow-x-auto mt-6">
      <div className="flex justify-start items-start gap-4 mx-8">
          <NavLink to={"/adAccountAds"}>
            <button className="font-avenir px-4 py-1 rounded-lg bg-green-800 text-white">
              Add Ads Account
            </button>
          </NavLink>
          <NavLink to={"/addCampaign"}>
            <button className="font-avenir px-4 py-1 rounded-lg bg-green-800 text-white">
              Add Campaign
            </button>
          </NavLink>
        </div>
        <table className="min-w-full bg-white mt-2">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Ad Account ID</th>
              <th className="p-3">Threshold</th>
              <th className="p-3">Current Balance</th>
              <th className="p-3">Active Spent</th>
              <th className="p-3">Delete Spent</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {userAdAccounts.map((account, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "text-black border-b border-opacity-20" : "text-black border-b border-opacity-20"}`}
              >
                <td className="p-3 text-center">{account.date}</td>
                <td className="p-3 text-center">{account.name}</td>
                <td className="p-3 text-center">{account.id}</td>
                <td className="p-3 text-center">
                  ${account.threshold.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.currentBalance.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.activeSpent.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.deleteSpent.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.totalSpent.toLocaleString()}
                </td>
                <td
                  className={`p-3 text-center ${
                    account.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {account.status}
                </td>
                <td className="p-3 text-center">
                  <FaEdit
                    onClick={() => handleEditClick(account)}
                    className="cursor-pointer ml-2"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total:
              </td>
              <td className="p-3 text-center">
                $
                {userAdAccounts
                  .reduce((sum, account) => sum + account.threshold, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                {userAdAccounts
                  .reduce((sum, account) => sum + account.currentBalance, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {userAdAccounts
                  .reduce((sum, account) => sum + account.activeSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {userAdAccounts
                  .reduce((sum, account) => sum + account.deleteSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {userAdAccounts
                  .reduce((sum, account) => sum + account.totalSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Edit Ad Account
            </h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Payment Date</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.date}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Ad Account Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm"
                    defaultValue={selectedAccount.name}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Ad Account ID</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.id}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Threshold</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.threshold}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Current Balance</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.currentBalance}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Active Spent</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.activeSpent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Delete Spent</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.deleteSpent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Spent</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.totalSpent}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700">Status</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedAccount.status}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAdAccount;