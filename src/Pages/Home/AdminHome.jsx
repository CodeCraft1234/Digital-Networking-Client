
import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import useMypymentsByEmail from "../../Hook/useMyMPayments";
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import useMpayment from "../../Hook/UseMpayment";
import useMyCampaingsByEmail from "../../Hook/useMyCampaignByEmail";
import { BsCashStack } from "react-icons/bs";
import useActivity from "../../Hook/useActivity";
import { TbReorder } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { MdCampaign } from "react-icons/md";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useCampaings from "../../Hook/useCampaign";
import useClients from "../../Hook/useClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminHome = () => {
  const [users] = useUsers();
  const [employeePayment] = useEmployeePayment();
  const [MPayment]=useMpayment()
  const [campaigns]=useCampaings()
  const [clients]=useClients()

  const tPay2 = campaigns?.filter(campaign =>
    clients.some(client => client.clientEmail === campaign.clientEmail)
  );
  

  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Filter clients for today
  const todayClients = clients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  // Filter clients for this week
  const weeklyClients = clients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  // Filter clients for this month
  const monthlyClients = clients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });

  // Filter clients for today
  const todayCamClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  // Filter clients for this week
  const weeklyCamClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  // Filter clients for this month
  const monthlCamyClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });



  
  const tPay = MPayment?.filter(campaign =>
    clients.some(client => client.clientEmail === campaign.clientEmail)
  );


  // Calculate today's total amount
  const todayTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.toDateString() === today.toDateString();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate this week's total amount
  const weeklyTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startOfWeek && paymentDate <= today;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate this month's total amount
  const monthlyTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startOfMonth && paymentDate <= today;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  

          
  /////////////////////////////////////////////////////////////////////////////////


//   const [employeeDatas, setEmployeeData] = useState([]);

//   useEffect(() => {
//     if (users && employeePayment) {
//       const months = Array.from({ length: 12 }, (_, i) => 
//         new Date(0, i).toLocaleString('default', { month: 'long' })
//       );

//       const allUserData = users.map(user => {
//         const { monthlySpent = [], sellery = [] } = user;

//         // Calculate payment by month
//         const paymentByMonth = months.reduce((acc, month) => {
//           const monthPayments = employeePayment.filter(payment =>
//             new Date(payment.date).toLocaleString('default', { month: 'long' }) === month
//           );
//           const totalPayAmount = monthPayments.reduce(
//             (sum, payment) => sum + parseFloat(payment.payAmount || 0),
//             0
//           );
//           acc[month] = totalPayAmount;
//           return acc;
//         }, {});

//         // Create monthly data
//         const monthlyData = months.map(month => {
//           // Filter and process monthlySpent
//           const monthlySpentData = monthlySpent
//             .filter(spent =>
//               new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
//             )
//             .sort((a, b) => {
//               if (a.accountName < b.accountName) return -1;
//               if (a.accountName > b.accountName) return 1;
//               return new Date(a.date) - new Date(b.date);
//             })
//             .reduce((acc, current) => {
//               const existingAccount = acc.find(item => item.accountName === current.accountName);
//               if (existingAccount) {
//                 if (new Date(current.date) > new Date(existingAccount.date)) {
//                   acc = acc.filter(item => item.accountName !== existingAccount.accountName);
//                   acc.push(current);
//                 }
//               } else {
//                 acc.push(current);
//               }
//               return acc;
//             }, []);

//           // Calculate totals
//           const totalSpent = monthlySpentData.reduce((acc, spent) => acc + (spent.totalSpentt || 0), 0);
//           const selleryData = sellery.filter(sell => sell.month === month);
//           const totalSellery = selleryData.reduce((acc, sell) => acc + (sell.amount || 0), 0);
//           const totalBonus = selleryData.reduce((acc, sell) => acc + (sell.bonus || 0), 0);
//           const totalAdminPay = paymentByMonth[month] || 0;

