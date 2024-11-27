import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import EmployeeClientPay from "../DashboardRoot/EmployeeClientPay";
import useClients from "../../Hook/useClient";
import { Link } from "react-router-dom";
import useAdsPayment from "../../Hook/useAdsPayment";
import useAdsAccountCenter from "../../Hook/useAdsAccountCenter";
import useAllEmployee from "../../Hook/useAllEmployee";
import { FaEdit, FaMinusSquare } from "react-icons/fa";

const AllUsers = () => {
  const [allEmployees,refetch]=useAllEmployee()
  const { user } = useContext(AuthContext); // Get current user
  const [employees, setEmployees] = useState([]); // State to hold filtered employees
  const [employees2, setEmployees2] = useState([]); // State to hold filtered employees
  const [employees3, setEmployees3] = useState([]); // State to hold filtered employees
  const [employees4, setEmployees4] = useState([]); // State to hold filtered employees
  const [employees5, setEmployees5] = useState([]); // State to hold filtered employees
  const [employees6, setEmployees6] = useState([]); // State to hold filtered employees
  const [employees7, setEmployees7] = useState([]); // State to hold filtered employees
  
  const initialTab = localStorage.getItem("activeTab") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  console.log(activeTab);

  useEffect(() => {
    if (allEmployees && activeTab !== 'all') {
      const employeeList = allEmployees.filter((u) => u.role === activeTab);
      setEmployees(employeeList);
      const employeeList2 = allEmployees.filter((u) => u.role === 'graphicDesigner');
      setEmployees2(employeeList2);
      const employeeList3 = allEmployees.filter((u) => u.role === 'admin');
      setEmployees3(employeeList3);
      const employeeList4 = allEmployees.filter((u) => u.role === 'employee');
      setEmployees4(employeeList4);
      const employeeList5 = allEmployees.filter((u) => u.role === 'webDeveloper');
      setEmployees5(employeeList5);
      const employeeList6 = allEmployees.filter((u) => u.role === 'contributor');
      setEmployees6(employeeList6);
      const employeeList7 = allEmployees.filter((u) => u.role === 'client');
      setEmployees7(employeeList7);
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

  // Update the active tab and save it to local storage
  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); // Store the active tab in local storage
  };

  const getButtonClass = (tab) => 
    `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
        activeTab === tab 
            ? 'bg-blue-600 font-bold text-white shadow-lg transform scale-105'  // Active tab styles
            : 'bg-red-600  text-white hover:bg-gray-700 hover:shadow-md' // Inactive tab styles
    }`;
  

  const [clients] = useClients();
  const [adsPayment] = useAdsPayment();
  const [adsAccountCenter] = useAdsAccountCenter();

  const totalClientsForEmployees = activeTab === 'employee'
    ? employees.reduce((total, employee) => 
        total + clients.filter(client => client.employeeEmail === employee.email).length
      , 0)
    : 0;



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
    <div className="my-5 mx-5 ">
      <Helmet>
        <title>All Users | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

    



      {activeTab === 'clientPay' && <EmployeeClientPay email={user?.email} />}

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}  className="p-5  rounded-lg">
      <div  className="flex justify-start rounded-lg items-center">
  <div className="flex justify-start  gap-3 mb-5 ">
    <button 
      className={getButtonClass('all')}
      onClick={() => changeTab('all')}
    >
      All Users ({allEmployees.length})
    </button>
    <button 
      className={getButtonClass('admin')}
      onClick={() => changeTab('admin')}
    >
      Administrator ({employees3.length})
    </button>
    <button 
      className={getButtonClass('employee')}
      onClick={() => changeTab('employee')}
    >
      Employees ({employees4.length})
    </button>
    <button 
      className={getButtonClass('webDeveloper')}
      onClick={() => changeTab('webDeveloper')}
    >
      Web Developer ({employees5.length})
    </button>
    <button 
      className={getButtonClass('graphicDesigner')}
      onClick={() => changeTab('graphicDesigner')}
    >
      Graphic Designer ({employees2.length})
    </button>
    <button 
      className={getButtonClass('contributor')}
      onClick={() => changeTab('contributor')}
    >
      Contributor ({employees6.length})
    </button>
    <button 
      className={getButtonClass('client')}
      onClick={() => changeTab('client')}
    >
      Users ({employees7.length})
    </button>
  </div>
</div>
      <div  className="overflow-x-auto rounded-xl  text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                  <th className="p-3 text-center">Action</th>
                <th className="p-3 text-center">Profile</th>
                <th className="p-3 text-start">Name</th>
                <th className="p-3 text-center">Mobile</th>
                <th className="p-3 text-start">Email</th>
                {activeTab === 'employee' && (
                  <th className="p-3 text-center">Client</th>
                )}
                {activeTab === 'contributor' && (
                  <th className="p-3 text-center">Due</th>
                )}
                <th className="p-3 text-center">Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((user, index) => (
                 <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
                 key={user._id}
                 className={`${
                   index % 2 === 0
                     ? "bg-white text-left text-black border-b border-opacity-20"
                     : "bg-gray-200  text-left text-black border-b border-opacity-20"
                 }`}
               >
                  <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
                  <button
                      onClick={() => handleDelete(user._id)}
                       className="text-red-600 text-xl hover:bg-blue-700  px-2 py-1 rounded"
                    >
                        <FaMinusSquare  />
                    </button>
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                    <img
                      className="h-16 w-16 flex justify-center items-center mx-auto rounded-full"
                      src={user.photo}
                      alt=""
                    />
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 hover:text-indigo-700 hover:font-bold border-r-2 border-gray-300 text-start">
                    {
                      user.role === 'contributor' ? <Link to={`/dashboard/adsuserInfo/${user?.email}`}>
                      {user.name}
                      </Link> : <Link to={`/dashboard/userinfo/${user?.email}`}>
                      {user.name}
                      </Link>
                    }
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                    {user.contactNumber}
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  <button
                         className="flex justify-start items-center gap-2"
                        onClick={() =>
                          document
                            .getElementById(`my_modal_${user._id}`)
                            .showModal()
                        }
                      >
                       <FaEdit />
                       <h1>{user.email}</h1>
                      </button>
                    
                  </td>

                                 {activeTab === 'contributor' && (
 <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
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
                       <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold border-gray-300 text-center">  <Link to={`/dashboard/allEmployeeClients/${user?.email}`}>
                       {clients.filter(c => c.employeeEmail === user.email).length}
                       </Link></td>
                     )}

                 
                 
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                    <select
                     style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
                      className="p-2 bg-gray-100 border border-gray-300 rounded"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                      <option value="webDeveloper">Web Developer</option>
                      <option value="graphicDesigner">Graphic Designer</option>
                      <option value="contributor">Contributor</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                 
                </tr>
              ))}
            </tbody>
            {activeTab === 'employee' && (
  <tfoot>
    <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}} className="  py-5">
      <td
        colSpan={5}
        className="text-right py-3 text-white font-bold"
      >
        Total :
      </td>
      <td
        colSpan={1}
        className="text-center font-bold"
      >
        {totalClientsForEmployees}
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
)}



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
{activeTab === 'contributor' && (
  <tfoot  style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className="">
    <tr>
      <td colSpan="5" className="p-3 text-right">
        Total: 
      </td>
      <td className="text-center">{totalDueForContributors.toFixed(2)}</td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
)}

{activeTab !== 'employee' && activeTab !== 'contributor' && (
  <tfoot>
    <tr  style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" py-5">
      <td
        colSpan={5}
        className="text-right py-3 text-white font-bold"
      >
        -
      </td>
      <td
        colSpan={1}
        className="text-center font-bold"
      >
        -
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
)}

          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
