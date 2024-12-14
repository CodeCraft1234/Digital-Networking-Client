import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import {  Link, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from "sweetalert2";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import useUserr from "../../Hook/useUser";
import { Helmet } from "react-helmet-async";
import SummaryCard from "./SummeryCard";

const PageSetup = () => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    const param = useParams()
    const [campaignss]=useCampaingsByEmail(param?.email)
    const [clients]=useClients()
    const AxiosPublic = UseAxiosPublic();
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [adsAccount] = useAdsAccount();

    const initialTab3 =
    userr?.role === "admin"
    ? localStorage.getItem("activeT") || "all" 
    : localStorage.getItem("activeT") || user?.email; 
  
    const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  
    const changeTab3 = (tab) => {
      setSelectedEmployee3(tab); // Update the state
      localStorage.setItem("activeT", tab); // Update localStorage
    };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

const initialTab = localStorage.getItem("activeTabsummeryEmpy") || "all";
const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

const changeTab = (tab) => {
setSelectedEmployee(tab);
localStorage.setItem("activeTabsummeryEmpy", tab);
};

const initialTab2 = localStorage.getItem("activeTabalu");
const [sortMonth, setSortMonth] = useState(initialTab2 || (new Date().getMonth() + 1).toString());

const changeTab2 = (tab) => {
setSortMonth(tab);
localStorage.setItem("activeTabalu", tab);
};

    const [myclients,refetch] = useMyClientsByEmail(selectedEmployee3);

    useEffect(() => {

        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 

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

    return (
        <div>
            <Helmet>
        <title>Page Setup | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
            <div >

            <div  className="grid grid-cols-2 mb-5  rounded-lg md:grid-cols-2 lg:grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around ">

        <SummaryCard title="Total Bill" value={(myclients?.flatMap(client => client.pageService || [])?.reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(2) || 0)} />
        <SummaryCard title="Total Paid" value={(myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(2) || 0)} />

          </div>

      <div className="side-space">
        
      <div className="flex justify-end gap-3 mb-4 items-center">
  {userr?.role === "admin" && (

    <select
      className="select2"
      value={selectedEmployee3}
      onChange={(e) => changeTab3(e.target.value)}
    >
      <option value="all">All Employees</option>
      {users.filter(u => u.role === "employee").map(employee => (
        <option key={employee._id} value={employee.email}>{employee.name}</option>
      ))}
    </select>
  )}

  <select
   className="select2"
    value={selectedEmployee}
    onChange={(e) => changeTab(e.target.value)}
  >
    <option value="all">Select Status</option>
    <option value="Active">Active</option>
    <option value="Complete">Complete</option>
  </select>

  <select
   className="select2"
    value={sortMonth}
    onChange={(e) => changeTab2(e.target.value)}
  >
    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      .map((month, index) => (
        <option key={index + 1} value={index + 1}>{month}</option>
      ))}
  </select>

  <select
    className="select2"
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
  >
    {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>

  

  <div >
    <input
      type="text"
      placeholder="Search by campaign name"
      className="input2"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>


       <div className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >  
                <th className="text-center">{campaignss?.length}</th>
                <th >Date</th>
                <th >Item Name</th>
                <th >Page Name</th>
                <th >Total Bill</th>
                <th >Total Paid</th>
                <th >Total Due</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {myclients?.flatMap(client => client.pageService || [])
              ?.filter(item => 
                (selectedEmployee === 'all' || item.status === selectedEmployee) &&
                (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) &&
                item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10))
              )
              .map((work, index) => (
                 <tr 
                 key={work._id}
                 className={`tr2`}
               >
                     <td className="text-center"> 
                        <button
                           className=" delete"
                          onClick={() => handledelete( work.ids ,work.id)}
                        >
                         <span >
                          <FaMinusSquare  />
                          </span>
                        </button> 
                    </td>
                      
                  <td>
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td>

                     <button
                        className="f-start edit"
                        onClick={() =>
                          document.getElementById(`modal_${work.ids}`).showModal()
                          }
                      >
                       <FaEdit /> 
                       <span>
  {work.itemName
    ?.split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.itemName?.split(' ').length > 4 ? '...' : '') 
  }
</span>
                    </button>

                    <dialog id={`modal_${work.ids}`} className="modal">
  <div className="modal-box bg-white text-black">
    <form onSubmit={(e) => handleUpdate(e, work.ids, work.id)}>
      {['itemName', 'totalBill', 'totalPaid'].map((field, index) => (
        <div className="mb-4" key={index}>
          <label className="block text-left text-gray-700">{field.replace(/([A-Z])/g, ' $1')}</label>
          <input
            type={field === 'totalBill' || field === 'totalPaid' ? 'number' : 'text'}
            name={field}
            defaultValue={work[field]}
            step={field === 'totalBill' || field === 'totalPaid' ? '0.01' : undefined}
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          className="close"
          onClick={() => document.getElementById(`modal_${work.ids}`).close()}
        >
          Close
        </button>
        <button type="submit" className="add">
          Update
        </button>
      </div>
    </form>
  </div>
                     </dialog>

                  </td>

                  <td>
                  
                   <Link to={work.pageUrl}>
                   {work.pageName
    .split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.pageName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  } 
                   </Link>
                  
                  </td>
                  
                  <td >
                  ৳ {work.totalBill || 0}
                  </td>

                  <td >
                  ৳ {work?.totalPaid || 0}
                  </td>

                  <td >
                    <span className="text-md mr-1 font-extrabold">৳</span>
                     {(work.totalBill || 0) - (work?.totalPaid || 0)}
                  </td>
                  <td className="text-center">

                  <label className="status-label">
  <input
    type="checkbox"
    checked={work.status === "Active"}
    onChange={() => {
      const newStatus = work.status === "Active" ? "Complete" : "Active";
      handleUpdate2(work.ids ,work.id, newStatus);
    }}
  />
  <div className={work.status === "Active" ? "active" : "inactive"}>
    <span className={work.status === "Active" ? "active" : ""}></span>
  </div>
                 </label>
                </td>
                </tr>
              ))}
              <tr className="font-bold tr1">
                <td></td>
                <td className="text-right" colSpan="3">
                  Total:
                </td>
                <td   >
                  <span className="text-sm mr-1 font-extrabold">$</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(0) || 0}
                </td>
                <td >
                  <span className="text-sm mr-1 font-extrabold">৳</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(0) || 0}
                </td>
                <td>
                  <span className="text-sm mr-1 font-extrabold">৳</span>{" "}
                  {myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(0) - myclients?.flatMap(client => client.pageService || []).reduce((acc, payment) => acc + parseFloat(payment?.totalPaid || 0), 0).toFixed(0) || 0}
                </td>
                {ddd?.role === "admin" ? (
                  <>
                    <td ></td>
                  </>
                ) : (
                  <>
                   <td ></td>
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