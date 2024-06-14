import { useContext, useEffect, useState } from "react";

import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";
import Payment from "../Home/Payment";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, refetch] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState(null);
console.log(ddd)
  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      console.log(fff);
      setDdd(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    if (users && user) {
      const fff = users.filter((u) => u.role === "employee");
      console.log(fff);
      setEmployee(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  console.log(ddd?.name);

  const AxiosPublic =UseAxiosPublic()
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
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
              text: "Your employee has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };



  return (
    <div className="mt-24 p-4 dark:text-green-800">
      <Helmet>
              <title> Digital Network | All Employee</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
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
  {users.map((campaign, index) => (
    <tr
      key={campaign._id}
      className={`${
        index % 2 === 0
          ? "bg-white text-gray-500 border-b border-opacity-20"
          : "bg-gray-200 text-gray-500 border-b border-opacity-20"
      }`}
    >
      <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">{index + 1}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center"><img className="h-24 w-24 flex justify-center items-center mx-auto rounded-lg" src={campaign.photo} alt="" /></td>
      <td className="p-3 border-r-2 border-gray-300 text-center">{campaign.name}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">$ {campaign.email}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">$ {campaign.role}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center"><button  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800" onClick={() => handledelete(campaign._id)}>Delete</button></td>
      
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
