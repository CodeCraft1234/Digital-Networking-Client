import { useState } from "react";
import useUserAdAccount from "../../Hook/useUserAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const UserAdAccount = () => {
  const [userad, refetch] = useUserAdAccount();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState();
  const AxiosPublic = UseAxiosPublic();

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    document.getElementById(`my_modal_${account.id}`).showModal();
    setData(data);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log(id);
    const date = e.target.date.value;
    const threshold = parseFloat(e.target.threshold.value);
    const currentBalance =parseFloat(e.target.currentBalance.value);
    const totalSpent = parseFloat(e.target.totalSpent.value);
    const status = e.target.status.value;

    const data = { date, threshold, currentBalance, totalSpent, status };
    console.log(data);

     // Make the patch request
     AxiosPublic.patch(`/userad/${id}`, data)
     .then((res) => {
       console.log(res.data);
       refetch();
     })
     .catch((error) => {
       console.error('Error updating ad account:', error);
     });
   
  };

  return (
    <div className="mt-24 p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        User Ads Account Activities
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Ad Account ID</th>
              <th className="p-3">Threshold</th>
              <th className="p-3">Current Balance</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {userad.map((account, index) => (
              <tr
                key={account._id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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
                  <button
                    className="font-avenir px-3 py-1 bg-neutral rounded text-white"
                    onClick={() => handleEditClick(account)}
                  >
                    Edit
                  </button>
                  <dialog id={`my_modal_${account.id}`} className="modal">
                    <div className="flex justify-start items-center text-black bg-indigo-300 p-5 gap-3">
                      <form onSubmit={(e) => handleUpdate(e, account._id)} className="text-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-black font-bold">
                              Payment Date
                            </label>
                            <input
                              type="text"
                              name="date"
                              defaultValue={account.date}
                              className="w-full border rounded p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-black font-bold">
                              Threshold
                            </label>
                            <input
                              type="number"
                              name="threshold"
                              defaultValue={account.threshold}
                              className="w-full border rounded p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-black font-bold">
                              Current Balance
                            </label>
                            <input
                              type="number"
                              name="currentBalance"
                              defaultValue={account.currentBalance}
                              className="w-full border rounded p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-black font-bold">
                              Total Spent
                            </label>
                            <input
                              type="number"
                              name="totalSpent"
                              defaultValue={0}
                              className="w-full border rounded p-2 mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-black font-bold">
                              Status
                            </label>
                            <select
                              name="status"
                              defaultValue={account.status}
                              className="w-full border rounded p-2 mt-1"
                            >
                              <option value="Active">Active</option>
                              <option value="Deasible">Deasible</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end mt-6">
                          {/* <button
                            type="button"
                            className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => document.getElementById(`my_modal_${account.id}`).close()}
                          >
                            Close
                          </button> */}
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                    <form method="dialog">
                      <button className="btn btn-secondary bg-blue-500 text-white font-bold">
                        Close
                      </button>
                    </form>
                  </dialog>
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
              <td className="p-3 text-right" colSpan="3">
                Total:
              </td>
              <td className="p-3 text-center">
                $
                {userad
                  .reduce((sum, account) => sum + account.threshold, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {userad
                  .reduce((sum, account) => sum + account.currentBalance, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {userad
                  .reduce((sum, account) => sum + account.totalSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAdAccount;