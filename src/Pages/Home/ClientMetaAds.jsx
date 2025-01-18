import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useFindClient from "./useFindClient";
import SummaryCard from "./SummeryCard";
import useMyAdsAccountByEmail from "../../Hook/useMyAdsAccountNyEmail";
import useUserr from "../../Hook/useUser";

const ClientMetaAds = ({data1}) => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    const initialTab = localStorage.getItem("activeTabClientProfile") || "clientCampaign";
    const data2 = isNaN(data1) ? initialTab : data1; // Use isNaN() to check if data1 is NaN
    const param = useParams();
    const {findClients , refetch}=useFindClient(param?.email)
    const AxiosPublic = UseAxiosPublic();
    
    const [myAdsAccount]=useMyAdsAccountByEmail(user?.email)
    console.log(myAdsAccount);

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
      const clientName = findClients?.clientName;
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
        role:data2,
        clientName,
      };
    
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
            <div>

            <div  className="grid grid-cols-2 mt-5  rounded-lg md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-3 lg:gap-3 justify-around ">
        <SummaryCard title="Total Spend" value={findClients?.campaings?.reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2) || 0} />
        <SummaryCard title="Total Bill" value={findClients?.campaings?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(0) || 0} />

        <SummaryCard title="Total Paid" value={findClients?.payments?.reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(0)} />
        <SummaryCard
  title={`Total ${
    (findClients?.campaings?.reduce(
      (acc, campaign) =>
        acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
      0
    ) || 0) -
      (findClients?.payments?.reduce(
        (acc, payment) => acc + parseFloat(payment?.amount || 0),
        0
      ) || 0) >= 0
      ? "Due"
      : "Advance"
  }`}
  value={(
    Math.abs(
      (findClients?.campaings?.reduce(
        (acc, campaign) =>
          acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
        0
      ) || 0) -
        (findClients?.payments?.reduce(
          (acc, payment) => acc + parseFloat(payment?.amount || 0),
          0
        ) || 0)
    ) || 0
  ).toFixed(0)}
/>

      </div>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="  rounded-lg p-5 mx-1 my-5 ">
        
  <div>

  {
      user && 
      <button
      className="add mb-5"
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
              <h1>{`Add ${data2.charAt(0).toUpperCase() + data2.slice(1).toLowerCase()} Campaing`}</h1>
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
              <label className="block text-black">
               {`${data2.charAt(0).toUpperCase() + data2.slice(1).toLowerCase()} Account`}
              </label>
                <select
                required
                  name="adsAccount"
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-2"
                >
              <option className="text-black" value="">
                      {`Select ${data2.charAt(0).toUpperCase() + data2.slice(1).toLowerCase()}`}
                  </option>

                  {myAdsAccount?.filter(f => f.role === `${data2}Account`).map((ads) => (
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
                  defaultValue={data1 === 'metaAds' ? 145 : 150}
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

  <div  className="table-div " >
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >  
              {
                    user && <th  className="p-3 text-center">{findClients?.metaAds?.filter(f=>f.role === 'metaAds')?.length}</th>}
                
                <th >Date</th>
                <th >Campaign Name</th>
                <th >Page Name</th>
                <th >Ads Account</th>
                <th >T. Budget</th>
                <th >T. Spent</th>
                <th >Total Bill</th>
                
                   {
                    user &&  <th >Status</th>
                }
                
              </tr>
            </thead>
            <tbody>
              {findClients?.campaings?.filter(f=>f.role === data2)?.map((work, index) => (
                 <tr 
                 key={work._id}
                 className={`tr2`}
               >
                

                {
      user && <td  className="text-center">
      <div className="f-center">
                
      <button
         className=" delete"
        onClick={() => handledelete(work.ids ,work.id,)}
      >
       <span >
        <FaMinusSquare  />
        </span>
      </button>
    </div>  </td>
      }

    
                      
                  <td >
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td >
                  {
      user ? <button
      className="f-start edit"
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
    </button> : <span>
{work.campaignName
.split(' ') // Split the campaign name into words
.slice(0, 4) // Take only the first 6 words
.join(' ') // Join the words back into a string
+ (work.campaignName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
}
</span>
      }
                  
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

className="input2"
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
className="input2"
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
className="input2"
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
className="input2"
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
className="input2"
/>
</div>

<div className="grid grid-cols-2 gap-3 mt-4">
<button
type="button"
className="close"
onClick={() =>
document.getElementById(`modal_${work.ids}`).close()
}
>
Close
</button>
<button
type="submit"
className="add"
>
Update
</button>

</div>
</form>
</div>
                </dialog>
                  
                  </td>
                  <td >
                  
                   {work.pageName
    .split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.pageName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  } 
                  
                  </td>
                  
                  <td  >
                    {work.adsAccount}
                  </td>

                  <td >
  $ {Number(work?.tBudged || 0).toFixed(2)}
</td>

<td >
  $ {Number(work?.tSpent || 0).toFixed(2)}
</td>


                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {parseInt(work.tSpent * work.dollerRate)}
                  </td>

                  
                     {
                      user &&                   <td className="text-center">
                      <label className="status-label">
                      <input
                        type="checkbox"
                        checked={work.status === "Active"}
                        onChange={() => {
                          const newStatus = work.status === "Active" ? "Complete" : "Active";
                          handleUpdate2(work.ids, work.id, newStatus);
                        }}
                      />
                      <div className={work.status === "Active" ? "active" : "inactive"}>
                        <span className={work.status === "Active" ? "active" : ""}></span>
                      </div>
                    </label>
                    
                      </td>
                  }

                 
                </tr>
              ))}
              <tr  className="tr1 font-bold">
              {
                      user && 
                <td ></td> }
                <td className=" text-right" colSpan="4">
                  Total:
                </td>
                <td  >
                  <span className="text-sm mr-1 font-extrabold">$</span>{""}
                  {findClients?.campaings?.filter(f=>f.role === data2)?.reduce((acc, payment) => acc + parseFloat(payment?.tBudged || 0), 0).toFixed(2)}
                </td>
                <td  >
                  <span className="text-sm mr-1 font-extrabold">$</span>{""}
                  {findClients?.campaings?.filter(f=>f.role === data2)?.reduce((acc, payment) => acc + parseFloat(payment?.tSpent || 0), 0).toFixed(2)}
                </td>
                <td >
                  <span className="text-sm mr-1 font-extrabold">৳</span>{""}
                  {findClients?.campaings?.filter(f=>f.role === data2)?.reduce(
    (acc, campaign) =>
      acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
    0
  ).toFixed(0)}
                </td>
                {userr?.role === "admin" ? (
                  <>
                    <td ></td>
                  
                  </>
                ) : (
                  <>
                   {
                      user && 
                   <td ></td>
                   }
                 
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

export default ClientMetaAds;