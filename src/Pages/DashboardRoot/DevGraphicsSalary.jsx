import {  useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useUsersSellery from '../../Hook/useUsersSellery';
import useUserr from '../../Hook/useUser';
import useMySalaryPayments from '../../Hook/useMySalaryPayment';
import useUsers from '../../Hook/useUsers';
import { AuthContext } from '../../Security/AuthProvider';
import useAllEmployee from '../../Hook/useAllEmployee';
import toast from 'react-hot-toast';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import useUserr2 from '../../Hook/useUser2';
import { ImCross } from 'react-icons/im';
import SummaryCard from '../Home/SummeryCard';
import useBasicSellery from '../../Hook/useBasicSalary';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const DevGraphicSalary = () => {
  const [basicSalary,refetch]=useBasicSellery()
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [allEmployees] = useAllEmployee([]);

  const initialTab =
  userr?.role === "admin"
  ? localStorage.getItem("a9") || "all" 
  : localStorage.getItem("a9") || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("a9", tab);
  };

  const [MySalaryPayment] = useMySalaryPayments(selectedEmployee);

  const {userr2}=useUserr2(selectedEmployee)

  const AxiosPublic=UseAxiosPublic()
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  

  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeName = userr2?.name;
    const employeeEmail = userr2?.email;
    const payAmount = e.target.payAmount.value;
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
      status:'pending'
    };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.post("/salaryPayment",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        AxiosPublic.post("/activity", datas).then(() => {
        });
        console.log(res.data);
        document.getElementById("my_modal_1").close()
       
      })

  };

  const handlePayment2 = async (e) => {
    e.preventDefault();
  
    const employeeEmail = e.target.employeeEmail.value;
    const month = e.target.month.value;
    const payAmount = e.target.payAmount.value;
  
    const data = {
      employeeName: userr2?.name,
      employeeEmail,
      payAmount,
      month,
      status: "pending",
    };
  
    const activityData = {
      date: new Date(),
      user: user?.displayName,
      email: user?.email,
    };
  
    try {
      // Send data to the backend
      const response = await AxiosPublic.post("/basicSalary", data);
  
      if (response.data.message === "Record updated successfully") {
        refetch()
        toast.success("Salary updated successfully!");
      } else {
        refetch()
        toast.success("Salary added successfully!");
      }
  
      // Log activity
      await AxiosPublic.post("/activity", activityData);
  
      // Close modal after successful submission
      document.getElementById("my_modal_11").close();
      refetch();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to process the salary. Please try again.");
    }
  };
  

  return (
    <div className=''>
     
     <div className="grid rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-3 text-black sm:grid-cols-2 gap-5 justify-around">
  {/* Basic Salary */}
  <SummaryCard 
    title="Basic Salary" 
    value={months.reduce(
      (total, month) =>
        total +
        (Number(
          basicSalary?.find(
            (data) =>
              data.employeeEmail === selectedEmployee &&
              data.month === month
          )?.payAmount
        ) || 0),
      0
    )} 
  />


  {/* Total Unpaid */}
  <SummaryCard 
    title="Total Unpaid" 
    value={
      months.reduce(
        (total, month) =>
          total +
          (Number(
            basicSalary?.find(
              (data) =>
                data.employeeEmail === selectedEmployee &&
                data.month === month
            )?.payAmount
          ) || 0),
        0
      ) -
      MySalaryPayment.reduce(
        (total, payment) => total + (parseFloat(payment.payAmount) || 0),
        0
      )
    } 
  />

  {/* Total Paid */}
  <SummaryCard 
    title="Total Paid" 
    value={months.reduce((total, month) => {
      const salaryPayments = MySalaryPayment.filter(
        (sell) =>
          new Date(sell.date).toLocaleString("default", { month: "long" }) ===
          month
      );
      return (
        total +
        salaryPayments.reduce(
          (subTotal, payment) => subTotal + (parseFloat(payment.payAmount) || 0),
          0
        )
      );
    }, 0)} 
  />


</div>


      <div className='side-space mt-5'>
   



<div className='f-start mb-4'>
    {
        userr?.role === 'admin'  && <div className="f-start">
        <button
          className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Pay Admin
        </button>
        <button
          className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
          onClick={() => document.getElementById("my_modal_11").showModal()}
        >
          Basic Salary
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-white text-black font-bold">
            <form onSubmit={(e) => handlePayment(e)}>
    
              <div className="grid lg:grid-cols-2">
    
              </div>
              <div className="">
                <h1
                  className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
                  onClick={() => document.getElementById("my_modal_1").close()}
                >
                  <ImCross />
                </h1>
    
                
    <div className='grid lg:grid-cols-2 gap-3'>
    <div className="mb-4">
                <label className="block text-gray-250">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={formattedDate}
                  className="input2"
                />
              </div>
    
              <div className="mb-5">
             <label className="block text-black">Select Developer/Desiner</label>
             <select
              
               className="select2 w-full"
               name="employeeEmail"
             >
               {allEmployees?.filter(f=> f.role === 'webDeveloper' || f.role === 'graphicDesigner').map((employee) => (
                 <option key={employee._id} value={employee.email}>
                   {employee.name}
                 </option>
               ))}
             </select>
           </div>
    </div>
    
                  <div className="grid lg:grid-cols-2 gap-3">
                  <div className="mb-4 ">
                <label className="block text-gray-250">Amount</label>
                <input
                  required
                  type="number"
                  name="payAmount"
                  placeholder="0"
                  className="input2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-250">Charge</label>
                <input
                  required
                  type="number"
                  name="charge"
                  placeholder="0"
                  defaultValue={0}
                  className="input2"
                />
              </div>
                  </div>
    
                 
                
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
    
    
    
    
    
              <div className="mb-4">
                <label className="block text-gray-250">Note (Optional)</label>
                <input
                  type="text"
                  name="note"
                  placeholder="type note..."
                  className="w-full border bg-white border-black rounded p-2 mt-1"
                />
              </div>
              <div className="grid mt-8 lg:grid-cols-2 gap-3">
                <form method="dialog">
                  <button className="p-2 w-full hover:bg-red-700 rounded-lg bg-red-600 text-white text-center">
                    Close
                  </button>
                </form>
                <button
                  type="submit"
                  className="font-avenir w-full hover:bg-indigo-700 px-3 pt-2 rounded-lg flex justify-center text-white bg-[#05a0db]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <dialog id="my_modal_11" className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <form onSubmit={handlePayment2}>
      <div className="grid lg:grid-cols-2"></div>

      <div className="">
        {/* Close Button */}
        <h1
          className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
          onClick={() => document.getElementById("my_modal_11").close()}
        >
          <ImCross />
        </h1>

        <div>
          {/* Select Employee */}
          <div className="mb-5">
            <label className="block text-black">Select Employee</label>
            <select
              className="select2 w-full"
              name="employeeEmail"
              required
            >
              {allEmployees
                ?.filter(
                  (employee) =>
                    employee.role === "webDeveloper" ||
                    employee.role === "graphicDesigner"
                )
                .map((employee) => (
                  <option key={employee._id} value={employee.email}>
                    {employee.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Select Month */}
          <div className="mb-5">
            <label className="block text-black">Select Month</label>
            <select className="select2 w-full" name="month" required>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-gray-250">Amount</label>
            <input
              required
              type="number"
              name="payAmount"
              placeholder="0"
              className="input2"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid mt-8 lg:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_11").close()}
          className="p-2 w-full hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
        >
          Close
        </button>
        <button
          type="submit"
          className="font-avenir w-full hover:bg-indigo-700 px-3 pt-2 rounded-lg flex justify-center text-white bg-[#05a0db]"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</dialog>

      </div>
    }

  

    <div className='f-end'>
  {
    userr?.role === 'admin' &&   <select
    className="select2"
    value={selectedEmployee}
    onChange={(e) => changeTab(e.target.value)}
>


    {allEmployees
        .filter((u) => ['webDeveloper', 'graphicDesigner'].includes(u.role))
        .map((employee) => (
            <option key={employee._id} value={employee.email}>
                {employee.name}
            </option>
        ))}
      </select>
  }
    </div>
    
</div>

<div className="table-div">
<table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
      <th>Month</th>
      <th>B. Salary</th>
      <th>Unpaid</th>
      <th>Paid</th>
    </tr>
  </thead>
  <tbody>
    {months.map((month) => {
      // Find the basic salary data for the selected employee and month
      const monthData = basicSalary?.find(
        (data) => data.employeeEmail === selectedEmployee && data.month === month
      );

      // Filter salary payments for the selected month
      const salaryPayments = MySalaryPayment.filter(
        (sell) =>
          new Date(sell.date).toLocaleString("default", { month: "long" }) ===
          month
      );

      // Calculate the total salary paid for the month
      const totalSalaryPaid = salaryPayments.reduce(
        (total, payment) => total + (parseFloat(payment.payAmount) || 0),
        0
      );

      // Calculate the unpaid salary as basic salary - total paid
      const unpaidSalary = (monthData?.payAmount || 0) - totalSalaryPaid;

      return (
        <tr key={month} className="tr2">
          <td>{month}</td>
          {/* Basic Salary or Default */}
          <td>৳ {monthData?.payAmount || 0}</td>
          {/* Unpaid Salary */}
          <td>৳ {unpaidSalary > 0 ? unpaidSalary : 0}</td>
          {/* Total Salary Paid */}
          <td>৳ {totalSalaryPaid}</td>
        </tr>
      );
    })}
  </tbody>

<tfoot className="font-bold">
  <tr className="tr1">
    {/* Label for totals */}
    <td className="text-right" colSpan="1">Total</td>

    {/* Total Basic Salary */}
    <td>
      ৳{" "}
      {months.reduce(
        (total, month) =>
          total +
          (Number(
            basicSalary?.find(
              (data) =>
                data.employeeEmail === selectedEmployee &&
                data.month === month
            )?.payAmount
          ) || 0),
        0
      ).toFixed(0)}
    </td>

    {/* Total Unpaid Salary */}
    <td>
      ৳{" "}
      {months.reduce(
        (total, month) =>
          total +
          (Number(
            basicSalary?.find(
              (data) =>
                data.employeeEmail === selectedEmployee &&
                data.month === month
            )?.payAmount
          ) || 0),
        0
      ).toFixed(2) - months.reduce((total, month) => {
        const salaryPayments = MySalaryPayment.filter(
          (sell) =>
            new Date(sell.date).toLocaleString("default", { month: "long" }) ===
            month
        );
        return (
          total +
          salaryPayments.reduce(
            (subTotal, payment) => subTotal + (parseFloat(payment.payAmount) || 0),
            0
          )
        );
      }, 0).toFixed(2)}
    </td>

    {/* Total Paid Salary */}
    <td>
      ৳{" "}
      {months.reduce((total, month) => {
        const salaryPayments = MySalaryPayment.filter(
          (sell) =>
            new Date(sell.date).toLocaleString("default", { month: "long" }) ===
            month
        );
        return (
          total +
          salaryPayments.reduce(
            (subTotal, payment) => subTotal + (parseFloat(payment.payAmount) || 0),
            0
          )
        );
      }, 0).toFixed(0)}
    </td>
  </tr>
</tfoot>

</table>

</div>

      </div>
    </div>
  );
};

export default DevGraphicSalary;






