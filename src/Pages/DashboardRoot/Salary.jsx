// import {  useContext, useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import useUsersSellery from '../../Hook/useUsersSellery';
// import useUserr from '../../Hook/useUser';
// import useMySalaryPayments from '../../Hook/useMySalaryPayment';
// import useUsers from '../../Hook/useUsers';
// import { AuthContext } from '../../Security/AuthProvider';
// import useAllEmployee from '../../Hook/useAllEmployee';
// import toast from 'react-hot-toast';
// import UseAxiosPublic from '../../Axios/UseAxiosPublic';
// import useUserr2 from '../../Hook/useUser2';
// import { ImCross } from 'react-icons/im';
// import SummaryCard from '../Home/SummeryCard';

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const Salary = () => {
//   const [employeeData, setEmployeeData] = useState([]);
//   const { user } = useContext(AuthContext);
//   const { userr } = useUserr(user?.email);
//   const [users] = useUsers();
//   const [allEmployees] = useAllEmployee([]);


//   const initialTab =
//   userr?.role === "admin"
//   ? localStorage.getItem("a9") || "all" 
//   : localStorage.getItem("a9") || user?.email; 

//   const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

//   const changeTab = (tab) => {
//     setSelectedEmployee(tab);
//     localStorage.setItem("a9", tab);
//   };


//   const initialTab5 =
//   userr?.role === "admin"
//   ? localStorage.getItem("a99") || "all" 
//   : localStorage.getItem("a99") || user?.email; 
//   const [selectedRole, setSelectedRole] = useState(initialTab5);

//   const changeTab5 = (tab) => {
//     setSelectedRole(tab);
//     localStorage.setItem("a99", tab);
//   };

//   // Fetch data based on selected employee
//   const [usersSellery] = useUsersSellery(selectedEmployee);
//   const [MySalaryPayment,refetch] = useMySalaryPayments(selectedEmployee);

//   useEffect(() => {
//     if (!usersSellery || !MySalaryPayment || !Array.isArray(months)) return;
  
//     const processMonthlyData = () => {
//       // Get all monthly spent data
//       const allMonthlySpent = Array.isArray(usersSellery)
//         ? usersSellery.flatMap((user) => user.monthlySpent || [])
//         : usersSellery?.monthlySpent || [];
  
//       // Map through months to calculate data
//       return months.map((month) => {
//         const monthlySpentData = allMonthlySpent.filter(
//           (spent) => 
//             new Date(spent.date).toLocaleString("default", { month: "long" }) === month
//         );
  
//         // Deduplicate by accountName and take the most recent entry
//         const uniqueMonthlySpent = monthlySpentData.reduce((acc, current) => {
//           const existingIndex = acc.findIndex((item) => item.accountName === current.accountName);
//           if (existingIndex !== -1) {
//             if (new Date(current.date) > new Date(acc[existingIndex].date)) {
//               acc[existingIndex] = current;
//             }
//           } else {
//             acc.push(current);
//           }
//           return acc;
//         }, []);
  
//         const totalSpent = uniqueMonthlySpent.reduce((acc, spent) => acc + (spent.totalSpentt || 0), 0);
  
//         // Filter salary data by month
//         const selleryData = MySalaryPayment.filter(
//           (sell) => 
//             new Date(sell.date).toLocaleString("default", { month: "long" }) === month
//         );
  
//         const totalSellery = selleryData.reduce((acc, sell) => acc + parseFloat(sell.payAmount) || 0, 0);
//         const totalBonus = selleryData.reduce((acc, sell) => acc + parseFloat(sell.bonus) || 0, 0);
  
//         return {
//           month,
//           totalSpent,
//           totalSellery,
//           totalBonus,
//           totalBill: totalSpent * 140,
//           totalSelleryPaid: totalSpent * 7 - totalSellery,
//           selleryData,
//         };
//       });
//     };
  
//     setEmployeeData(processMonthlyData());
//   }, [usersSellery, MySalaryPayment, months]);


  
//   const {userr2}=useUserr2(selectedEmployee)

//   const AxiosPublic=UseAxiosPublic()
//   const today = new Date();
//   const formattedDate = today.toISOString().split('T')[0];  

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     const employeeName = userr2?.name;
//     const employeeEmail = userr2?.email;
//     const payAmount = e.target.payAmount.value;
//     const charge = e.target.charge.value;
//     const paymentMethod = e.target.paymentMethod.value;
//     const note = e.target.note.value;
//     const date = e.target.date.value;

//     const data = {
//       employeeName,
//       employeeEmail,
//       payAmount,
//       note,
//       charge,
//       paymentMethod,
//       date,
//       status:'pending'
//     };

//     const datas = {
//       title: `added ${payAmount} in in ${paymentMethod}`,
//       date: new Date(),
//       user: user?.displayName,
//       email:user?.email
//     };

//     AxiosPublic.post("/salaryPayment",
//       data
//     )
//       .then((res) => {
//         toast.success("Send successful!");
//         refetch();
//         AxiosPublic.post("/activity", datas).then(() => {
//         });
//         console.log(res.data);
//         document.getElementById("my_modal_1").close()
       
//       })

//   };
  
//   const formatValue = (value, decimals = 2) =>
//     new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

//   console.log(selectedRole);

//   return (
//     <div className=''>
//       <Helmet>
//         <title>Salary | Digital Network </title>
//         <link rel="canonical" href="https://www.example.com/" />
//       </Helmet>

//       <div  className="grid   rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">

//       <SummaryCard title="Total Spent" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0))} />
//       <SummaryCard title="Total Salery" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0))} />
//       <SummaryCard title="Total Paid" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0))} />
//       <SummaryCard title="Total Unpaid" value={formatValue( employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0))} />
//       </div>

//       <div className='side-space mt-5'>
   



// <div className='f-start mb-4'>
// <div className="f-start">
//     <button
//       className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
//       onClick={() => document.getElementById("my_modal_1").showModal()}
//     >
//       Pay Admin
//     </button>
//     <dialog id="my_modal_1" className="modal">
//       <div className="modal-box bg-white text-black font-bold">
//         <form onSubmit={(e) => handlePayment(e)}>

//           <div className="grid lg:grid-cols-2">

//           </div>
//           <div className="">
//             <h1
//               className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
//               onClick={() => document.getElementById("my_modal_1").close()}
//             >
//               <ImCross />
//             </h1>

            
// <div className='grid lg:grid-cols-2 gap-3'>
// <div className="mb-4">
//             <label className="block text-gray-250">Date</label>
//             <input
//               type="date"
//               name="date"
//               required
//               defaultValue={formattedDate}
//               className="input2"
//             />
//           </div>

//           <div className="mb-5">
//          <label className="block text-black">Select Employee</label>
//          <select
          
//            className="select2 w-full"
//            name="employeeEmail"
//          >
//            {allEmployees?.filter(f=> f.role !== 'admin').map((employee) => (
//              <option key={employee._id} value={employee.email}>
//                {employee.name}
//              </option>
//            ))}
//          </select>
//        </div>
// </div>

//               <div className="grid lg:grid-cols-2 gap-3">
//               <div className="mb-4 ">
//             <label className="block text-gray-250">Amount</label>
//             <input
//               required
//               type="number"
//               name="payAmount"
//               placeholder="0"
//               className="input2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-250">Charge</label>
//             <input
//               required
//               type="number"
//               name="charge"
//               placeholder="0"
//               defaultValue={0}
//               className="input2"
//             />
//           </div>
//               </div>

             
            
//           </div>

//           <div className="mb-4">
//   <div className="mt-2 grid lg:grid-cols-3">
//     {[
//       { value: "bank", label: "Brack Bank" },
//       { value: "DBBLBank", label: "DBBL Bank" },
//       { value: "IBBLBank", label: "Islami Bank" },
//       { value: "bkashPersonal", label: "bKash" },
//       { value: "nagadPersonal", label: "Nagad" },
//     ].map(({ value, label }) => (
//       <div className="form-control" key={value}>
//         <label className="label flex justify-start items-center gap-2 cursor-pointer">
//           <input
//             type="radio"
//             name="paymentMethod"
//             value={value}
//             className="radio radio-primary"
//           />
//           <span className="label-text text-black">{label}</span>
//         </label>
//       </div>
//     ))}
//   </div>
// </div>





//           <div className="mb-4">
//             <label className="block text-gray-250">Note (Optional)</label>
//             <input
//               type="text"
//               name="note"
//               placeholder="type note..."
//               className="w-full border bg-white border-black rounded p-2 mt-1"
//             />
//           </div>
//           <div className="grid mt-8 lg:grid-cols-2 gap-3">
//             <form method="dialog">
//               <button className="p-2 w-full hover:bg-red-700 rounded-lg bg-red-600 text-white text-center">
//                 Close
//               </button>
//             </form>
//             <button
//               type="submit"
//               className="font-avenir w-full hover:bg-indigo-700 px-3 pt-2 rounded-lg flex justify-center text-white bg-[#05a0db]"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </dialog>
//   </div>
  

//     <div className='f-end'>
//     {
//     userr?.role === 'admin' &&   <select
//     className="select2"
//     value={selectedRole}
//     onChange={(e) => changeTab5(e.target.value)}
// >
//             <option value="employee">Employee</option>
//             <option value="graphicDesigner">GraphicDesign</option>
//             <option value="webDeveloper">Web Developer</option>
//    </select>
//   }


//   {
//     userr?.role === 'admin' &&   <select
//     className="select2"
//     value={selectedEmployee}
//     onChange={(e) => changeTab(e.target.value)}
// >
// <option value="all">
//   All{" "}
//   {selectedRole === "employee"
//     ? "Employee"
//     : selectedRole === "graphicDesigner"
//     ? "Graphic Designer"
//     : selectedRole === "webDeveloper"
//     ? "Web Developer"
//     : "Users"}
// </option>

//     {users
//         .filter((u) => [selectedRole].includes(u.role))
//         .map((employee) => (
//             <option key={employee._id} value={employee.email}>
//                 {employee.name}
//             </option>
//         ))}
//       </select>
//   }
//     </div>
    
// </div>

//        <div className="table-div  " >
//     <table className="min-w-full text-center ">
//       <thead className=" ">
//         <tr className="tr1">
//               <th >Month</th>
//               <th >Spent</th>
//               <th >T. Sellery</th>
//               <th >Unpaid</th>
//               <th >Paid</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employeeData.map((data, index) => (
//               <tr 
//               key={data._id}
//               className={`tr2`}
//              >
                
//                 <td>{data.month}</td>
//                 <td>
//   $ {new Intl.NumberFormat('en-IN').format(data.totalSpent.toFixed(2))}
//               </td>
//               <td>
//   ৳ {
//     new Intl.NumberFormat('en-IN').format(
//       (data.totalSpent * (["October", "November", "December"].includes(data.month) ? 7 : 7)).toFixed(0)
//     )
//   }
//              </td>
//               <td>
//   ৳ {new Intl.NumberFormat('en-IN').format(data.totalSelleryPaid.toFixed(2))}
//                </td>
//               <td>
//   ৳ {new Intl.NumberFormat('en-IN').format(data.totalSellery.toFixed(2))}
//                </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className=" font-bold ">
//           <tr className='tr1'>
//             <td  className=" text-right" colSpan="1">Total</td>
//             <td >
//   $ {new Intl.NumberFormat('en-IN').format(
//     employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)
//   )}
//             </td>
//             <td>
//   ৳ {new Intl.NumberFormat('en-IN').format(
//     employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(2)
//   )}
//             </td>
//               <td>
//   ৳ {new Intl.NumberFormat('en-IN').format(
//     employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(2)
//   )}
//              </td>
//            <td>
//   ৳ {new Intl.NumberFormat('en-IN').format(
//     employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)
//   )}
//            </td>
//           </tr>
//         </tfoot>
//         </table>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Salary;











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
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { Link } from 'react-router-dom';

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
  ? localStorage.getItem("a9") || "all" 
  : localStorage.getItem("a9") || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("a9", tab);
  };


  const initialTab5 =
  userr?.role === "admin"
  ? localStorage.getItem("a99") || "all" 
  : localStorage.getItem("a99") || user?.email; 
  const [selectedRole, setSelectedRole] = useState(initialTab5);

  const changeTab5 = (tab) => {
    setSelectedRole(tab);
    localStorage.setItem("a99", tab);
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


  
  const formatValue = (value, decimals = 2) =>
    new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })

  const [employeePayment] = useEmployeePayment();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab2 = localStorage.getItem("activeTaballselleryMonth") ;
  const [sortMonth, setSortMonth] = useState(initialTab2 || currentMonth);
  
  const changeTab2 = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballselleryMonth", tab); 
  };

  useEffect(() => {
    const employees = users.filter(user => user.role === 'employee');
    const aggregatedData = employees.map(user => {
      const monthlySpentData = (user.monthlySpent || []).filter(spent => {
        const spentDate = new Date(spent.date);
        return spentDate.toLocaleString('default', { month: 'long' }) === sortMonth && spentDate.getFullYear() === selectedYear;
      });

      const selleryData = (user.sellery || []).filter(sell => sell.month === sortMonth);
      const adminPayData = (user.adminPay || []).filter(pay => {
        const payDate = new Date(pay.date);
        return payDate.toLocaleString('default', { month: 'long' }) === sortMonth && payDate.getFullYear() === selectedYear;
      });

      const employeePaymentData = employeePayment.filter(payment => {
        const paymentDate = new Date(payment.date);
        return (
          payment.employeeEmail === user.email &&
          paymentDate.toLocaleString('default', { month: 'long' }) === sortMonth &&
          paymentDate.getFullYear() === selectedYear
        );
      });

      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);
      const totalPayAmount = employeePaymentData.reduce((acc, payment) => acc + parseFloat(payment.payAmount), 0);

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
        totalPayAmount,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);

    setEmployeeData(sortedData);

  }, [users, employeePayment, sortMonth, selectedYear]);


  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);
  const totalSellery = employeeData.reduce((acc, user) => acc + user.totalSellery, 0);
  const totalBonus = employeeData.reduce((acc, user) => acc + user.totalBonus, 0);


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
    <div className=''>
      <Helmet>
        <title>Salary | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div  className="grid   rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">

      <SummaryCard title="Total Spent" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0))} />
      <SummaryCard title="Total Salery" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0))} />
      <SummaryCard title="Total Paid" value={formatValue(employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0))} />
      <SummaryCard title="Total Unpaid" value={formatValue( employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0))} />
      </div>

      <div className='side-space mt-5'>
   



