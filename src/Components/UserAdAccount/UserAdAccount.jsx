import { useContext, useEffect, useState } from "react";
import useAdsAccount from "../../Hook/useAdAccount";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
// import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";

const UserAdAccount = ({email}) => {


  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === user?.email);
          console.log(fff);
          setDdd(fff || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  

  const [adsAccount, refetch] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);

  useEffect(() => {
    const filterdata = adsAccount.filter((m) => m.employeeEmail === email);
    console.log(filterdata);
    setAdsAccounts(filterdata);

  }, [adsAccount, email]);

  const handleAddAdsAcount = (e) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const paymentDate = e.target.paymentDate.value;
    const employeeEmail = email;
    const data = { accountName, paymentDate, employeeEmail };

    AxiosPublic.post("/adsAccount", data).then((res) => {
      console.log(res.data);
      // toast.success("add successful");
      refetch()
      Swal.fire({
        title: "Good job!",
        text: "add successful!",
        icon: "success"
      });
 
    });
  };

const AxiosPublic=UseAxiosPublic()
  const handleUpdate = (e, id) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const paymentDate=e.target.paymentDate.value;
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const status = e.target.status.value;
    console.log(accountName, currentBallence,threshold, totalSpent, status);

    const body = { accountName,paymentDate, currentBallence,threshold, totalSpent, status };

    AxiosPublic.patch(`https://digital-networking-server.vercel.app/adsAccount/${id}`, body)
        .then(res => {
            console.log(res.data);
            refetch();
            // toast.success("Campaign updated successfully");
            Swal.fire({
              title: "Good job!",
              text: "Campaign update success!",
              icon: "success"
            });
            
        })
        .catch(error => {
            console.error("Error updating campaign:", error);
            // toast.error("Failed to update campaign");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to update campaign!",
              
            });
        });
};

const [currentTotal,setCurrentTotal]=useState(0)
const [tSpent,setthreshold]=useState(0)
 const [TSpent,setTSpent]=useState(0)

