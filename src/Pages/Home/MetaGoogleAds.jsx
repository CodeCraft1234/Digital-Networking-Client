import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import { Link } from "react-router-dom";
import useClientsCampaignsPage from "../../Hook/useClientCampaignsPage";
import useAllEmployee from "../../Hook/useAllEmployee";
import { ImCross } from "react-icons/im";

const MetaGoogleAds = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [allEmployees]=useAllEmployee()

  const role = localStorage.getItem(("activeTabClientProfile7") || "metaAds")

  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`activeTabag3${user?.email}`) || "all" 
  : localStorage.getItem(`activeTabag3${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem(`activeTabag3${user?.email}`, tab); // Update localStorage
  };

  
  // const [client, totalItems, totalPages, , refetch] = useClientsPage(selectedEmployee3, currentPage);
  


  const AxiosPublic=UseAxiosPublic()
  const [searchQuery, setSearchQuery] = useState("");



  const initialTab2 = localStorage.getItem("activeTaballcampaignmonthsss");
  
  const [sortMonth, setSortMonth] = useState(initialTab2 || (new Date().getMonth() + 1).toString());

  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballcampaignmonthsss", tab);
  };

  const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
      refetch();
    };

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const initialTab = localStorage.getItem("activeTabsummeryEmployeess") || "All";
    const [selectedStatus, setSelectedEmployee] = useState(initialTab);
  
    const changeTab = (tab) => {
      setSelectedEmployee(tab);
      localStorage.setItem("activeTabsummeryEmployeess", tab);
    };

    const { clientCampaigns, totalItems, totalPages, refetch } = useClientsCampaignsPage(
      selectedEmployee3,
      currentPage,
      sortMonth,
      selectedStatus,
      selectedYear,
      role
  );

  
    

const itemsPerPage = 100;


console.log(role);


const displayedItems = clientCampaigns?.slice(0, currentPage * itemsPerPage);

const filteredCampaigns = displayedItems?.filter((item) => {
  return (
      item.campaignName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
});

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

  AxiosPublic.put(`/clientCampaings/${id}/${ids}`, { status })
      .then((res) => {
          console.log("Update Response:", res.data);
          refetch(); 

      })
      .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
      });
};

   const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const InputField = ({ label, name, defaultValue, disabled, type = "text" }) => (
    <div className="mb-4">
      <label className="block text-left text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
      />
    </div>
  );
  console.log(filteredCampaigns);
  
  return (
    <div>
       <Helmet>
          <title>{role ? `${role.charAt(0).toUpperCase()}${role.slice(1)} ` : 'Default Title'} | Digital Network</title>
          <link rel="canonical" href="https://www.example.com/" />
        </Helmet>

       

         <div className='lg:block hidden'>

      <div className="flex flex-col mb-5 sm:flex-row justify-end items-center gap-3">

  {userr?.role === "admin" && (
    <select className="select2" value={selectedEmployee3} onChange={(e) => changeTab3(e.target.value)}>
      <option value="all">Select Digital Marketer</option>
      {allEmployees?.filter((u) => u.role === "employee").map((e) => (
        <option key={e._id} value={e.email}>{e.name}</option>
      ))}
    </select>
  )}

  <select className="select2" value={sortMonth} onChange={(e) => changeTab2(e.target.value)}>
  <option  value='all'>Select Month</option>
    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      .map((month, i) => <option key={i} value={i + 1}>{month}</option>)}
  </select>

  <select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="all">Select Year</option> {/* Default option */}
  {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>





  <select className="select2" value={selectedStatus} onChange={(e) => changeTab(e.target.value)}>
    <option value="all">Select Status</option>
    <option value="Active">Active</option>
    <option value="Complete">Complete</option>
  </select>
  <div className="flex">
    <input type="text" placeholder="Search by campaign name" className="input2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
   
  </div>
</div>


     <div className=" table-div" >
          <table className="min-w-full ">
            <thead className=" ">
              <tr className="tr1" >
                <th className=" text-center">{filteredCampaigns.length}</th>
                <th className="flex justify-start items-center">Client Name</th>
                <th >Phone</th>
                <th >Campaign</th>
                <th >Ads</th>
                <th >Budged</th>
                <th >Spend</th>
                <th >Bill</th>
                <th >Status</th>
              </tr>
            </thead>
            <tbody>
            {filteredCampaigns
  ?.map((work, index) => (
    <tr 
    key={work.id}
    className={`${
      index % 2 === 0
        ? "bg-white text-left text-black border-b border-opacity-20"
        : "bg-gray-100  text-left text-black border-b border-opacity-20"
    }`}
  >

      <td>
        {index + 1}
      </td>

              {
            userr?.role === 'admin' &&    <td>  <Link
       
            to={`/client/${work.id}`}
          >
            <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === work.email)?.photo} alt="" />
             <p className="text-start ">
             <p className="text-lg flex justify-start items-center gap-1 ">{truncateText(work.clientName, 4)}</p>
             <h1> {allEmployees?.find(f => f.email === work.email)?.name || 'N/A'}</h1>
             </p>
              </div>
              </Link>
          </td>
          }


          <td>
         {work.clientPhone}
          </td>

          <td>
            <Link
              to={`/client/${work.id}`}
              className="flex gap-2 items-center hover:font-bold"
            >
          <div className="flex items-center justify-between w-full ">
            {/* Left Side: Name & Phone (Stacked) */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm flex justify-start items-center gap-1 ">{truncateText(work.campaignName, 4)}</p>
              <p className="text-start">{new Date(work?.date).toLocaleDateString("en-GB")}</p>
            </div>
          
          
          </div>
          
            </Link>
          </td>
          <td>
         {work.adsAccount}
          </td>
          <td>
          <span><span className="amount-doller">$</span><span className="ml-1">{work.tBudged}</span></span>
          </td>
          <td>
          <span><span className="amount-doller">$</span><span className="ml-1">{work.tSpent}</span></span>
          </td>
          <td>
          <span> <span className="amount-taka">৳ </span><span className="ml-1">{parseInt(work.tSpent * work.dollerRate)}</span></span>
          </td>




  <td className="text-center">
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
</tr>


  ))}
  <tr className="tr1 font-bold">
  {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="5">
                  Total:
                </td> : <td className="text-right" colSpan="4">
                  Total:
                </td>
            }

            <td>
            <span><span className="amount-doller">$</span><span className="ml-1">{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
     filteredCampaigns
        ?.reduce((acc, work) => acc + (isNaN(parseFloat(work?.tBudged)) ? 0 : parseFloat(work?.tBudged)), 0)
    )}</span></span>
            </td>
            <td>
            <span><span className="amount-doller">$</span><span className="ml-1">{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      filteredCampaigns
        .reduce((acc, work) => acc + (isNaN(parseFloat(work?.tSpent)) ? 0 : parseFloat(work?.tSpent)), 0)
    )}</span></span>
            </td>


  <td>
    <span className="amount-taka">৳ </span>
    {new Intl.NumberFormat('en-IN').format(
      filteredCampaigns
        .reduce((acc, work) => acc + (isNaN(parseFloat(work?.tSpent)) ? 0 : parseFloat(work?.tSpent * work.dollerRate)), 0)
    )}
  </td>

  <td className=""></td>
  <td className=""></td>
  <td className=""></td>
</tr>

</tbody>
          </table>  

          <div className="flex items-center justify-center my-5 space-x-2">
  {/* Previous Button */}
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md ${
      currentPage === 1
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Previous
  </button>

  {/* Page Numbers */}
  {(() => {
    const buttons = [];
    let startPage, endPage;

    // Always show 5 buttons, with the current page in the middle
    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages to keep the current page in the middle
      startPage = Math.max(currentPage - 2, 1);
      endPage = Math.min(currentPage + 2, totalPages);

      // Adjust if the current page is near the start or end
      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
    }

    // Generate buttons for the calculated range
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md ${
            currentPage === i
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-red-600 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  })()}

  {/* Next Button */}
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-md ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }`}
  >
    Next
  </button>
