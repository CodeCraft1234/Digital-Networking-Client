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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const Salary = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);
  const [users] = useUsers();
  const [allEmployees] = useAllEmployee([]);


  const initialTab =
  userr?.role === "admin"
  ? localStorage.getItem("a") || "all" 
  : localStorage.getItem("a") || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  // Change tab and save selection to local storage
  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("a", tab);
  };

  // Fetch data based on selected employee
  const [usersSellery] = useUsersSellery(selectedEmployee);
  const [MySalaryPayment,refetch] = useMySalaryPayments(selectedEmployee);

  useEffect(() => {
    if (!usersSellery || !MySalaryPayment || !Array.isArray(months)) return;
  
    const processMonthlyData = () => {
      // Get all monthly spent data
      const allMonthlySpent = Array.isArray(usersSellery)
        ? usersSellery.flatMap((user) => user.monthlySpent || [])
        : usersSellery?.monthlySpent || [];
  
      // Map through months to calculate data
      return months.map((month) => {
        const monthlySpentData = allMonthlySpent.filter(
          (spent) => 
            new Date(spent.date).toLocaleString("default", { month: "long" }) === month
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
  
        const totalSpent = uniqueMonthlySpent.reduce((acc, spent) => acc + (spent.totalSpentt || 0), 0);
  
        // Filter salary data by month
        const selleryData = MySalaryPayment.filter(
          (sell) => 
            new Date(sell.date).toLocaleString("default", { month: "long" }) === month
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
      });
    };
  
    setEmployeeData(processMonthlyData());
  }, [usersSellery, MySalaryPayment, months]);


  
  const {userr2}=useUserr2(selectedEmployee)

  const AxiosPublic=UseAxiosPublic()
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  

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
      charge,
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
  


  return (
    <div className='m-5'>
      <Helmet>
        <title>Marketers Salary | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="grid my-5 p-5 rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Spent</h2>
          <p className="lg:text-xl text-xl font-bold mt-5">
  $ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Salery</h2>
          <p className="lg:text-xl text-xl font-bold mt-5">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-xl text-xl font-bold mt-5">
  <span className="text-2xl font-extrabold">৳</span>
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Unpaid</h2>
          <p className="lg:text-xl text-xl font-bold mt-5">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0)
  )}
</p>

        </div>


      </div>

      <div className='px-5 pb-5 pt-5 my-5 mt-5  rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
   



<div className='flex mb-5 justify-start items-center gap-3'>
<div className="flex  justify-start">
    <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
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
              className="w-full border text-black bg-white border-black rounded p-2 mt-1"
            />
          </div>

          <div className="mb-5">
         <label className="block text-black">Select Employee</label>
         <select
          
           className="border bg-white w-full mt-1  py-2   text-black border-black rounded p-2 "
           name="employeeEmail"
         >
           {allEmployees?.filter(f=> f.role !== 'admin').map((employee) => (
             <option key={employee._id} value={employee.email}>
               {employee.name}
             </option>
           ))}
         </select>
       </div>

              <div className="grid lg:grid-cols-2 gap-3">
              <div className="mb-4 ">
            <label className="block text-gray-250">Amount</label>
            <input
              required
              type="number"
              name="payAmount"
              placeholder="0"
              className="w-full border bg-white border-black rounded p-2 mt-1"
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
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
              </div>

             
            
          </div>

          <div className="mb-4">
  <div className="mt-2 grid lg:grid-cols-3">
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="bank"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Brack Bank</span>
      </label>
    </div>
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="DBBLBank"
          className="radio radio-primary"
        />
        <span className="label-text text-black">DBBL Bank</span>
      </label>
    </div>
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="IBBLBank"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Islami Bank</span>
      </label>
    </div>
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="bkashPersonal"
          className="radio radio-primary"
        />
        <span className="label-text text-black">bKash</span>
      </label>
    </div>
    <div className="form-control">
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="nagadPersonal"
          className="radio radio-primary"
        />
        <span className="label-text text-black">Nagad</span>
      </label>
    </div>
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
  
      <select
    style={{
        backgroundColor: "var(--bg-color2)",
        border: "var(--border)",
        color: "var(--text-color2)",
    }}
    className="border bg-white  text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
    value={selectedEmployee}
    onChange={(e) => changeTab(e.target.value)}
>
    <option value="all">All Employees</option>
    {users
        .filter((u) => ["employee", "graphicDesign", "webDeveloper", "staf"].includes(u.role))
        .map((employee) => (
            <option key={employee._id} value={employee.email}>
                {employee.name}
            </option>
        ))}
      </select>
</div>

       <div className="overflow-x-auto rounded-xl  text-center " style={{  color: 'var(--text-color)'}}>
    <table className="min-w-full text-center ">
      <thead className=" ">
        <tr className="" style={{backgroundColor: 'var(--bg-color)',border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
          
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Month</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Spent</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">T. Sellery</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Unpaid</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Paid</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => (
              <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={data._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
             >
                
                <td style={{  border: 'var(--border)'}}  className="p-3 hover:text-blue-600 cursor-pointer border-r-2 border-gray-300 text-start px-5">
                  {data.month}
                </td>
                <td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-300 text-start">
  $ {new Intl.NumberFormat('en-IN').format(data.totalSpent.toFixed(2))}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-300 text-start">
  ৳ {
    new Intl.NumberFormat('en-IN').format(
      (data.totalSpent * (["October", "November", "December"].includes(data.month) ? 7 : 7)).toFixed(0)
    )
  }
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-300 text-start">
  ৳ {new Intl.NumberFormat('en-IN').format(data.totalSelleryPaid.toFixed(2))}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 border-r-2 border-gray-300 text-start">
  ৳ {new Intl.NumberFormat('en-IN').format(data.totalSellery.toFixed(2))}
</td>


              
              </tr>
            ))}
          </tbody>
          <tfoot className=" font-bold ">
          <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
            <td style={{  border: 'var(--border)'}} className="p-3 text-right" colSpan="1">Total</td>
            <td style={{ border: 'var(--border)' }} className="p-3 text-start">
  $ {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)
  )}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 text-start">
  ৳ {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(2)
  )}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 text-start">
  ৳ {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(2)
  )}
</td>
<td style={{ border: 'var(--border)' }} className="p-3 text-start">
  ৳ {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)
  )}
</td>

          
          
          </tr>
        </tfoot>
        </table>
      </div>
      </div>

    </div>
  );
};

export default Salary;

