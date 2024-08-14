import { useContext, useEffect, useState } from "react";
import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AllEmployee = () => {
  const [users, setUsers] = useUsers();
  const { user } = useContext(AuthContext);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    if (users) {
      const employees = users.filter((u) => u.role === "employee");
      setEmployee(employees || []);
    }
  }, [users]);

  const AxiosPublic = UseAxiosPublic();
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete employee",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/users/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Your employee has been deleted.", "success");
            setEmployee(employee.filter((emp) => emp._id !== id));
          }
        });
      }
    });
  };

  return (
    <div className="mt-5 p-4 dark:text-green-800">
      <Helmet>
        <title>All Employee | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <Link to={`/dashboard/addEmployee`}>
        <button className="text-xl border-black border text-white btn-outline px-2 text-black mx-auto bg-[#05a0db] rounded-lg py-2">
          <h1>Add An Employee</h1>
        </button>
      </Link>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="w-full bg-blue-500 text-white">
              <th className="px-6 py-3 border">SL</th>
              <th className="px-6 py-3 border">Profile</th>
              <th className="px-6 py-3 border">Full Name</th>
              <th className="px-6 py-3 border">Email</th>
              <th className="px-6 py-3 border">Number</th>
              <th className="px-6 py-3 border">Address</th>
              <th className="px-6 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((em, index) => (
              <tr key={em._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 border text-center">{index + 1}</td>
                <td className="px-6 py-4 border text-center">
                  <img
                    className="w-10 h-10 rounded-full mx-auto"
                    src={em.companyLogo}
                    alt={em.name}
                  />
                </td>
                <td className="px-6 py-4 border">{em.fullName}</td>
                <td className="px-6 py-4 border">{em.email}</td>
                <td className="px-6 py-4 border">{em.contctNumber}</td>
                <td className="px-6 py-4 border">{em.fullAddress}</td>
                <td className="px-6 py-4 border text-center">
                  <button
                    onClick={() => handledelete(em._id)}
                    className="p-2 rounded-lg text-3xl text-black mx-auto"
                  >
                     <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployee;
