import { Link, useParams } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import { MdDelete } from "react-icons/md";

const  EmployeeClients = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [clients, refetch] = useClients();
  const {email}=useParams()
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [users, user]);

  useEffect(() => {
    const filtered = clients.filter((c) => c.employeeEmail === email);
    setFilteredClients(filtered);
  }, [clients,email]);



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

  const AxiosPublic = UseAxiosPublic();
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
        AxiosPublic.delete(`/clients/${id}`).then((res) => {
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

  return (
    <div className="mt-5">
      <Helmet>
        <title>All Clients | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>


      <div className="p-5 ">
        <div className="overflow-x-auto rounded-lg border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3 text-center">SL</th>
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
              {filteredClients.map((campaign, index) => (
                <tr
                  key={campaign._id}
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
                    <Link
                      to={`/dashboard/client/${campaign.clientEmail}`}
                      className="flex justify-center"
                    >
                      {campaign.clientName}
                    </Link>
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    {campaign.clientPhone}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    $ {parseFloat(campaign.tBudged).toFixed(2)}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    $ {parseFloat(campaign.tSpent).toFixed(2)}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    ৳ {parseFloat(campaign.tBill).toFixed(2)}
                  </td>
                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    ৳ {parseFloat(campaign.tPayment).toFixed(2)}
                  </td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <button
                      className="text-center text-black text-3xl"
                      onClick={() => handledelete(campaign._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-[#05a0db] text-sm text-white font-bold">
                <td className="p-3 border-black text-right" colSpan="3">
                  Total :
                </td>
                <td className="p-3 border-black text-center">
                  $ {totalBudged.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center">
                  $ {totalSpent.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center">
                  ৳ {totalbill.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center">
                  ৳ {totalRCV.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeClients;
