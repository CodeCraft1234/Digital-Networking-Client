import { useContext, useEffect, useState } from 'react';
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

  const initialTab = userr?.role === "admin"
    ? localStorage.getItem(`acti355${user?.email}`) || "all"
    : localStorage.getItem(`acti355${user?.email}`) || user?.email;

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const [usersSellery] = useUsersSellery(selectedEmployee);
  const [MySalaryPayment, refetch] = useMySalaryPayments(selectedEmployee);
  const { userr2 } = useUserr2(selectedEmployee);

  const AxiosPublic = UseAxiosPublic();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem(`acti355${user?.email}`, tab);
  };

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
  
        const totalSpent =
          uniqueMonthlySpent
            ?.filter((f) => f.role === "metaSpend" || f.role === "googleSpend")
            .reduce((acc, spent) => acc + spent.totalSpentt, 0) || 0;
  
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
      }).filter((data) => !isNaN(data.totalSpent)); // Filter out months with NaN data
    };
  
    setEmployeeData(processMonthlyData());
  }, [usersSellery, MySalaryPayment, months]);
  
  // Updated formatValue function to ensure whole numbers
  const formatValue = (value) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));
  

  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees?.find(e => e.email === employeeEmail)?.name || user?.displayName;
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



  return (
    <div>
      <Helmet>
        <title>Marketer Salary | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      {/* Summary Cards */}
      <div className="grid rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around">
  <SummaryCard 
    title="Total Spend" 
    value={formatValue(Number(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)))} 
  />
  <SummaryCard 
    title="Total Salary" 
    value={formatValue(Number(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0)))} 
  />
  <SummaryCard 
    title="Total Paid" 
    value={formatValue(Number(employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0)))} 
  />
  <SummaryCard 
    title="Total Unpaid" 
    value={formatValue(Number(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0)))} 
  />
</div>


      {/* Salary Payment Modal */}
      <div className="side-space mt-5">
        <div className="f-between mb-4">
        <div>
{
        userr?.role === 'admin' &&      <div className="f-start">

        <button
          className="add"
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
                <div >
                  <label className="block text-black" >Select Employee</label>
                  <select name="employeeEmail" className="select2 w-full">
                    {allEmployees?.filter(f=>f.role === 'employee')
                      .map((employee) => (
                        <option key={employee._id} value={employee.email}>
                          {employee.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
    
    </div>
    
    
             
              <div className='mt-3'>
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
                <button
                  type="submit"
                  className="add"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </dialog>
         </div>
      }
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
          <td><span className="amount-doller">$ </span> {formatValue(data.totalSpent.toFixed(0))}</td>
          <td><span className="amount-taka">৳ </span> {formatValue((data.totalSpent * 7).toFixed(0))}</td>
          <td><span className="amount-taka">৳ </span> {formatValue(data.totalSelleryPaid.toFixed(0))}</td>
          <td><span className="amount-taka">৳ </span> {formatValue(data.totalSellery.toFixed(0))}</td>
        </tr>
      ))}
    </tbody>
    <tfoot className="font-bold">
      <tr className="tr1">
        <td className="text-right" colSpan="1">Total</td>
        <td><span className="amount-doller">$ </span> {formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0))}</td>
        <td><span className="amount-taka">৳ </span> {formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0))}</td>
        <td><span className="amount-taka">৳ </span> {formatValue(employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0))}</td>
        <td><span className="amount-taka">৳ </span> {formatValue(employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0))}</td>
      </tr>
    </tfoot>
  </table>
</div>

      </div>
    </div>
  );
};

export default MarketerSalary;