
import { Helmet } from "react-helmet-async";
import useUsers from "../../Hook/useUsers";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import { BsCashCoin, BsCashStack } from "react-icons/bs";
import useActivity from "../../Hook/useActivity";
import { TbReorder } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
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

import useClients from "../../Hook/useClient";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import RadarChart from "./RaderChart";
import useClientsCampaingss from "../../Hook/useClientCampaingss";
import { AuthContext } from "../../Security/AuthProvider";
import { useContext, useEffect } from "react";
import useUserr from "../../Hook/useUser";
import useMyEmployeePayments from "../../Hook/useMyemployeePayments";
import useOnlyClientEmailByEmail from "../../Hook/useOnlyClientEmailByEmail";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminHome = () => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)

  const email = userr?.role === "admin" ? "all" : user?.email;

  const [clientsPayments] = useClients(email);

  
  const [onlyClientEmails] = useOnlyClientEmailByEmail(email);
  
  
  const [clientsCampaingss]=useClientsCampaingss(userr?.role === "admin" ? "all" : user?.email)
  console.log(onlyClientEmails,clientsCampaingss);

  const [MyEmployeePayment] = useMyEmployeePayments(
    userr?.role === "admin" ? "all" : user?.email
  );
  


  
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayClients = onlyClientEmails?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  const weeklyClients = onlyClientEmails?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  const monthlyClients = onlyClientEmails?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });

  const todayCamClients = clientsCampaingss?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate.toDateString() === today.toDateString();
  });

  const weeklyCamClients = clientsCampaingss?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfWeek && clientDate <= today;
  });

  const monthlCamyClients = clientsCampaingss?.filter(client => {
    const clientDate = new Date(client.date);
    return clientDate >= startOfMonth && clientDate <= today;
  });


  const todayTotal = clientsPayments
  ?.flatMap(client => client.payments) // Flatten all payments into a single array
  ?.filter(payment => {
    const paymentDate = new Date(payment?.date); // Ensure `payment.date` exists and is a valid date
    return paymentDate.toDateString() === today.toDateString();
  })
  .reduce((sum, payment) => sum + payment.amount, 0);

const weeklyTotal = clientsPayments
  ?.flatMap(client => client.payments) // Flatten all payments into a single array
  ?.filter(payment => {
    const paymentDate = new Date(payment?.date);
    return paymentDate >= startOfWeek && paymentDate <= today;
  })
  .reduce((sum, payment) => sum + payment.amount, 0);

const monthlyTotal = clientsPayments
  ?.flatMap(client => client.payments) // Flatten all payments into a single array
  ?.filter(payment => {
    const paymentDate = new Date(payment?.date);
    return paymentDate >= startOfMonth && paymentDate <= today;
  })
  .reduce((sum, payment) => sum + payment.amount, 0);
  /////////////////////////////////////////////////////////////////////////////////


  const [activity]=useActivity()

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

  const isInThisWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week
  
    return date >= startOfWeek && date <= endOfWeek; // Check if the date is in this week
  };
  

  const todayPayAmountTotal = MyEmployeePayment
  
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.toDateString() === today.toDateString(); // Filter only today's data
    })
    .filter(f=>f.status === 'Approved')
    .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0); // Sum the payAmount values
  

    const thisWeekPayAmountTotal = MyEmployeePayment
    .filter(payment => isInThisWeek(payment.date)) 
    .filter(f => f.status === 'Approved')
    .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0);
  

      const thisMonthPayAmountTotal = MyEmployeePayment
                  .filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear(); // Check if the payment is in the current month
             })
             .filter(f=>f.status === 'Approved')
           .reduce((acc, payment) => acc + parseFloat(payment.payAmount || 0), 0);

  return (

    <div>  

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
                    
                    <p>Last 7 days Income: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {weeklyTotal}
                       </span></p>
                    <p>Last 30 days Income: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {monthlyTotal}</span></p>
                 </div>
                      </div>
                     </div>

                

                     <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="bg-gray-800  mb-5   rounded-lg">
                    <h1 style={{ border: 'var(--border)' }} className="font-bold text-xl  rounded-t-lg border-gray-300 p-2 pl-4">Admin Payment</h1>
                      <div style={{ border: 'var(--border)' }} className="flex p-3  rounded-b-lg  justify-start gap-3 pl-4 items-center">
                      <p className="text-7xl">
                     
                      <BsCashCoin />
                  </p>

                   <div className="space-y-1">
                 
                   <p>Today Payments: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {todayPayAmountTotal}</span></p>
                    
                    <p>Last 7 days Payment: <span className="font-bold">
                    <span className="text-sm font-extrabold">৳</span> {thisWeekPayAmountTotal}
                       </span></p>
                    <p>Last 30 days Payment: <span className="font-bold"><span className="text-sm font-extrabold">৳</span> {thisMonthPayAmountTotal}</span></p>
                    
                 </div>

                      </div>
                      </div>


                       </div>

                         {/* //////////////////bar chart///////////////////////// */}
                        <div className="p-5 rounded-lg mb-5" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }}>
                        <h2 style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)',  }} className=" font-bold p-3">Admin Payment & Transaction Overview</h2>

                     <LineChart MyEmployeePayment={MyEmployeePayment} tPay={clientsPayments}></LineChart>
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
      <Bar data={data5} options={options4} />
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
                    
                    <p>Last 7 days Order: <span className="font-bold">
                    <span className="text-sm font-extrabold"></span> {weeklyClients.length}
                       </span></p>
                    <p>Last 30 days Order: <span className="font-bold"><span className="text-sm font-extrabold"></span> {monthlyClients.length}</span></p>
                    
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
                    
                    <p>Last 7 days Campaigns: <span className="font-bold">
                    <span className="text-sm font-extrabold"></span> {weeklyCamClients.length}
                       </span></p>
                    <p>Last 30 days Campaigns: <span className="font-bold"><span className="text-sm font-extrabold"></span> {monthlCamyClients.length}</span></p>
                  
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
          {activity.map((a) => (
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
export default AdminHome;
