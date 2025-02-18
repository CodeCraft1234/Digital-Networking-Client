import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ImCross } from 'react-icons/im';
import toast from 'react-hot-toast';
import useUsersSellery from '../../Hook/useUsersSellery';
import useUserr from '../../Hook/useUser';
import useMySalaryPayments from '../../Hook/useMySalaryPayment';
import useAllEmployee from '../../Hook/useAllEmployee';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUserr2 from '../../Hook/useUser2';
import SummaryCard from '../Home/SummeryCard';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MarketerSalary = () => {
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [allEmployees] = useAllEmployee([]);
  const [employeeData, setEmployeeData] = useState([]);

  // Initialize selected employee from localStorage or default
  const initialTab = userr?.role === "admin"
    ? localStorage.getItem(`acti355${user?.email}`) || "all"
    : localStorage.getItem(`acti355${user?.email}`) || user?.email;

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  // Fetch data based on selected employee
  const [usersSellery] = useUsersSellery(selectedEmployee);
  const [MySalaryPayment, refetch] = useMySalaryPayments(selectedEmployee);
  const { userr2 } = useUserr2(selectedEmployee);

  const AxiosPublic = UseAxiosPublic();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  // Handle tab change for employee selection
  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem(`acti355${user?.email}`, tab);
  };

  // Process monthly data for employee
  useEffect(() => {
    if (!usersSellery || !MySalaryPayment || !Array.isArray(months)) return;

    const processMonthlyData = () => {
      const allMonthlySpent = Array.isArray(usersSellery)
        ? usersSellery.flatMap((user) => user.monthlySpent || [])
        : usersSellery?.monthlySpent || [];

      return months.map((month) => {
        const monthlySpentData = allMonthlySpent.filter(
          (spent) => new Date(spent.date).toLocaleString("default", { month: "long" }) === month
        );

        // Deduplicate by accountName and take the most recent entry
        const uniqueMonthlySpent = monthlySpentData.reduce((acc, current) => {
          const existingIndex = acc.findIndex((item) => item.accountName === current.accountName);
          if (existingIndex !== -1) {
            if (new Date(current.date) > new Date(acc[existingIndex].date)) {
              acc[existingIndex] = current;
            }
          } else {
            acc.push(current);
          }
          return acc;
        }, []);

        const totalSpent = uniqueMonthlySpent
          ?.filter((f) => f.role === 'metaSpend' || f.role === 'googleSpend')
          .reduce((acc, spent) => acc + spent.totalSpentt, 0);

        const selleryData = MySalaryPayment.filter(
          (sell) => new Date(sell.date).toLocaleString("default", { month: "long" }) === month
        );

        const totalSellery = selleryData.reduce((acc, sell) => acc + parseFloat(sell.payAmount) || 0, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + parseFloat(sell.bonus) || 0, 0);

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          selleryData,
        };
      }).filter(data => !isNaN(data.totalSpent)); // Filter out months with NaN data
    };

    setEmployeeData(processMonthlyData());
  }, [usersSellery, MySalaryPayment, months]);

  // Handle salary payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeName = userr2?.name;
    const employeeEmail = userr2?.email;
    const payAmount = e.target.payAmount.value;
    const charge = e.target.charge.value;
    const paymentMethod = e.target.paymentMethod.value;
    const note = e.target.note.value;
    const date = e.target.date.value;

    const data = {
      employeeName,
      employeeEmail,
      payAmount,
      note,
      paymentMethod,
      date,
    };

    const activityData = {
      title: `Added ${payAmount} via ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email: user?.email,
    };

    try {
      await AxiosPublic.post("/salaryPayment", data);
      toast.success("Payment successful!");
      refetch();
      await AxiosPublic.post("/activity", activityData);
      document.getElementById("my_modal_1").close();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error(error);
    }
  };

  // Format numeric values
  const formatValue = (value, decimals = 2) =>
    new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);


  console.log(allEmployees);
  return (
    <div>
      <Helmet>
        <title>Marketer Salary | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      {/* Summary Cards */}
      <div className="grid rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">
        <SummaryCard title="Total Spend" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0))} />
        <SummaryCard title="Total Salary" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0))} />
        <SummaryCard title="Total Paid" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0))} />
        <SummaryCard title="Total Unpaid" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0))} />
      </div>

      {/* Salary Payment Modal */}
      <div className="side-space mt-5">
        <div className="f-between mb-4">
          <div className="f-start">
            <button
              className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Pay Salary
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box bg-white text-black font-bold">
                <form onSubmit={handlePayment}>
                  <div className="flex justify-end">
                    <ImCross
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => document.getElementById("my_modal_1").close()}
                    />
                  </div>
                  <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        required
                        defaultValue={formattedDate}
                        className="input2"
                      />
                    </div>
                    {userr?.role === "admin" && (
                      <div>
                        <label className="block text-black">Select Employee</label>
                        <select name="employeeEmail" className="select2 w-full">
                          {allEmployees
                            ?.filter((f) => f.role === 'employee' && f.email === selectedEmployee)
                            .map((employee) => (
                              <option key={employee._id} value={employee.email}>
                                {employee.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    <label>Amount</label>
                    <input
                      type="number"
                      name="payAmount"
                      required
                      placeholder="0"
                      className="input2"
                    />
                  </div>
                  <div className="mb-4">
                    <div className="mt-2 grid lg:grid-cols-3">
                      {[
                        { value: "bank", label: "Brack Bank" },
                        { value: "DBBLBank", label: "DBBL Bank" },
                        { value: "IBBLBank", label: "Islami Bank" },
                        { value: "bkashPersonal", label: "bKash" },
                        { value: "nagadPersonal", label: "Nagad" },
                      ].map(({ value, label }) => (
                        <div className="form-control" key={value}>
                          <label className="label flex justify-start items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={value}
                              className="radio radio-primary"
                            />
                            <span className="label-text text-black">{label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label>Note (Optional)</label>
                    <input
                      type="text"
                      name="note"
                      placeholder="Type note..."
                      className="input2"
                    />
                  </div>
                  <div className="grid lg:grid-cols-2 gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => document.getElementById("my_modal_1").close()}
                      className="close"
                    >
                      Close
                    </button>
                    <button type="submit" className="add">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
          <div className="f-end">
          {userr?.role === "admin" ? (
      <select
        
        className="select2"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="all">Select Digital Marketer</option>
        {allEmployees
          .filter((u) => u.role === "employee")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
              ) : (
             <></>
               )}
          </div>
        </div>

        {/* Employee Data Table */}
        <div className="table-div">
          <table className="min-w-full text-center">
            <thead>
              <tr className="tr1">
                <th>Month</th>
                <th>Spend</th>
                <th>T.Salary</th>
                <th>Unpaid</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((data, index) => (
                <tr key={index} className="tr2">
                  <td>{data.month}</td>
                  <td>$ {formatValue(data.totalSpent)}</td>
                  <td>৳ {formatValue(data.totalSpent * 7)}</td>
                  <td>৳ {formatValue(data.totalSelleryPaid)}</td>
                  <td>৳ {formatValue(data.totalSellery)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold">
              <tr className="tr1">
                <td className="text-right" colSpan="1">Total</td>
                <td>$ {formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent, 0))}</td>
                <td>৳ {formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0))}</td>
                <td>৳ {formatValue(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0))}</td>
                <td>৳ {formatValue(employeeData.reduce((acc, data) => acc + data.totalSellery, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketerSalary;