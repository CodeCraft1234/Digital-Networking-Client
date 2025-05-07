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
import { ImCross } from "react-icons/im";

const TiktokAds = ({data}) => {
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
      const coin = e.target.coin.value;
      const totalBill = 1.90 * coin;

      const body = { itemName, coin, totalBill };

      const datas = {
        title: `Updated ${itemName} in My Clients`,
        date: new Date(),
        user: user?.displayName,
      };
    
      AxiosPublic.patch(`/clientPageService/updates2/${id}/${ids}`, body)
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

const [allEmployees]=useAllEmployee()



const datas=myclients?.flatMap(client => client.pageService || [])
?.filter(item =>  
  (selectedEmployee === 'all' || item.status === selectedEmployee) &&
  (!selectedYear || new Date(item.date).getFullYear() === parseInt(selectedYear)) &&
  item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (sortMonth === 'all' || new Date(item.date).getMonth() + 1 === parseInt(sortMonth, 10))
)?.filter(item=>item.role === data )


const [coin, setCoin] = useState();
const [totalBills, setTotalBill] = useState();

const handleCoinChange = (e) => {
  const coinValue = parseFloat(e.target.value) || 0;
  setCoin(coinValue);
  setTotalBill((coinValue * 1.9).toFixed(0)); // Update total bill automatically
};

const handleTotalBillChange = (e) => {
  setTotalBill(e.target.value); // Allow manual editing of totalBill
};

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
      className="input2"
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
                <th className="text-start flex justify-start ">Client Name</th>
                <th >Item Name</th>
                <th >Coins</th>
                <th >Total Bill</th>
                <th >Date</th>
              
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

                 

                  <td className="text-center">{index + 1}</td>
                  
                  
                

               <td>  <Link
       
            to={`/client/${work.id}`}
          >
            <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === work.email)?.photo} alt="" />
             <p className="text-start ">
             <p className="text-lg flex justify-start items-center gap-1 ">{work.clientName}</p>
             <h1> {allEmployees?.find(f => f.email === work.email)?.name || 'N/A'}</h1>
             </p>
              </div>
              </Link>
          </td>
          


               
                  
                  <td>

                     
                    <span>
  {work.itemName
    ?.split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.itemName?.split(' ').length > 4 ? '...' : '') 
  }
</span>
                  </td>

                
                  
                  <td >
                   {work.coin || 0}
                  </td>
                  <td >
                  <span className="amount-taka">৳</span> {work.totalBill || 0}
                  </td>

                  <td>
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                 
                </tr>
              ))}
              <tr className="font-bold tr1">
                <td></td>
                {
            userr?.role === 'admin' ? 
            <td className="text-right" colSpan="2">
                  Total:
                </td> : <td className="text-right" colSpan="1">
                  Total:
                </td>
            }
                
                <td   >
                  <span className="text-sm mr-1 font-extrabold"></span>{" "}
                  {datas?.reduce((acc, payment) => acc + parseFloat(payment?.coin || 0), 0).toFixed(0) || 0}
                </td>
                <td   >
                <span className="amount-taka">৳ </span>
                  {datas?.reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(0) || 0}
                </td>
                <td></td>
              
                
              
 
              </tr>
            </tbody>
          </table>
        </div>
        </div>

 <div className="bg-white font-sans pt-20 pb-20  mt-8 lg:max-w-2xl lg:hidden mx-auto text-sm">
       
       
       
       
       
             {datas?.map((payment) => (
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
                             {allEmployees?.find(f => f.email === payment.email)?.name || 'N/A'}
                           </Link>
                         </div>
                         <div className="flex justify-start text-start items-center gap-1">
                           <Link
                             to={`/client/${payment?.clientEmail}`}
                             className="text-[14px] sm:text-xs text-gray-500"
                           >
                             {payment?.clientName}
                           </Link>
                         </div>
                         <div className="flex justify-start text-start items-center gap-1">
                           <p
                            
                             className="text-[14px] sm:text-xs text-gray-500"
                           >
                             {payment.campaignName}
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
              <span className="font-medium text-gray-600">Coin:</span>{" "}
              <span className="text-red-600 font-bold"> {payment?.coin?.toLocaleString()}</span>
            </p>
   
                     <p className="text-gray-800">
              <span className="font-medium text-gray-600">Bill:</span>{" "}
              <span className="text-red-600 font-bold">৳ {payment.totalBill?.toLocaleString()}</span>
            </p>
                     <div>
                     
                       
                     </div>
       
                   </div>
                 </div>
               </div>
             ))}
       

           </div>

      </div>
        </div>
    );
};

export default TiktokAds;