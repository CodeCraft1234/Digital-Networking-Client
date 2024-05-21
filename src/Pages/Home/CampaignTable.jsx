import React, { useState } from 'react';
import useCampaings from '../../Hook/useCampaign';
import { Form } from 'react-router-dom';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';

const CampaignTable = () => {

  const [campaigns,refetch]=useCampaings()
  const [data,setdata]=useState()
  const AxiosPublic=UseAxiosPublic()
  console.log(data)
  

  const handleaddblog=(e)=>{
    e.preventDefault()
    const totalSpent=e.target.totalSpent.value
    const status=e.target.status.value
    const paymentReceived=e.target.paymentReceived.value
    const paymentMethode=e.target.paymentMethode.value
    const data={totalSpent,status,paymentReceived,paymentMethode}
   console.log(data)
   setdata(data)

  

   }

   const hadleclick=(id)=>{
    console.log(data)
    
    AxiosPublic.patch(`http://localhost:5000/campaings/${id}`,data)
    .then(res=>{
     console.log(res.data)
     refetch()
    })
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
                <th className="p-3 text-center">T.Budged</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center"> Payment Rcv</th>
                <th className="p-3 text-center">Method</th>
                <th className="p-3 text-center">Edit</th>
              </tr>
            </thead>
            {
                  campaigns.map(ini=><tbody key={ini.id}>
                    <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                        <td className="p-3 text-center">{ini.date}</td>
                        <td className="p-3 text-center">{ini.campaignName}</td>
                        <td className="p-3 text-center">{ini.pageName}</td>
                        <td className="p-3 text-center">{ini.totalBudged}</td>
                        <td className="p-3 text-center">{ini.totalSpent}</td>
                        <td className="p-3 text-center">{ini.status}</td>
                        <td className="p-3 text-center">{ini.paymentReceived}</td>
                        <td className="p-3 text-center">{ini.paymentMethode}</td>
                        <td><button className="font-avenir  px-3 py-1 bg-neutral rounded text-white" onClick={()=>document.getElementById('my_modal_5').showModal()}>Edit</button></td>
                        {/* Open the modal using document.getElementById('ID').showModal() method */}

<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
<section className="p-6 mt-24 dark:text-gray-100">
               
               <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
               <div>
               <h1 className="text-3xl my-4 font-bold  text-white">Update </h1>
                   <div>
                 <label for="name" className="block mb-1 ml-1">Total Spent</label>
                 <input id="name" name="totalSpent" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
               <label for="name" className="block mb-1 ml-1">Status</label>
                 <select name="status" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800">
                    <option disabled selected>Status</option>
                   <option> Review</option>
                   <option>Active</option>
                  <option>Complete</option>
              </select>
              <div>
                 <label for="name" className="block mb-1 ml-1">Payment Received</label>
                 <input id="name" name="paymentReceived" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
               </div>
                   <div>
                 <label for="name" className="block mb-1 ml-1">Payment Method</label>
                 <select name="paymentMethode" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800">
                    <option disabled selected>Select</option>
                   <option>bkashMarcent</option>
                   <option>bkashPersonal</option>
                  <option>nagadPersonal</option>
                  <option>rocketPersonal</option>
              </select>
               </div>
                </div>
                  <button onClick={()=>hadleclick(ini._id)} className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
                  <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Close</button>
      </form>
    </div>
                 </Form>
                         </section>
                        
</dialog>
                      </tr>
                    </tbody>)
            }
            
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
