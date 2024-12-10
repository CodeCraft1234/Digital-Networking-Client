import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";
import useMySalaryPayments from "../../Hook/useMySalaryPayment";
import useUserr2 from "../../Hook/useUser2";

const SalaryPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [users]=useUsers()
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("ac") || "all" 
  : localStorage.getItem("ac") || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);
  const {userr2}=useUserr2(selectedEmployee3)

  const changeTab2 = (tab) => {
    setSelectedEmployee3(tab); 
    localStorage.setItem("ac", tab); 
  };

  const [MySalaryPayment,refetch]=useMySalaryPayments(selectedEmployee3)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const AxiosPublic=UseAxiosPublic()
  const [selectedDate, setSelectedDate] = useState("");

  const initialTab = localStorage.getItem("activeTaballClientspayss") ;
  const [sortMonth, setSortMonth] = useState(initialTab); 
  
  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballClientspayss", tab); 
  };

  const initialStatus = localStorage.getItem("activeTabSelectedStatuss") || 'All';
  const [selectedStatus2, setSelectedStatus2] = useState(initialStatus);

  const changeTab3 = (tab) => {
    setSelectedStatus2(tab);
    localStorage.setItem("activeTabSelectedStatuss", tab);
  };

  useEffect(() => {
    const filtered = MySalaryPayment.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&

        (selectedCategory === 'All' || selectedCategory === '' || payment.paymentMethod === selectedCategory) &&
        
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedCategory, 
    MySalaryPayment,
    selectedStatus2,
    selectedYear,
  ]);

  useEffect(() => {
    const filtered = MySalaryPayment.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData2(filtered);
  }, [
    sortMonth,
    selectedCategory, 
    MySalaryPayment,
    selectedStatus2,
    selectedYear,
  ]);
  
  const [nagadPersonal, setNagadPersonalTotal] = useState(0);
  const [bkashPersonal, setBkashPersonalTotal] = useState(0);
  const [rocketPersonal, setRocketPersonalTotal] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);
  const [IBBLBankTotal, setIBBLBankTotal] = useState(0);
  const [DBBLBankTotal, setDBBLBankTotal] = useState(0);

  useEffect(() => {
    const filtered = filteredData2; 

    const filter3 = filtered.filter(d => d.paymentMethod === 'nagadPersonal');
    const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setNagadPersonalTotal(total3);

    const filter4 = filtered.filter(d => d.paymentMethod === 'bkashPersonal');
    const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBkashPersonalTotal(total4);

    const filter5 = filtered.filter(d => d.paymentMethod === 'rocketPersonal');
    const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setRocketPersonalTotal(total5);

    const filter6 = filtered.filter(d => d.paymentMethod === 'bank');
    const total6 = filter6.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setBankTotal(total6);

    const filter8 = filtered.filter(d => d.paymentMethod === 'IBBLBank');
    const total8 = filter8.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setIBBLBankTotal(total8);

    const filter9 = filtered.filter(d => d.paymentMethod === 'DBBLBank');
    const total9 = filter9.reduce((acc, datas) => acc + parseFloat(datas.payAmount), 0);
    setDBBLBankTotal(total9);

  }, [filteredData2]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const displayedItems = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, currentPage * itemsPerPage);
  const isMoreItems = currentPage * itemsPerPage < filteredData.length;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleUpdatePayment = (e, id, payment) => {
    e.preventDefault();
  
    const payAmount = parseFloat(e.target.payAmount.value);
    const date = e.target.date.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const status = 'pending';
    const updatedPaymentData = { status, note, payAmount, date, paymentMethod };

    const previousAmount = payment.payAmount; 

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.patch(`/salaryPayment/${id}`,
      updatedPaymentData
    )
    .then(() => {
      refetch();
      document.getElementById(`modal_${id}`).close();
      toast.success("Updated successful!");

      AxiosPublic.post("/activity", datas).then(() => {
      });
  
      AxiosPublic.post('/editNotification', {
          ppayAmount: previousAmount,
          pdate: payment.date,
          pnote: payment.note,
          ppaymentMethod: payment.paymentMethod,
          pstatus: payment.status,
    
          editDate:new Date(),
          name:user?.displayName,
          photo:user?.photoURL,
          email:user?.email,
          message : `The payment of ৳${previousAmount} via ${payment.paymentMethod} has been updated to ৳${payAmount} using ${paymentMethod}.`,

    
          note,
          payAmount,
          date,
          paymentMethod
        
      })
      .then(() => {
        console.log("Edit notification sent successfully!");
      })
      .catch(err => console.error("Error sending edit notification:", err));
    })
    .catch(err => console.error("Error updating payment:", err));
  };
  
  const handleDelete = (id, note, paymentMethod, charge, payAmount, date) => {

    const datas = {
      title: `Deleted ${payAmount} from ${paymentMethod} `,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        AxiosPublic.delete(`/salaryPayment/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
            AxiosPublic.post("/activity", datas).then(() => {
            });
            AxiosPublic.post('/notification', {
              type: 'delete',
              paymentId: id,
              note,
              paymentMethod,
              charge,
              payAmount,
              date,
              deleteDate:new Date(),
              name:user.displayName,
              photo:user?.photoURL,
              email:user?.email,
              message: `Payment of ৳${payAmount} by ${paymentMethod} was deleted.`
            })
            .then(() => {
           
            })
            .catch((error) => {
              toast.error("Failed to create notification.");
            });
          })
          .catch((error) => {
            toast.error("Failed to delete. Please try again.");
          });
      }
    });
  };

  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };
  
    AxiosPublic.patch(`/salaryPayment/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };

  return (
    <div className="m-5">
      <ToastContainer />
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }} className="grid grid-cols-2 p-5 rounded-lg sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5 lg:grid-cols-6 px-5">
  {[
    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', amount: bankTotal, bgColor: '#f2f2f2' },
    { category: 'DBBLBank', img: 'https://i.ibb.co.com/nnN8KW0/DBBL.png', amount: DBBLBankTotal, bgColor: '#f2f2f2' },
    { category: 'IBBLBank', img: 'https://i.ibb.co.com/yfMSDcd/IBBL.png', amount: IBBLBankTotal, bgColor: '#f2f2f2' },
    { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', amount: bkashPersonal, bgColor: '#ffe6f7' },
    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', amount: nagadPersonal, bgColor: '#fff2cc' },
    // { category: 'rocketPersonal', img: 'https://i.ibb.co/QkTM4M3/rocket.png', amount: rocketPersonal, bgColor: '#e0f7fa' },
    
  ].map(({ category, img, amount, bgColor }) => (
    <div key={category} onClick={() => setSelectedCategory(category)} style={{ backgroundColor: bgColor, border: 'var(--border)' }} className="balance-card bg-white rounded-2xl shadow-lg p-5 text-center transition-transform hover:scale-105 border-0">
      <img className="balance-card-img mx-auto h-16" src={img} alt={category} />
      <p className="balance-card-text text-lg lg:text-2xl font-bold text-gray-700">
        <span className="text-lg lg:text-2xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(amount)}
      </p>
    </div>
  ))}

  <div style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} onClick={() => setSelectedCategory('All')} className="balance-card bg-white  rounded-2xl shadow-lg p-5 text-center transition-transform hover:scale-105 border-0">
    <h1 className=" font-bold mt-3 text-2xl text-black">
      <p className="mb-5">Total</p> <span className="text-lg lg:text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(bkashPersonal + DBBLBankTotal + IBBLBankTotal + rocketPersonal +  nagadPersonal  +  bankTotal)}
    </h1>
    {/* <h1 className="text-xl font-bold mt-2 text-red-800">
       <span className="text-lg lg:text-xl font-extrabold">৳</span> {new Intl.NumberFormat('en-IN').format(filteredData2.reduce((acc, item) => acc + (isNaN(parseFloat(item?.charge)) ? 0 : parseFloat(item?.charge)), 0))}
    </h1> */}
  </div>
</div>




     <div className=" my-5 rounded-md pb-5" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
     <div className="flex flex-col md:flex-row justify-start lg:justify-between items-center gap-5 lg:px-5 lg:p-0 px-5">
<div className="flex justify-start">
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

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="flex mt-2 lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">

        <div className="w-full lg:w-auto flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
      <select
        style={{
          backgroundColor: "var(--bg-color2)",
          border: "var(--border)",
          color: "var(--text-color2)",
        }}
        className="border bg-white text-black py-2 lg:w-auto w-full border-gray-400 rounded px-2"
        value={selectedEmployee3}
        onChange={(e) => changeTab2(e.target.value)}
      >
        <option value="all">All Employees</option>
        {users
          .filter((u) => ["employee", "graphicDesign", "webDeveloper","staf"].includes(u.role))
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  ) : (
   <></>
  )}
