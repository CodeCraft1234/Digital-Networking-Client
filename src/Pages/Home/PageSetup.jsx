import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, Link, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from "sweetalert2";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useFindClient from "./useFindClient";
import MyClients from "./Clients";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import useUserr from "../../Hook/useUser";

const PageSetup = () => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    const param = useParams()
    const [campaignss]=useCampaingsByEmail(param?.email)
    const [clients]=useClients()
    const [datas,setdatas]=useState()
    const AxiosPublic = UseAxiosPublic();
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalBills, setTotalBills] = useState(0);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [adsAccount] = useAdsAccount();


    const initialTab3 =
    userr?.role === "admin"
      ? localStorage.getItem("activeTaballcampaignmonthsss8") || "all"
      : user?.email;

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem("activeTaballcampaignmonthsss8", tab); // Update localStorage
  };

    const [myclients,refetch] = useMyClientsByEmail(selectedEmployee3);

    useEffect(() => {
        const realdata = clients.find((m) => m.clientEmail === param?.email);
        setdatas(realdata)

        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 

      const totalBill = campaignss.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
      );
      setTotalBills(totalBill);
    
      const totalSpent = campaignss.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent),
        0
      );
      setTotalSpent(totalSpent);


    }, [clients, users, user, param?.email, campaignss, adsAccount]);


    const handleUpdate = (e, ids, id) => {
      e.preventDefault();
    
      const itemName = e.target.itemName.value;
      const totalBill = e.target.totalBill.value;
      const totalPaid = e.target.totalPaid.value;

      const body = { itemName, totalPaid, totalBill };

      const datas = {
        title: `Updated ${itemName} in My Clients`,
        date: new Date(),
        user: user?.displayName,
      };
    
      AxiosPublic.patch(`/clientPageService/updates/${id}/${ids}`, body)
        .then((res) => {
          console.log("Update response:", res.data);
          refetch();
    
          AxiosPublic.post("/activity", datas).then(() => {
            const modalElement = document.getElementById(`modal_${ids}`);
            if (modalElement) {
              modalElement.close();
            }
            toast.success(`${itemName} has been successfully updated`);
          });
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
    };
    
  
    const handleaddblog = (e) => {
      e.preventDefault();
      const itemName = e.target.itemName.value;
      const clientEmail = param?.email;
      const pageName = e.target.pageName.value;
      const clientName = datas?.clientName
      const totalBill = e.target.totalBill.value;
      const pageUrl = e.target.pageUrl.value;
      const email = user?.email;
      const status = "Active";
      const date = e.target.date.value;
      const ids = param?.email;

      const generateRandomId = () => {
        let randomId = '';
        for (let i = 0; i < 20; i++) {
          randomId += Math.floor(Math.random() * 10); // Append a random digit (0-9)
        }
        return randomId;
      };

      const idu=generateRandomId()
  
      const pageService = {
        itemName,
        id: ids,
        ids: parseFloat(idu),
        clientEmail,
        pageName,
        status,
        pageUrl,
        totalBill,
        email,
        date,
        clientName
      };
    
      const datas2 = {
        title: `Added ${itemName} in Client campaign`,
        date: new Date(),
        user: user?.displayName,
      };
  
      AxiosPublic.post("/clients/pageService", { // Correct endpoint
        id: ids,
        pageService,
      })
      .then((res) => {
        console.log(res.data);
        AxiosPublic.post("/activity", datas2).then(() => {
          toast.success(`${itemName} has been successfully updated`);
        });
        document.getElementById(`my_modal_2`).close();
        refetch();
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
              AxiosPublic.delete(`/clientPageService/delete/${id}/${ids}`)
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
    
    AxiosPublic.put(`/clientPageService/${id}/${ids}`, { status })
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

       const [totalPaymeent, setTotalPayment] = useState([]);
       const [Mpayments]=useMpymentsByEmail(param?.email)
     
       useEffect(() => {
         const totalBill = Mpayments.reduce(
           (acc, campaign) => acc + parseFloat(campaign.amount),
           0
         );
         setTotalPayment(totalBill);
       }, [ Mpayments]);

       const today = new Date();
       const formattedDate = today.toISOString()?.split('T')[0];  // "YYYY-MM-DD" format
       

    return (
        <div>
            <div className="p-5">

            <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}  className="grid grid-cols-2  rounded-lg md:grid-cols-2 lg:grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-3 justify-around p-5">

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-sm font-bold">Total Bill</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2">
             <span className="lg:text-2xl text-xl font-extrabold">৳</span> {myclients?.flatMap(client => client.pageService || [])?.reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(2) || 0}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-sm font-bold">Total Paid</h2>
          <p className="lg:text-2xl text-xl font-bold mt-2"> <span className="lg:text-2xl text-xl font-extrabold">৳</span> {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(2) || 0}</p>
        </div>


          </div>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="  rounded-lg p-5 mx-1 my-5 ">
        
        <div className="flex justify-start gap-3 items-center">
        <div>

<button
className="font-avenir hover:bg-indigo-700 px-5 p-2 lg:w-auto w-full mx-auto   bg-[#05a0db] rounded-lg text-white"
onClick={() => document.getElementById("my_modal_2").showModal()}
>
Add a Item
</button>

<dialog id="my_modal_2" className="modal overflow-hidden">
<div className="modal-box bg-white">
  <section className="dark:text-gray-100">
    <Form
      onSubmit={handleaddblog}
      className=" w-full  p-1 mx-auto space-y-5 rounded-md  text-black font-bold"
    >
      <div>
        <h1 className="text-2xl mb-4 text-center font-bold text-black">
          Add a Item
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
            Item Name
          </label>
          <input
            id="name"
            name="itemName"
            type="text"
            placeholder="type...."
            required
            className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
          />
        </div>
        <div>
          <label htmlFor="totalBudged" className="block mb-1 ml-1">
            Total Bill
          </label>
          <input
            step="0.01"
            id="totalBill"
            name="totalBudged"
            type="number"
            placeholder="type...."
            required
            className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
          />
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
        <div className="w-full lg:w-auto flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
      <select
        style={{
          backgroundColor: "var(--bg-color2)",
          border: "var(--border)",
          color: "var(--text-color2)",
        }}
        className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
        value={selectedEmployee3}
        onChange={(e) => changeTab3(e.target.value)}
      >
        <option value="all">All Employees</option>
        {users
          .filter((u) => u.role === "employee")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  ) : (
   <></>
  )}
</div>
        </div>




  <div  className="overflow-x-auto rounded-xl mt-5  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>  
                <th style={{  border: 'var(--border)'}} className="p-3">{campaignss?.length}</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Date</th>
                <th style={{  border: 'var(--border)'}} className="p-3 text-start">Item Name</th>
                <th style={{  border: 'var(--border)'}} className="p-3 text-start">Page Name</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Total Bill</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Total Paid</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Total Due</th>
                <th style={{  border: 'var(--border)'}} className="p-3">Status</th>
 
              </tr>
            </thead>
            <tbody>
              {myclients?.flatMap(client => client.pageService || [])?.map((work, index) => (
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
                          onClick={() => handledelete( work.ids ,work.id)}
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
  {work.itemName
    ?.split(' ') // Split the campaign name into words
    .slice(0, 4) // Take only the first 6 words
    .join(' ') // Join the words back into a string
    + (work.itemName?.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  }
</span>
                      </button>
                      <dialog id={`modal_${work.ids}`} className="modal">
<div className="modal-box bg-white text-black">
<form onSubmit={(e) => handleUpdate(e, work.ids ,work.id)}>
<div className="mb-4">
<label className="block text-left text-gray-700">
Item Name
</label>
<input
type="text"
name="itemName"
defaultValue={work.itemName}

className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>

<div className="mb-4">
<label className="block text-left text-gray-700">
Total Bill
</label>
<input
type="number"
name="totalBill"
defaultValue={work.totalBill}
step="0.01"
className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
/>
</div>
<div className="mb-4">
<label className="block text-left text-gray-700">
Total Paid
</label>
<input
type="number"
name="totalPaid"
defaultValue={work.totalPaid}
step="0.01"
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
                  
                   <Link to={work.pageUrl}>
                   {work.pageName
    .split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.pageName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  } 
                   </Link>
                  
                  </td>
                  
                

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {work.totalBill || 0}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {work?.totalPaid || 0}
                  </td>

                 

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>
                     {(work.totalBill || 0) - (work?.totalPaid || 0)}
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
                <td   className="p-3 text-right" colSpan="3">
                  Total:
                </td>
                <td  style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">$</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(2) || 0}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">৳</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(2) || 0}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 text-center">
                  <span className="text-sm mr-1 font-extrabold">৳</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(2) - myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(2) || 0}
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

export default PageSetup;