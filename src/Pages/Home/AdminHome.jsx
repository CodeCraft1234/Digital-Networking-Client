import { Helmet } from "react-helmet-async";
import { BsCashCoin} from "react-icons/bs";
import { TbReorder, TbWorldWww } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdAccountCircle, MdCampaign, MdHomeRepairService, MdOutlinePayments, MdOutlineSummarize } from "react-icons/md";
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
import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useUserr from "../../Hook/useUser";
import useMyActivity from "../../Hook/useMyActivity";
import { Link } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaHistory, FaMoneyCheckAlt, FaPaintBrush, FaStickyNote, FaUserCog } from "react-icons/fa";
import { IoMdCash } from "react-icons/io";
import { CiBank } from "react-icons/ci";
import { ArrowDownCircle, Bell, Menu, RefreshCcw } from "lucide-react";
import useClientsPaymentsPage from "../../Hook/useClientPaymentsPage";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [myActivity]=useMyActivity(userr?.role === 'admin' ? 'all' : user?.email)
  console.log(myActivity);
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


  const services = [
    { title: 'অ্যাডস একাউন্ট', icon: <MdAccountCircle className="text-3xl drop-shadow-md" />, link: '/adsAccount' },
    { title: 'সার্ভিস', icon: <MdHomeRepairService className="text-3xl drop-shadow-md" />, link: '/services' },
    { title: 'ক্যাম্পেইন', icon: <MdCampaign className="text-3xl drop-shadow-md" />, link: '/campaigns' },
    { title: 'ক্লায়েন্ট', icon: <FaPeopleGroup className="text-3xl drop-shadow-md" />, link: '/clients' },
    { title: 'ব্যয়', icon: <FaHistory className="text-3xl drop-shadow-md" />, link: '/monthlySpend' },
    { title: 'বেতন', icon: <IoMdCash className="text-3xl drop-shadow-md" />, link: '/salary' },
    { title: 'সারাংশ', icon: <MdOutlineSummarize className="text-3xl drop-shadow-md" />, link: '/summery' },
    { title: 'পেমেন্ট', icon: <MdOutlinePayments className="text-3xl drop-shadow-md" />, link: '/allPayments' },
    { title: 'ইউজার', icon: <FaUserCog className="text-3xl drop-shadow-md" />, link: '/allUsers' },
    { title: 'নোটিশ', icon: <FaStickyNote className="text-3xl drop-shadow-md" />, link: '/noticePad' },
    { title: 'ইনভয়েস', icon: <FaMoneyCheckAlt className="text-3xl drop-shadow-md" />, link: '/invoice' },
    { title: 'ব্যাংক', icon: <CiBank className="text-3xl drop-shadow-md" />, link: '/bankInfo' },
  ];


  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`acti${user?.email}`) || "all" 
  : localStorage.getItem(`acti${user?.email}`) || user?.email; 

const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab3 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem(`acti${user?.email}`, tab); // Update localStorage
  };

  const AxiosPublic = UseAxiosPublic();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const initialTab = localStorage.getItem("activeTabclientpayMont") || new Date().getMonth() + 1;
  const [sortMonth, setSortMonth] = useState(initialTab);
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTabclientpayMont", tab);
  };
  

  const [currentPage, setCurrentPage] = useState(1);
      const [selectedStatus2, setSelectedStatus2] = useState('all');
    


      const {
        clientPayments,
        totalItems,
        totalPages,
        refetch
      } = useClientsPaymentsPage(
        selectedEmployee3,
        selectedCategory || 'all',
        currentPage,
        sortMonth,
        selectedYear,
        userr,
        selectedStatus2
      );

    // Sort payments by date (assuming payments have a 'date' property)
    const latestPayment = clientPayments
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Get the latest payment


    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' ' + d.toLocaleDateString('en-GB');
    };
    
    console.log(clientPayments);

    const [isRefreshing, setIsRefreshing] = useState(false);


    const handleRefresh = async () => {
      setIsRefreshing(true);     // Start animation
      await refetch();           // Call refetch
      setTimeout(() => {
        setIsRefreshing(false);  // Stop animation after a short delay
      }, 800);                   // Adjust timing as needed
    };
    

  return (

    <div className="lg:my-5 mb-5 lg:mt-0">  

      <Helmet>
        <title> Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

      <div className="hidden lg:block">
      <div className="grid lg:grid-cols-3 lg:gap-5">

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

              </div>

             <div className="grid  lg:grid-cols-6 gap-5 ">

                        

<div className="lg:col-span-4 bg-white admin-payment-overview p-5 rounded-lg" style={{  color: 'var(--text-color2)', border: 'var(--border)' }}>
<h2 className="font-bold p-3" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)' }}>
Admin Payment & Transaction Overview
  </h2>
 <LineChart data={clientHomePage}  />
</div>

