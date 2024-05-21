
// import  {  useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import useCampaings from '../../Hook/useCampaign';
// import UseAxiosPublic from '../../Axios/UseAxiosPublic';
// import useUsers from '../../Hook/useUsers';

// const CampaignTable = () => {
 
//   const [campaigns, refetch]=useCampaings();
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const AxiosPublic = UseAxiosPublic();

//   const [users] = useUsers();
//   console.log(users);

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
//     const tBudget = e.target.tBudget.value;
//     const amountSpent = e.target.amountSpent.value;
//     const status = e.target.status.value;
//     const cashIn = e.target.cashIn.value;
//     const method = e.target.method.value;
    
    
//     const body = {tBudget, amountSpent, status, cashIn, method};
//     console.log(body);

//     AxiosPublic.patch(`http://localhost:5000/campaings/${selectedCampaign._id}`,body)
//     .then(res=>{
//      console.log(res.body)
//      refetch();
//     })
//   };

//   if(users.roll === "admin"){
//     return null;
//   } 
//   else{
//     return (
//       <div>
//         <div className="p-2 mt-24 sm:p-4 dark:text-gray-100">
//           <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
//             Campaign Table
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-xs">
//               <thead className="dark:bg-gray-700">
//                 <tr>
//                   <th className="p-3 text-center">Date</th>
//                   <th className="p-3 text-center">Campaign Name/URL</th>
//                   <th className="p-3 text-center">Page Name/URL</th>
//                   <th className="p-3 text-center">T.Budget</th>
//                   <th className="p-3 text-center">T.Spent</th>
//                   <th className="p-3 text-center">Status</th>
//                   <th className="p-3 text-center">Payment Rcv</th>
//                   <th className="p-3 text-center">Method</th>
//                   <th className="p-3 text-center">Edit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {campaigns.map((campaign) => (
//                   <tr key={campaign._id} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
//                     <td className="p-3 text-center">{campaign.date}</td>
//                     <td className="p-3 text-center">{campaign.campaignName}</td>
//                     <td className="p-3 text-center">{campaign.pageName}</td>
//                     <td className="p-3 text-center">{campaign.tBudget}</td>
//                     <td className="p-3 text-center">{campaign.amountSpent}</td>
//                     <td className="p-3 text-center">{campaign.status}</td>
//                     <td className="p-3 text-center">{campaign.cashIn}</td>
//                     <td className="p-3 text-center">{campaign.method}</td>
//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => openModal(campaign)}
//                         className="font-avenir px-3 py-1 bg-neutral rounded text-white"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr className="border-b border-opacity-20 bg-lime-700">
//                   <td className="p-3 text-center"></td>
//                   <td className="p-3 text-center"></td>
//                   <td className="p-3 text-center">Total BDT</td>
//                   <td className="p-3 text-center">৳0.00</td>
//                   <td className="p-3 text-center">৳0.00</td>
//                   <td className="p-3 text-center">৳0.00</td>
//                   <td className="p-3 text-center">৳0.00</td>
//                   <td className="p-3 text-center"></td>
//                   <td className="p-3 text-center"></td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
  
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//             <form onSubmit={handleUpdate}>
//               <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//                 <h6 className="text-center text-2xl font-bold text-green-600 mb-6">
//                   Edit Campaign
//                 </h6>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">T.Budget</label>
//                   <input
//                     type="number"
//                     name="tBudget"
//                     value={selectedCampaign.tBudget}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2 mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">T.Spent</label>
//                   <input
//                     type="number"
//                     name="amountSpent"
//                     value={selectedCampaign.amountSpent}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2 mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Status</label>
//                   <select
//                     name="status"
//                     value={selectedCampaign.status}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2 mt-1"
//                   >
//                     <option value="In Review">In Review</option>
//                     <option value="Active">Active</option>
//                     <option value="Complete">Complete</option>
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Payment Rcv</label>
//                   <input
//                     type="number"
//                     name="cashIn"
//                     value={selectedCampaign.cashIn}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2 mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Method</label>
//                   <select
//                     name="method"
//                     value={selectedCampaign.method}
//                     onChange={handleInputChange}
//                     className="w-full border rounded p-2 mt-1"
//                   >
//                     <option value="bKash Personal">bKash Personal</option>
//                     <option value="bKash Marcent">bKash Marcent</option>
//                     <option value="Nagad Personal">Nagad Personal</option>
//                     <option value="Rocket Personal">Rocket Personal</option>
//                     <option value="bank">Bank</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="bg-red-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-red-600"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-blue-600"
//                   >
//                     Update
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}
  
//         <ToastContainer />
//       </div>
//     );
//   }


// };

// export default CampaignTable;

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCampaings from '../../Hook/useCampaign';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUsers from '../../Hook/useUsers';

const CampaignTable = () => {
  const [campaigns, refetch] = useCampaings();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AxiosPublic = UseAxiosPublic();

  const [users] = useUsers();

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
    const tBudget = e.target.tBudget.value;
    const amountSpent = e.target.amountSpent.value;
    const status = e.target.status.value;
    const cashIn = e.target.cashIn.value;
    const method = e.target.method.value;
    
    const body = { tBudget, amountSpent, status, cashIn, method };
    console.log(body);

    AxiosPublic.patch(`http://localhost:5000/campaings/${selectedCampaign._id}`, body)
      .then(res => {
        console.log(res.data);
        refetch();
        toast.success('Campaign updated successfully');
        closeModal();
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to update campaign');
      });
  };

  if (users.role === "admin") {
    return null;
  }

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
                  <option value="bank">Bank</option>
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

