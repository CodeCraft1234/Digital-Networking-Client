import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const UserAdAccount = ({email}) => {


  // const [users] = useUsers(); 
  // const {user}=useContext(AuthContext)
  // console.log(users)

  // const [userss,setUser]=useState([])
  // console.log(userss?.email)
  // useEffect(()=>{
  //   const filtered=users.find(e=>e.email === user?.email) 
  //   console.log('sdahjgj',filtered)
  //   setUser(filtered)
  // },[users,user])


  
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

    AxiosPublic.post("http://localhost:5000/adsAccount", data).then((res) => {
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

    AxiosPublic.patch(`http://localhost:5000/adsAccount/${id}`, body)
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
    <h6 className="text-center text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 p-2 sm:p-2">
      User Ads Account Activities
    </h6>

    <div>
          <button
            className="font-avenir px-3 mt-10 mx-auto py-1 bg-neutral ml-10 rounded text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Add Ads Account
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <form onSubmit={(e) => handleAddAdsAcount(e)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-700">Account Name</label>
                    <input
                      type="type"
                      name="accountName"
                      placeholder="type here..."
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Issue Date</label>
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
                  className="font-avenir px-3 mx-auto py-1 bg-neutral rounded flex justify-center text-white"
                >
                  Send
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
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
                  ? "text-black border-b border-opacity-20"
                  : "text-black border-b border-opacity-20"
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
                          <label className="block text-gray-700">
                            Current Ballence
                          </label>
                          <input
                            type="number"
                            name="currentBallence"
                            className="w-full border rounded p-2 mt-1"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Threshold
                          </label>
                          <input
                            type="number"
                            name="threshold"
                            className="w-full border rounded p-2 mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-700">
                           TotaL Spent
                          </label>
                          <input
                            type="number"
                            name="totalSpent"
                            className="w-full border rounded p-2 mt-1"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Status
                          </label>
                          <select
                            name="status"
                            className="w-full border rounded p-2 mt-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Disable">Disable</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white"
                      >
                        Update
                      </button>
                    </form>
                    <div className="modal-action">
                      <button
                        className="btn"
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