<div className="lg:col-span-2">
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
<TbReorder className="icon-home" />
<div className="info-home">
<p>Today Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(todayCampaigns || 0)}</span></p>
<p>Last 7 days Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisWeekCampaigns || 0)}</span></p>
<p>Last 30 days Orders: <span className="amount-home">{new Intl.NumberFormat('en-IN').format(thisMonthCampaigns || 0)}</span></p>
</div>
</div>
</div>
</div>
               </div>

               <div className="grid lg:grid-cols-6 gap-5 min-h-screen items-stretch">
  {/* Left div */}
  <div className="lg:col-span-4  flex flex-col h-full">
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 flex-grow">
      <div className="chart-card-home">
        <PieChart data27={data27} options27={options27} />
      </div>

      <div className="chart-card-home">
        <RadarChart data3={data3} options3={options3} />
      </div>

      <div
        style={{
         
          color: 'var(--text-color2)',
          border: 'var(--border)',
        }}
        className="bg-white rounded-lg p-5 chart-card-home"
      >
        <h1 className="font-bold text-xl rounded-t-lg border-gray-300 ">
          Salary Overview
        </h1>
        <Bar data={data5} options={options4} />
      </div>

      <div
        style={{
         
          color: 'var(--text-color2)',
          border: 'var(--border)',
        }}
        className="bg-white  rounded-lg p-5 chart-card-home"
      >
        <h1 className="font-bold text-xl rounded-t-lg border-gray-300 pb-3">
          Campaign Overview
        </h1>
        <Bar data={data5} options={options5} />
      </div>
    </div>
  </div>

  {/* Right div */}
  <div className="lg:col-span-2 bg-white text-black border border-gray-500 rounded-xl flex flex-col h-full">
    <h1
    
      className="font-bold text-xl rounded-t-lg border-gray-300 p-4"
    >
      Activity Log
    </h1>
    <div
      style={{
        width: "100%",
        maxHeight: "900px",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
      className="scrollbar-hide p-4 flex-grow"
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
                        <p>
                          {isNaN(new Date(item.date))
                            ? "Invalid date"
                            : formatDistanceToNow(new Date(item.date), {
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


      <div className="lg:hidden block fixed top-0 overflow-hidden">
  {/* Header */}
  <section className="bg-[#0B3A84] text-white px-4 py-3 flex justify-between items-center">
    {/* Left: Logo */}
    <img
      src="https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"
      alt="logo"
      className="h-6"
    />

    {/* Right: Notification + Menu */}
    <div className="flex items-center gap-4">
      <Bell className="w-5 h-5" />
      <Menu className="w-5 h-5" />
    </div>
  </section>

  {/* User Info Bar */}
  <div className="bg-[#0B3A84] text-white px-4 py-3 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <img
        src={user?.photoURL || "https://i.ibb.co.com/20gdNM8h/Digital-Network-White-1.png"}
        alt="profile"
        className="h-10 w-10 rounded-full object-cover border-2 border-white"
      />
      <div>
        <p className="font-semibold text-sm">{user?.displayName || "User Name"}</p>
      </div>
    </div>
    <button className="bg-yellow-400 text-black text-sm px-4 py-1 rounded-full font-bold">
      ৳ Balance
    </button>
  </div>


  {/* Service Section */}
  <div className="bg-[#F5F5F5] min-h-screen px-4 pt-4 ">

  <div className="bg-white rounded-md shadow-sm overflow-hidden border">
  {/* Header */}
  <div className="flex justify-between items-center px-4 py-2 border-b">
  <div
  className="flex items-center gap-1 text-gray-800 font-semibold text-sm cursor-pointer"
  onClick={handleRefresh}
>
  <span>সর্বশেষ লেনদেন</span>
  <RefreshCcw
    className={`h-4 w-4 text-pink-500 transition-transform duration-500 ${
      isRefreshing ? "animate-spin" : ""
    }`}
  />
</div>

    <Link to={'/allPayments'} className="text-pink-600 text-sm font-semibold hover:underline">
      সবগুলো দেখুন
    </Link>
  </div>

  {/* Latest Transaction */}
  {latestPayment ? (
    <div className="flex justify-between items-center px-4 py-3">
      {/* Left Icon and Text */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-600 rounded-full p-1">
          <ArrowDownCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-gray-800 text-sm font-semibold">{latestPayment?.clientName}</p>
          <div className="flex items-center justify-end space-x-2 mt-2">
                {(() => {
                  const logo = [
                    { method: "bkashMarchent", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
                    { method: "bkashPersonal", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
                    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png" },
                    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
                    { method: "nagadMarchent", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
                    { method: "DBBLBank", src: "https://i.ibb.co/nnN8KW0/DBBL.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
                    { method: "IBBLBank", src: "https://i.ibb.co/pnS6nt4/IBBLBank.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
                    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", width: "w-10 sm:w-12", height: "h-8 sm:h-10" },
                  ].find((item) => item.method === latestPayment?.paymentMethod);

                  if (!logo) return null;

                  return (
                    <>
                      <img
                        src={logo.src}
                        alt={latestPayment?.paymentMethod}
                        className={`${logo.width || "w-12"} ${logo.height || "h-6"} object-contain`}
                      />
                    
                    </>
                  );
                })()}
              </div>
        </div>
      </div>

      {/* Right Amount and Time */}
      <div className="text-right">
        <p className="text-emerald-600 text-sm font-semibold">
          + ৳{latestPayment.amount.toFixed(2)}
        </p>
        <p className="text-gray-500 text-xs">
          {formatDate(latestPayment.date)}
        </p>
      </div>
    </div>
  ) : (
    <p className="px-4 py-3 text-gray-500 text-sm">No payment data available</p>
  )}
</div>


    <h2 className="text-lg mt-5 font-semibold mb-4 text-[#0B3A84]">সার্ভিস সমূহ</h2>

    <div className="space-y-4">
      {[0, 1, 2].map((rowIndex) => (
        <div
          key={rowIndex}
          className="bg-white rounded-xl shadow p-4 border border-gray-200"
        >
          <div className="grid grid-cols-4 gap-4">
            {services.slice(rowIndex * 4, (rowIndex + 1) * 4).map((service, idx) => (
              <Link
                to={service.link}
                key={idx}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-[#EAF1FF] text-[#0B3A84] w-12 h-12 rounded-full flex items-center justify-center shadow-inner text-xl">
                  {service.icon}
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-700">{service.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>



    

     </div>
  );
};
export default AdminHome;
