// import React, { useEffect, useState } from 'react';
// import useCampaings from '../../Hook/useCampaign';
// import useUsers from '../../Hook/useUsers';

// const CampaignTable = () => {
//   const [campaigns]=useCampaings()
//   const initialData = [
//     { date: '4/9/2023', campaignName: '', pageName: 'Health care', tBudget: 22.00, amountSpent: 6.00, delivery: 'In Review', cashIn: 1500.00, method: '', cashOut: 0.00 },
//     { date: '4/9/2023', campaignName: '', pageName: '', tBudget: 0.00, amountSpent: 0.00, delivery: 'In Review', cashIn: 0.00, method: '', cashOut: 0.00 },
//     // Add additional rows as per the table
//   ];
//   console.log(initialData);

//   const [users, setUsers] = useUsers();
//   const [selectedUser, setSelectedUser] = useState(null);

//   const [totals, setTotals] = useState({
//     bkashMarcentTotal: 0,
//     bkashPersonalTotal: 0,
//     nagadPersonalTotal: 0,
//     rocketPersonalTotal: 0,
//     payoneerTotal: 0,
//     totalBDT: 0,
//   });

//   const [editValues, setEditValues] = useState({
//     bkashMarcentTotal: 0,
//     bkashPersonalTotal: 0,
//     nagadPersonalTotal: 0,
//     rocketPersonalTotal: 0,
//     payoneerTotal: 0,
//     totalBDT: 0,
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [data, setData] = useState(initialData);

//   useEffect(() => {
//     const calculateTotals = () => {
//       const newTotals = {
//         bkashMarcentTotal: users.reduce(
//           (acc, user) => acc + (user.bkashMarcent || 0),
//           0
//         ),
//         bkashPersonalTotal: users.reduce(
//           (acc, user) => acc + (user.bkashPersonal || 0),
//           0
//         ),
//         nagadPersonalTotal: users.reduce(
//           (acc, user) => acc + (user.nagadPersonal || 0),
//           0
//         ),
//         rocketPersonalTotal: users.reduce(
//           (acc, user) => acc + (user.rocketPersonal || 0),
//           0
//         ),
//         payoneerTotal: users.reduce(
//           (acc, user) => acc + (user.payoneer || 0),
//           0
//         ),
//         totalBDT: users.reduce((acc, user) => acc + (user.totalBDT || 0), 0),
//       };
//       setTotals(newTotals);
//       setEditValues(newTotals);
//     };

//     calculateTotals();
//   }, [users]);

 

 

//   const openModal = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   const handleUserInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedUser({
//       ...selectedUser,
//       [name]: parseFloat(value),
//     });
//   };


 

//  const handleSubmit = (e) =>{
//   e.preventDefault();
//   const tSpent = e.target.tSpent.value;
//   const statusOption = e.target.statusOption.value;
//   const paymentRcv = e.target.paymentRcv.value;
//   const paymentOption = e.target.paymentOption.value;
//   console.log(tSpent, statusOption, paymentRcv, paymentOption);
//  }

//   return (
//     <div>
//       <div className="p-2 mt-24 sm:p-4 dark:text-gray-100">
//         <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
//           Campaign Table
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-xs">
//             <thead className="dark:bg-gray-700">
//               <tr>
//                 <th className="p-3 text-center">Date</th>
//                 <th className="p-3 text-center">Campaign Name/URL</th>
//                 <th className="p-3 text-center">Page Name/URL</th>
//                 <th className="p-3 text-center">T.Budged</th>
//                 <th className="p-3 text-center">T.Spent</th>
//                 <th className="p-3 text-center">Status</th>
//                 <th className="p-3 text-center"> Payment Rcv</th>
//                 <th className="p-3 text-center">Method</th>
//                 <th className="p-3 text-center">Edit</th>
//               </tr>
//             </thead>
//             {
//                   campaigns.map(ini=><tbody key={ini.id}>
//                     <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
//                         <td className="p-3 text-center">{ini.date}</td>
//                         <td className="p-3 text-center">{ini.campaignName}</td>
//                         <td className="p-3 text-center">{ini.pageName}</td>
//                         <td className="p-3 text-center">{ini.totalBudged}</td>
//                         <td className="p-3 text-center">
                          
