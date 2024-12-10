import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import useMyCampaingsByEmail from "../../Hook/useMyCampaignByEmail";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";

import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";

const MetaAds = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("activeTab") || "all" 
  : localStorage.getItem("activeTab") || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem("activeTab", tab); // Update localStorage
  };

  const [myclients, refetch] = useMyClientsByEmail(selectedEmployee3);

  const AxiosPublic=UseAxiosPublic()
  const [mycampaigns] = useMyCampaingsByEmail(user?.email);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab = localStorage.getItem("activeTabsummeryEmployeess") || "All";
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTabsummeryEmployeess", tab);
  };

  const initialTab2 = localStorage.getItem("activeTaballcampaignmonthsss");
  const [sortMonth, setSortMonth] = useState(initialTab2 || (new Date().getMonth() + 1).toString());

  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballcampaignmonthsss", tab);
  };



  const tspent = mycampaigns
      
  ?.filter(campaign => myclients.some(client => client.clientEmail === campaign.clientEmail))
  console.log(tspent,mycampaigns);

  const filteredItems = tspent.filter((item) =>
    item?._id.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const displayedItems = myclients.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < myclients.length;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleUpdate = (e, ids, id) => {
    e.preventDefault();
    const tSpent = e.target.totalSpent.value;
    const campaignName = e.target.campaignName.value;
    const dollerRate = e.target.dollerRate.value;
    const tBudged = e.target.tBudged.value;
    const body = { tSpent,campaignName, dollerRate, tBudged };

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
            AxiosPublic.delete(`/clientCampaing/delete/${id}/${ids}`)
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
    
    AxiosPublic.put(`/clientCampaing/${id}/${ids}`, { status })
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


     const handleaddblog = (e) => {
      e.preventDefault();
      const clientName = e.target.clientName.value;
      const clientPhone = e.target.clientPhone.value;
      const clientEmail = e.target.clientEmail.value;
      const employeeEmail = selectedEmployee3;
      const tBudged = 0;
      const tSpent = 0;
      const tBill = 0;
      const tDue = 0;
      const tPaid = 0;
      const date = new Date();
    
      const data = {
        clientName,
        clientEmail,
        clientPhone,
        tBudged,
        employeeEmail,
        tSpent,
        tBill,
        date,
        tDue,
        tPaid,
      };
    
      const datas = {
        title: `Added ${clientName} as a client`,
        date: new Date(),
        user: user?.displayName,
        email:selectedEmployee3
      };
    
      AxiosPublic.post("/clients", data)
        .then((res) => {
          refetch();
          console.log(res.data);
          AxiosPublic.post("/activity", datas).then(() => {
            document.getElementById("my_modal_2").close();
            toast.success(`Successfully added ${clientName}`);
          });
        })
        .catch((error) => {
          toast.error("Failed to add client");
          console.error(error);
        });
    };
   const [users]=useUsers()

  return (
    <div className="lg:mt-5 overflow-x-auto  mt-5 mb-10 mx-5">
      <Helmet>
        <title>Campaigns | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className='px-4 py-4 overflow-x-auto  rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="flex flex-col mb-0 lg:mb-5 sm:flex-row justify-between items-center gap-5">

      <div className="flex lg:justify-center justify-center mb-4 lg:mb-0 text-gray-500 lg:mx-2 pb-1 items-center gap-3">

<div className='flex justify-center'>
   <div>
     <button
       className="font-avenir hover:bg-red-700 px-3 text-sm mx-auto py-1.5 bg-[#05a0db] rounded-lg text-white"
       onClick={() => document.getElementById("my_modal_2").showModal()}
     >
       Add Client
     </button>
     <dialog id="my_modal_2" className="modal">
       <div className="modal-box bg-white text-black font-bold">
         <form onSubmit={handleaddblog}>
           <div className="mb-4">
             <h1
               className="text-black flex hover:text-red-500 justify-end text-end"
               onClick={() => document.getElementById("my_modal_2").close()}
             >
               <ImCross />
             </h1>
             <label className="block text-black">Client Name</label>
             <input
               id="name"
               name="clientName"
               type="text"
               required
               className="w-full bg-white border-2 border-black rounded p-2 mt-1"
             />
           </div>

           <div className="mb-4">
             <label className="block text-black">Client Phone</label>
             <input
               id="clientPhone"
               name="clientPhone"
               type="number"
               required
               className="w-full bg-white border-2 border-black rounded p-2 mt-1"
             />
           </div>
           <div className="mb-4">
             <label className="block text-black">Client Email</label>
             <input
               id="clientEmail"
               name="clientEmail"
               type="email"
               required
               className="w-full bg-white border-2 border-black rounded p-2 mt-1"
             />
           </div>

           <div className="grid mt-8 grid-cols-2 gap-3">
             <button
               type="button"
               onClick={() => document.getElementById("my_modal_2").close()}
               className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
             >
               Close
             </button>
             <button
               type="submit"
               className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded text-white"
             >
               Submit
             </button>
           </div>
         </form>
       </div>
     </dialog>
   </div>
</div>

</div>
  


  <div className="ml-5 flex mb-5 lg:mb-0 gap-3 justify-center">

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

<div>
         <select
        style={{ backgroundColor: 'var(--bg-color2)', border: 'var(--border)', color: 'var(--text-color2)' }}
        className="bg-white border  text-black border-gray-400 rounded p-2 mt-1.5"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="all">Select Status</option>
        <option value="Active">Active</option>
        <option value="Complete">Complete</option>
      </select>
        </div>
  

        <div className="w-full lg:w-auto flex flex-col justify-center items-start">
        <select
          style={{
            backgroundColor: 'var(--bg-color2)',
            border: 'var(--border)',
            color: 'var(--text-color2)',
          }}
          className="w-full lg:w-auto border bg-white text-black border-gray-400 rounded p-2 mt-1"
          value={sortMonth}
          onChange={(e) => changeTab2(e.target.value)}
        >
          
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month, index) => (
            <option key={index + 1} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>
      
      <div className=" lg:flex text-black justify-center items-center">
        <select
        style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className=" rounded-md p-2 mt-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
   <div>
   <input
    style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
     type="text"
     placeholder="Search by campaign name"
     className="border bg-white  text-black placeholder-gray-500 py-2 mt-1 border-gray-700 rounded-l-lg p-1 flex-1"
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button
     className="bg-black  text-white border border-black shadow-2xl rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
     onClick={() => {/* Add search functionality here */}}
    >
     Search
    </button>
   </div>
  </div>

     </div>

     <div  className="overflow-x-auto rounded-xl  text-center " style={{ color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)', backgroundColor: 'var(--bg-color)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                <th className="p-3 text-center  border-gray-300">{displayedItems.length}</th>
                <th className="p-3 text-center  border-gray-300">Date</th>
                <th className="p-3 text-start  border-gray-300">Campaign Name</th>
                <th className="p-3 text-start  border-gray-300">Client Name</th>
                <th className="p-3 text-start  border-gray-300">Page Name</th>
                <th className="p-3 text-center  border-gray-300">Budged</th>
                <th className="p-3 text-center  border-gray-300">Spend</th>
                <th className="p-3 text-center  border-gray-300">Total Bill</th>
                <th className="p-3 text-center  border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
            {displayedItems
  ?.flatMap(client => client.campaings || [])
  .filter(item => 
    item.role === 'metaAds' && 
    (selectedEmployee === 'all' || item.status === selectedEmployee) &&
    (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) &&
    item.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10))
  )
  ?.map((work, index) => (
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

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  $ {work.tBudged}
                  </td>

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  $ {work.tSpent}
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
  <tr style={{border: 'var(--border)', backgroundColor: 'var(--bg-color)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" font-bold">
    <td className="p-3  border-gray-300 text-right" colSpan="5">
      Total :
    </td>
    <td className="p-3  border-gray-300 text-center">$ {totalBudged.toFixed(2)}</td>
    <td className="p-3  border-gray-300 text-center">$ {totalSpent.toFixed(2)}</td> 
    <td className="p-3  border-gray-300 text-start"></td> 
    <td className="p-3  border-gray-300 text-start"></td> 


  </tr>
</tbody>
          </table>  
          {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}

        </div>
        </div>
   
    </div>
  );
};

export default MetaAds;