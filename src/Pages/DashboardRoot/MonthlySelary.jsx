import { useState, useEffect, useContext } from 'react';
import useUsers from '../../Hook/useUsers';
import { Helmet } from 'react-helmet-async';
import useMySalaryPayments from '../../Hook/useMySalaryPayment';
import useUsersSellery from '../../Hook/useUsersSellery';
import SummaryCard from '../Home/SummeryCard';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import useAllEmployee from '../../Hook/useAllEmployee';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { ImCross } from 'react-icons/im';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 6 }, (_, index) => 2024 + index); // Creates an array of years from 2020 to 2050

const MonthlySalary = () => {
  const [users] = useUsers();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const [usersSellery] = useUsersSellery('all');
  const [MySalaryPayment, refetch] = useMySalaryPayments('all');
  console.log(usersSellery);
  
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [allEmployees] = useAllEmployee([]);
  
  const initialTab2 = localStorage.getItem("activeTaballselleryMonth");
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballselleryMonth", tab);
  };


  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [employeeData, setEmployeeData] = useState([]);
const [availableYears, setAvailableYears] = useState([]);

useEffect(() => {
  const aggregatedData = usersSellery?.map((user) => {
    const monthlySpentData = (user.monthlySpent || []).filter((spent) => {
      const spentDate = new Date(spent.date);
      const monthMatch =
        sortMonth === "all" ||
        spentDate.toLocaleString("default", { month: "long" }) === sortMonth;
      return monthMatch && spentDate.getFullYear() === selectedYear;
    });

    const selleryData = MySalaryPayment.filter((sell) => {
      const sellDate = new Date(sell.date);
      const monthMatch =
        sortMonth === "all" ||
        sellDate.toLocaleString("default", { month: "long" }) === sortMonth;
      return (
        monthMatch &&
        sellDate.getFullYear() === selectedYear &&
        sell.employeeEmail === user.email
      );
    });

    const totalSpent = monthlySpentData
      ?.filter((f) => f.role === "metaSpend" || f.role === "googleSpend")
      .reduce((acc, spent) => acc + spent.totalSpentt, 0);

    const totalSellery = selleryData.reduce(
      (acc, sell) => acc + parseFloat(sell.payAmount),
      0
    );

    return {
      ...user,
      totalSpent,
      totalSellery,
    };
  });

  const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);
  setEmployeeData(sortedData);

  // Extract available years dynamically
  const uniqueYears = [
    ...new Set([
      ...usersSellery.flatMap((user) =>
        user.monthlySpent?.map((spent) => new Date(spent.date).getFullYear()) || []
      ),
      ...MySalaryPayment.map((sell) => new Date(sell.date).getFullYear()),
    ]),
  ].sort((a, b) => b - a); // Sort years in descending order

  setAvailableYears(uniqueYears);
}, [users, usersSellery, MySalaryPayment, sortMonth, selectedYear]);

const handleYearChange = (event) => {
  setSelectedYear(parseInt(event.target.value, 10));
};


  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + parseFloat(user.totalSellery), 0);

  const AxiosPublic = UseAxiosPublic()
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

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
    <div className=' text-black'>
      <div className="grid mb-5 rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">
        <SummaryCard title="Total Spend" value={totalSpent.toFixed(0)} />
        <SummaryCard title="Total Salary" value={(totalSpent * 7).toFixed(0)} />
        <SummaryCard title="Total Paid" value={totalSellery} />
        <SummaryCard title="Total Unpaid" value={(totalSpent * 7 - totalSellery).toFixed(0)} />
      </div>

      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }}>
        <div className="flex mb-4 justify-center lg:justify-between gap-5 items-center">
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
          <div className='f-end '>
            <div className='mr-3'>
              <select id="monthSelect" value={sortMonth} onChange={(e) => changeTab2(e.target.value)}
                className="select2">
                   <option value='all'>Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div>
  <select
    id="yearSelect"
    value={selectedYear}
    onChange={handleYearChange}
    className="select2"
  >
    {availableYears.length > 0 ? (
      availableYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))
    ) : (
      <option value={selectedYear}>{selectedYear}</option>
    )}
  </select>
</div>


          </div>
        </div>
        <div className="table-div" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
          <table className="min-w-full text-center">
            <thead className="">
              <tr className="tr1">
                <th className='text-center'>SL</th>
                <th>Employee Name</th>
                <th>Spent</th>
                <th>T. Salary</th>
                <th>Paid</th>
                <th>Unpaid</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody className='text-black'>
              {employeeData.map((user, index) => (
                <tr key={user?._id} className={`tr2`}>
                  <td className='text-center'>{index + 1}</td>
                  <td>
                    <div className='flex justify-start items-center gap-1'>
                      <img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span>
                    </div>
                  </td>
                  <td><span className="amount-doller">$ </span> {user.totalSpent.toFixed(2)}</td>
                  <td><span className="amount-taka">৳ </span> {(user.totalSpent * 7).toFixed(2)}</td>
                  <td><span className="amount-taka">৳ </span> {user.totalSellery}</td>
                  <td><span className="amount-taka">৳ </span> {(user.totalSpent * 7 - user.totalSellery).toFixed(2)}</td>
                  <td><span className="amount-taka">৳ </span> {(user.totalSpent * 7 - user.totalSellery).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold">
              <tr className='tr1'>
                <td className='text-right' colSpan="2">Total:</td>
                <td><span className="amount-doller">$ </span> {totalSpent.toFixed(2)}</td>
                <td><span className="amount-taka">৳ </span> {(totalSpent * 7).toFixed(2)}</td>
                <td><span className="amount-taka">৳ </span> {totalSellery}</td>
                <td><span className="amount-taka">৳ </span> {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
                <td><span className="amount-taka">৳ </span> {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalary;