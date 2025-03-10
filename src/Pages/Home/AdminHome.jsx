import { Helmet } from "react-helmet-async";
import { BsCashCoin, BsCashStack } from "react-icons/bs";
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

import LineChart from "./LineChart";
import PieChart from "./PieChart";
import RadarChart from "./RaderChart";
import useClientHomePage from "../../Hook/useClientHomePage";
import { formatDistanceToNow } from "date-fns";
import useAllEmployee from "../../Hook/useAllEmployee";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";
import useMyActivity from "../../Hook/useMyActivity";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [myActivity]=useMyActivity(userr?.role === 'admin' ? 'all' : user?.email)
  const [clientHomePage]=useClientHomePage(userr?.role === 'admin' ? 'all' : user?.email)

  const todaySpend = clientHomePage.todaySpend
  const thisWeekSpend = clientHomePage.thisWeekSpend
  const thisMonthSpend = clientHomePage.thisMonthSpend
  const todayClients = clientHomePage.todayClients
  const thisWeekClients = clientHomePage.thisWeekClients
  const thisMonthClients = clientHomePage.thisMonthClients
  const todayCampaigns = clientHomePage.todayCampaigns
  const thisWeekCampaigns = clientHomePage.thisWeekCampaigns
  const thisMonthCampaigns = clientHomePage.thisMonthCampaigns
  const todayAdminPay = clientHomePage.todayAdminPay
  const thisWeekAdminPay = clientHomePage.thisWeekAdminPay
  const thisMonthAdminPay = clientHomePage.thisMonthAdminPay
  const todayTotal = clientHomePage.today
  const weeklyTotal = clientHomePage.thisWeek
  const monthlyTotal = clientHomePage.thisMonth

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
          todayClients, // Assuming these are arrays, we use .length for count
          thisWeekClients,
          thisMonthClients,
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
        label: "Spend (৳)", 
        data: [
          todaySpend,
          thisWeekSpend,
          thisMonthSpend,
        ],
        backgroundColor: ["#1abc9c", "#3498db", "#9b59b6"], 
        borderWidth: 1, 
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

    <div className="my-5 mb-5 lg:mt-0">  

      <Helmet>
        <title> Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

                <div className="grid  lg:grid-cols-6 gap-5">
                  {/* left div */}

                    <div  className="lg:col-span-4 ">  

                        <div className="">

                        <div className="grid lg:grid-cols-2 lg:gap-5">
  <div className="payment-card-home">
    <div className="card-body-home">
      <BsCashCoin className="icon-home" />
      <div className="info-home">
        <p>Today Income: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(todayTotal || 0)}</span></p>
        <p>Last 7 days Income: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(weeklyTotal || 0)}</span></p>
        <p>Last 30 days Income: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(monthlyTotal || 0)}</span></p>
      </div>
    </div>
  </div>

  <div className="payment-card-home">
    <div className="card-body-home">
      <BsCashCoin className="icon-home" />
      <div className="info-home">
        <p>Today Payments: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(todayAdminPay || 0)}</span></p>
        <p>Last 7 days Payment: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(thisWeekAdminPay || 0)}</span></p>
        <p>Last 30 days Payment: <span className="amount-home"><span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN').format(thisMonthAdminPay || 0)}</span></p>
      </div>
    </div>
  </div>
</div>


                         {/* //////////////////bar chart///////////////////////// */}

                         <div className="admin-payment-overview p-5 rounded-lg" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }}>
                         <h2 className="font-bold p-3" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)' }}>
                        Admin Payment & Transaction Overview
                           </h2>
                          <LineChart data={clientHomePage}  />
                         </div>

