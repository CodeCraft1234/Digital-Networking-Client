import  { useState, useEffect, useContext } from 'react';
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
  const [employeeData, setEmployeeData] = useState([]);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [usersSellery] = useUsersSellery('all');
  const [MySalaryPayment,refetch] = useMySalaryPayments('all');

  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [allEmployees] = useAllEmployee([]);

  const initialTab2 = localStorage.getItem("activeTaballselleryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballselleryMonth", tab); 
  };

  useEffect(() => {

    const aggregatedData = usersSellery?.map(user => {
        
      const monthlySpentData = (user.monthlySpent || []).filter(spent => {
        const spentDate = new Date(spent.date);
        return spentDate.toLocaleString('default', { month: 'long' }) === sortMonth && spentDate.getFullYear() === selectedYear;
      });

      const selleryData = MySalaryPayment.filter(sell => sell.month === sortMonth);
      const adminPayData = MySalaryPayment.filter(pay => {
        const payDate = new Date(pay.date);
        return payDate.toLocaleString('default', { month: 'long' }) === sortMonth && payDate.getFullYear() === selectedYear;
      });

      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);
  

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);

    setEmployeeData(sortedData);

  }, [users,usersSellery,MySalaryPayment,  sortMonth, selectedYear]);



  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);


  const AxiosPublic=UseAxiosPublic()
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  

  const handlePayment = async (e) => {
    e.preventDefault();
    const employeeName = userr?.name;
    const employeeEmail = userr?.email;
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
      charge,
      paymentMethod,
      date,
      status:'pending'
    };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: userr?.displayName,
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
     

      <div  className="grid mb-5  rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">

<SummaryCard title="Total Spent" value={totalSpent.toFixed(0)} />
<SummaryCard title="Total Salery" value={(totalSpent * 7).toFixed(0)} />
<SummaryCard title="Total Paid" value={totalSellery.toFixed(0)} />
<SummaryCard title="Total Unpaid" value={(totalSpent * 7 - totalSellery).toFixed(0)} />
</div>


      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className=" flex mb-4 justify-center lg:justify-between gap-5 items-center">
      <div className="f-start">
          <button
            className="font-avenir  px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Pay Admin
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
      
          
      
      <div>
            {userr?.role === "admin" && (
              <div className="mb-4">
                <label className="block text-black">Select Digital Marketer</label>
                <select className="select2 w-full" name="employeeEmail">
                  {allEmployees
                    ?.filter((f) => f.role === "employee")
                    .map(({ _id, email, name }) => (
                      <option key={_id} value={email}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
            )}
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
        </div>
     <div className='f-end'>
     <div> 
          <select id="monthSelect" value={sortMonth}  onChange={(e) => changeTab2(e.target.value)} 
       className="select2">
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
        
          <select  id="yearSelect" value={selectedYear} onChange={handleYearChange} className="select2">
            
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
     </div>
      </div>

    

      <div  className="table-div " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >
              <th className='text-center'>SL</th>
              <th>Employee Name</th>
              <th>Spent</th>
              <th>T. Sellery</th>
              <th>Paid</th>
              <th>Unpaid</th>
            </tr>
          </thead>
          <tbody className='text-black'>
            {employeeData.map((user, index) => (
              <tr  key={user?._id}
              className={`tr2`}
            >
                 <td className='text-center'>{index + 1}</td>
                <td >
               <div className='flex justify-start items-center gap-1'>
               <img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span>
               </div>
                </td>
                 <td >$ {user.totalSpent.toFixed(2)}</td>
                <td >৳ {(user.totalSpent * 7).toFixed(2)}</td>
                <td >
  ৳ {users
    ?.filter(e => e.email === user?.email)
    .map(user => user.adminPayments?.reduce((acc, curr) => acc + (parseFloat(curr.payAmount) || 0), 0) || 0)[0]
    .toFixed(2)}
</td>


<td >
  ৳ {(
    (user.totalSpent * 7) - 
    (users
      ?.filter(e => e.email === user?.email)
      .map(user => user.adminPayments?.reduce((acc, curr) => acc + (parseFloat(curr?.payAmount) || 0), 0) || 0)[0]
    )
  ).toFixed(2)}
</td>

              </tr>
            ))}
          </tbody>
          <tfoot className=" font-bold ">
            <tr className='tr1'>
              <td className='text-right' colSpan="2">Total:</td>
              <td >$ {totalSpent.toFixed(2)}</td> 
              <td >৳ {(totalSpent * 7).toFixed(2)}</td>
              <td >৳ {totalSellery.toFixed(2)}</td>
              <td >৳ {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
             
            </tr>
          </tfoot>
        </table>
      </div>
      </div>

    </div>
  );
};

export default MonthlySalary;
