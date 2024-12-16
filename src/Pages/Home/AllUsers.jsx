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
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import AllClients from "./AllClients";
import useOnlyClientEmail from "../../Hook/useOnlyClientEmail";

const AllUsers = () => {
  const [users,refetch]=useUsers()
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [employees2, setEmployees2] = useState([]);
  const [employees3, setEmployees3] = useState([]);
  const [employees4, setEmployees4] = useState([]);
  const [employees5, setEmployees5] = useState([]);
  const [employees6, setEmployees6] = useState([]);
  const [employees7, setEmployees7] = useState([]);
  
  const initialTab = localStorage.getItem("activeTabs") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (users && activeTab !== 'all') {
      const employeeList = users.filter((u) => u.role === activeTab);
      setEmployees(employeeList);
      const employeeList2 = users.filter((u) => u.role === 'graphicDesigner');
      setEmployees2(employeeList2);
      const employeeList3 = users.filter((u) => u.role === 'admin');
      setEmployees3(employeeList3);
      const employeeList4 = users.filter((u) => u.role === 'employee');
      setEmployees4(employeeList4);
      const employeeList5 = users.filter((u) => u.role === 'webDeveloper');
      setEmployees5(employeeList5);
      const employeeList6 = users.filter((u) => u.role === 'contributor');
      setEmployees6(employeeList6);
      const employeeList7 = users.filter((u) => u.role === 'client');
      setEmployees7(employeeList7);
    } else {
      setEmployees(users); 
    }
  }, [users, activeTab]);

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

  const getButtonClass = (tab) => 
    `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg  transition duration-300 ease-in-out  ${
        activeTab === tab 
            ? 'bg-blue-600 font-bold text-white transform scale-105'
            : 'hover:bg-blue-300 hover:shadow-md'
    }`;

  const [onlyClientEmail]=useOnlyClientEmail()
  const [adsPayment] = useAdsPayment();
  const [adsAccountCenter] = useAdsAccountCenter();

  const totalClientsForEmployees = activeTab === 'employee'
    ? employees.reduce((total, employee) => 
        total + onlyClientEmail.filter(client => client.employeeEmail === employee.email).length
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
    <div className=" ">
      <Helmet>
        <title>All User | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

    



      {activeTab === 'clientPay' && <EmployeeClientPay email={user?.email} />}

      <div   className="side-space">
      <div  className="f-start  ">
  <div  style={{ color: 'var(--text-color2)'}} className="f-start  mb-5 ">
    <a 
      className={getButtonClass('all')}
      onClick={() => changeTab('all')}
    >
      All Users ({users.length})
    </a>
    <a
      className={getButtonClass('admin')}
      onClick={() => changeTab('admin')}
    >
      Administrator ({employees3.length})
    </a>
    <a 
      className={getButtonClass('employee')}
      onClick={() => changeTab('employee')}
    >
      Employees ({employees4.length})
    </a>
    <a
      className={getButtonClass('webDeveloper')}
      onClick={() => changeTab('webDeveloper')}
    >
      Web Developer ({employees5.length})
    </a>
    <a
      className={getButtonClass('graphicDesigner')}
      onClick={() => changeTab('graphicDesigner')}
    >
      Graphic Designer ({employees2.length})
    </a>
    <a
      className={getButtonClass('contributor')}
      onClick={() => changeTab('contributor')}
    >
      Contributor ({employees6.length})
    </a>
    <a
      className={getButtonClass('client')}
      onClick={() => changeTab('client')}
    >
      Users ({employees7.length})
    </a>
  </div>
</div>
        {
          activeTab === 'allClient' ? <AllClients></AllClients> :  <div  className="table-div">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
                  <th className=" text-center">Action</th>
                <th >Profile</th>
                <th >Name</th>
                <th >Mobile</th>
                <th >Email</th>
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
                  <button
                      onClick={() => handleDelete(user._id)}
                       className="text-red-600 text-xl hover:bg-blue-700  px-2 py-1 rounded"
                    >
                        <FaMinusSquare  />
                    </button>
                  </td>

                  <td>
                    <img
                      className="h-16 w-16 flex justify-center items-center mx-auto rounded-full"
                      src={user.photo}
                      alt=""
                    />
                  </td>

                  <td>
                      {user.name}
                  </td>

                  <td>
                    {user.contactNumber}
                  </td>
                  <td>
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
                       {onlyClientEmail.filter(c => c.employeeEmail === user?.email).length}
                      </td>
                     )}

                  <td className="text-center">
                    <select
                      className="select2"
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
    <tr className="font-bold tr1">
      <td
        colSpan={5}
        className="text-right "
      >
        Total :
      </td>
      <td
        colSpan={1}
      >
        {totalClientsForEmployees}
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
      <td></td>
   
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
      <td
        colSpan={1}
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
    </div>
  );
};

export default AllUsers;
