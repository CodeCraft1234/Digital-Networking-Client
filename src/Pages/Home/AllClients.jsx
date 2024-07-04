import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";

const AllClients = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState([]);
  const [clients, refetch] = useClients();
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employees = users.filter(u => u.role === 'employee');
      setDdd(employees);
    }
  }, [users, user]);

  useEffect(() => {
    if (clients) {
      setFilteredClients(clients);
    }
  }, [clients]);

  const handleSort = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const filtered = clients.filter(c => c.employeeEmail === email);
    setFilteredClients(filtered);
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;


    const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  console.log(totalSpent, totalBudged, totalRCV, totalbill);

  useEffect(() => {


    const totalRcv = filteredByCategory.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);
    }, 0);
    setTotalRCV(totalRcv);

    const tspent = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(tspent);

    const total = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);

    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBill),
      0
    );
    setTotalBill(totalBill);

  }, [filteredByCategory]);

const AxiosPublic =UseAxiosPublic()
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete blog",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/clients/${id}`)
        .then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };


  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  return (
    <div className="mt-5">
       <Helmet>
              <title> Digital Network | Clients</title>
              <link rel="canonical" href="https://www.tacobell.com/" />
               </Helmet>
<div className="flex justify-between items-center ">
<form className="flex justify-center items-center" onSubmit={handleSort}>
        <div className="mb-4 ml-10 mx-auto">
          <label className="block text-gray-700">Sort By Employee</label>
          <select name="email" className="border rounded p-2 mt-1">
          <option value="">All Employee</option>
            {ddd.map(d => <option key={d._id} value={d.email}>{d.name}</option>)}
          </select>
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
      </form>
      <div className="flex justify-end ">
                <input
                  type="text"
                  placeholder=" Client Phone Number"
                  className=" rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  className=" w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
                >
                  <IoIosSearch className="mx-auto font-bold w-6 h-6" />
                </button>
      </div>
</div>




      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto border-2 border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Client Name</th>
                <th className="p-3 text-center">Client Phone</th>
                <th className="p-3 text-center">T.Budget</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Total Bill</th>
                <th className="p-3 text-center">Total Payment Rcv</th>
                <th className="p-3 text-center">Action</th>
              
              </tr>
            </thead>
            <tbody>
  {filteredByCategory.map((campaign, index) => (
    <tr
      key={campaign._id}
      className={`${
        index % 2 === 0
          ? "bg-white text-gray-500 border-b border-opacity-20"
          : "bg-gray-200 text-gray-500 border-b border-opacity-20"
      }`}
    >
      <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">{new Date(campaign?.date).toLocaleDateString("en-GB")}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">
        <Link to={`/dashboard/client/${campaign.clientEmail}`} className="flex justify-center">
          {campaign.clientName}
        </Link>
      </td>
      <td className="p-3 border-r-2 border-gray-300 text-center">{campaign.clientPhone}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">$ {campaign.tBudged}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">$ {campaign.tSpent}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">৳ {campaign.tBill}</td>
      <td className="p-3 border-r-2 border-gray-300 text-center">৳ {campaign.tPayment}</td>
      <td className="p-3 border-r-2 border-gray-200 text-center">
                  <div className="relative inline-block">
                  <button
                                            onClick={() => toggleDropdown(campaign._id)}
                                            className=" focus:outline-none"
                                        >
                                            &#8226;&#8226;&#8226;
                                        </button>
                    {activeDropdown === campaign._id && (
                      <div className="absolute right-0 z-20 w-40 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-xl">
      
                        <button
                          className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200"
                          onClick={() => handledelete(campaign._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
      
    </tr>
  ))}
  <tr className="bg-green-800 text-sm text-white font-bold">
    <td className="p-3 border-2 border-black text-right" colSpan="3">
      Total :
    </td>
    <td className="p-3 border-2 border-black text-center">$ {totalBudged}</td>
    <td className="p-3 border-2 border-black text-center">$ {totalSpent}</td>
    <td className="p-3 border-2 border-black text-center">৳ {totalbill}</td>
    <td className="p-3 border-2 border-black text-center">৳ {totalRCV}</td>
    <td className="p-3 border-2 border-black text-center"></td>
   
  </tr>
</tbody>

          </table>
          
        </div>
      </div>
      
    </div>
  );
};

export default AllClients;