
import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMyClientsByEmail from "../../Hook/useMyClientsByEmail";
import useMypymentsByEmail from "../../Hook/useMyMPayments";
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import useMyCampaingsByEmail from "../../Hook/useMyCampaignByEmail";
import { BsCashStack } from "react-icons/bs";
import useActivity from "../../Hook/useActivity";
import { TbReorder } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { MdCampaign } from "react-icons/md";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useMyEmployeePayments from "../../Hook/useMyemployeePayments";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import RadarChart from "./RaderChart";
import DoughnutChart from "./DouughtOurChart";
import useMyMyActivityEmail from "../../Hook/useMyActivity";
import useMyActivity from "../../Hook/useMyActivity";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];


const EmployeeHome = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employeePayment] = useEmployeePayment();
  const [Mypayments]=useMypymentsByEmail(user?.email)
  const [mycampaigns] = useMyCampaingsByEmail(user?.email);
  const [myclients]=useMyClientsByEmail(user?.email)
  const [MyEmployeePayment]=useMyEmployeePayments(user?.email)

  const tPay2 = mycampaigns?.filter(campaign =>
    myclients.some(client => client.clientEmail === campaign.clientEmail)
  );
  

  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayClients = myclients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  const weeklyClients = myclients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  const monthlyClients = myclients?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });

  const todayCamClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  const weeklyCamClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  const monthlCamyClients = tPay2?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });


  function isInThisWeek(date) {
    const currentDate = new Date();
    const startOfWeek = currentDate.getDate() - currentDate.getDay(); // Get the start of the current week
    const endOfWeek = startOfWeek + 6; // Get the end of the current week
    const startOfWeekDate = new Date(currentDate.setDate(startOfWeek));
    const endOfWeekDate = new Date(currentDate.setDate(endOfWeek));
    const paymentDate = new Date(date);
  
    return paymentDate >= startOfWeekDate && paymentDate <= endOfWeekDate;
  }

  const todayPayAmountTotal = MyEmployeePayment
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.toDateString() === today.toDateString(); // Filter only today's data
    })
    .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0); // Sum the payAmount values
  

    const thisWeekPayAmountTotal = MyEmployeePayment
    .filter(payment => isInThisWeek(payment.date)) 
    .filter(f=>f.status === 'Approved')
    .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0);

      const thisMonthPayAmountTotal = MyEmployeePayment
            .filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear(); // Check if the payment is in the current month
             })
             .filter(f=>f.status === 'Approved')
           .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0);

      


  
  const tPay = Mypayments?.filter(campaign =>
    myclients.some(client => client.clientEmail === campaign.clientEmail)
  );

  const todayTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.toDateString() === today.toDateString();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const weeklyTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startOfWeek && paymentDate <= today;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const monthlyTotal = tPay
    ?.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= startOfMonth && paymentDate <= today;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
       
  /////////////////////////////////////////////////////////////////////////////////

  const email = user?.email;
  const [employeeDatas, setEmployeeData] = useState([]);
  const [filteredUsers, setFilterUser] = useState();
  console.log(filteredUsers,users);

  useEffect(() => {

    const filteredUser = users?.find(user => user?.email === email);

    setFilterUser(filteredUser)

    if (filteredUser) {
      const { monthlySpent, sellery } = filteredUser;

      const employeePayments = employeePayment.filter(payment => payment.employeeEmail === email);

      const paymentByMonth = months.reduce((acc, month) => {
        const monthPayments = employeePayments.filter(payment => new Date(payment.date).toLocaleString('default', { month: 'long' }) === month);
        const totalPayAmount = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.payAmount), 0);
        acc[month] = totalPayAmount;
        return acc;
      }, {});

      const monthlyData = months.map(month => {

        const selleryData = (sellery || []).filter(sell => sell.month === month);

        const monthlySpentData = (monthlySpent || [])
        .filter(spent =>
          new Date(spent.date).toLocaleString('default', { month: 'long' }) === month
        )
        .sort((a, b) => {
          if (a.accountName < b.accountName) return -1;
          if (a.accountName > b.accountName) return 1;
          return new Date(a.date) - new Date(b.date);
        })
        .reduce((acc, current) => {
          const existingAccount = acc.find(item => item.accountName === current.accountName);
          if (existingAccount) {
            if (new Date(current.date) > new Date(existingAccount.date)) {
              acc = acc.filter(item => item.accountName !== existingAccount.accountName); 
              acc.push(current); 
            }
          } else {
            acc.push(current); 
          }
          return acc;
        }, []);
        setFilterUser(monthlySpentData)
      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
      
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
        const totalAdminPay = paymentByMonth[month] || 0;

        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalDue: totalSpent * 140 - totalAdminPay,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          totalAdminPay 
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [users, email, employeePayment]);

  const [myActivity]=useMyActivity(email)
  const [activity]=useActivity()

    const options27 = {
      responsive: true,
      plugins: {
        legend: {
          display: false, 
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `৳ ${new Intl.NumberFormat("en-IN").format(context.raw)}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time Period",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Income (৳)",
          },
        },
      },
    };
    const options3 = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Hides the legend
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `৳ ${new Intl.NumberFormat("en-IN").format(context.raw)}`, // Formats the tooltip values
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
           
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Income (৳)", // Label for the y-axis
          },
        },
      },
    };
    
    const data3 = {
      labels: ["Today", "This Week", "This Month"], // Labels for the x-axis
      datasets: [
        {
          label: "Income (৳)", // Tooltip label
          data: [
            todayClients.length, // Assuming these are arrays, we use .length for count
            weeklyClients.length,
            monthlyClients.length,
          ],
          backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"], // Custom colors
          borderWidth: 1, // Border thickness
        },
      ],
    };

    const options4 = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Hides the legend
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `৳ ${new Intl.NumberFormat("en-IN").format(context.raw)}`, // Formats the tooltip values
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
           
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Income (৳)", // Label for the y-axis
          },
        },
      },
    };
    
    const data4 = {
      labels: ["Total Salary", "Total Paid", "Total Unpaid"], // Labels for the x-axis
      datasets: [
        {
          label: "Income (৳)", // Tooltip label
          data: [
            (employeeDatas.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2), // Assuming these are arrays, we use .length for count
            (
              employeeDatas.reduce((acc, data) => acc + data.totalSpent * 7, 0) -
              employeeDatas.reduce((acc, data) => acc + data.totalSelleryPaid, 0)
            ).toFixed(2),
            (employeeDatas.reduce((acc, data) => acc + data.totalSelleryPaid, 0)).toFixed(2),
          ],
          backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"], // Custom colors
          borderWidth: 1, // Border thickness
        },
      ],
    };

    const options5 = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Hides the legend
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `৳ ${new Intl.NumberFormat("en-IN").format(context.raw)}`, // Formats the tooltip values
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
           
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Income (৳)", // Label for the y-axis
          },
        },
      },
    };
    
    const data5 = {
      labels: ["Today", "This Week", "This Month"], // Labels for the x-axis
      datasets: [
        {
          label: "Income (৳)", // Tooltip label
          data: [
            todayCamClients.length ,
            weeklyCamClients.length,
            monthlCamyClients.length,
          ],
          backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"], // Custom colors
          borderWidth: 1, // Border thickness
        },
      ],
    };
    



    const data27 = {
      labels: ["Today", "This Week", "This Month"],
      datasets: [
        {
          label: "Income (৳)",
          data: [todayTotal, weeklyTotal, monthlyTotal],
          backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"], // Custom colors
          borderWidth: 1,
        },
      ],
    }

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

                       <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  mb-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Admin Payments</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <TbReorder />
                  </p>

                   <div className="space-y-1">
                 
                   <p>Today Payments: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {todayPayAmountTotal}</span></p>
                    
                    <p>This week Payments: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {thisWeekPayAmountTotal}
                       </span></p>
                    <p>This Month Payments: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {thisMonthPayAmountTotal}</span></p>
                    
                 </div>

                      </div>
                      </div>

                       </div>


                {/* //////////////////bar chart///////////////////////// */}
                <div className="p-5 rounded-lg mb-5" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }}>
                        <h2 style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)',  }} className=" font-bold p-3">Admin Payment & Transaction Overview</h2>

                        <LineChart MyEmployeePayment={MyEmployeePayment} tPay={tPay}></LineChart>
                        </div>
                      
                        
                       <div className="grid lg:grid-cols-2 gap-5 ">
                      
                       <PieChart data27={data27} options27={options27}></PieChart>

                        <RadarChart data3={data3} options3={options3}></RadarChart>
                   
                         <div
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
        border: "var(--border)",
      }}
      className="bg-gray-800 mb-5 rounded-lg p-5"
    >
      <h1
      
        className="font-bold text-xl rounded-t-lg border-gray-300 pb-3"
      >
        Salary Overview
      </h1>
      <Bar data={data4} options={options4} />
                        </div>

                         <div
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
        border: "var(--border)",
      }}
      className="bg-gray-800 mb-5 rounded-lg p-5"
    >
      <h1
      
        className="font-bold text-xl rounded-t-lg border-gray-300 pb-3"
      >
        Campaign Overview
      </h1>
      <Bar data={data5} options={options5} />
                        </div>

                       </div>

                     
                        </div>
               {/* //////////////////bar chart///////////////////////// */}

                    </div>

                    <div  className="col-span-2 ">
                    <div  className=" rounded-lg  text-white  gap-5">
                    <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  mb-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Orders</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <TbReorder />
                  </p>
                   <div className="space-y-1">
                 
                   <p>Today Orders: <span className="font-bold"><span className="text-sm font-extrabold"></span> {todayClients.length}</span></p>
                    
                    <p>This week Orders: <span className="font-bold">
                    <span className="text-sm font-extrabold"></span> {weeklyClients.length}
                       </span></p>
                    <p>This Month Orders: <span className="font-bold"><span className="text-sm font-extrabold"></span> {monthlyClients.length}</span></p>
                    
                 </div>
                      </div>
                   </div>
                    
                   <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  my-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Campaigns</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <MdCampaign />

                  </p>
                   <div className="space-y-1">
                 
                   <p>Today Campaigns: <span className="font-bold"><span className="text-sm font-extrabold"></span> {todayCamClients.length}</span></p>
                    
                    <p>This week Campaigns: <span className="font-bold">
                    <span className="text-sm font-extrabold"></span> {weeklyCamClients.length}
                       </span></p>
                    <p>This Month Campaigns: <span className="font-bold"><span className="text-sm font-extrabold"></span> {monthlCamyClients.length}</span></p>
                  
                 </div>
                      </div>
                 </div>
                 
                 <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800 mb-5    rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Spend</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                      <RiMoneyDollarCircleLine />
                      
                  </p>
                   <div className="space-y-1">
                 
                   <p>
  This Month: <span className="font-bold">
  $ {
    users?.find(user => user?.email === email)?.monthlySpent
      ?.filter(spent => {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // Get current month
        return new Date(spent.date).toLocaleString('default', { month: 'long' }) === currentMonth;
      })
      .sort((a, b) => {
        if (a.accountName < b.accountName) return -1;
        if (a.accountName > b.accountName) return 1;
        return new Date(b.date) - new Date(a.date); // Sort by date descending for each accountName
      })
      .reduce((acc, current) => {
        // Check if accountName is already added
        const existingAccount = acc.find(item => item.accountName === current.accountName);
        if (!existingAccount) {
          acc.push(current); // Add the latest entry for each unique accountName
        }
        return acc;
      }, [])
      .reduce((total, account) => total + (account.totalSpentt || 0), 0) // Sum up totalSpentt values
      .toFixed(2) // Format total to two decimal places
  }
</span>

</p>

                   <p>Previous Month: <span className="font-bold">
  $ {
    users?.find(user => user?.email === email)?.monthlySpent
      ?.filter(spent => {
        // Get the current date and calculate the previous month
        const currentDate = new Date();
        const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'long' }); // Get previous month as a string

        // Filter the spent data for the previous month
        return new Date(spent.date).toLocaleString('default', { month: 'long' }) === previousMonth;
      })
      .sort((a, b) => {
        if (a.accountName < b.accountName) return -1;
        if (a.accountName > b.accountName) return 1;
        return new Date(b.date) - new Date(a.date); // Sort by date descending for each accountName
      })
      .reduce((acc, current) => {
        // Check if accountName is already added
        const existingAccount = acc.find(item => item.accountName === current.accountName);
        if (!existingAccount) {
          acc.push(current); // Add the latest entry for each unique accountName
        }
        return acc;
      }, [])
      .reduce((total, account) => total + (account.totalSpentt || 0), 0) // Sum up totalSpentt values
      .toFixed(2) // Format total to two decimal places
  }
</span>

                   </p>
                   <p>Total Spend: <span className="font-bold">
                     $ {new Intl.NumberFormat('en-IN').format(
                       employeeDatas.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)
                     )}
                   </span></p>
                 </div>
                      </div>
                  

                 </div>

               

                    <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800   mb-5  rounded-lg">
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
                 </div>
                    
               
                
                        </div>



                        <div
  style={{
    backgroundColor: "var(--bg-color3)",
    color: "var(--text-color2)",
    border: "var(--border)",
    width: "100%",
  }}
  className="bg-gray-50 mb-5 rounded-lg shadow-lg"
>
  <h1
    style={{
      border: "var(--border)",
      backgroundColor: "var(--bg-header)",
      color: "var(--text-color1)",
    }}
    className="font-bold text-xl rounded-t-lg border-gray-300 p-4"
  >
    Activity Log
  </h1>

  <div className="p-4">
    <div
      style={{
        maxHeight: "600px", // Scrollable container height
        overflowY: "auto",
      }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor: "var(--bg-header)",
              color: "var(--text-color1)",
              borderBottom: "2px solid var(--border-color)",
            }}
          >
            <th className="text-left p-3">Time</th>
            <th className="text-left p-3">User</th>
            <th className="text-left p-3">Message</th>
          </tr>
        </thead>
        <tbody>
          {activity?.filter(e=>e.email === user?.email).map((a) => (
            <tr
              key={a._id}
              style={{
                backgroundColor: "var(--bg-row)",
                color: "var(--text-color2)",
              }}
              className="hover:bg-gray-200"
            >
              <td className="p-3 border-b border-gray-300 text-sm">
                {new Date(a.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="p-3 border-b border-gray-300 text-sm">
                {a.user.split(" ")[0]}
              </td>
              <td className="p-3 border-b border-gray-300 text-sm">{a.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
                     </div>



                    </div>
               </div>  
     </div>
  );
};
export default EmployeeHome;


