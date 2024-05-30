import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";

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

  return (
    <div>
      <h2 className="text-center mx-4 mt-24 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800">
        All Client Table
      </h2>
      <form className="flex justify-center items-center" onSubmit={handleSort}>
        <div className="mb-4 ml-10 mx-auto">
          <label className="block text-gray-700">Sort By Employee</label>
          <select name="email" className="border rounded p-2 mt-1">
            {ddd.map(d => <option key={d._id} value={d.email}>{d.name}</option>)}
          </select>
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
      </form>
      <div className="p-2 sm:p-4">
        <div className="overflow-x-auto">
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
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((campaign, index) => (
                <tr
                  key={campaign._id}
                  className={`${
                    index % 2 === 0
                      ? "text-black border-b border-opacity-20"
                      : "text-black border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 text-center">{campaign.date}</td>
                  <Link to={`/client/${campaign.clientEmail}`}>
                    <td className="p-3 flex justify-center text-center">{campaign.clientName}</td>
                  </Link>
                  <td className="p-3 text-center">{campaign.clientPhone}</td>
                  <td className="p-3 text-center">{campaign.tBudged}</td>
                  <td className="p-3 text-center">{campaign.tSpent}</td>
                  <td className="p-3 text-center">{campaign.tBill}</td>
                  <td className="p-3 text-center">{campaign.tPayment}</td>
                  <td className="p-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllClients;
