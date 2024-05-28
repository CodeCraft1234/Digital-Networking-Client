import  {  useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCampaings from '../../Hook/useCampaign';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { split } from 'postcss/lib/list';
import EmployeerMouthlySelery from './EmployeerMouthlySelery';
import useClients from '../../Hook/useClient';
import { Form, Link } from 'react-router-dom';
import useAdsAccount from '../../Hook/useAdAccount';

const CampaignTable = ({email}) => {

console.log(email)
  const [clients,refetch]=useClients()
  const [adsAccount]=useAdsAccount()
  const AxiosPublic = UseAxiosPublic();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [data, setUserData] = useState([]);
  const [users] = useUsers();
  const [user, setUser] = useState(null);
  console.log('kjhgfaklhgklagshkl',clients,adsAccount)



  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  console.log(totalSpent,totalBudged,totalRCV,totalbill)

  useEffect(() => {
    const filtered = clients.filter(campaign => campaign.employeeEmail === email);
    console.log(filtered);

    const totalRcv = filtered.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);


    }, 0);
    setTotalRCV(totalRcv);

        const tspent = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tSpent), 0);
        setTotalSpent(tspent);

        const total = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tBudged), 0);
        setTotalBudged(total);

        const totalBill = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tBill), 0);
        setTotalBill(totalBill);



    setFilteredCampaigns(filtered);
  }, [clients, email]);

  const [adsAccounts, setAdsAccounts] = useState([]);
 
  useEffect(() => {
    const filterdata = adsAccount.filter(m => m.employeeEmail === email);
    console.log(filterdata);
    setAdsAccounts(filterdata);
  }, [adsAccount, email]);

  const handlePayment=(e)=>{

  }

  const handleAddAdsAcount=(e)=>{
    e.preventDefault() 
    const accountName=e.target.accountName.value
    const issueDate=e.target.issueDate.value 
    console.log(accountName,issueDate) 
    const employeeEmail=email 
    const data={accountName,issueDate,employeeEmail} 

    AxiosPublic.post('http://localhost:5000/adsAccount',data)
    .then(res=>{
     console.log(res.data)
     toast.success("add successful");
    })

  }
  

    const handleaddblog=(e)=>{
        e.preventDefault()
        const clientName=e.target.clientName.value
        const clientPhone=e.target.clientPhone.value
        const clientEmail=e.target.clientEmail.value
        const employeeEmail=email
        const tBudged=0
        const tSpent=0
        const tBill=0
        const tDue=0
        const tPaid=0
        const date=e.target.date.value
        const data={clientName,clientEmail,clientPhone,tBudged,employeeEmail,tSpent,tBill,date, tDue,tPaid}
       console.log(data)

       AxiosPublic.post('http://localhost:5000/clients',data)
       .then(res=>{
        console.log(res.data)
       })

       }

  return (
    <div>

<div className="  grid px-24 lg:grid-cols-6 items-center gap-5 justify-center mt-24">
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44 ' src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 44,000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44' src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 44,000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14  mx-auto text-center w-44' src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : $ 1000.00</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44' src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 1000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-8 mx-auto text-center w-72' src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
        <p className='text-xl mt-5 text-center font-bold'>T.USD : $4000</p>
        <p className='text-xl text-center font-bold'>T.Spent: ${totalSpent}</p>
      </div>
      <div className=" px-10 py-3 bg-white shadow-2xl  rounded-lg">
        <p className='text-xl text-center font-bold'> T.Balance: ৳ 1000</p>
        <p className='text-xl text-center font-bold'>T.Received: ৳ {totalRCV}</p>
        <p className='text-xl text-center font-bold'>T.Cash Out: ৳ 10000</p>
      </div>
    </div>
    <div className='flex justify-start items-center gap-3'>
    <div>
<button className="font-avenir px-3 mt-10 mx-auto py-1 bg-neutral ml-10 rounded text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Add Ads Account</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <form onSubmit={(e) => handleAddAdsAcount(e)}>
                               <div className="flex justify-center items-center gap-3">
                               <div className="mb-4">
                                    <label className="block text-gray-700">Account Name</label>
                                    <input type="type" name="accountName" placeholder='type here...' className="w-full border rounded p-2 mt-1" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Issue Date</label>
                                    <input type="date" name="issueDate" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                </div>
                               </div>
                                <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded flex justify-center text-white">Send</button>
                            </form>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
    </div>

    <div>
              <button className="font-avenir px-3 mt-10 mx-auto py-1 bg-neutral ml-10 rounded text-white" onClick={() => document.getElementById('my_modal_2').showModal()}>Add Client</button>
                    <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                        <section className="p-6 mt-24 dark:text-gray-100">
               
               <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
               <div>
               <h1 className="text-3xl my-4 text-center font-bold  text-white">Add a Client </h1>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                 <label for="date" className="block mb-1 ml-1">Date</label>
                 <input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
                   <div>
                 <label for="name" className="block mb-1 ml-1">Client Name</label>
                 <input id="name" name="clientName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
                  
                  
                   </div>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                 <label for="name" className="block mb-1 ml-1">Client Phone</label>
                 <input id="name" name="clientPhone" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
                   <div>
                 <label for="name" className="block mb-1 ml-1">Client Email</label>
                 <input id="name" name="clientEmail" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
               
                   </div>
                </div>
                  <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
                 </Form>
                         </section>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
    </div>
    
    <div>
              <button className="font-avenir px-3 mt-10 mx-auto py-1 bg-neutral ml-10 rounded text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Cashout</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <form onSubmit={(e) => handlePayment(e)}>
                               <div className="flex justify-center items-center gap-3">
                               <div className="mb-4">
                                    <label className="block text-gray-700">Previous Received</label>
                                    <input type="number" disabled name="previousReceived" defaultValue={56345623} className="w-full border rounded p-2 mt-1" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Pay Amount</label>
                                    <input type="number" name="payAmount" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                </div>
                               </div>
                                <div className="flex justify-center items-center gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Payment Method</label>
                                        <select name="paymentMethod" className="w-full border rounded p-2 mt-1">
                                            <option value="bkashMarchent">Bkash Marchent</option>
                                            <option value="rocketPersonal">Bkash Personal</option>
                                            <option value="rocketPersonal">Nagad Personal</option>
                                            <option value="rocketPersonal">Rocket Personal</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date</label>
                                        <input type="date" name="date" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                    </div>
                                </div>
                                <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded flex justify-center text-white">Send</button>
                            </form>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
    </div>

    </div>
   
      <div className="p-2  sm:p-4 dark:text-green-600">
        <h2 className="mb-4 text-6xl text-green-600 text-center font-semibold leading-tight">
         Client Campaign Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Client Name</th>
                <th className="p-3 text-center">Client Phone</th>
                {/* <th className="p-3 text-center">Client Email</th> */}
                <th className="p-3 text-center">T.Budget</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Total Bill</th>
                <th className="p-3 text-center">Total Payment Rcv</th>
              </tr>
            </thead>
            <tbody>
  {filteredCampaigns.map((campaign) => (
    <tr key={campaign._id} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
      <td className="p-3 text-center">{campaign.date}</td>
    
           <Link to={`/client/${campaign.clientEmail}`}>
                 <td className="p-3 text-center">{campaign.clientName}</td>
          </Link>
      <td className="p-3 text-center">{campaign.clientPhone}</td>
      <td className="p-3 text-center">{campaign.tBudged}</td>
      <td className="p-3 text-center">{campaign.tSpent}</td>
      <td className="p-3 text-center">{campaign.tBill}</td>
      <td className="p-3 text-center">{campaign.tPayment}</td>
          </tr>
         ))}
         <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right" colSpan="2">Total :</td>
                                <td className="p-3 text-center">{totalBudged}</td>
                                <td className="p-3 text-center"> {totalSpent}</td>
                                <td className="p-3 text-center">{totalbill}</td>
                                <td className="p-3 text-center">{totalRCV}</td>
                            </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* //////////////////////////////////////////////////////////// */}
      <div className="mt-24 p-4">
      <h6 className="text-center uppercase font-bold text-3xl md:text-5xl text-green-800">
        User Ads Account Activities
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
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
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 text-center">{account.issueDate}</td>
                <td className="p-3 text-center">{account.accountName}</td>
                <td className="p-3 text-center">
                 00
                </td>
                <td className="p-3 text-center">
                 00
                </td>
                <td className="p-3 text-center">
                00
                </td>
                <td className="p-3 text-center">
                active
                </td>
                <td className="p-3 text-center">
                                        <button className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById(`modal_${index}`).showModal()}>Edit</button>
                                        <dialog id={`modal_${index}`} className="modal">
                                            <div className="modal-box">
                                                <form >
                                                    <div className="flex justify-center items-center gap-3">
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">Previous Spent</label>
                                                            <input type="number" disabled name="previousSpent" className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">New Spent</label>
                                                            <input type="number" name="newSpent" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-3">
                                                    <div className="mb-4">
                                                            <label className="block text-gray-700">Dollers Rate</label>
                                                            <input type="number" name="dollerRate" defaultValue={140} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700">Status</label>
                                                        <select name="status" className="w-full border rounded p-2 mt-1">
                                                            <option value="In Review">In Review</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Complete">Complete</option>
                                                        </select>
                                                    </div>
                                                    </div>
                                                   
                                                    <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white">Update</button>
                                                </form>
                                                <div className="modal-action">
                                                    <button className="btn" onClick={() => document.getElementById(`modal_${index}`).close()}>Close</button>
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
      {/* //////////////////////////////////////////////////////////// */}
      <EmployeerMouthlySelery email={email}></EmployeerMouthlySelery>
    </div>

  );
};
export default CampaignTable;