import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useCampaings from "../../Hook/useCampaign";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import useMyCampaingsByEmail from "../../Hook/useMyCampaignByEmail";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";

const MyCampaigns = () => {
  const { user } = useContext(AuthContext);
  const [clients] = useClients();
  const AxiosPublic=UseAxiosPublic()
  const [mycampaigns, refetch] = useMyCampaingsByEmail(user?.email);
  const [campaigns] = useCampaings();

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [client, setClient] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


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

  useEffect(() => {
    if (clients.length && user?.email) {
      const filtered = clients.filter((campaign) => campaign.employeeEmail === user.email);
      setClient(filtered);
    }
  }, [clients, user?.email]);

  useEffect(() => {
    if (campaigns.length && user?.email) {
      const filtered = campaigns.filter((c) => c?.email === user.email);
      setFilteredClients(filtered);
    }
  }, [campaigns, user?.email]);

  // Filter and Sort Campaigns based on Date

  const [myclients]=useMyClientsByEmail(user?.email)

  const tspent = mycampaigns
      
  ?.filter(campaign => myclients.some(client => client.clientEmail === campaign.clientEmail))
  console.log(tspent,mycampaigns);

  const filteredItems = tspent.filter((item) =>
    item?._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          (selectedEmployee === "All" || item.status === selectedEmployee) &&
          item?.campaignName?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  // Filter campaigns by selected month
  const filtered = sortMonth
    ? filteredByCategory.filter((item) => {
        const month = new Date(item.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      })
    : filteredByCategory;
    console.log(filtered);

  useEffect(() => {
    const totals = filteredByCategory.reduce(
      (acc, { tSpent, tBudged }) => ({
        spent: acc.spent + parseFloat(tSpent) || 0,
        budged: acc.budged + parseFloat(tBudged) || 0,
      }),
      { spent: 0, budged: 0 }
    );
    setTotalSpent(totals.spent);
    setTotalBudged(totals.budged);
  }, [filteredByCategory]);

  // Sort campaigns alphabetically by campaign name
  const sortedAdsAccounts = filtered.sort((a, b) =>
    a.campaignName?.localeCompare(b.campaignName)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const displayedItems = sortedAdsAccounts.slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < sortedAdsAccounts.length;

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
  

  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/campaigns/${id}`).then(() => {
          refetch();
          toast.success("Campaign deleted successfully");
        });
      }
    });
  };

  return (
    <div className="lg:mt-5 overflow-x-auto  mt-5 mb-10 mx-5">
      <Helmet>
        <title>My Campaign | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className='px-4 py-4 overflow-x-auto  rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="flex flex-col mb-0 lg:mb-5 sm:flex-row justify-between items-center gap-5">

  
   <div className="flex justify-start items-center gap-3">
   <div>
         <select
        style={{ backgroundColor: 'var(--bg-color2)', border: 'var(--border)', color: 'var(--text-color2)' }}
        className="bg-white border text-black border-gray-400 rounded p-2 mt-1"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="All">Status</option>
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
   </div>



  <div className="ml-5 flex mb-5 lg:mb-0 justify-center">
   <input
    style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
     type="text"
     placeholder="Search by campaign name"
     className="border bg-white  text-black placeholder-gray-500 border-gray-700 rounded-l-lg p-1 flex-1"
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
                <th className="p-3 text-center  border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
  {displayedItems?.filter(f => selectedEmployee === 'All' || f.status === selectedEmployee)?.map((campaign, index) => (
    <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
    key={campaign._id}
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
                          onClick={() => handledelete(campaign._id)}
                        >
                         <span >
                          <FaMinusSquare  />
                          </span>
                        </button>
                      </div>
     </td>
      
      
    
      <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 text-start border-gray-300 ">
  {new Date(campaign.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })}
     </td>
      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">

       <div className="flex justify-start items-center ">
       <div>
                      <button
                        className=" flex justify-center items-center gap-1   px-2 py-1 rounded"
                        onClick={() =>
                          document.getElementById(`modal_${campaign._id}`).showModal()
                        }
                      >
                       <FaEdit /> 
                       <span>
  {campaign.campaignName
    .split(' ') // Split the campaign name into words
    .slice(0, 4) // Take only the first 6 words
    .join(' ') // Join the words back into a string
    + (campaign.campaignName.split(' ').length > 5 ? '...' : '') // Add "..." if there are more than 6 words
  }
</span>
                      </button>
                      <dialog id={`modal_${campaign._id}`} className="modal">
  <div className="modal-box bg-white text-black">
    <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
    <h1
             className=" text-black flex hover:text-red-500  justify-end  text-end"
             onClick={() => document.getElementById(`modal_${campaign._id}`).close()}
           >
            <ImCross />
           </h1>
           <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Campaign Name</label>
        <input
          type="text"
          name="campaignName"
          defaultValue={campaign.campaignName}
       
          className="w-full bg-white  border-gray-700 border rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Budged</label>
        <input
          type="number"
          name="tBudged"
          defaultValue={campaign.tBudged}
          step="0.01"
          className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
        />
      </div>
      

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Total Spent</label>
        <input
          type="number"
          name="totalSpent"
          defaultValue={campaign.tSpent}
          step="0.01"
          className="w-full bg-white border  border-gray-700 rounded p-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-start  font-bold text-gray-700">Dollars Rate</label>
        <input
          step="0.01"
          type="number"
          name="dollerRate"
          defaultValue={campaign.dollerRate}
          className="w-full bg-white border  border-gray-700 rounded p-2 mt-1"
        />
      </div>
     



      <div className="modal-action grid grid-cols-2 gap-3 mt-8">
      <button
          type="button"
          className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white"
          onClick={() =>
            document.getElementById(`modal_${campaign._id}`).close()
          }
        >
          Close
        </button>
        <button
          type="submit"
          className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded-lg text-white"
        >
          Update
        </button>
       
      </div>
    </form>
  </div>
</dialog>
        </div>


       </div>
        

      </td>
      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start">
       <Link to={`/dashboard/client/${campaign.clientEmail}`}>
       <span>
  {campaign.pageName
    .split(' ') // Split the campaign name into words
    .slice(0, 2) // Take only the first 6 words
    .join(' ') // Join the words back into a string
    + (campaign.pageName.split(' ').length > 5 ? '...' : '') // Add "..." if there are more than 6 words
  }
</span>
       </Link>
       
      </td>        
      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-start">
     
        {campaign.clientName}
      
      </td>        
      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
     
      $ {campaign.tBudged}
      
      </td>        


      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
       
      $ {campaign.tSpent}
     </td>    

     

      <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={campaign.status === "Active"}
    onChange={() => {
      const newStatus = campaign.status === "Active" ? "Complete" : "Active";
      handleUpdate2(campaign._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      campaign.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        campaign.status === "Active" ? "translate-x-6" : ""
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


  </tr>
</tbody>
          </table>  
          {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}

        </div>
        </div>
   
    </div>
  );
};

export default MyCampaigns;