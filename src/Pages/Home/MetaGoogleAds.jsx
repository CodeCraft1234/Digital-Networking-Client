import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";

import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";
import { Link } from "react-router-dom";

const MetaGoogleAds = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)

  const data2 = localStorage.getItem(("activeTabClientProfile") || "metaAds")

  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`activeTabag3${user?.email}`) || "all" 
  : localStorage.getItem(`activeTabag3${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem(`activeTabag3${user?.email}`, tab); // Update localStorage
  };

  const [myclients, refetch] = useMyClientsByEmail(selectedEmployee3);
  const AxiosPublic=UseAxiosPublic()
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  const filteredCampaigns = displayedItems
  ?.flatMap(client => client.campaings || []) // Flatten the campaigns array
  ?.filter(item =>
    item.role === data2 && // Filter based on role
    (selectedEmployee === 'all' || item.status === selectedEmployee) && // Filter based on employee status
    (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) && // Filter based on year
    item.campaignName?.toLowerCase().includes(searchQuery.toLowerCase()) && // Filter based on campaign name search
    (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10)) // Filter based on selected month
  );

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

   const [users]=useUsers()

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
  
  
  return (
    <div>
      <Helmet>
        <title>{data2} | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className='side-space'>

      <div className="flex flex-col mb-5 sm:flex-row justify-end items-center gap-3">

  {userr?.role === "admin" && (
    <select className="select2" value={selectedEmployee3} onChange={(e) => changeTab3(e.target.value)}>
      <option value="all">Select Digital Marketer</option>
      {users.filter((u) => u.role === "employee").map((e) => (
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
  <option value="">Select Year</option> {/* Default option */}
  {Array.from({ length: 2035 - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>




  <select className="select2" value={selectedEmployee} onChange={(e) => changeTab(e.target.value)}>
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
                <th >Date</th>
                <th >Campaign Name</th>
                <th >Client Name</th>
                <th >Page Name</th>
                <th >Budged</th>
                <th >Spend</th>
                <th >Total Bill</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
            {filteredCampaigns
  ?.map((work, index) => (
<tr key={work._id} className="tr2">
  <td className="text-center">
      <button
        className="delete"
        onClick={() => handledelete(work.ids, work.id)}
      >
        <FaMinusSquare />
      </button>
  </td>

  <td>{new Date(work?.date).toLocaleDateString("en-GB")}</td>

  <td>
    <button
      className=" edit flex justify-center items-center gap-1 px-2 py-1 rounded"
      onClick={() =>
        document.getElementById(`modal_${work.ids}`).showModal()
      }
    >
      <FaEdit />
      <span>
        {truncateText(work.campaignName, 4)}
      </span>
    </button>

    <dialog id={`modal_${work.ids}`} className="modal">
      <div className="modal-box bg-white text-black">
        <form onSubmit={(e) => handleUpdate(e, work.ids, work.id)}>
          <InputField
            label="Campaign Name"
            name="campaignName"
            defaultValue={work.campaignName}
          />
          <InputField
            label="Account Name"
            name="adsAccount"
            defaultValue={work.adsAccount}
            disabled
          />
          <InputField
            label="Total Budget"
            name="tBudged"
            defaultValue={work.tBudged}
            type="number"
          />
          <InputField
            label="Total Spent"
            name="totalSpent"
            defaultValue={work.tSpent}
            type="number"
          />
          <InputField
            label="Dollar Rate"
            name="dollerRate"
            defaultValue={work.dollerRate}
            type="number"
          />

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

  <td><Link to={`/client/${work.id}`}>{truncateText(work.clientName, 4)}</Link></td>
  <td>{work.adsAccount}</td>
  <td>$ {work.tBudged}</td>
  <td>$ {work.tSpent}</td>
  <td>
    <span className="text-md mr-1 font-extrabold">৳</span>
    {parseInt(work.tSpent * work.dollerRate)}
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
  <td className="text-right" colSpan="5">
    Total:
  </td>
  
  <td>
    $ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
     filteredCampaigns
        ?.reduce((acc, work) => acc + (isNaN(parseFloat(work?.tBudged)) ? 0 : parseFloat(work?.tBudged)), 0)
    )}
  </td>
  
  <td>
    $ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      filteredCampaigns
        .reduce((acc, work) => acc + (isNaN(parseFloat(work?.tSpent)) ? 0 : parseFloat(work?.tSpent)), 0)
    )}
  </td>

  <td>
    <span className="text-md mr-1 font-extrabold">৳</span>
    {new Intl.NumberFormat('en-IN').format(
      filteredCampaigns
        .reduce((acc, work) => acc + (isNaN(parseFloat(work?.tSpent)) ? 0 : parseFloat(work?.tSpent * work.dollerRate)), 0)
    )}
  </td>

  <td className=""></td>
</tr>

</tbody>
          </table>  
          {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}

        </div>
        </div>
   
    </div>
  );
};

export default MetaGoogleAds;