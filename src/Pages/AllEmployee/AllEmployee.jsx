import { useContext, useEffect, useState } from "react";

import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";
import { AuthContext } from "../../Security/AuthProvider";
import { Link } from "react-router-dom";
import Payment from "../Home/Payment";

const AllEmployee = () => {
  const [users, setUsers] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState(null);

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
            className="bg-white hover:bg-blue-600 border border-black mx-auto shadow-md rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl"
            style={{ width: "300px", height: "400px" }}
          >
            <div className="text-center text-black hover:text-blue-100 overflow-hidden">
              <img
                className="w-20 h-20 mx-auto rounded-full mb-4"
                src={em.photo}
                alt={em.name}
              />
              <h2 className="text-xl font-semibold mb-4">{em.name}</h2>
            </div>
            <div className="text-left text-black hover:text-blue-100">
              <div className="flex items-center justify-start mb-2 gap-2">
                <span>Full Name: </span>
                <span>{em.fullName}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2">
                <span>Email: </span>
                <span>{em.email}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span>Facebook: </span>
                <span>{em.facebookID}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2">
                <span>Address: </span>
                <span>{em.fullAddress}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2">
                <span>Contact Number:</span>
                <span>{em.contctNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEmployee;
