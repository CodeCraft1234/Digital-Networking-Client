import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import useSalarySheet from "../../Hook/useSalarySheet";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const SalarySheet = () => {
  const [salary, refetch] = useSalarySheet();
  console.log(salary);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AxiosPublic = UseAxiosPublic();

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedEmployee = {
      ...selectedEmployee,
      name: e.target.name.value,
      totalWork: e.target.totalWork.value,
      dollarRet: e.target.dollarRet.value,
      totalSalary: e.target.totalSalary.value,
      paid: e.target.paid.value,
      unpaid: e.target.unpaid.value,
      bonus: e.target.bonus.value,
      status: e.target.status.value,
      // photo: e.target.photo.value,
    };

    AxiosPublic.patch(
      `http://localhost:5000/salary/${selectedEmployee.id}`,
      updatedEmployee
    ).then((res) => {
      console.log(res.data);
      refetch();
      handleCancel();
    });
  };

  const totals = {
    totalWork: 6000,
    dollarRet: 42,
    totalSalary: 18000,
    paid: 18000,
    unpaid: 0,
    bonus: 6000,
  };

  return (
    <div className="mt-24 p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        Employee Monthly Salary Sheet
      </h6>
      <p className="mt-6 text-center text-white p-1 font-bold text-2xl md:text-3xl bg-green-800">
        January
      </p>
      <div className="overflow-x-auto mt-0">
        <table className="min-w-full text-xs md:text-sm lg:text-base bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Total Work</th>
              <th className="p-3">Dollar Ret</th>
              <th className="p-3">Total Salary</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {salary.map((employee, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 flex items-center space-x-3">
                  <img
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    src={employee.photo}
                    alt=""
                  />
                  <span>{employee.name}</span>
                </td>
                <td className="p-3 text-center">${employee.totalWork}</td>
                <td className="p-3 text-center">৳ {employee.dollarRet}</td>
                <td className="p-3 text-center">৳ {employee.totalSalary}</td>
                <td className="p-3 text-center">৳ {employee.paid}</td>
                <td className="p-3 text-center">৳ {employee.unpaid}</td>
                <td className="p-3 text-center">৳ {employee.bonus}</td>
                <td
                  className={`p-3 text-center ${
                    employee.status === "Paid"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {employee.status}
                </td>
                <td className="p-3 text-center">
                  <FaEdit
                    onClick={() => handleEditClick(employee)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white">
              <td className="p-3 text-center font-bold">Total BDT</td>
              <td className="p-3 text-center font-bold">${totals.totalWork}</td>
              <td className="p-3 text-center font-bold">
                ৳ {totals.dollarRet}
              </td>
              <td className="p-3 text-center font-bold">
                ৳ {totals.totalSalary}
              </td>
              <td className="p-3 text-center font-bold">৳ {totals.paid}</td>
              <td className="p-3 text-center font-bold">৳ {totals.unpaid}</td>
              <td className="p-3 text-center font-bold">৳ {totals.bonus}</td>
              <td className="p-3 text-center font-bold"></td>
              <td className="p-3 text-center font-bold"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Edit Employee Salary
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Employee Name</label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.name}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Work</label>
                  <input
                    type="number"
                    name="totalWork"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.totalWork}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Dollar Ret</label>
                  <input
                    type="number"
                    name="dollarRet"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.dollarRet}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Salary</label>
                  <input
                    type="number"
                    name="totalSalary"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.totalSalary}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Paid</label>
                  <input
                    type="number"
                    name="paid"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.paid}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Unpaid</label>
                  <input
                    type="number"
                    name="unpaid"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.unpaid}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Bonus</label>
                  <input
                    type="number"
                    name="bonus"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.bonus}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Status</label>
                  <input
                    type="text"
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.status}
                  />
                </div>
                {/* <div className="md:col-span-2">
                  <label className="block text-gray-700">Photo URL</label>
                  <input
                    type="text"
                    name="photo"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedEmployee.photo}
                  />
                </div> */}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySheet;
