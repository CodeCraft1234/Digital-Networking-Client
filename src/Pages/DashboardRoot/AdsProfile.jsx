import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { useLoaderData, useParams } from 'react-router-dom';
import useAdsAccountCenter from '../../Hook/useAdsAccountCenter';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Helmet } from 'react-helmet-async';
import useAdsPayment from '../../Hook/useAdsPayment';
import AdsUserPayments from './AdsUserPayments';
import AdsUserAdsAccount from './AdsUserAdsAccount';
import ContributorHistory from './ContributorHistory';
import ContributorSummery from './ContributorSummery';


const AdsProfile = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    console.log(ddd);
    const {email}=useParams()
    console.log(email);
  
    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user,email]);
  
    
  
    const [adsAccountCenter, refetch] = useAdsAccountCenter();
    const [adsAccounts, setAdsAccounts] = useState([]);
  
    useEffect(() => {
      const filterdata = adsAccountCenter.filter((m) => m.employeeEmail === email);
      console.log(filterdata);
      setAdsAccounts(filterdata);
  
    }, [adsAccountCenter, user?.email]);
  
    const handleAddAdsAcount = (e) => {
      e.preventDefault();
      const accountName = e.target.accountName.value;
      const paymentDate = e.target.paymentDate.value;
      const employeeEmail = email;
      const employeerName = ddd?.name;
      const currentBallence=0
      const threshold=0
      const totalSpent=0
      const dollerRate=125
      const status='Active'
  
  
      const data = { accountName,dollerRate,totalSpent,currentBallence,threshold, paymentDate,status, employeeEmail,employeerName };
  
      AxiosPublic.post("/adsAccountCenter", data).then((res) => {
        console.log(res.data);
        // toast.success("add successful");
        refetch()
        
      });
    };
  
  const AxiosPublic=UseAxiosPublic()
  
  const [currentTotal,setCurrentTotal]=useState(0)
  const [tSpent,setthreshold]=useState(0)
   const [TSpent,setTSpent]=useState(0)
  
  useEffect(() => {
   
    const total = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.currentBallence),
      0
    );
    setCurrentTotal(total);
  
    const totalBill = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.threshold),
      0
    );
    setthreshold(totalBill);
  
    const totalBilll = adsAccounts.reduce(
      (acc, campaign) => acc + parseFloat(campaign.totalSpent),
      0
    );
    setTSpent(totalBilll);
  
  }, [adsAccounts]);
  
  const [modalData, setModalData] = useState(null);
  const handleUpdate = (e, id) => {
    e.preventDefault();
    const accountName = e.target.accountName.value;
    const currentBallence = e.target.currentBallence.value;
    const threshold = e.target.threshold.value;
    const totalSpent = e.target.totalSpent.value;
    const dollerRate = e.target.dollerRate.value;
    const status = e.target.status.value;
    const paymentDate = e.target.paymentDate.value;
    const body = { accountName,currentBallence,paymentDate,dollerRate, threshold, totalSpent, status };
    AxiosPublic.patch(`/adsAccountCenter/${id}`,body
    )
      .then((res) => {
        console.log(res.body);
        refetch();
        Swal.fire({
          title: "Good job!",
          text: "Add Account success!",
          icon: "success",
        });
  
        setModalData(null);
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add account!",
        });
      });
  };


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete blog",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/adsAccountCenter/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };


  const [adsPayment] = useAdsPayment();


  const [payment, setPayment] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [sortMonth, setSortMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [totalPayment, setTotalPayment] = useState(0);
  useEffect(() => {
    const realdata = adsPayment.filter(
      (m) => m.employeeEmail === email
    );
    setPayment(realdata);
    const totalBill = realdata.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [adsPayment, email]);


  useEffect(() => {
    if (payment) {
      setFilteredClients(payment);
    }
  }, [payment]);

  useEffect(() => {
    let filtered = payment;

    if (selectedEmployee) {
      filtered = filtered.filter((c) => c.employeeEmail === selectedEmployee);
    }

    if (sortMonth !== "") {
      filtered = filtered.filter((c) => {
        const month = new Date(c.date).getMonth() + 1;
        return month === parseInt(sortMonth);
      });
    }

    if (selectedDate) {
      filtered = filtered.filter((c) => {
        const paymentDate = new Date(c.date);
        const selected = new Date(selectedDate);
        return (
          paymentDate.getDate() === selected.getDate() &&
          paymentDate.getMonth() === selected.getMonth() &&
          paymentDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    setFilteredClients(filtered);
  }, [selectedEmployee, sortMonth, selectedDate, adsPayment]);

  const filteredItems = filteredClients.filter((item) =>
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.paymentMethod.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  useEffect(() => {
    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.payAmount),
      0
    );
    setTotalPayment(totalBill);
  }, [filteredByCategory]);



  const [userdata,setUserData]=useState()
  console.log(userdata);

  useEffect(()=>{
    const finder=users.find(use=>use.email === user?.email)
    setUserData(finder)
  },[users,user?.email])

  const handlePayment =async (e) => {
    e.preventDefault();
    const employeeName=user?.displayName
    const employeeEmail = email;
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

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/adsPayment",
      data
    )
      .then((res) => {
        refetch();

      })


      const fields = {
        bkashMarchent: (userdata.bkashMarchent || 0) - payAmount,
        bkashPersonal: (userdata.bkashPersonal || 0) - payAmount,
        nagadPersonal: (userdata.nagadPersonal || 0) - payAmount,
        rocketPersonal: (userdata.rocketPersonal || 0) - payAmount,
      };
    
      if (!fields[paymentMethod]) {
        console.error("Invalid payment method");
        return;
      }
    
      const body2 = { [paymentMethod]: fields[paymentMethod] };
    
      try {
        const res = await axios.put(`https://digital-networking-server.vercel.app/users/${paymentMethod}/${userdata._id}`, body2);
        console.log(res.data);
        refetch();  // Make sure this function correctly refetches the updated data
      } catch (error) {
        console.error("Error updating account:", error);
      }
  };



  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };


  const [userss,setUser]=useState([])
  console.log(userss?.email)
  useEffect(()=>{
    const filtered=users.find(e=>e.email === user?.email) 
    console.log('sdahjgj',filtered)
    setUser(filtered)
  },[users,user])

  const userr=useLoaderData()
  console.log(userr)
 const [data,setData]=useState([])
  console.log(data)

    useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
      .then(res=>{
        console.log(res.data)
        setData(res.data)
      })
    },[])

    const [totalPayment2, setTotalPayment2] = useState(0);
    const [TSpent2, setTSpent2] = useState(0);
    const [totalBill, setTotalBill] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
  
    useEffect(() => {
      if (user) {
        const realdata = adsPayment.filter(
          (m) => m.employeeEmail === email
        );
        const totalBill = realdata.reduce(
          (acc, campaign) => acc + parseFloat(campaign.payAmount || 0),
          0
        );
        setTotalPayment2(totalBill);
      }
    }, [adsPayment, user]);
  
  
    useEffect(() => {
      const totalSpent = adsAccounts.reduce(
        (acc, campaign) => acc + parseFloat(campaign.totalSpent || 0),
        0
      );
      setTSpent2(totalSpent);
  
      const totalDollarRate = adsAccounts.reduce(
        (acc, campaign) => acc + parseFloat(campaign.dollerRate), // Convert string to number and add to accumulator
        0 
      );
      
      const averageDollarRate = adsAccounts.length ? totalDollarRate / adsAccounts.length : 0;
  
      const totalBill = totalSpent * averageDollarRate;
      setTotalBill(totalBill);
  
      const totalDue = totalBill - totalPayment;
      setTotalDue(totalDue);
  
    }, [adsAccounts, totalPayment]);
    

    const [activeTab, setActiveTab] = useState('payment'); // Default to 'userAdAccount'
    const getButtonClass = (tab) => 
      `px-1 py-2 rounded ${activeTab === tab ? ' text-blue-700 font-bold' : ' text-black font-md'}`;
  
    return (
        <div className='my-5'>
          
        <div className=" p-4 dark:text-green-800">
        <Helmet>
         <title>Ads user profile | Digital Network </title>
         <link rel="canonical" href="https://www.example.com/" />
       </Helmet>

       <div className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto w-20 h-20 lg:w-32 lg:h-32" 
          src={ddd?.photo} 
          alt="" 
        />
        <h1 className="lg:text-4xl mt-4 text-black sm:text-2xl md:text-3xl font-bold text-center">
          {ddd?.name}
        </h1>
      </div>

       {/* <div className="grid lg:grid-cols-4 text-white grid-cols-2 gap-3 lg:gap-5 justify-around mt-5">
        <div className="px-5 py-10 rounded-2xl bg-[#c6e529] shadow-lg text-center">
          <h2 className="text-xl">Total Spent</h2>
          <p className="lg:text-4xl text-sm font-bold"> $ {TSpent2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] shadow-lg text-center">
          <h2 className="text-xl">Total Bill</h2>
          <p className="lg:text-4xl text-sm font-bold"> ৳ {totalBill.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] shadow-lg text-center">
          <h2 className="text-xl">Total Paid</h2>
          <p className="lg:text-4xl text-sm font-bold"> ৳ {totalPayment2.toFixed(2)}</p>
        </div>
        <div className="px-5 py-10 rounded-2xl bg-[#ce1a38] shadow-lg text-center">
          <h2 className="text-xl ">Total Due</h2>
          <p className=" lg:text-4xl text-sm font-bold"> ৳ {totalDue.toFixed(2)}</p>
        </div>
        </div> */}




      <div className="flex justify-center items-center gap-5 mt-5">
    
      <button 
          className={getButtonClass('payment')}
          onClick={() => setActiveTab('payment')}
        >
          Payment
        </button>
        <p className='text-2xl font-bold'>|</p>
        <button 
          className={getButtonClass('adsAccount')}
          onClick={() => setActiveTab('adsAccount')}
        >
          Ads Account
        </button>
        <p className='text-2xl font-bold'>|</p>
        <button 
          className={getButtonClass('history')}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <p className='text-2xl font-bold'>|</p>
        <button 
          className={getButtonClass('summery')}
          onClick={() => setActiveTab('summery')}
        >
          Summery
        </button>

      </div>

      {activeTab === 'payment' && <AdsUserPayments email={email} />}
      {activeTab === 'adsAccount' && <AdsUserAdsAccount email={email} />}
      {activeTab === 'history' && <ContributorHistory email={email} />}
      {activeTab === 'summery' && <ContributorSummery email={email} />}



   </div>

  

     
    </div>
    );
};

export default AdsProfile;