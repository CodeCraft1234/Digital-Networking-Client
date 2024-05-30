import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";

const UserAdAccount = ({email}) => {

  const [adsAccount] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);

  useEffect(() => {
    const filterdata = adsAccount.filter((m) => m.employeeEmail === email);
    console.log(filterdata);
    setAdsAccounts(filterdata);

  }, [adsAccount, email]);

  const handleAddAdsAcount = (e) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const issueDate = e.target.issueDate.value;
    console.log(accountName, issueDate);
    const employeeEmail = email;
    const data = { accountName, issueDate, employeeEmail };

    AxiosPublic.post("https://digital-networking-server.vercel.app/adsAccount", data).then((res) => {
      console.log(res.data);
      toast.success("add successful");
    });
  };

const AxiosPublic=UseAxiosPublic()
  const handleUpdate = (e, id) => {
    e.preventDefault();
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const status = e.target.status.value;
    console.log(currentBallence,threshold, totalSpent, status);

    const body = { currentBallence,threshold, totalSpent, status };

    AxiosPublic.patch(`https://digital-networking-server.vercel.app/adsAccount/${id}`, body)
        .then(res => {
            console.log(res.data);
            refetch();
            toast.success("Campaign updated successfully");
        })
        .catch(error => {
            console.error("Error updating campaign:", error);
            toast.error("Failed to update campaign");
        });
};

  return (
    <div className="mt-24 p-4 dark:text-green-800">
    <h6 className="text-center mx-4 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 ">
       Ads Account Activities
    </h6>

    <div className="flex justify-start mb-5 text-gray-500 border-b border-opacity-20 mx-2 pb-1 items-center gap-3">
          <button
            className="font-avenir px-3 mt-5 mx-auto py-1 ml-10 rounded-lg text-white bg-green-800"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            Add Ads Account
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form onSubmit={(e) => handleAddAdsAcount(e)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-250">Account Name</label>
                    <input
                      type="type"
                      name="accountName"
                      placeholder="type here..."
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Issue Date</label>
                    <input
                      type="date"
                      name="issueDate"
                      defaultValue={0}
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800"
                >
                  Send
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                </form>
              </div>
            </div>
          </dialog>
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
            <th className="p-3">Action</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {adsAccounts.map((account, index) => (
            <tr
              key={account._id}
              className={`${
                index % 2 === 0
                  ? "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
                  : "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
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
                  onClick={() =>
                    document.getElementById(`modal_${index}`).showModal()
                  }
                >
                  Edit
                </button>
                <dialog id={`modal_${index}`} className="modal">
                  <div className="modal-box">
                    <form onSubmit={(e) => handleUpdate(e, account._id)}>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Current Ballence
                          </label>
                          <input
                            type="number"
                            name="currentBallence"
                            className="w-full border rounded p-2 mt-1 text-gray-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Threshold
                          </label>
                          <input
                            type="number"
                            name="threshold"
                            className="w-full border rounded p-2 mt-1 text-gray-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-500">
                           TotaL Spent
                          </label>
                          <input
                            type="number"
                            name="totalSpent"
                            className="w-full border rounded p-2 mt-1 text-gray-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Status
                          </label>
                          <select
                            name="status"
                            className="w-full border rounded p-2 mt-1 text-gray-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Disable">Disable</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="font-avenir px-3 mx-auto py-1 bg-green-800 rounded-lg text-white"
                      >
                        Update
                      </button>
                    </form>
                    <div className="modal-action">
                      <button
                        className="p-2 rounded-lg bg-red-600 text-white text-center"
                        onClick={() =>
                          document.getElementById(`modal_${index}`).close()
                        }
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default UserAdAccount;
