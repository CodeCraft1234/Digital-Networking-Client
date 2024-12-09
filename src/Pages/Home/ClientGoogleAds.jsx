import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from "sweetalert2";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";

import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useFindClient from "./useFindClient";

const ClientGoogleAds = () => {
    const { user } = useContext(AuthContext);
    const param = useParams();
    const {findClients , refetch}=useFindClient(param?.email)
    const [campaignss]=useCampaingsByEmail(param?.email)
    const [clients]=useClients()
    const [datas,setdatas]=useState()
    const AxiosPublic = UseAxiosPublic();
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [adsAccount] = useAdsAccount();
    const [adsAccounts, setAdsAccounts] = useState([]);

    useEffect(() => {
        const realdata = clients.find((m) => m.clientEmail === param?.email);
        setdatas(realdata)

        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 


      const filterdata = adsAccount.filter(
        (m) => m.employeeEmail === user?.email
      );
      setAdsAccounts(filterdata);

    }, [clients, users, user, param?.email, campaignss, adsAccount]);

    const generateRandomId = () => {
      let randomId = '';
      for (let i = 0; i < 20; i++) {
        randomId += Math.floor(Math.random() * 10); // Append a random digit (0-9)
      }
      return randomId;
    };
    
    
    const handleaddblog = (e) => {
      e.preventDefault();
      const campaignName = e.target.campaignName.value;
      const clientEmail = param?.email;
      const pageName = e.target.pageName.value;
      const clientName = datas?.clientName;
      const tBudged = e.target.totalBudged.value;
      const pageUrl = e.target.pageUrl.value;
      const adsAccount = e.target.adsAccount.value;
      const dollerRate = e.target.dollerRate.value;
      const email = user?.email;
      const tSpent = tBudged;
      const status = "Active";
      const date = e.target.date.value;
      const ids = param?.email;
      const idss=generateRandomId()
    
      const campaings = {
        campaignName,
        clientEmail,
        pageName,
        adsAccount,
        id: ids,
        ids: parseInt(idss),
        status,
        pageUrl,
        tBudged,
        email,
        tSpent,
        dollerRate,
        date,
        role:'googleAds',
        clientName,
      };

      console.log(campaings);
    
      const datas2 = {
        title: `Added ${campaignName} in Client campaign`,
        date: new Date(),
        user: user?.displayName,
      };
    
    
      AxiosPublic.post("/clients/campaings", { // Correct endpoint
        id: ids,
        campaings,
      })
        .then((res) => {
          console.log(res.data);
          AxiosPublic.post("/activity", datas2).then(() => {
            toast.success(`${campaignName} has been successfully updated`);
          });
          document.getElementById(`my_modal_2`).close();
          refetch();
        });
    };


    const handleUpdate = (e, ids, id) => {
      e.preventDefault();
      const tSpent = e.target.totalSpent.value;
      const campaignName = e.target.campaignName.value;
      const dollerRate = e.target.dollerRate.value;
      const tBudged = e.target.tBudged.value;
      const body = { tSpent,campaignName, dollerRate, tBudged };
      console.log(body,ids, id);

      const datas = {
        title: `Updated ${campaignName} in My Clients`,
        date: new Date(),
        user: user?.displayName,
      };
  
      AxiosPublic.patch(`/clientCampaings/update/${id}/${ids}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
          AxiosPublic.post("/activity", datas).then(() => {
            document.getElementById(`modal_${ids}`).close();
            toast.success(`${campaignName} has been successfully updated`);
          });
          document.getElementById(`modal_${ids}`).close();
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
    };


    const handledelete = (ids, id) => {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
          if (result.isConfirmed) {
              AxiosPublic.delete(`/clientCampaings/delete/${id}/${ids}`)
                  .then((res) => {
                      toast.success("Campaign deleted successfully!");
                      refetch(); // Refresh data after deletion
                  })
                  .catch((error) => {
                      console.error("Error deleting campaign:", error);
                      toast.error("Failed to delete the campaign. Please try again.");
                  });
          }
      });
  };
  
    const handleUpdate2 = (ids, id, status) => {
      const activityData = {
          title: `Updated ${status} in Client campaigns`,
          date: new Date(),
          user: user?.displayName,
      };
      
      AxiosPublic.put(`/clientCampaings/${id}/${ids}`, { status })
          .then((res) => {
              console.log("Update Response:", res.data);
              refetch(); // Refresh data after update
  
              // Log the activity
              AxiosPublic.post("/activity", activityData)
                  .then(() => {
                      document.getElementById(`modal_${id}`).close();
                      toast.success(`${status} has been successfully updated`);
                  })
                  .catch((activityError) => {
                      console.error("Activity log error:", activityError);
                      toast.error("Activity logging failed");
                  });
  
              toast.success("Campaign updated successfully");
          })
          .catch((error) => {
              console.error("Error updating campaign:", error);
              toast.error("Failed to update campaign");
          });
  };
  
       const today = new Date();
       const formattedDate = today.toISOString().split('T')[0];  // "YYYY-MM-DD" format
       

    return (
        <div>
            <div className="p-5">

            <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}  className="grid grid-cols-2  rounded-lg md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-3 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Spent</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2"> $ {findClients?.campaings?.reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Bill</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2">
             <span className="lg:text-2xl text-xl font-extrabold">৳</span> {findClients?.campaings?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(0)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Paid</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2"> <span className="lg:text-2xl text-xl font-extrabold">৳</span> {findClients?.payments?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total <span>
  {((findClients?.campaings?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(2) - findClients?.payments?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2)).toFixed(0))  >= 0 ? 'Due' : 'Advance'}
</span>
</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2">
          <span className="lg:text-2xl text-xl font-extrabold">৳</span> {Math.abs((findClients?.campaings?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(2) - findClients?.payments?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2)).toFixed(0)) || 0}
          </p>
        </div>
          </div>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="  rounded-lg p-5 mx-1 my-5 ">
        
  <div>

    {
      ddd?.role ==='employee' && 
      <button
      className="font-avenir hover:bg-indigo-700 px-5 p-2 lg:w-auto w-full mx-auto   bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add Campaign
    </button>
    }
   
    <dialog id="my_modal_2" className="modal overflow-hidden">
      <div className="modal-box bg-white">
        <section className="dark:text-gray-100">
          <Form
            onSubmit={handleaddblog}
            className=" w-full  p-1 mx-auto space-y-5 rounded-md  text-black font-bold"
          >
            <div>
              <h1 className="text-2xl mb-4 text-center font-bold text-black">
                Add a Campaign
              </h1>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  placeholder="type...."
                  required
                  defaultValue={formattedDate}
                  className="w-full border border-gray-600 text-black bg-green-300 rounded p-2 mt-1"
                />
              </div>

            <div className="grid lg:grid-cols-2 gap-3 items-center">
            <div className="mb-4">
                <label htmlFor="name" className="block mb-1 ml-1">
                  Campaign Name
                </label>
                <input
                  id="name"
                  name="campaignName"
                  type="text"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Ads Account</label>
                <select
                
                  name="adsAccount"
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-2"
                >
                  <option className="text-black" value="">
                    All Ads Account
                  </option>
                  {adsAccounts.map((ads) => (
                    <option key={ads._id} value={ads?.accountName}>
                      {ads?.accountName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
            <div className="mb-4">
                <label htmlFor="pageName" className="block mb-1 ml-1">
                  Page Name
                </label>
                <input
                  id="pageName"
                  name="pageName"
                  type="text"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 ml-1">
                Page Url <span className="text-red-600">(Optional)</span>
                </label>
                <input
                  id="name"
                  name="pageUrl"
                  type="text"
                  placeholder="type...."
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
            </div>
                <div className="flex items-center gap-3">
               
              <div>
                <label htmlFor="totalBudged" className="block mb-1 ml-1">
                  Total Budged
                </label>
                <input
                  step="0.01"
                  id="totalBudged"
                  name="totalBudged"
                  type="number"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div>
                <label htmlFor="dollerRate" className="block mb-1 ml-1">
                  Doller Rate
                </label>
                <input
                  step="0.01"
                  id="dollerRate"
                  name="dollerRate"
                  type="number"
                  placeholder="type dollerRate"
                  defaultValue={140}
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
            <button
                type="button"
                className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
                onClick={() => document.getElementById("my_modal_2").close()}
              >
                Close
              </button>
              <button
                type="submit"
                className="font-avenir px-3 py-2 hover:bg-indigo-700 bg-[#05a0db] rounded-lg text-white text-center"
              >
                Submit
              </button>
              
            </div>
          </Form>
        </section>
      </div>
    </dialog>
  </div>

  <div  className="overflow-x-auto rounded-xl mt-5  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>  
                <th style={{  border: 'var(--border)'}} className="p-3">{findClients?.metaAds?.filter(f=>f.role === 'googleAds')?.length}</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Date</th>
                <th style={{  border: 'var(--border)'}} className="p-3 text-start">Campaign Name</th>
                <th style={{  border: 'var(--border)'}} className="p-3 text-start">Page Name</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Ads Account</th>
                <th style={{  border: 'var(--border)'}} className="p-3">T. Budget</th>
                <th style={{  border: 'var(--border)'}} className="p-3">T. Spent</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Total Bill</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Status</th>
 
              </tr>
            </thead>
            <tbody>
              {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.map((work, index) => (
                 <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                 key={work._id}
                 className={`${
                   index % 2 === 0
                     ? "bg-white text-left text-black border-b border-opacity-20"
                     : "bg-gray-200  text-left text-black border-b border-opacity-20"
                 }`}
               >
                <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
      <div className="flex justify-center gap-3">
                
                        <button
                           className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
                          onClick={() => handledelete(work.ids ,work.id,)}
                        >
                         <span >
                          <FaMinusSquare  />
                          </span>
                        </button>
                      </div>
     </td>
                      
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-left">
                  <button
                        className=" flex justify-center items-center gap-1   px-2 py-1 rounded"
                        onClick={() =>
                          document.getElementById(`modal_${work.ids}`).showModal()
                          }
                      >
                       <FaEdit /> 
                       <span>
  {work.campaignName
    .split(' ') // Split the campaign name into words
    .slice(0, 4) // Take only the first 6 words
    .join(' ') // Join the words back into a string
    + (work.campaignName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  }
</span>
                      </button>
                      <dialog id={`modal_${work.ids}`} className="modal">
<div className="modal-box bg-white text-black">
<form onSubmit={(e) => handleUpdate(e, work.ids ,work.id)}>
<div className="mb-4">
<label className="block text-left text-gray-700">
Campaign Name
</label>
<input
type="text"
name="campaignName"
defaultValue={work.campaignName}

className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>
<div className="mb-4">
<label className="block text-left text-gray-700">
Account Name
</label>
<input
type="text"
name="adsAccount"
defaultValue={work.adsAccount}
disabled
className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>

<div className="mb-4">
<label className="block text-left text-gray-700">
Total Budged
</label>
<input
type="number"
name="tBudged"
defaultValue={work.tBudged}
step="0.01"
className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>
<div className="mb-4">
<label className="block text-left text-gray-700">
Total Spent
</label>
<input
type="number"
name="totalSpent"
defaultValue={work.tSpent}
step="0.01"
className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>

<div className="mb-4">
<label className="block text-left text-gray-700">
Dollers Rate
</label>
<input
step="0.01"
type="number"
name="dollerRate"
defaultValue={work.dollerRate}
className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>

<div className="grid grid-cols-2 gap-3 mt-4">
<button
type="button"
className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
onClick={() =>
document.getElementById(`modal_${work.ids}`).close()
}
>
Close
</button>
<button
type="submit"
className="font-avenir hover:bg-indigo-700 px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
>
Update
</button>

</div>
</form>
</div>
                </dialog>
                  
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-left">
                  
                   {work.pageName
    .split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.pageName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  } 
                  
                  </td>
                  
                  <td  style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                    {work.adsAccount}
                  </td>

                  <td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-200 text-center">
  $ {Number(work?.tBudged || 0).toFixed(2)}
</td>

<td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-200 text-center">
  $ {Number(work?.tSpent || 0).toFixed(2)}
</td>


                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {parseInt(work.tSpent * work.dollerRate)}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={work.status === "Active"}
    onChange={() => {
      const newStatus = work.status === "Active" ? "Complete" : "Active";
      handleUpdate2(work.ids ,work.id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      work.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        work.status === "Active" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
                   </td>

                 
                
                </tr>
              ))}
              <tr style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" font-bold">
                <td  className="p-3  text-center"></td>
                <td   className="p-3 text-right" colSpan="4">
                  Total:
                </td>
                <td  style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">$</span>{" "}
                  {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.reduce((acc, payment) => acc + parseFloat(payment?.tBudged || 0), 0).toFixed(2)}
                </td>
                <td  style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">$</span>{" "}
                  {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">৳</span>{" "}
                  {findClients?.campaings?.filter(f=>f.role === 'googleAds')?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(0)}
                </td>
                {ddd?.role === "admin" ? (
                  <>
                    <td style={{  border: 'var(--border)'}} className="p-3 text-center"></td>
                  
                  </>
                ) : (
                  <>
                   <td style={{  border: 'var(--border)'}} className="p-3 text-center"></td>

                 
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        </div>

      </div>
        </div>
    );
};

export default ClientGoogleAds;