<div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
  <div className="chart-card-home">
    <PieChart data27={data27} options27={options27} />
  </div>

  <div className="chart-card-home">
    <RadarChart data3={data3} options3={options3} />
  </div>

  <div
    style={{
      backgroundColor: 'var(--bg-color3)',
      color: 'var(--text-color2)',
      border: 'var(--border)',
    }}
    className="bg-gray-800  rounded-lg p-5 chart-card-home"
  >
    <h1 className="font-bold text-xl rounded-t-lg border-gray-300 ">
      Salary Overview
    </h1>
    <Bar data={data5} options={options4} />
  </div>

  <div
    style={{
      backgroundColor: 'var(--bg-color3)',
      color: 'var(--text-color2)',
      border: 'var(--border)',
    }}
    className="bg-gray-800 rounded-lg p-5 chart-card-home"
  >
    <h1 className="font-bold text-xl rounded-t-lg border-gray-300 pb-3">
      Campaign Overview
    </h1>
    <Bar data={data5} options={options5} />
  </div>
</div>

                        </div>

                    </div>
                    {/* right div */}
                    <div  className="lg:col-span-2 ">
                 
                    <div className="income-card-home">
  <div className="card-body-home">
    <TbReorder className="icon-home" />
    <div className="info-home">
      <p>Today Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(todayCampaigns || 0)}</span></p>
      <p>Last 7 days Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisWeekCampaigns || 0)}</span></p>
      <p>Last 30 days Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisMonthCampaigns || 0)}</span></p>
    </div>
  </div>
</div>

<div className="income-card-home">
  <div className="card-body-home">
    <MdCampaign className="icon-home" />
    <div className="info-home">
      <p>Today Spend: <span className="amount-home"><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(todaySpend || 0)}</span></p>
      <p>Last 7 days Spend: <span className="amount-home"><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(thisWeekSpend || 0)}</span></p>
      <p>Last 30 days Spend: <span className="amount-home"><span className="amount-doller">$ </span> {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(thisMonthSpend || 0)}</span></p>
    </div>
  </div>
</div>

<div className="income-card-home">
  <div className="card-body-home">
    <RiMoneyDollarCircleLine className="icon-home" />
    <div className="info-home">
      <p>Today Clients: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(todayClients || 0)}</span></p>
      <p>Last 7 days Clients: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisWeekClients || 0)}</span></p>
      <p>Last 30 days Clients: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisMonthClients || 0)}</span></p>
    </div>
  </div>
</div>


                    <h1
    style={{
      backgroundColor: "var(--bg-color3)",
      color: "var(--text-color2)",
      border: "var(--border)",
    }}
    className="font-bold text-xl  rounded-t-lg border-gray-300 p-4"
  >
    Activity Log
  </h1>
                    <div
                    
  style={{
    backgroundColor: "var(--bg-color3)",
    color: "var(--text-color2)",
    border: "var(--border)",
    width: "100%",
    maxHeight: "900px",
    overflowY: "auto",
    scrollbarWidth: "none", // Hide scrollbar for Firefox
  }}
  className="scrollbar-hide p-4"
>

  <table className="w-full border-collapse">
    <tbody>
      {myActivity.map((item) => (
        <div
          key={item._id}
          style={{
            border: "var(--border)",
          }}
          className={`flex items-start justify-start gap-5 px-2 py-4 mb-4 rounded-xl cursor-pointer shadow-lg transition-colors hover:bg-blue-100 border-l-4 ${
            item.status === "read" ? "border-gray-200" : "border-yellow-500"
          }`}
        >
          <div>
            <div className="font-semibold">
              <div>
                <div className="flex justify-start items-center gap-2">
                  <img
                    className="h-10 w-10 object-cover rounded-full"
                    src={
                      item?.photo ||
                      "https://i.ibb.co/21YYSRT7/user-6380868-1280.webp"
                    }
                    alt={item?.user || "User"}
                  />
                  <div>
                    <div>
                      <p>
                        <span className="font-bold">{item.user}</span>{" "}
                        <span className="font-thin">{item.title}</span>
                      </p>
                    </div>
                    <p className="">
                      {isNaN(new Date(item.date || item.date))
                        ? "Invalid date"
                        : formatDistanceToNow(new Date(item.date || item.date), {
                            addSuffix: true,
                          })}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </tbody>
  </table>
</div>


                    </div>
               </div>  
     </div>
  );
};
export default AdminHome;
