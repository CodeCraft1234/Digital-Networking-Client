import  {  useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCampaings from '../../Hook/useCampaign';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';

const CampaignTable = () => {
  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const [data, setData] = useState([]);
  console.log(data?.bkashPersonal)

  useEffect(() => {
    const finds = users.find(use => use.email === user?.email);
    setData(finds ? [finds] : []); // Ensure `data` is always an array
  }, [users, user]); // Also include `user` in the dependency array
  
  
  const [campaigns, refetch]=useCampaings();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AxiosPublic = UseAxiosPublic();

  const [totalSpentTotal, setTotalSpentTotal] = useState('');
  const [totalBillTotal, setTotalBillTotal] = useState('');
  const [totalPaymentTotal, setTotalPaymentTotal] = useState('');

  useEffect(() => {
    const totalBill = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.tSpent), 0);
    const totalPayment = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.previousPayment), 0);
    const totalAvg = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.dollerRate), 0);
    const avg=totalAvg / campaigns.length
    setTotalSpentTotal(totalBill);
    setTotalPaymentTotal(totalPayment)
    setTotalBillTotal(avg)
  }, [campaigns]);

  useEffect(()=>{
    const finds=users.find(use=>use.email === user?.email)
    setData(finds)
  },[users,])

  const openModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCampaign({
      ...selectedCampaign,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const newSpent=e.target.newSpent.value
    const previousPayment = e.target.previousPayment.value;
    const status = e.target.status.value;
    const tSpent = e.target.tSpent.value;
    const dollerRate = e.target.dollerRate.value;
    const method = e.target.method.value;

console.log(selectedCampaign.email)
    const totalSpent=(parseFloat(previousPayment) + parseFloat(newSpent))

    const body = { totalSpent,tSpent, status,previousPayment,dollerRate,  method};
    console.log(body,totalSpent);

    AxiosPublic.patch(`http://localhost:5000/campaings/${selectedCampaign._id}`,body)
    .then(res=>{
     console.log(res.body)
     refetch();
    })
    

   
  };

  return (
    <div>
      <div className="p-2 mt-24 sm:p-4 dark:text-gray-100">
        <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
          Campaign Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="dark:bg-gray-700">
              <tr>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Campaign Name/URL</th>
                <th className="p-3 text-center">Page Name/URL</th>
                <th className="p-3 text-center">T.Budget</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Total Bill</th>
                <th className="p-3 text-center">Total Payment Rcv</th>
                <th className="p-3 text-center">Method</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign._id} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  <td className="p-3 text-center">{campaign.date}</td>
                  <td className="p-3 text-center">{campaign.campaignName}</td>
                  <td className="p-3 text-center">{campaign.pageName}</td>
                  <td className="p-3 text-center">{campaign.tBudget}</td>
                  <td className="p-3 text-center">{campaign.tSpent}</td>
                  <td className="p-3 text-center">{campaign.tSpent * campaign.dollerRate}</td>
                  <td className="p-3 text-center">{campaign.totalSpent}</td>
                  <td className="p-3 text-center">{campaign.method}</td>
                  <td className="p-3 text-center">{campaign.status}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openModal(campaign)}
                      className="font-avenir px-3 py-1 bg-neutral rounded text-white"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total :</td>
                <td className="p-3 text-center">{totalSpentTotal}</td>
                <td className="p-3 text-center">{totalBillTotal * totalSpentTotal}</td>
                <td className="p-3 text-center">{totalPaymentTotal}</td>
                <td className="p-3 text-center">Total Due : {totalBillTotal * totalSpentTotal - totalPaymentTotal}</td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleUpdate}>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
              <h6 className="text-center text-2xl font-bold text-green-600 mb-6">
                Edit Campaign 
              </h6>
              <div className="mb-4">
                <input
                disabled
                  type="text"
                  name="email"
                  value={data?.email}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className='grid grid-cols-2'>
              
              <div className="mb-4">
                <label className="block text-gray-700">New Payment</label>
                <input
                  type="number"
                  name="newSpent"
                  defaultValue={0}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Previous Payment</label>
                <input
                
                  type="number"
                  name="previousPayment"
                  value={selectedCampaign.totalSpent}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              </div>
              <div  className='grid grid-cols-2'>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  name="status"
                  value={selectedCampaign.status}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="In Review">In Review</option>
                  <option value="Active">Active</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Total Spent</label>
                <input
                  type="number"
                  name="tSpent"
                  value={selectedCampaign.tSpent}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              </div>
              <div  className='grid grid-cols-2'>
              <div className="mb-4">
                <label className="block text-gray-700">Doller Rate</label>
                <input
                  type="number"
                  name="dollerRate"
                  defaultValue={140}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Method</label>
                <select
                  name="method"
                  value={selectedCampaign.method}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="bkashPersonal">bkashPersonal</option>
                  <option value="bkashMarcent">bkashMarcent</option>
                  <option value="nagadPersonal">nagadPersonal</option>
                  <option value="rocketPersonal">rocketPersonal</option>
                  <option value="bank">bank</option>
                </select>
              </div>
              </div>
              {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}></button>
<dialog  id="my_modal_3" className="modal">

              <div className="mb-4">
                <label className="block text-gray-700">Bkash Marcent</label>
                <input
                disabled
                  type="number"
                  name="bkashMarcent"
                  value={data.bkashMarcent}
                  
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Bkash Personal</label>
                <input
                disabled
                  type="number"
                  name="bkashPersonal"
                  value={data.bkashPersonal}
                  
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nagad Personal</label>
                <input
                disabled
                  type="number"
                  name="nagadPersonal"
                  value={data.nagadPersonal}
                  
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rocket Personal</label>
                <input
                disabled
                  type="number"
                  name="rocketPersonal"
                  value={data.rocketPersonal}
                  
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
      
    </div>
  );
};
export default CampaignTable;