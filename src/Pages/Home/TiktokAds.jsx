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


      <div className="side-space">
        
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
  <option value="">Select Year</option> {/* Default option */}
  {[...new Set(
    myclients
      ?.flatMap((client) => client.pageService || [])
      ?.map((item) => new Date(item.date).getFullYear())
  )]
    .sort((a, b) => a - b) // Sort years in ascending order
    .map((year) => (
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
                {
                  userr?.role === 'admin' &&  
                  <th > Employee Name</th>
                }
                <th >Client Name</th>
                <th >Item Name</th>
                <th >Coins</th>
                <th >Total Bill</th>
                <th >Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {datas
              ?.map((work, index) => (
                 <tr 
                 key={work._id}
                 className={`tr2`}
               >

                 

                  <td className="text-center">{index + 1}</td>
                  
                  
                

                  {
            userr?.role === 'admin' &&    <td>  <Link
       
            to={`/client/${work.id}`}
          >
              <div className='flex justify-start items-center gap-2'>
              <img className='h-10 w-10 rounded-full object-cover' src={allEmployees.find(f => f.email === work.employeeEmail)?.photo} alt="" />
              <h1> {allEmployees.find(f => f.email === work.employeeEmail)?.name || 'N/A'}</h1>
              </div>
              </Link>
          </td>
          }


                  <td><Link className="hover:font-bold" to={`/client/${work.id}`}>{work.clientName}</Link></td>
                  
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
                        <button
                        className=" edit"
                        onClick={() =>
                          document.getElementById(`modal_${work.ids}`).showModal()
                          }
                      >
                       <FaEdit /> 
                       
                      </button>
                      </div>
              
                      <dialog id={`modal_${work.ids}`} className="modal">
               <div className="modal-box bg-white text-black">
               <form onSubmit={(e) => handleUpdate(e, work.ids, work.id)}>

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
                  defaultValue={work.date}
                  className="input2"
                />
              </div>

    <div className="mb-4">
      <label className="block text-left text-gray-700">Item Name</label>
      <input
        type="text"
        name="itemName"
        defaultValue={work.itemName}
        className="input2"
      />
    </div>





    <div className="grid lg:grid-cols-2 gap-3">
          <div className="">
            <label htmlFor="coin" className="block text-start mb-1 ml-1">
              Coin 
            </label>
            <input
  step="0.01"
  id="coin"
  name="coin"
  type="number"
  placeholder="type...."
  className="input2"
  min="350" 
  defaultValue={coin || work.coin}
  onChange={handleCoinChange}
/>

          </div>
          <div className="">
            <label htmlFor="totalBill" className="block text-start mb-1 ml-1">
              Total Bill
            </label>
            <input
              step="0.01"
              id="totalBill"
              name="totalBill"
              type="number"
              placeholder="type...."
              className="input2"
              defaultValue={totalBills || work.totalBill}
              onChange={handleTotalBillChange} // Allow manual editing
            />
          </div>
        </div>


  <div className="grid grid-cols-2 gap-3 mt-6">
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
            <td className="text-right" colSpan="3">
                  Total:
                </td> : <td className="text-right" colSpan="2">
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
                <td></td>
                
              
 
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
        </div>
    );
};

export default TiktokAds;