<div className='f-start mb-4'>

<div className="f-start">
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
         <label className="block text-black">Select Employee</label>
         <select
          
           className="select2 w-full"
           name="employeeEmail"
         >
           {allEmployees?.filter(f=> f.role !== 'admin').map((employee) => (
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
  </div>


    <div className='f-end'>
    {
    userr?.role === 'admin' &&   <select
    className="select2"
    value={selectedRole}
    onChange={(e) => changeTab5(e.target.value)}
>
            <option value="employee">Employee</option>
            <option value="graphicDesigner">GraphicDesign</option>
            <option value="webDeveloper">Web Developer</option>
   </select>
  }


  {
    userr?.role === 'admin' &&   <select
    className="select2"
    value={selectedEmployee}
    onChange={(e) => changeTab(e.target.value)}
>
<option value="all">
  All{" "}
  {selectedRole === "employee"
    ? "Employee"
    : selectedRole === "graphicDesigner"
    ? "Graphic Designer"
    : selectedRole === "webDeveloper"
    ? "Web Developer"
    : "Users"}
</option>

    {users
        .filter((u) => [selectedRole].includes(u.role))
        .map((employee) => (
            <option key={employee._id} value={employee.email}>
                {employee.name}
            </option>
        ))}
      </select>
  }
    </div>
    <div> 
          <select id="monthSelect" value={sortMonth}  onChange={(e) => changeTab2(e.target.value)} className="p-2 bg-white text-black border border-gray-700 rounded">
          <option  value={' '}>Select Month </option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
    
</div>

{
  sortMonth === ' ' ? <div className="table-div  " >
  <table className="min-w-full text-center ">
    <thead className=" ">
      <tr className="tr1">
            <th >Month</th>
            <th >Spent</th>
            <th >T. Sellery</th>
            <th >Unpaid</th>
            <th >Paid</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((data, index) => (
            <tr 
            key={data._id}
            className={`tr2`}
           >
              
              <td>{data.month}</td>
              <td>
$ {new Intl.NumberFormat('en-IN').format(data.totalSpent.toFixed(2))}
            </td>
            <td>
৳ {
  new Intl.NumberFormat('en-IN').format(
    (data.totalSpent * (["October", "November", "December"].includes(data.month) ? 7 : 7)).toFixed(0)
  )
}
           </td>
            <td>
৳ {new Intl.NumberFormat('en-IN').format(data?.totalSelleryPaid?.toFixed(2))}
             </td>
            <td>
৳ {new Intl.NumberFormat('en-IN').format(data.totalSellery.toFixed(2))}
             </td>
            </tr>
          ))}
        </tbody>
        <tfoot className=" font-bold ">
        <tr className='tr1'>
          <td  className=" text-right" colSpan="1">Total</td>
          <td >
$ {new Intl.NumberFormat('en-IN').format(
  employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)
)}
          </td>
          <td>
৳ {new Intl.NumberFormat('en-IN').format(
  employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(2)
)}
          </td>
            <td>
৳ {new Intl.NumberFormat('en-IN').format(
  employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(2)
)}
           </td>
         <td>
৳ {new Intl.NumberFormat('en-IN').format(
  employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)
)}
         </td>
        </tr>
      </tfoot>
      </table>
    </div> :  <div className="table-div">
        <table className="min-w-full text-center bg-white">
          <thead >
            <tr className='tr1'>
              <th >Month</th>
              <th >Employee Name</th>
              <th >Spent</th>
              <th >T. Sellery</th>
              <th >Paid</th>
              <th >Unpaid</th>
              <th >Bonus</th>
            </tr>
          </thead>
          <tbody className='text-black'>
            {employeeData.map((user, index) => (
              <tr key={user.email} className={`tr2`}>
                 <td >{sortMonth}</td>
                <td onClick={() => changeTab('sellery')} >
                  <Link className='flex justify-start items-center gap-2' to={`/dashboard/userInfo/${user?.email}`}><img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span></Link>
                </td>
                 <td >${user.totalSpent.toFixed(2)}</td>
                <td >৳ {(user.totalSpent * 7).toFixed(2)}</td>
                <td >৳ {user.totalSellery.toFixed(2)}</td>
                <td >৳ {(user.totalSpent * 7 - user.totalSellery).toFixed(2)}</td>
                <td >৳ {user.totalBonus.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot >
            <tr className='tr1'>
              <td className=" text-right " colSpan="2">Total:</td>
              <td >${totalSpent.toFixed(2)}</td> 
              <td >৳ {(totalSpent * 7).toFixed(2)}</td>
              <td >৳ {totalSellery.toFixed(2)}</td>
              <td>৳ {(totalSpent * 7 - totalSellery).toFixed(2)}</td>
              <td>৳ {totalBonus.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
}
       
      </div>
    </div>
  );
};

export default Salary;



