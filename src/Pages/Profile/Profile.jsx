
import "./profile.css";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import useUsers from "../../Hook/useUsers";

const Profile = () => {

  const [users] = useUsers(); 
  console.log(users)

  const userr=useLoaderData()
  console.log(userr)

//dhdsffdsjh
  return (
    <div className="mt-24   ">
      <div >
      <img className="rounded-full mx-auto w-72 h-72" src={userr.photo} alt=""/>
      
    </div>
    <div className="flex mx-auto items-center px-10 space-x-2 overflow-hidden sm:justify-center flex-nowrap dark:bg-gray-800 dark:text-gray-100">
    <NavLink to=""
          className="flex items-center flex-shrink-0 pl-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Profile
        </NavLink>
        <NavLink
          to="/ad-account"
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Ad Account
        </NavLink>
        <NavLink
          to="/mobile-banking"
          className="flex items-center flex-shrink-0 px-5 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Mobile Banking
        </NavLink>
        <NavLink
          to="/salary"
          className="flex items-center flex-shrink-0 pr-16 py-2 border-b-4 dark:border-gray-700 dark:text-gray-400"
          activeClassName="dark:border-violet-400 dark:text-gray-50"
        >
          Salary
        </NavLink>
      </div>
      {/* 1st table */}
      <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-400">
              <tr>
                <th className="p-3 text-center">Cover Photo</th>
                <th className="p-3 text-center">Company Logo</th>
                <th className="p-3 text-center">Full Name</th>
                <th className="p-3 text-center">Full Address</th>
                <th className="p-3 text-center">Facebook ID</th>
                <th className="p-3 text-center">Contact Number</th>
              </tr>
            </thead>
           
            
                <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                  <td className="p-3 text-center">     <Link to={`/userInfo/${userr._id}`}>
                    <img  className="w-10 h-10 mx-auto rounded-full" src={userr.photo} alt="" />
                                                       </Link>
                  </td>
                  <td className="p-3 text-center">
                  <img  className="w-10 h-10 mx-auto rounded-full" src={userr.companyLogo} alt="" />
                  </td>
                
                  <td className="p-3 text-center">{userr?.fullName}</td>
                  <td className="p-3 text-center">{userr?.fullAddress}</td>
                  <td className="p-3 text-center">{userr?.facebookID}</td>
                  <td className="p-3 text-center">{userr?.contctNumber}</td>
                </tr>
            
           
          </table>
        </div>
    </div>
  );
};

export default Profile;