useEffect(() => {
 
  const total = adsAccounts.reduce(
    (acc, campaign) => acc + parseFloat(campaign.currentBallence),
    0
  );
  setCurrentTotal(total);

  const totalBill = adsAccounts.reduce(
    (acc, campaign) => acc + parseFloat(campaign.threshold),
    0
  );
  setthreshold(totalBill);

  const totalBilll = adsAccounts.reduce(
    (acc, campaign) => acc + parseFloat(campaign.totalSpent),
    0
  );
  setTSpent(totalBilll);

}, [adsAccounts]);


  return (
    <div className="mt-24 p-4 dark:text-green-800">


     <div className="flex justify-start mb-5 text-gray-500 border-b border-opacity-20 mx-2 pb-1 items-center gap-3">
      <button
        className="font-avenir px-3 mt-5 mx-auto py-1 ml-10 rounded-lg text-white bg-green-800"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Add Ads Account
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white">
          <form onSubmit={(e) => handleAddAdsAcount(e)}>
            <div className="flex justify-center items-center gap-3">
              <div className="mb-4">
                <label className="block text-black">Account Name</label>
                <input
                  type="text required"
                  name="accountName"
                  placeholder="type here..."
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Payment Date</label>
                <input
                required
                  type="date"
                  name="paymentDate"
                  className="w-full border bg-green-300 border-gray-600 text-black rounded p-2 mt-1"
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
            <th className="p-3">SL</th>
            <th className="p-3">Payment Date</th>
            <th className="p-3">Ad Account Name</th>
            <th className="p-3">Current Balance</th>
            <th className="p-3">Threshold</th>
            <th className="p-3">Total Spent</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {adsAccounts.map((account, index) => (
            <tr
              key={account._id}
              className={`${
                index % 2 === 0
                  ? "text-gray-500 border-b border-opacity-20 "
                  : "text-gray-500 border-b border-opacity-20 "
              }`}
            >
              <td className="p-3 border-r-2 border-l-2 border-gray-300 text-center">{index + 1}</td>
              <td className="p-3 border-r-2 border-l-2 border-gray-300 text-center">{account.paymentDate}</td>
              <td className="p-3 border-r-2 border-gray-300 text-center">{account.accountName}</td>
              <td className="p-3 border-r-2 border-gray-300  text-center">$ {account.currentBallence}</td>
              <td className="p-3 border-r-2 border-gray-300 text-center">$ {account.threshold}</td>
              <td className="p-3 border-r-2 border-gray-300 text-center">$ {account.totalSpent}</td>
              <td className="p-3 border-r-2 border-gray-300 text-center">{account.status}</td>
              <td className="p-3 border-r-2 border-gray-300 text-center">
                <button
                  className="font-avenir  flex justify-center px-3 mx-auto py-1 bg-green-800 rounded text-white"
                  onClick={() =>
                    document.getElementById(`modal_${index}`).showModal()
                  }
                >
                  Edit
                </button>
                <dialog id={`modal_${index}`} className="modal">
                  <div className="modal-box bg-white   text-black font-bold">
                    <form onSubmit={(e) => handleUpdate(e, account._id)}>
                      <div className="flex justify-center items-center gap-3">
                      <div className="mb-4">
                          <label className="block text-gray-500">
                          Account Name
                          </label>
                          <input
                            type="text required"
                            name="accountName" 

                            defaultValue={account?.accountName}
                            className="w-full border-2 border-black rounded p-2 mt-1 bg-white text-black"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-500">
                          Payment Date
                          </label>
                          <input
                          required
                            type="date"
                            name="paymentDate"
                            defaultValue={account?.paymentDate}
                            className="w-full border-2 border-black bg-green-300 rounded p-2 mt-1 text-black"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-3">
                        
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Current Ballence
                          </label>
                          <input
                          step="0.01"
                            type="number required"
                            name="currentBallence"
                            defaultValue={account.currentBallence}
                            className="w-full  border-2 border-black rounded p-2 mt-1 text-black bg-white"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Threshold
                          </label>
                          <input
                            type="number required"
                            name="threshold"
                            step="0.01"
                            defaultValue={account.threshold}
                            className="w-full  border-2 border-black rounded p-2 mt-1 text-black bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-3">
                        <div className="mb-4">
                          <label className="block text-gray-500">
                           TotaL Spent
                          </label>
                          <input
                            type="number required"
                            name="totalSpent"
                            step="0.01"
                            defaultValue={account.totalSpent}
                            className="w-full  border-2 border-black rounded p-2 mt-1 text-black bg-white"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-500">
                            Status
                          </label>
                          <select
                          type="text required"
                            name="status"
                            defaultValue={account.status}
                            className="w-full border-2 border-black text-black bg-white rounded p-2 mt-1"
                          >
                            <option className="text-green-800" value="Active">Active</option>
                            <option className="text-red-800" value="Disable">Disable</option>
                          </select>
                        </div>
                      </div>

                      <button onClick={() =>
                          document.getElementById(`modal_${index}`).close()
                        }
                        type="submit"
                        className="font-avenir px-3 mx-auto py-1 bg-green-800 rounded-lg text-white"
                      >
                        Update
                      </button>
                    </form>
                    <div className="modal-action">
                                                      <button className="p-2 rounded-lg bg-red-600 text-white text-center" onClick={() => document.getElementById(`modal_${index}`).close()}>Close</button>
                              </div>
                    
                  </div>
                </dialog>
              </td>
            </tr>
          ))}
          <tr className="bg-green-800 text-sm text-white font-bold">
    
    <td className="p-3 border-2 border-gray-300 text-right" colSpan="3">
      Total :
    </td>
    <td className="p-3 border-2 border-gray-300 text-center">$ {currentTotal}</td>
    <td className="p-3 border-2 border-gray-300 text-center">$ {tSpent}</td> 
    <td className="p-3 border-2 border-gray-300 text-center">$ {TSpent}</td> 
    <td className="p-3 border-2 border-gray-300 text-center"></td> 
    <td className="p-3 border-2 border-gray-300 text-center"></td> 
   
    

  </tr>
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default UserAdAccount;
