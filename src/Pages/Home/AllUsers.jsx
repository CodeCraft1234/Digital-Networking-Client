import { useContext, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import EmployeeClientPay from "../DashboardRoot/EmployeeClientPay";
import useAdsPayment from "../../Hook/useAdsPayment";
import useAdsAccountCenter from "../../Hook/useAdsAccountCenter";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import AllClients from "./AllClients";
import useAllEmployee from "../../Hook/useAllEmployee";
import { MdTune } from "react-icons/md";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [allEmployees,refetch]=useAllEmployee()


  const initialTab = localStorage.getItem("activeTabs") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (allEmployees && activeTab !== 'all') {
      const employeeList = allEmployees.filter((u) => u.role === activeTab);
      setEmployees(employeeList);
    } else {
      setEmployees(allEmployees); 
    }
  }, [allEmployees, activeTab]);

  const AxiosPublic = UseAxiosPublic();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete user",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/users/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "The user has been deleted.",
              icon: "success",
            });
            refetch(); // Refetch users after deletion
          }
        });
      }
    });
  };

  const handleRoleChange = (id, newRole) => {
    AxiosPublic.put(`/users/role/${id}`, { role: newRole })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch(); // Refetch users after role update
        }
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue updating the role.",
          icon: "error",
        });
      });
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTabs", tab);
  };

  const [adsPayment] = useAdsPayment();
  const [adsAccountCenter] = useAdsAccountCenter();


    const totalDueForContributors = activeTab === 'contributor'
    ? employees.reduce((total, employee) => 
        total + (
          adsAccountCenter
            .filter(payment => payment.employeeEmail === employee.email)
            .reduce((acc, payment) => acc + parseFloat(payment.totalSpent || 0) * parseFloat(payment.dollerRate || 0), 0) 
          - (
            adsPayment
              .filter(payment => payment.employeeEmail === employee.email)
              .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0)
          )
        )
      , 0)
    : 0;

    const handleUpdate = (e, id) => {
      e.preventDefault();
      const name = e.target.name.value;
      const contactNumber = e.target.contactNumber.value;
      const body = { name,contactNumber };

      AxiosPublic.patch(`/users/2/${id}`,
        body
      )
        .then((res) => {
          refetch();
          document.getElementById(`my_modal_${id}`).close();
        })
    };

  return (
    <div className=" ">
      <Helmet>
        <title>All User | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

  
      {activeTab === 'clientPay' && <EmployeeClientPay email={user?.email} />}

      <div className="lg:block hidden">
      <div  className="f-start">
      <div style={{ color: 'var(--text-color2)' }} className="f-start cursor-pointer gap-3 mb-5">
  <a
    className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
    onClick={() => changeTab('all')}
  >
    All Users
  </a>
  <a
    className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
    onClick={() => changeTab('admin')}
  >
    Administrator
  </a>
  <a
    className={`tab-button ${activeTab === 'employee' ? 'active' : ''}`}
    onClick={() => changeTab('employee')}
  >
    Digital Marketer
  </a>
  <a
    className={`tab-button ${activeTab === 'graphicDesigner' ? 'active' : ''}`}
    onClick={() => changeTab('graphicDesigner')}
  >
    Graphic Designer
  </a>
  <a
    className={`tab-button ${activeTab === 'UI/UXDesigner' ? 'active' : ''}`}
    onClick={() => changeTab('UI/UXDesigner')}
  >
    UI/UX Designer
  </a>
  <a
    className={`tab-button ${activeTab === 'webDeveloper' ? 'active' : ''}`}
    onClick={() => changeTab('webDeveloper')}
  >
    Web Developer
  </a>
  <a
    className={`tab-button ${activeTab === 'contributor' ? 'active' : ''}`}
    onClick={() => changeTab('contributor')}
  >
    Contributor
  </a>
  <a
    className={`tab-button ${activeTab === 'client' ? 'active' : ''}`}
    onClick={() => changeTab('client')}
  >
    Users
  </a>
</div>

      </div>
      </div>

      <div className="text-xs text-gray-700 mb-5 lg:hidden">
                    
                    
                    <div className="fixed top-0 left-0 right-0 z-50">
                      {/* Pink Top Bar */}
                      <div className="bg-[#f3a62b]  text-white flex items-center justify-between px-4 py-3 shadow-md">
                        <p></p>
                        <h1 className="text-lg text-center font-bold">মাসিক স্পিন্ড</h1>
                        <div className="relative">
                          <img
                            src="https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"
                            alt="Icon"
                            className="w-6 h-6"
                          />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    
                      {/* White Tabs + Search Section */}
                      <div className="bg-white shadow-md pt-2">
                        {/* Tabs */}
                    
                        <div className="flex justify-around items-center relative">
  {/* সমস্ত (All) */}
  <button
    onClick={() => changeTab('all')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'all' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    সব
    {activeTab === 'all' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* অ্যাডমিন (Admin) */}
  <button
    onClick={() => changeTab('admin')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'admin' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    অ্যাডমিন
    {activeTab === 'admin' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* মার্কেটার (Marketer) */}
  <button
    onClick={() => changeTab('employee')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'employee' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    মার্কেটার
    {activeTab === 'employee' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* গ্রাফিক ডিজাইনার (Graphic Designer) */}
  <button
    onClick={() => changeTab('graphicDesigner')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'graphicDesigner' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    গ্রাফিক
    {activeTab === 'graphicDesigner' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>

  {/* ওয়েব ডেভেলপার (Web Developer) */}
  <button
    onClick={() => changeTab('webDeveloper')}
    className={`relative py-3 text-sm font-sans ${activeTab === 'webDeveloper' ? 'text-pink-600 font-bold' : 'text-gray-500'}`}
  >
    ডেভেলপার
    {activeTab === 'webDeveloper' && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600"></div>
    )}
  </button>
</div>

      
            
                      </div>
                    </div>
                    
                    
                        </div>

                        <div className="bg-white font-sans py-20 lg:max-w-2xl lg:hidden mx-auto text-sm">
  {employees?.map((user) => (
    <div
      key={user._id}
      className="px-4 py-3 border-b hover:bg-gray-50 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Content */}
        <div className="flex items-center gap-3">
          {/* User Image */}
          <img
            className="h-10 w-10 rounded-full object-cover border"
            src={user.photo}
            alt={user.name}
          />

          {/* User Info */}
          <div>
            <p className="text-base font-semibold text-gray-900 hover:text-blue-700 transition-colors">
              {user?.name}
            </p>
            <p className="text-sm text-gray-600">{user.contactNumber}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="text-right space-y-1">
          <p className="text-sm font-medium text-red-700">{user.email}</p>
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none bg-white text-black focus:ring-1 focus:ring-blue-500"
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="employee">Digital Marketer</option>
            <option value="webDeveloper">Web Developer</option>
            <option value="graphicDesigner">Graphic Designer</option>
            <option value="UI/UXDesigner">UI/UX Designer</option>
            <option value="contributor">Contributor</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>
    </div>
  ))}
</div>

      
        {
          activeTab === 'allClient' ? <AllClients></AllClients> :
          <div  className="table-div lg:block hidden" >
          <table className="min-w-full text-center ">
            <thead className=" ">
          <tr className="tr1">
                  <th className=" text-center">{employees.length} Users</th>
                <th >Name</th>
                <th >Mobile</th>
                <th >Email</th>
                {activeTab === 'employee' && (
                  <th >L.week Orders</th>
                )}
                {activeTab === 'employee' && (
                  <th >Client</th>
                )}
                {activeTab === 'contributor' && (
                  <th >Due</th>
                )}
                <th className="text-center">Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((user, index) => (
                 <tr 
                 key={user._id}
                 className={`tr2`}
               >
                  <td  className="text-center">
                  <div className="f-center">
                  <button
                      onClick={() => handleDelete(user._id)}
                       className="text-red-600 text-xl hover:bg-blue-700  px-2 py-1 rounded"
                    >
                        <FaMinusSquare  />
                    </button>
                    <button
                         className="flex justify-start items-center gap-2"
                        onClick={() =>
                          document
                            .getElementById(`my_modal_${user._id}`)
                            .showModal()
                        }
                      >
                       <FaEdit />
                   
                      </button>
                  </div>

                      <dialog id={`my_modal_${user._id}`} className="modal">
  <div className="modal-box bg-white">
    <form
      onSubmit={(e) =>
        handleUpdate(e, user?._id, )
      }
    >
      <h1 className="text-black font-bold text-start">Name</h1>
      <input
        className="text-black inline-block w-full mb-5 p-3 border border-black bg-white"
        type="text"
        name="name"
        required
        defaultValue={user?.name}
        id=""
      />
      <h1 className="text-black font-bold text-start">Contact Number</h1>
      <input
        type="number"
        name="contactNumber"
        placeholder="01..."
        defaultValue={user?.contactNumber}
        className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
      />

      <button
        type="submit"
        className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
      >
        Update
      </button>
    </form>
    <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
        ✕
      </button>
    </form>
  </div>
                      </dialog>
                  </td>

                  <td>
                   <div className="f-start">
                   <img
                      className="h-14 w-14  rounded-full"
                      src={user.photo}
                      alt=""
                    />
                     {user.name}
                   </div>
                  </td>

                

                  <td>
                    {user.contactNumber}
                  </td>
                  <td>
                  <h1>{user.email}</h1>
 
                  </td>

                                 {activeTab === 'contributor' && (
 <td>
  <span className="mr-1 text-xl font-bold">৳</span> 
 {
    (
     adsAccountCenter
       .filter(payment => payment.employeeEmail === user.email)
       .reduce((acc, payment) => acc + parseFloat(payment.totalSpent || 0) * parseFloat(payment.dollerRate || 0), 0)
   ) - (
    adsPayment
      .filter(payment => payment.employeeEmail === user.email)
      .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0) 
  )
 }
</td>

)}

                  {activeTab === 'employee' && (
                       <td>  
                       {user.lastWeekClient}
                      </td>
                     )}
                  {activeTab === 'employee' && (
                       <td>  
                       {user.clients}
                      </td>
                     )}
                 
                  <td className="text-center">
                    <select
                      className="select2"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Digital Marketer</option>
                      <option value="webDeveloper">Web Developer</option>
                      <option value="graphicDesigner">Graphic Designer</option>
                      <option value="UI/UXDesigner">UI/UX Designer</option>
                      <option value="contributor">Contributor</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
            {activeTab === 'employee' && (
  <tfoot>
    <tr className="font-bold tr1">
      <td
        colSpan={4}
        className="text-right "
      >
        Total :
      </td>
      <td colSpan={1}>
  {employees.reduce((acc, employee) => acc + parseFloat(employee.lastWeekClient || 0), 0)}
</td>
      <td colSpan={1}>
  {employees.reduce((acc, employee) => acc + parseFloat(employee.clients || 0), 0)}
</td>


      <td></td>
    </tr>
  </tfoot>
)}

{activeTab === 'contributor' && (
  <tfoot >
    <tr className="tr1 font-bold">
      <td colSpan="5" className=" text-right">
        Total: 
      </td>
      <td >{totalDueForContributors.toFixed(2)}</td>
      
   
    </tr>
  </tfoot>
)}

{activeTab !== 'employee' && activeTab !== 'contributor' && (
  <tfoot>
    <tr   className=" tr1 font-bold">
      <td
        colSpan={5}
        className="text-right py-3 text-white font-bold"
      >
        -
      </td>
    
 
    </tr>
  </tfoot>
)}

          </table>
       
          </div>
       
        }
       
    </div>
  );
};

export default AllUsers;
