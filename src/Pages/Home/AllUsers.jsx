import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const AllUsers = () => {
  const [users, refetch] = useUsers();
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (users && user) {
      const foundUser = users.find((u) => u.email === user.email);
      setCurrentUser(foundUser || {});
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList || []);
    }
  }, [users, user]);

  const AxiosPublic = UseAxiosPublic();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete employee",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/users/${id}`)
          .then((res) => {
            refetch();
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "The employee has been deleted.",
                icon: "success",
              });
            }
          });
      }
    });
  };

  const handleRoleChange = (id, newRole) => {
    AxiosPublic.put(`/users/role/${id}`, { role: newRole })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
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

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="mt-5 p-4 dark:text-green-800">
      <Helmet>
        <title>All Users | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center">Sl</th>
                <th className="p-3 text-center">Profile</th>
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-gray-500 border-b border-opacity-20"
                      : "bg-gray-200 text-gray-500 border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    <img
                      className="h-24 w-24 flex justify-center items-center mx-auto rounded-lg"
                      src={user.photo}
                      alt=""
                    />
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    {user.name}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    {user.email}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-2 border bg-white text-black border-gray-300 rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                      <option value="client">Client</option>
                      <option value="adsAccount">Ads Account</option>
                    </select>
                  </td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleDropdown(user._id)}
                        className="focus:outline-none"
                      >
                        &#8226;&#8226;&#8226;
                      </button>
                      {activeDropdown === user._id && (
                        <div className="absolute right-0 z-20 w-40 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-xl">
                          <button
                            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