//                         </td>
//                         <td className="p-3 text-center">{ini.status}</td>
//                         <td className="p-3 text-center">{ini.cashIn}</td>
//                         <td className="p-3 text-center">{ini.method}</td>
//                         <td><button onClick={() => openModal(users)} className="font-avenir  px-3 py-1 bg-neutral rounded text-white">Edit</button></td>
//                       </tr>
//                     </tbody>)
//             }

            
//               <tr className="border-b border-opacity-20 bg-lime-700">
//                 <td className="p-3 text-center"></td>
//                 <td className="p-3 text-center"></td>
//                 <td className="p-3 text-center">Total BDT</td>
//                 <td className="p-3 text-center">৳0.00</td>
//                 <td className="p-3 text-center">৳0.00</td>
//                 <td className="p-3 text-center">৳0.00</td>
//                 <td className="p-3 text-center">৳0.00</td>
//                 <td className="p-3 text-center"></td>
//                 <td className="p-3 text-center"></td>
                
//               </tr>
//           </table>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <form onSubmit={handleSubmit}>
//           <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//             <h6 className="text-center text-2xl font-bold text-green-600 mb-6">
//               Edit {selectedUser.name}
//             </h6>
//             <div className="mb-4">
//               <label className="block text-gray-700">$ T.Spent</label>
//               <input
//                 type="number"
//                 name="tSpent"
//                 value={selectedUser.bkashMarcent}
//                 onChange={handleUserInputChange}
//                 className="w-full border rounded p-2 mt-1"
//               />
//             </div>
//             <div className="mb-4">
//         <label htmlFor="statusOption" className="block text-gray-700">Status:</label>
//         <select id="statusOption" name="statusOption" className="w-full border rounded p-2 mt-1">
//           <option value="pending">Pending</option>
//           <option value="active">Active</option>
//           <option value="complete">Complete</option>
          
//         </select>
//       </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">$ Payment Rcv</label>
//               <input
//                 type="number"
//                 name="paymentRcv"
//                 value={selectedUser.nagadPersonal}
//                 onChange={handleUserInputChange}
//                 className="w-full border rounded p-2 mt-1"
//               />
//             </div>
//             <div className="mb-4">
             
//               <div className="mb-4">
//         <label htmlFor="paymentOption" className="block text-gray-700">Payment Option:</label>
//         <select id="paymentOption" name="paymentOption" className="w-full border rounded p-2 mt-1">
//           <option value="bKashPersonal">bKash Personal</option>
//           <option value="bKashMarcent">bKash Marcent</option>
//           <option value="nagadPersonal">Nagad Personal</option>
//           <option value="rocketPersonal">Rocket Personal</option>
//           <option value="payoneer">Payoneer</option>
//         </select>
//       </div>
//             </div>
           
           
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={closeModal}
//                 className="bg-red-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-red-600"
//               >
//                 Cancel
//               </button>
//               <button
               
//                 className="bg-blue-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-blue-600"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CampaignTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CampaignTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

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
    try {
      const response = await axios.put(
        `http://localhost:5000/campaigns/${selectedCampaign._id}`,
        selectedCampaign
      );
      const updatedCampaigns = campaigns.map((campaign) =>
        campaign._id === response.data._id ? response.data : campaign
      );
      setCampaigns(updatedCampaigns);
      closeModal();
      toast.success('Campaign updated successfully!');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Failed to update campaign.');
    }
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
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Payment Rcv</th>
                <th className="p-3 text-center">Method</th>
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
                  <td className="p-3 text-center">{campaign.amountSpent}</td>
                  <td className="p-3 text-center">{campaign.status}</td>
                  <td className="p-3 text-center">{campaign.cashIn}</td>
                  <td className="p-3 text-center">{campaign.method}</td>
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
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
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
                <label className="block text-gray-700">T.Budget</label>
                <input
                  type="number"
                  name="tBudget"
                  value={selectedCampaign.tBudget}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">T.Spent</label>
                <input
                  type="number"
                  name="amountSpent"
                  value={selectedCampaign.amountSpent}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
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
                <label className="block text-gray-700">Payment Rcv</label>
                <input
                  type="number"
                  name="cashIn"
                  value={selectedCampaign.cashIn}
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
                  <option value="bKash Personal">bKash Personal</option>
                  <option value="bKash Marcent">bKash Marcent</option>
                  <option value="Nagad Personal">Nagad Personal</option>
                  <option value="Rocket Personal">Rocket Personal</option>
                  <option value="Payoneer">Payoneer</option>
                </select>
              </div>
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