//           return {
//             month,
//             totalSpent,
//             totalSellery,
//             totalBonus,
//             totalBill: totalSpent * 140,
//             totalDue: totalSpent * 140 - totalAdminPay,
//             totalSelleryPaid: totalSpent * 7 - totalSellery,
//             totalAdminPay
//           };
//         });

//         return {
//           userEmail: user.email,
//           monthlyData
//         };
//       });

//       // Flatten and combine all users' monthly data
//       const aggregatedData = allUserData.flatMap(user => user.monthlyData);
//       setEmployeeData(aggregatedData);
//     }
//   }, [users, employeePayment]);

  const [activity]=useActivity()



    // Sample Data
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sales",
          data: [300, 500, 400, 700, 800, 600],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  
    // Chart Options
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Monthly Sales Data",
        },
      },
    };

    const totalSpent = users?.map(user => user?.monthlySpent?.filter(spent => new Date(spent.date).toLocaleString('default', { month: 'long' }) === new Date().toLocaleString('default', { month: 'long' })).sort((a, b) => a.accountName.localeCompare(b.accountName) || new Date(b.date) - new Date(a.date)).reduce((acc, current) => { if (!acc.some(item => item.accountName === current.accountName)) acc.push(current); return acc; }, []).reduce((total, account) => total + (account.totalSpentt || 0), 0).toFixed(2)).reduce((sum, userTotal) => sum + parseFloat(userTotal || 0), 0);


    const totalSpentPreviousMonth = users
  ?.map(user => {
    // Process each user's monthlySpent
    return user?.monthlySpent
      ?.filter(spent => {
        // Calculate the previous month
        const currentDate = new Date();
        const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long' });

        // Filter spent data for the previous month
        return new Date(spent.date).toLocaleString('default', { month: 'long' }) === previousMonth;
      })
      ?.sort((a, b) => {
        // Sort by accountName (ascending) and date (descending)
        if (a.accountName < b.accountName) return -1;
        if (a.accountName > b.accountName) return 1;
        return new Date(b.date) - new Date(a.date);
      })
      ?.reduce((acc, current) => {
        // Ensure unique accountName entries
        if (!acc.some(item => item.accountName === current.accountName)) {
          acc.push(current); // Add the latest entry for each unique accountName
        }
        return acc;
      }, [])
      ?.reduce((total, account) => total + (account.totalSpentt || 0), 0); // Sum up totalSpentt values
  })
  ?.filter(total => total > 0) // Remove undefined or 0 results
  ?.reduce((sum, userTotal) => sum + userTotal, 0) // Sum totals for all users
  ?.toFixed(2); // Format the total to two decimal places
  
//     const totalSpents = users
//   ?.map(user => {

