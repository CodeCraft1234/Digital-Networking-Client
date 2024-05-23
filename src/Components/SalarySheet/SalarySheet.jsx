import { useState } from "react";
import useSalarySheet from "../../Hook/useSalarySheet";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const SalarySheet = () => {
  const [salary, refetch] = useSalarySheet();
  const [data, setData] = useState();
  const AxiosPublic = UseAxiosPublic();

  const handleSalary = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const totalWork = e.target.threshold.value;
    const dollarRet = e.target.dollarRet.value;
    const totalSalary = e.target.totalSalary.value;
    const paid = e.target.paid.value;
    const unpaid = e.target.unpaid.value;
    const bonus = e.target.bonus.value;
    const status = e.target.status.value;
    const photo = e.target.photo.value;
    const data = {
      name,
      totalWork,
      dollarRet,
      totalSalary,
      paid,
      unpaid,
      bonus,
      status,
      photo,
    };
    setData(data);
  };


  const totals = {
    totalWork: 6000,
    dollarRet: 42,
    totalSalary: 18000,
    paid: 18000,
    unpaid: 0,
    bonus: 6000,
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log(id);
  
    // Parse the input values to floats
    const totalWork = parseFloat(e.target.totalWork.value);
    const paid = parseFloat(e.target.paid.value);
    const saleryRate = parseFloat(e.target.saleryRate.value);
    const bonus = parseFloat(e.target.bonus.value);
  
    const data = { totalWork, paid, saleryRate, bonus };
    console.log(data);
  
    // Make the patch request
    AxiosPublic.patch(`/salary/${id}`, data)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error('Error updating salary:', error);
      });
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
              <th className="p-3">Basic Salary</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Total Salary</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Status</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {salary.map((employee, index) => (
              <tr
                key={employee._id}
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
                <td className="p-3 text-center">{employee.totalWork}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100}
                </td>
                <td className="p-3 text-center">৳ {employee.bonus}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100 + employee.bonus}
                </td>
                <td className="p-3 text-center">৳ {employee.paid}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid}
                </td>
                <td
                  className={`p-3 text-center ${
                    (employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid  <= 0 ? 'text-blue-500'   : "text-red-500"
                  }`}
                >
                  {(employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid  <= 0 ? (
                    <p>Paid</p>
                  ) : (
                    <p>UnPaid</p>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="font-avenir px-3 py-1 bg-neutral rounded text-white"
                    onClick={() =>
                      document.getElementById(`my_modal_${index}`).showModal()
                    }
                  >
                    Edit
                  </button>
                  <dialog id={`my_modal_${index}`} className="modal">
                    <div className="flex justify-start items-center text-black bg-indigo-300 p-5 gap-3">
                      <form onSubmit={(e) => handleUpdate(e, employee._id)} className="text-start">
                        <div className="flex ml-5 justify-start items-center">
                          <div className="mb-4">
                            <label className="block text-black font-bold">
                              Total Work
                            </label>
                            <input
                              type="number"
                              name="totalWork"
                              className="w-full border rounded p-2 mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-5 justify-start items-center text-black bg-indigo-300 p-5">
                          <div className="flex justify-start items-center">
                            <div className="mb-4">
                              <label className="block text-black font-bold">
                                Salary Rate
                              </label>
                              <input
                                type="number"
                                name="saleryRate"
                                defaultValue={5.4}
                                className="w-full border rounded p-2 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start items-center text-black bg-indigo-300 p-5 gap-3">
                          <div className="flex justify-start items-center">
                            <div className="mb-4">
                              <label className="block text-black font-bold">
                                Paid
                              </label>
                              <input
                                type="number"
                                name="paid"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start items-center text-black bg-indigo-300 p-5 gap-3">
                          <div className="flex justify-start items-center">
                            <div className="mb-4">
                              <label className="block text-black font-bold">
                                Bonus
                              </label>
                              <input
                                type="number"
                                name="bonus"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-500 mx-auto flex justify-center text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-blue-600"
                        >
                          Update
                        </button>
                      </form>
                    </div>

                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-secondary bg-blue-500 text-white font-bold">
                        Close
                      </button>
                    </form>
                  </dialog>
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white">
              <td className="p-3 text-center font-bold">Total BDT</td>
              <td className="p-3 text-center font-bold">${totals.totalWork}</td>
              <td className="p-3 text-center font-bold">৳ {totals.dollarRet}</td>
              <td className="p-3 text-center font-bold">৳ {totals.totalSalary}</td>
              <td className="p-3 text-center font-bold">৳ {totals.paid}</td>
              <td className="p-3 text-center font-bold">৳ {totals.unpaid}</td>
              <td className="p-3 text-center font-bold">৳ {totals.bonus}</td>
              <td className="p-3 text-center font-bold"></td>
              <td className="p-3 text-center font-bold"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalarySheet;
