import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import "./profile.css";
import { useLoaderData } from "react-router-dom";

const Profile = () => {
  const { user, logOut } = useContext(AuthContext);

  const userr=useLoaderData()
  console.log(userr)


  const handleLogout = () => {
    logOut();
    window.location.href = "/";
  };
//dhdsffdsjh
  return (
    <div className="mt-[100px] mx-auto max-w-md p-6 rounded-lg shadow-md">
      <div className="boxP">
        <div className="loginP">
          <div className="loginBxP">
            <div className="text-center  mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ">
                <img
                  src={user?.photoURL}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-start space-y-3">
              <h1 className="text-md font-bold text-white">
                Name : {userr?.fullName}
              </h1>
              <h1 className="text-md font-bold text-white">
                Mobile : {userr?.contctNumber}
              </h1>
              <h1 className="text-md font-bold text-white">
                Address :{userr?.fullAddress}
              </h1>
              {/* <h1 className="text-xl font-bold text-white">
                C{userr?.companyLogo}
              </h1> */}
              <p className="text-md font-bold text-white">
                Email: {userr?.email}</p>
            </div>
              </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-indigo-950 border-b-2 rounded-lg"
              >
                <a className="b rounded-lg" href="">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Logout
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;