//     return user?.monthlySpent
//       ?.sort((a, b) => {
//         if (a.accountName < b.accountName) return -1;
//         if (a.accountName > b.accountName) return 1;
//         return new Date(b.date) - new Date(a.date);
//       })
//       ?.reduce((acc, current) => {
//         if (!acc.some(item => item.accountName === current.accountName)) {
//           acc.push(current); 
//         }
//         return acc;
//       }, [])
//       ?.reduce((total, account) => total + (account.totalSpentt || 0), 0); 
//   })
//   ?.filter(total => total > 0) 
//   ?.reduce((sum, userTotal) => sum + userTotal, 0) 
//   ?.toFixed(2); 

  return (

    <div className="m-5 ">  

      <Helmet>
        <title> Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

                <div className="grid lg:grid-cols-6 gap-5">
                    <div className="col-span-4">
                      
                        <div className="">

                       <div className="grid lg:grid-cols-2 gap-5">
                       <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  mb-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Orders</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <TbReorder />
                  </p>
                   <div className="space-y-1">
                 
                   <p>Today Orders: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {todayClients.length}</span></p>
                    
                    <p>This week Orders: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {weeklyClients.length}
                       </span></p>
                    <p>This Month Orders: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {monthlyClients.length}</span></p>
                    
                 </div>
                      </div>
                   </div>

                 <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  mb-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Income</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                  <BsCashStack />
                  </p>
                   <div className="space-y-1">
                 
                   <p>Today Income: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {todayTotal}</span></p>
                    
                    <p>This Week Income: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {weeklyTotal}
                       </span></p>
                    <p>This Month Income: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {monthlyTotal}</span></p>
                 </div>
                      </div>
                 </div>
                       </div>

                        <div className="bg-gray-100 border border-gray-500 mb-5 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Graph Chart</h2>
      <Bar data={data} options={options} />
    </div>
                        </div>


                    </div>

                    <div  className="col-span-2 ">
                    <div  className=" rounded-lg  text-white  gap-5">
                    
                    

                 <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800 mb-5    rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Spend</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <RiMoneyDollarCircleLine />
                      
                  </p>
                   <div className="space-y-1">
                 
                   <p>
  This Month: <span className="font-bold">
  $ {totalSpent.toFixed(2)}
</span>

</p>

                   <p>Previous Month: <span className="font-bold">
  $ {totalSpentPreviousMonth}
</span>

                   </p>
                   <p>Total Spend: <span className="font-bold">
                     {/* $ {new Intl.NumberFormat('en-IN').format(
                       employeeDatas.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)
                     )} */}
                   </span></p>
                 </div>
                      </div>
                  

                 </div>


                    {/* <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800     rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Salary</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <LiaMoneyBillWaveSolid />
                  </p>
                   <div className="space-y-1">
                 
                   <p>Total Salary: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {(employeeDatas.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}</span></p>
                    
                    <p>Total Paid: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {(
                           employeeDatas.reduce((acc, data) => acc + data.totalSpent * 7, 0) -
                           employeeDatas.reduce((acc, data) => acc + data.totalSelleryPaid, 0)
                         ).toFixed(2)}
                       </span></p>
                    <p>Total Unpaid: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {(employeeDatas.reduce((acc, data) => acc + data.totalSelleryPaid, 0)).toFixed(2)}</span></p>
                 </div>
                      </div>
                 </div> */}

                 <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  my-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Campaigns</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <MdCampaign />

                  </p>
                   <div className="space-y-1">
                 
                   <p>Today Campaigns: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {todayCamClients.length}</span></p>
                    
                    <p>This week Campaigns: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {weeklyCamClients.length}
                       </span></p>
                    <p>This Month Campaigns: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {monthlCamyClients.length}</span></p>
                  
                 </div>
                      </div>
                 </div>
                
                        </div>



                        <div
  style={{
    backgroundColor: "var(--bg-color3)",
    color: "var(--text-color2)",
    border: "var(--border)",
  }}
  className="bg-gray-800 mb-5 rounded-lg"
>
  <h1
    style={{ border: "var(--border)" }}
    className="font-bold text-xl rounded-t-lg border-gray-300 p-2 pl-4"
  >
    Activity Log
  </h1>

  <div className="p-4 text-black">
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-white rounded-t-lg text-black">
        <tr className="rounded-t-lg" style={{backgroundColor: 'var(--bg-color)' ,border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
          <th  className="border border-gray-300 px-4 py-2">Time</th>
          <th className="border border-gray-300 px-4 py-2">User</th>
          <th className="border border-gray-300 px-4 py-2">Message</th>
        </tr>
      </thead>
      <tbody className="text-black">
      {
  activity
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
    .slice(0, 10) // Get the latest 10 logs
    .map((a) => (
      <tr key={a._id}>
        <td style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}} className="border border-gray-300 px-4 py-2">
          {new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </td>
        <td style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}} className="border border-gray-300 px-4 py-2">{a.user.split(" ")[0]}</td>
        <td style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}} className="border border-gray-300 px-4 py-2">{a.title}</td>
      </tr>
    ))
}

       
      </tbody>
    </table>
  </div>
</div>


                    </div>
               </div>  
     </div>
  );
};
export default AdminHome;
