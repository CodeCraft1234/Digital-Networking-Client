import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import Swal from "sweetalert2";
import useUsers from "../../Hook/useUsers";

const EmployeePayments = () => {
  const [employeePayment, refetch] = useEmployeePayment();
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);

  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortDay, setSortDay] = useState("");
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [users, user]);

  useEffect(() => {
    if (employeePayment) {
      setFilteredClients(employeePayment);
    }
  }, [employeePayment]);

  useEffect(() => {
    let filtered = employeePayment;

    if (selectedEmployee) {
      filtered = filtered.filter((c) => c.employeeEmail === selectedEmployee);
    }

    if (sortDay !== "") {
      filtered = filtered.filter((c) => {
        const day = new Date(c.date).getDate();
        return day === parseInt(sortDay);
      });
    }

    if (sortMonth !== "") {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((c) => {
        const paymentDate = new Date(c.date);
        const selected = new Date(selectedDate);
        return (
          paymentDate.getDate() === selected.getDate() &&
          paymentDate.getMonth() === selected.getMonth() &&
          paymentDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    setFilteredClients(filtered);
  }, [selectedEmployee, sortDay, sortMonth, selectedDate, employeePayment]);

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  useEffect(() => {
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredByCategory]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/employeePayment/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your payment has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    if (activeDropdown === orderId) {
        setActiveDropdown(null);
    } else {
        setActiveDropdown(orderId);
    }
};
  return (
    <div className="mt-5">
      <Helmet>
        <title>Digital Network | Employee Payments</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <div className="flex text-black justify-between gap-4 items-center">
        <div className="flex justify-center items-center mb-4 ml-10 mx-auto">
          <label className="block  mr-2">By Employee</label>
          <select
            className="border  bg-blue-200 text-black border-gray-400 rounded p-2 mt-1 mr-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.email}>
                {employee.name}
              </option>
            ))}
          </select>
          <label className="block  mr-2">By Date (1-31)</label>
          <select
            className="border  bg-blue-200 text-black border-gray-400 rounded p-2 mt-1 mr-2"
            value={sortDay}
            onChange={(e) => setSortDay(e.target.value)}
          >
            <option value="">Select Day</option>
            {[...Array(31).keys()].map((day) => (
              <option key={day + 1} value={day + 1}>
                {day + 1}
              </option>
            ))}
          </select>
          <label className="block  mr-2">By Month</label>
          <select
            className="border  bg-blue-200 text-black border-gray-400 rounded p-2 mt-1"
            value={sortMonth}
            onChange={(e) => setSortMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <label className="block  ml-2">By Date</label>
          <input
            type="date"
            className="border rounded bg-blue-200 text-black border-gray-400 p-2 mt-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Payment Method"
            className="rounded-l-lg w-20 placeholder-black border-2 border-black p-2 font-bold text-black sm:w-2/3 text-sm bg-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="w-10 p-2 font-semibold rounded-r-lg sm:w-1/3 bg-[#FF9F0D] dark:bg-[#FF9F0D] text-white"
          >
            <IoIosSearch className="mx-auto font-bold w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6 border-2 border-black mx-4">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">SL</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Note</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredByCategory.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  <span className="text-md mr-1 font-extrabold">৳</span>
                  {payment.payAmount}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.paymentMethod === "bkashMarchent" && (
                    <img
                      className="h-10 w-24 flex mx-auto my-auto items-center justify-center"
                      src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "bkashPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/520Py6s/bkash-1.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "rocketPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/QkTM4M3/rocket.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "nagadPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/JQBQBcF/nagad-marchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp"
                      alt=""
                    />
                  )}
                </td>
                <td className="p-3 border-r-2 border-gray-200 text-start">
                  {payment.note}
                </td>
                <td className="px-4 text-center border-gray-500 py-2 relative">
                                        <button
                                            onClick={() => toggleDropdown(payment._id)}
                                            className=" focus:outline-none"
                                        >
                                            &#8226;&#8226;&#8226;
                                        </button>
                                        {activeDropdown === payment._id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md  z-10">
                                             
                                                <button
                                                    onClick={() => {  handleDelete(payment._id); toggleDropdown(payment._id); }}
                                                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
              <td className="p-3 text-center" colSpan="2">
                Total Amount =
              </td>
              <td className="p-3 text-center">
                <span className="text-md mr-1 font-extrabold">৳</span>
                {totalPayment}
              </td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePayments;
