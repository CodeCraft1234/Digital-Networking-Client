import { useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useOwnSelary from "../../Hook/useOwnSelary";

const EmployeerMouthlySelery = ({ email }) => {
  const [ownSelary] = useOwnSelary();
  const [filteredSelary, setFilteredSelary] = useState([]);
  console.log(filteredSelary);
  console.log(ownSelary);

  useEffect(() => {
    if (ownSelary.length > 0) {
      const filtered = ownSelary.filter(salary => salary.email === email);
      setFilteredSelary(filtered);
    }
  }, [ownSelary, email]);

  return (
    <div className="mt-5 p-4">
      <h6 className="text-center mb-5 font-bold text-3xl md:text-5xl text-green-800">
        Employees Own Monthly Salary Sheet
      </h6>
      <div className="overflow-x-auto mt-0">
        <table className="min-w-full text-xs md:text-sm lg:text-base bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Total Work</th>
              <th className="p-3">Basic Salary</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Total Salary</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSelary.map((employee, index) => (
              <tr
                key={employee._id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 flex items-center space-x-3">
                  <span>{employee.mounth}</span>
                </td>
                <td className="p-3 text-center">{employee.totalWork}</td>
                <td className="p-3 text-center">
                  ৳ {((employee.totalWork * 5.4) / 100).toFixed(2)}
                </td>
                <td className="p-3 text-center">৳ {employee.bonus}</td>
                <td className="p-3 text-center">
                  ৳ {(((employee.totalWork * 5.4) / 100) + employee.bonus).toFixed(2)}
                </td>
                <td className="p-3 text-center">৳ {employee.paid}</td>
                <td className="p-3 text-center">
                  ৳ {(((employee.totalWork * 5.4) / 100) + employee.bonus - employee.paid).toFixed(2)}
                </td>
                <td
                  className={`p-3 text-center ${
                    ((employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid <= 0) ? 'text-blue-500' : "text-red-500"
                  }`}
                >
                  {((employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid <= 0) ? (
                    <p>Paid</p>
                  ) : (
                    <p>Unpaid</p>
                  )}
                </td>
                <td className="p-3 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeerMouthlySelery;
