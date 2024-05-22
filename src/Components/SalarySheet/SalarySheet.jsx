import { useState } from "react";
import useSalarySheet from "../../Hook/useSalarySheet";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const SalarySheet = () => {
    const [salary, refetch] = useSalarySheet();
  console.log(salary);

  const [data,setdata]=useState();
  const AxiosPublic=UseAxiosPublic();

  const handleSalary=(e)=>{
    e.preventDefault()
    const adAccountName=e.target.adAccountName.value
    const threshold=e.target.threshold.value
    const spent=e.target.spent.value
    const status=e.target.status.value
    const payment=e.target.payment.value
    const data={adAccountName,threshold,spent,status,payment}
   console.log(data)
   setdata(data)
   }

   const hadleclick=(id)=>{
    console.log(data)
    AxiosPublic.patch(`http://localhost:5000/salary/${id}`,data)
    .then(res=>{
     console.log(res.data)
     refetch()
    })
   }

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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalarySheet;