</div>

        </div>

        </div>

       <div className="bg-white font-sans pt-20 pb-20  mt-8 lg:max-w-2xl lg:hidden mx-auto text-sm">
       
       
       
       
       
             {filteredCampaigns.map((payment) => (
               <div key={payment._id} className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
                 <div className="flex items-start justify-between gap-2 sm:gap-3">
                   {/* Left Content */}
                   <div className="flex-1">
                     <div className="flex items-start justify-start text-start gap-2 sm:gap-3">
                       {/* Image */}
                       <div className="flex-shrink-0">
                         <img
                           className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                           src={allEmployees.find(f => f.email === payment.email)?.photo}
                           alt=""
                         />
       
       <label className="status-label mt-3">
                         <input
                           type="checkbox"
                           className="sr-only"
                           checked={(payment?.status || "Approved") !== "pending"}
                           onChange={() => {
                             const currentStatus = payment?.status || "Approved";
                             const newStatus = currentStatus !== "pending" ? "pending" : "Approved";
                             handleUpdate2(payment.ids, payment.id, newStatus);
                           }}
                         />
                         <div className={`status-switch ${(payment?.status || "Approved") !== "pending" ? "active" : "inactive"}`}>
                           <span className={`status-switch-thumb ${(payment?.status || "Approved") !== "pending" ? "active" : ""}`}></span>
                         </div>
                       </label>
                       </div>
       
                       {/* Names */}
                       <div className="flex flex-col text-start justify-start items-start">
                       <div className="flex justify-start text-start items-center gap-1">
                           <Link
                             to={`/client/${payment?.clientEmail}`}
                             className="text-black text-sm sm:text-base hover:text-blue-800 transition-colors"
                           >
                             
                             {truncateText(payment.campaignName, 4)}
                           </Link>
                         </div>
                         {/* <div className="flex justify-start text-start items-center gap-1">
                           <Link
                             to={`/client/${payment?.clientEmail}`}
                             className="text-[14px] sm:text-xs text-gray-500"
                           >
                             {payment?.clientName}
                           </Link>
                         </div> */}
                         <div className="flex justify-start text-start items-center gap-1">
                           <p
                            
                             className="text-[14px] sm:text-xs text-gray-500"
                           >
                             {payment?.clientName}
                           </p>
                         </div>
                         
                         <p className="text-[10px] sm:text-xs text-gray-500">
                         {new Date(payment.date)?.toLocaleString("en-GB", {
                           hour: "2-digit",
                           minute: "2-digit",
                           hour12: true,
                           day: "2-digit",
                           month: "2-digit",
                           year: "2-digit",
                         })}
                       </p>
                       </div>
                     </div>
       
                   </div>
       
                   {/* Right Content */}
                   <div className="text-right">
              
                     <p className="text-gray-800">
              <span className="font-medium text-gray-600">Budget:</span>{" "}
              <span className="text-red-600 font-bold">৳ {payment?.tBudged?.toLocaleString()}</span>
            </p>
                     <p className="text-gray-800">
              <span className="font-medium text-gray-600">Spend:</span>{" "}
              <span className="text-red-600 font-bold">৳ {payment?.tSpent?.toLocaleString()}</span>
            </p>
                     <p className="text-gray-800">
              <span className="font-medium text-gray-600">Bill:</span>{" "}
              <span className="text-red-600 font-bold">৳ {parseInt(payment.tSpent * payment.dollerRate)?.toLocaleString()}</span>
            </p>
                     <div>
                     
                       
                     </div>
       
                   </div>
                 </div>
               </div>
             ))}
       

           </div>
   
    </div>
  );
};

export default MetaGoogleAds;