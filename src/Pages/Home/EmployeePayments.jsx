
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { IoIosSearch } from "react-icons/io";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import Swal from "sweetalert2";
import useUsers from "../../Hook/useUsers";
import useClients from "../../Hook/useClient";

const EmployeePayments = () => {
    const [employeePayment,refetch]=useEmployeePayment()
  const AxiosPublic = UseAxiosPublic();
  const [totalPayment, setTotalPayment] = useState(0);

  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [ddd, setDdd] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (users && user) {
      const employees = users.filter(u => u.role === 'employee');
      setDdd(employees);
    }
  }, [users, user]);

  useEffect(() => {
    if (employeePayment) {
      setFilteredClients(employeePayment);
    }
  }, [employeePayment]);

  const handleSort = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const filtered = employeePayment.filter(c => c.employeeEmail === email);
    setFilteredClients(filtered);
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;



 
 
  useEffect(() => {
          const totalBill = filteredByCategory.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
          setTotalPayment(totalBill);
      
  }, [filteredByCategory]);



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
        AxiosPublic.delete(`/employeePayment/${id}`)
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




  return (
    <div className="mt-24">
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
                  placeholder="payment method"
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




<div className="overflow-x-auto mt-6 border-2 border-black mx-4">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3 ">SL</th>
                                <th className="p-3">Payment Date</th>
                                <th className="p-3">Payment Amount</th>
                                <th className="p-3">Payment Method</th>
                                <th className="p-3"> Note</th>
                                <th className="p-3"> Action</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {filteredByCategory.map((payment, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{payment.date}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center"><span className="text-md mr-1 font-extrabold">৳</span>  {payment.payAmount}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">
                                        {payment.paymentMethod === 'bkashMarchent' && <img className="h-10 w-24 flex mx-auto my-auto items-center justify-center" src='https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'bkashPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/520Py6s/bkash-1.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'rocketPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/QkTM4M3/rocket.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'nagadPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/JQBQBcF/nagad-marchant.png' alt="" /> 
                                        }
                                        {payment.paymentMethod === 'bank' && <img className="h-12 w-13 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp' alt="" />
                                        }
                                        </td>
                                        <td className="p-3 border-r-2 border-gray-200 text-start"> {payment.note}</td>
                                        <td className="p-3 border-r-2 border-gray-200 text-start"> <button  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800" onClick={() => handledelete(payment._id)}>Delete</button></td>
                                           
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center" colSpan="2">
                                    Total Amount =
                                </td>
                                <td className="p-3 text-center"><span className="text-md mr-1 font-extrabold">৳</span>  {totalPayment}</td>
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