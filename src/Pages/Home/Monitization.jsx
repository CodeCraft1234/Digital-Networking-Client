import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import {  Link, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUsers from "../../Hook/useUsers";
import Swal from "sweetalert2";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import useUserr from "../../Hook/useUser";
import { Helmet } from "react-helmet-async";
import useAllEmployee from "../../Hook/useAllEmployee";

const Monitization = ({data}) => {
    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)
    const param = useParams()
    const [campaignss]=useCampaingsByEmail(param?.email)
    const AxiosPublic = UseAxiosPublic();
    const [users] = useUsers();

    const initialTab3 =
    userr?.role === "admin"
    ? localStorage.getItem(`activeTabag356${user?.email}`) || "all" 
    : localStorage.getItem(`activeTabag356${user?.email}`) || user?.email; 
  
    const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  
    const changeTab3 = (tab) => {
      setSelectedEmployee3(tab); // Update the state
      localStorage.setItem(`activeTabag356${user?.email}`, tab); // Update localStorage
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


    const handleUpdate = (e, ids, id) => {
      e.preventDefault();
      const itemName = e.target.itemName.value;
      const pageName = e.target.pageName.value;
      const totalBill = e.target.totalBill.value;
      const pageUrl = e.target.pageUrl.value;
      const role = e.target.role.value;

      const body = { itemName, pageUrl, totalBill, role, pageName };
      console.log(body);

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
const [allEmployees]=useAllEmployee()

const datas=myclients?.flatMap(client => client.pageService || [])
?.filter(item =>  
  (selectedEmployee === 'all' || item.status === selectedEmployee) &&
  (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) &&
  item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10))
)?.filter(item=>item.role === data )

const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

console.log(datas);
    return (
        <div>
            <Helmet>
        <title>{data} | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
            <div >


      <div className="my-5 lg:block hidden">
        
      <div className="f-between  mb-4 ">

     <div>
     {
                userr?.role === 'employee' ?
        <button
      className="add"
       onClick={() => document.getElementById("my_modal_8").showModal()}
     >
        Pay Now
</button> : <div></div>}
     </div>
<div className="f-end   ">
{userr?.role === "admin" && (

<select
  className="select2"
  value={selectedEmployee3}
  onChange={(e) => changeTab3(e.target.value)}
>
  <option value="all">Select Digital Marketer</option>
  {allEmployees?.filter(u => u.role === "employee").map(employee => (
    <option key={employee._id} value={employee.email}>{employee.name}</option>
  ))}
</select>
)}

<select
  className="select2"
  value={sortMonth}
  onChange={(e) => changeTab2(e.target.value)}
>
  <option value="all">Select Month</option>
  {[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
    .map((month, index) => {
      // Get the unique months from the myclients data
      const monthsInData = [
        ...new Set(
          myclients
            ?.flatMap(client => client.pageService || []) // Flatten pageService array
            ?.map(item => new Date(item.date).getMonth() + 1) // Extract months (1-based index)
        ),
      ];

      // Check if the month is in the data
      if (monthsInData.includes(index + 1)) {
        return (
          <option key={index} value={index + 1}>
            {month}
          </option>
        );
      }
      return null;
    })
    .filter(option => option !== null)} {/* Filter out null values */}
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



  <select
   className="select2"
    value={selectedEmployee}
    onChange={(e) => changeTab(e.target.value)}
  >
    <option value="all">Select Status</option>
    <option value="Active">Active</option>
    <option value="Complete">Complete</option>
  </select>

  

  <div >
    <input
      type="text"
      placeholder="Search by campaign name"
      className="select2"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  </div>
</div>


       <div className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
            <tr className="tr1" >  
                <th className="text-center">{datas?.length}</th>
                {
                  userr?.role === 'admin' &&  
                  <th className="text-start flex justify-start"> Employee Name</th>
                }
                <th >Phone</th>
                <th >Item Name</th>
                <th >Page Name</th>
                <th >Bill</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {datas
              ?.map((work, index) => (
                <tr 
                key={work.id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-100  text-left text-black border-b border-opacity-20"
                }`}
              >
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
                  
                  <td className="text-start">

                     
                    <p className="flex justify-start items-center gap-1">    <button
                        className=" edit "
                        onClick={() =>
                          document.getElementById(`modal_${work.ids}`).showModal()
                          }
                      >
                       <FaEdit /> 
                       
                      </button>
<p>  {work.itemName
    ?.split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.itemName?.split(' ').length > 4 ? '...' : '') 
  }</p>
</p>
<p>
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </p>
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
                  <span className="amount-taka">৳</span> {work.totalBill || 0}
                  </td>

               

                
                  

                {
                      user &&
                <td  className="text-center">
                  <div className="f-center">
                        <button
                           className=" delete"
                          onClick={() => handledelete( work.ids ,work.id)}
                        >
                         <span >
                          <FaMinusSquare  />
                          </span>
                          
                        </button>
                     
                      </div>
              
               <dialog id={`modal_${work.ids}`} className="modal">
               <div className="modal-box bg-white text-black">
               <form onSubmit={(e) => handleUpdate(e, work.ids, work.id)}>
  <div className="grid lg:grid-cols-2 gap-3">
    <div className="mb-4">
      <label className="block text-left text-gray-700">Item Name</label>
      <input
        type="text"
        name="itemName"
        defaultValue={work.itemName}
        className="input2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-left text-gray-700">Page Name</label>
      <input
        type="text"
        name="pageName"
        defaultValue={work.pageName}
        className="input2"
      />
    </div>
  </div>

  <div className="grid lg:grid-cols-2 gap-3">
    <div className="mb-4">
      <label className="block text-left text-gray-700">Page URL</label>
      <input
        type="text"
        name="pageUrl"
        defaultValue={work.pageUrl}
        className="input2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-left text-gray-700">Total Bill</label>
      <input
        type="number"
        name="totalBill"
        defaultValue={work.totalBill}
        step="0.01"
        className="input2"
      />
    </div>
  </div>

  <div className="mt-2 grid mb-4 lg:grid-cols-2">
    {[
      { value: "pageSetup", label: "Page Setup" },
      { value: "pageMonitization", label: "Page Monitization" },
      { value: "graphicDesign", label: "Graphic Design" },
      { value: "webDesign", label: "Web Design" },
    ].map(({ value, label }) => (
      <div className="form-control" key={value}>
        <label className="label flex justify-start items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="role"
            value={value}
            defaultChecked={work?.role === value} // Check if the role matches
            className="radio radio-primary"
            required
          />
          <span className="label-text text-black">{label}</span>
        </label>
      </div>
    ))}
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
    <button type="submit" className="add">
      Update
    </button>
  </div>
</form>

               </div>
                                    </dialog>  </td>
               }
                      
                 
                </tr>
              ))}
              <tr className="font-bold tr1">
                <td></td>
                {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="4">
                  Total:
                </td> : <td className="text-right" colSpan="3">
                  Total:
                </td>
               }
                <td   >
                <span className="amount-taka">৳ </span>
                  {datas?.reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(0) || 0}
                </td>
                
              
                {userr?.role === "admin" ? (
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

  <div className="bg-white pt-40 pb-16  font-sans  lg:max-w-2xl lg:hidden mx-auto text-sm">

      {datas
      ?.map((payment) => (
        <div
        key={payment._id}
        className="px-4 py-3 sm:px-6 sm:py-4 border-b hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-end justify-between gap-4">
          {/* Left Content */}
          <div className="flex items-start gap-3 flex-1">
            {/* Image */}
            <img
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
              src={allEmployees.find(f => f.email === payment.email)?.photo}
              alt="Employee"
            />
      
            {/* Info */}
            <div className="flex flex-col gap-1 text-sm">
              {/* Client Name */}
              <Link className="hover:font-bold" to={`/client/${payment.id}`}>{payment.clientName}</Link>
      
              {/* Employee Name */}
              {/* <Link
                to={`/client/${payment?.clientEmail}`}
                className="text-gray-600 hover:text-blue-600 text-xs"
              >
                {allEmployees.find(f => f.email === payment.employeeEmail)?.name}
              </Link> */}
              <Link
                to={`/client/${payment?.clientEmail}`}
                className="text-gray-600 hover:text-blue-600 text-xs"
              >
               {payment.pageName
    .split(' ') 
    .slice(0, 3) 
    .join(' ') 
    + (payment.pageName.split(' ').length > 4 ? '...' : '')}
              </Link>
      
   

              <p className="text-gray-500 text-xs">
                {payment.itemName
    .split(' ') 
    .slice(0, 3) 
    .join(' ') 
    + (payment.itemName.split(' ').length > 4 ? '...' : '')}
              </p>
              
            </div>
          </div>
      
          {/* Right Content */}
          <div className="text-right space-y-1 text-sm sm:text-base">
          <p className="text-gray-800">
              <span className="font-medium text-gray-600">Bill:</span>{" "}
              <span className="text-red-600 font-bold">৳ {payment?.totalBill?.toLocaleString()}</span>
            </p>

            <p className="text-gray-500 text-xs">
                {new Date(payment.date).toLocaleString("en-GB", {
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
      
      ))}

      {/* Modal */}


    </div>

      </div>
        </div>
    );
};

export default Monitization;