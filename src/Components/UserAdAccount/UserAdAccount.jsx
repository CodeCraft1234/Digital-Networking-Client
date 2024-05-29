import { useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";

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


  return (
    <div className="mt-24 p-4 dark:text-green-800">
    <h6 className="text-center text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 p-2 sm:p-2">
      User Ads Account Activities
    </h6>
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
              <td className="p-3 text-center">00</td>
              <td className="p-3 text-center">00</td>
              <td className="p-3 text-center">00</td>
              <td className="p-3 text-center">active</td>
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
                    <form>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Previous Spent
                          </label>
                          <input
                            type="number"
                            disabled
                            name="previousSpent"
                            className="w-full border rounded p-2 mt-1"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            New Spent
                          </label>
                          <input
                            type="number"
                            name="newSpent"
                            defaultValue={0}
                            className="w-full border rounded p-2 mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Dollers Rate
                          </label>
                          <input
                            type="number"
                            name="dollerRate"
                            defaultValue={140}
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
                            <option value="In Review">In Review</option>
                            <option value="Active">Active</option>
                            <option value="Complete">Complete</option>
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
