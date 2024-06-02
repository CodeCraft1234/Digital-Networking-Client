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

const AllEmployee = () => {
  const [users, setUsers] = useUsers();
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

  return (
    <div className="mt-24 p-4 dark:text-green-800">
      {/* <h6 className="text-center mx-4 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800 mb-6">
        All Employee
      </h6> */}

      {/* {ddd?.role === "employee" && (
        <h2 className="mb-4 text-center mx-4 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800">
          All Employers
        </h2>
      )} */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4">
        {employee?.map((em) => (
          <div
            key={em._id}
            className="bg-white  border border-black mx-auto shadow-md rounded-lg p-6 transform transition-all hover:shadow-xl"
            style={{ width: "300px", height: "400px" }}
          >
            <div className="text-center text-black  overflow-hidden">
              <img
                className="w-20 h-20 mx-auto rounded-full mb-4"
                src={em.companyLogo}
                alt={em.name}
              />

              <h2 className="text-base font-semibold mb-4 text-red-600">
                {em.name}
              </h2>
            </div>
            <div className="text-left text-black ">
              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Full Name: </span>
                <span className="text-sm text-gray-600">{em.fullName}</span>
              </div>
              {/* <div className="flex items-center justify-start mb-2 gap-2">
                <span>Company Name: </span>
                <span>{em.companyName}</span>
              </div> */}
              <div className="flex items-center justify-start mb-2 gap-2">
                <span className="font-bold">Email: </span>
                <span className="text-sm text-gray-600">{em.email}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Mob:</span>
                <span className="text-sm text-gray-600">{em.contctNumber}</span>
              </div>

              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Address: </span>
                <span className="text-sm text-gray-600">{em.fullAddress}</span>
              </div>

              <div className="flex items-center justify-center mb-2 gap-0 overflow-hidden ">
                {/* <span className=" font-bold">Facebook: </span> */}
                <button className=" text-blue-600 rounded-lg  border-gray-600 p-3">
                  <Link to={em.facebookID}>
                    <FaFacebook className="w-5 h-5"></FaFacebook>
                  </Link>
                </button>
                <button className=" text-red-600 rounded-lg  border-gray-600 p-3">
                  <Link to={em.instagramID}>
                    <FaInstagram className="w-5 h-5"></FaInstagram>
                  </Link>
                </button>
                <button className=" text-[#0072B9] rounded-lg  border-gray-600 p-3">
                  <Link to={em.linkedinID}>
                    <FaLinkedin className="w-5 h-5"></FaLinkedin>
                  </Link>
                </button>
                <button className=" text-[#00A2FD] rounded-lg  border-gray-600 p-3">
                  <Link to={em.twitterID}>
                    <FaTwitter className="w-5 h-5"></FaTwitter>
                  </Link>
                </button>
                <button className=" text-[#FF211F] rounded-lg  border-gray-600 p-3">
                  <Link to={em.youtubeID}>
                    <FaYoutube className="w-5 h-5"></FaYoutube>
                  </Link>
                </button>
                <button className=" text-[#00CE6C] rounded-lg  border-gray-600 p-3">
                  <Link to={em.whatsappID}>
                    <FaWhatsapp className="w-5 h-5"></FaWhatsapp>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEmployee;