</div>
      

        <input
    style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
    type="date"
    className="border bg-green-300 text-black border-gray-400 rounded p-2 mt-1"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />
       
          <div className="flex lg:mt-1 justify-center text-center items-center">
            <select
            style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
              className=" w-full  mt-1  lg:my-5  t rounded-md p-2 "
              value={sortMonth}
              onChange={(e) => changeTab(e.target.value)}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className=" lg:flex text-black justify-center items-center">
        <select
        style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className=" rounded-md p-2 mt-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="flex  justify-center text-center items-center">

<select
 style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
  className="border bg-white w-full     text-black border-gray-400 rounded p-2 mt-1 "
  value={selectedStatus2}
  onChange={(e) => changeTab3(e.target.value)}
>
  <option value="All">All Status</option>
  <option value="pending">Pending</option>
  <option value="Approved">Approved</option>
 
</select>
</div>
        </div>
      
      </div>

        </div>



<div  className="overflow-x-auto  rounded-xl mx-5 text-center " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full  text-center ">
            <thead className=" ">
              <tr className="" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
              <th style={{  border: 'var(--border)'}} className="p-3 ">{displayedItems.length}</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Date</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Employee Name</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Amount</th>
              {/* <th style={{  border: 'var(--border)'}} className="p-3">Charge</th> */}
              <th style={{  border: 'var(--border)'}} className="p-3">Payment Method</th>
              <th style={{  border: 'var(--border)'}} className="p-3"> Note</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Status</th>
             
            </tr>
          </thead>
          <tbody>
            {displayedItems?.map((payment, index) => (
               <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
               key={payment._id}
               className={`${
                 index % 2 === 0
                   ? "bg-white text-left text-black border-b border-opacity-20"
                   : "bg-gray-200  text-left text-black border-b border-opacity-20"
               }`}
             >
                <td style={{  border: 'var(--border)'}} className="p-3  border-r-2 border-l-2 border-gray-200 text-center">
                <div className="flex justify-center items-center gap-3 ">
                <button
                    className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
                    onClick={() => handleDelete(payment._id,payment?.note,payment.paymentMethod,payment?.charge,payment?.payAmount,payment.date)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>
                 <button
                  className=" flex justify-center text-xl items-center gap-1   px-2 py-1 rounded"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                    <FaEdit />
                  </button>
                  <dialog id={`modal_${payment._id}`} className="modal">
                    <div className="modal-box bg-white text-black font-bold">
                    <form onSubmit={(e) => handleUpdatePayment(e, payment._id, payment)}>

                        <div className="mb-4">
                          <h1
                            className=" text-black flex hover:text-red-500  justify-end  text-end"
                            onClick={() =>
                              document
                                .getElementById(`modal_${payment._id}`)
                                .close()
                            }
                          >
                            <ImCross />
                          </h1>
                          <label className="block text-black text-xl font-bold">
                            {" "}
                           Edit Admin Pay Amount
                          </label>
                          
                        </div>
                        <div className="mb-4">
                          <label className="block text-left text-gray-700"> Date</label>
                          <input
                            type="date"
                            defaultValue={payment.date}
                            name="date"
                            className="w-full border bg-green-200 border-black rounded p-2 mt-1"
                          />
                        </div>

                       <div className="grid grid-cols-2 gap-3">
                       <div className="mb-4">
                          <label className="block text-left text-gray-700">
                            {" "}
                            New Amount
                          </label>
                          <input
                            required
                            type="number"
                            name="payAmount"
                            defaultValue={payment?.payAmount}
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
              defaultValue={payment?.charge}
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
                       </div>

                        

                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Method</label>
                          <select
                            required
                            name="paymentMethod"
                            defaultValue={payment.paymentMethod}
                            className="w-full border bg-white border-black rounded p-2 mt-1"
                          >
                            <option value="bank">Brack Bank</option>
                            <option value="IBBLbank">Islami Bank</option>
                            <option value="DBBLBank">DBBL Bank</option>

                            <option value="bkashPersonal">
                              bKash 
                            </option>
                            <option value="nagadPersonal">
                              Nagad 
                            </option> 
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="block text-left text-gray-700">Note</label>
                          <input
                            required
                            type="text"
                            name="note"
                            defaultValue={payment?.note}
                            className="w-full border bg-white border-black rounded p-2 mt-1"
                          />
                        </div>

                        <div className="modal-action grid grid-cols-2 gap-3 mt-4">
                          <button
                            type="button"
                            className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white"
                            onClick={() =>
                              document
                                .getElementById(`modal_${payment._id}`)
                                .close()
                            }
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded-lg text-white"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </dialog>
                  
                 </div>
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {payment.employeeName}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.payAmount}
                </td>
                {/* <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  ৳ {payment.charge || 0}
                </td> */}

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                 
                  {payment.paymentMethod === "bkashPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/f8LcKV0/bKash.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "rocketPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/QkTM4M3/rocket.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "nagadPersonal" && (
                    <img
                      className="h-10 w-24 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/JQBQBcF/nagad-marchant.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "DBBLBank" && (
                    <img
                      className="h-10 w-32 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/nnN8KW0/DBBL.png"
                      alt=""
                    />
                  )}
                  {payment.paymentMethod === "IBBLBank" && (
                    <img
                      className="h-10 w-32 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co.com/yfMSDcd/IBBL.png"
                      alt=""
                    />
                  )}
                  
                  {payment.paymentMethod === "bank" && (
                    <img
                      className="h-12 w-13 flex my-auto items-center mx-auto justify-center"
                      src="https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png"
                      alt=""
                    />
                  )}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {" "}
                  {payment.note}
                </td>
            
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={payment.status !== "pending"}
    onChange={() => {
      const newStatus = payment.status !== "pending" ? "pending" : "Approved";
      handleUpdate2(payment._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      payment.status !== "pending" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        payment.status !== "pending" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
</td>
              </tr>
            ))}
            <tr style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" font-bold">
              <td></td>
              <td></td>
              <td style={{  border: 'var(--border)'}} className="p-3 text-right" >
                Total :
              </td>

              <td style={{ border: 'var(--border)' }} className="p-3 text-center">
  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // To ensure two decimal places if required
  }).format(
    bkashPersonal + nagadPersonal + bankTotal + DBBLBankTotal + IBBLBankTotal + rocketPersonal
  )}
              </td>
               {/* <td className="p-3 text-center">
  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // Ensure consistency in decimals
  }).format(
    displayedItems.reduce((acc, item) => acc + (isNaN(parseFloat(item?.charge)) ? 0 : parseFloat(item?.charge)), 0)
  )}
              </td> */}


              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
          
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default SalaryPayments;
