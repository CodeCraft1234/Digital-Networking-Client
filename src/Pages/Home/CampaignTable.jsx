import  {  useContext, useEffect, useState, } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCampaings from '../../Hook/useCampaign';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { split } from 'postcss/lib/list';
import EmployeerMouthlySelery from './EmployeerMouthlySelery';
import useClients from '../../Hook/useClient';
import { Link,  NavLink } from 'react-router-dom';

const CampaignTable = ({email}) => {


console.log(email)
  
  const [clients,refetch]=useClients()
  const AxiosPublic = UseAxiosPublic();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [data, setUserData] = useState([]);
  const [users] = useUsers();
  const [user, setUser] = useState(null);
  console.log('kjhgfaklhgklagshkl',clients)


  useEffect(() => {
    const filtered = clients.filter(campaign => campaign.email === email);
    console.log(filtered);
    setFilteredCampaigns(filtered);
  }, [clients, email]);
  
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${email}`);
//         console.log(res.data);
//         setUserData(res.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [AxiosPublic, email]);

  
//   useEffect(() => {
//     if (users.length > 0) {
//       const foundUser = users.find(user => user?.email === email);
//       setUser(foundUser ? foundUser : null);
//       console.log(foundUser,'ksdahjkghs')
//     }
//   }, [users, email]);


//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);


//   const [totalSpentTotal, setTotalSpentTotal] = useState('');
//   const [totalBillTotal, setTotalBillTotal] = useState('');
//   const [totalPaymentTotal, setTotalPaymentTotal] = useState('');

//   useEffect(() => {
//     const totalBill = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.tSpent), 0);
//     const totalPayment = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.previousPayment), 0);
//     const totalAvg = campaigns.reduce((acc, campaign) => acc + parseFloat(campaign.dollerRate), 0);
//     const avg=totalAvg / campaigns.length
//     setTotalSpentTotal(totalBill);
//     setTotalPaymentTotal(totalPayment)
//     setTotalBillTotal(avg)
//   }, [clients]);

//   const openModal = (campaign) => {
//     setSelectedCampaign(campaign);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedCampaign(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCampaign({
//       ...selectedCampaign,
//       [name]: value,
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const newSpent=e.target.newSpent.value
//     const previousPayment = e.target.previousPayment.value;
//     const status = e.target.status.value;
//     const tSpent = e.target.tSpent.value;
//     const dollerRate = e.target.dollerRate.value;
//     const method = e.target.method.value;

// console.log(selectedCampaign.email)
//     const totalSpent=(parseFloat(previousPayment) + parseFloat(newSpent))

//     const body = { totalSpent,tSpent, status,previousPayment,dollerRate,  method};
//     console.log(body,totalSpent);

//     AxiosPublic.patch(`https://digital-networking-server.vercel.app/campaings/${selectedCampaign._id}`,body)
//     .then(res=>{
//      console.log(res.body)
//      refetch();
//     })
    

   
//   };

  return (
    <div>
      <div className="p-2  sm:p-4 dark:bg-green-800">
        <h2 className="mb-4 text-4xl bg-green-800 text-white text-center font-semibold leading-tight">
         Client Campaign Table
        </h2>
        <div className="overflow-x-auto mt-1">
       <div className='flex justify-start items-start gap-4 mx-8'>
       <NavLink to={"/addClient"}>
       <button
          className="font-avenir px-4 py-1 rounded-lg bg-green-800 text-white"
        >
          Add Client
        </button>
       </NavLink>
       <NavLink to={"/addCampaign"}>
       <button
          className="font-avenir px-4 py-1 rounded-lg bg-green-800 text-white"
        >
          Add Campaign
        </button>
       </NavLink>
       </div>
          <table className="min-w-full text-xs mt-2">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Client Name</th>
                <th className="p-3 text-center">Client Phone</th>
                {/* <th className="p-3 text-center">Client Email</th> */}
                <th className="p-3 text-center">T.Budget</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Total Bill</th>
                <th className="p-3 text-center">Total Payment Rcv</th>
                <th className="p-3 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className='text-gray-250'>
  {filteredCampaigns.map((campaign) => (
    <tr key={campaign._id} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
      <td className="p-3 text-center">{campaign.date}</td>
    
           <Link to={`/client/${campaign.clientEmail}`}>
                 <td className="p-3 text-center">{campaign.clientName}</td>
            </Link>
            
      <td className="p-3 text-center">{campaign.clientPhone}</td>
      {/* <td className="p-3 text-center">{campaign.clientEmail}</td> */}
      <td className="p-3 text-center">{campaign.tBudged}</td>
      <td className="p-3 text-center">{campaign.tSpent}</td>
      <td className="p-3 text-center">{(campaign.tSpent * 140).toFixed(2)}</td>
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

            {/* <tfoot>
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
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
            </tfoot> */}
          </table>
        </div>
      </div>

      {/* {isModalOpen && (
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
              </div> */}
{/*              
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
        </div> */}
     
      {/* <ToastContainer /> */}

      <EmployeerMouthlySelery email={email}></EmployeerMouthlySelery>

    </div>

  );
};
export default CampaignTable;