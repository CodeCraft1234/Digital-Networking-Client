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
    const AxiosPublic = UseAxiosPublic();
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [adsAccount] = useAdsAccount();
    const [employees, setEmployees] = useState([]);


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

      if (users) {
        setEmployees(users.filter((u) => u.role === "employee"));
      }


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
        
        <div className="flex justify-end gap-3 items-center">
       
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
              {myclients?.flatMap(client => client.pageService || [])
              ?.filter(item => 
                (selectedEmployee === 'all' || item.status === selectedEmployee) &&
                (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) &&
                item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10))
              )
              .map((work, index) => (
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