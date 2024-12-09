import {  useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import usePayoneerData from "../../Hook/usePayoneerData";
import useUserr from "../../Hook/useUser";
import { AuthContext } from "../../Security/AuthProvider";
import usePayoneerEmail from "../../Hook/usePayoneerEmail";

const Payoneer = () => {
  const [payoneerData,refetch]=usePayoneerData()
  const [payoneerEmail]=usePayoneerEmail()
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const AxiosPublic=UseAxiosPublic()
  const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

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
  const initialStatus4 = localStorage.getItem("activeTabSelectedStatusse") || 'All';
  const [selectedStatus4, setSelectedStatus4] = useState(initialStatus4);

  const changeTab4 = (tab) => {
    setSelectedStatus4(tab);
    localStorage.setItem("activeTabSelectedStatusse", tab);
  };

  useEffect(() => {
    const filtered = payoneerData.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        (selectedStatus2 === 'All' || payment.status === selectedStatus2) &&
        (selectedStatus4 === 'All' || payment.payoneerEmail === selectedStatus4) &&
        (!sortMonth || paymentDate.getMonth() + 1 === parseInt(sortMonth)) &&
        (!selectedYear || paymentDate.getFullYear() === parseInt(selectedYear))
      );
    });
  
    setFilteredData(filtered);
  }, [
    sortMonth,
    selectedStatus4,
    payoneerData,
    selectedStatus2,
    selectedYear,
  ]);

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
    const payoneerEmail = e.target.payoneerEmail.value;
    const amount = e.target.amount.value;
    const dollerRate = e.target.dollerRate.value;
    const note = e.target.note.value;
    const date = e.target.date.value;

    const data = {
      dollerRate ,
      payoneerEmail,
      amount,
      note,
      date,
      status:'pending'
    };

    AxiosPublic.post("/payoneerData",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        console.log(res.data);
        document.getElementById("my_modal_1").close()
       
      })

  };
  const handlePayment2 = async (e) => {
    e.preventDefault();
    const payoneerEmail = e.target.payoneerEmail.value;
  
    const data = {
      payoneerEmail,
    };

    AxiosPublic.post("/payoneerEmail",
      data
    )
      .then((res) => {
        toast.success("Send successful!");
        refetch();
        console.log(res.data);
        document.getElementById("my_modal_2").close()
       
      })

  };

  const handleUpdatePayment = (e, id) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
    const dollerRate = e.target.dollerRate.value;
    const payoneerEmail = e.target.payoneerEmail.value;
    const note = e.target.note.value;

    const updatedPaymentData = {    
        dollerRate ,
      payoneerEmail,
      amount,
      note,
      date, };

    AxiosPublic.patch(`/payoneerData/${id}`,
      updatedPaymentData
    )
    .then(() => {
      refetch();
      document.getElementById(`modal_${id}`).close();
      toast.success("Updated successful!");

    })
    .catch(err => console.error("Error updating payment:", err));
  };
  
  const handleDelete = (id) => {

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

        AxiosPublic.delete(`/payoneerData/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
          })
          .catch((error) => {
            toast.error("Failed to delete. Please try again.");
          });
      }
    });
  };

  const handleDeleteEmail = (id) => {
    AxiosPublic.delete(`/payoneerEmail/${id}`)
      .then((res) => {
        toast.success("Delete successful!");
        document.getElementById("my_modal_3").close(); // Close the modal
       
      })
      .catch((error) => {
        toast.error("Failed to delete. Please try again.");
      });
  };
  
  

  const handleUpdate2 = (id, newStatus) => {
    const body = { status: newStatus };
  
    AxiosPublic.patch(`/payoneerData/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };
  console.log(userr);

  return (
    <div className="m-5">
      <ToastContainer />
      <Helmet>
        <title>Admin Payment | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>


      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="grid my-5 p-5 rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-2 text-black sm:grid-cols-2 gap-5 justify-around ">

      <div className="px-5 py-10 rounded-2xl  bg-[#65533d] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Doller</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="lg:text-xl text-xl font-extrabold">৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce((acc, datas) => acc + parseFloat(datas.amount || 0), 0))}</span> 

</p>
        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-xl font-bold">Total BDT</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="text-2xl font-extrabold">৳ </span>
  {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce(
    (sum, campaign) =>
      sum +
      (parseFloat(campaign?.amount || 0) * parseFloat(campaign?.dollerRate || 0)),
    0))}
</p>
        </div>


      </div>

     <div className=" my-5 rounded-md pb-5" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
     <div className="flex flex-col md:flex-row justify-start lg:justify-between items-center gap-5 lg:px-5 lg:p-0 px-5">
    <div className="flex justify-start">
    {
      userr?.role === "admin" ? <div className="flex justify-start gap-3">
       <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Buy Doller
    </button>
       <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add Email
    </button>

       <button
      className="font-avenir px-6 hover:bg-indigo-700 py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_3").showModal()}
    >
      My Emails
    </button>
      </div> : <></>
    }
  

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
              name="amount"
              placeholder="0"
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div>
                <label htmlFor="dollerRate" className="block mb-1 ml-1">
                  Doller Rate
                </label>
                <input
                  step="0.01"
                  id="dollerRate"
                  name="dollerRate"
                  type="number"
                  placeholder="type dollerRate"
                  defaultValue={125}
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              </div>
            
          </div>

          <div className="mb-4">
          <div className="mb-4">
                <label className="block text-black">Payoneer Email</label>
                <select
                  required
                  name="payoneerEmail"
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-2"
                >
                  <option className="text-black" value="">
                    Select an email
                  </option>
                  {
                    payoneerEmail.map(email=>  <option key={email._id} value={email.payoneerEmail}>
                      {email.payoneerEmail}
                      </option>)
                  }
                  
                   
                </select>
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
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box bg-white text-black font-bold">
        <form onSubmit={(e) => handlePayment2(e)}>

          <div className="grid lg:grid-cols-2">

          </div>
          <div className="">
            <h1
              className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
              onClick={() => document.getElementById("my_modal_2").close()}
            >
              <ImCross />
            </h1>

              
              <div className="mb-4 ">
            <label className="block text-gray-250">Payoneer Email</label>
            <input
              required
              type="email"
              name="payoneerEmail"
           
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
        
    
            
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
   <dialog id="my_modal_3" className="modal">
  <div className="modal-box bg-white text-black font-bold">
    <div className="flex justify-between items-start">
    <h2 className="text-xl mb-4">Payoneer Emails</h2>
    <h1
              className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              <ImCross />
            </h1>
    </div>
    <div className="grid gap-3">
      {payoneerEmail?.map((email, index) => (
        <div
          key={index}
          className="flex justify-between items-center border p-2 rounded-lg bg-gray-100"
        >
          <span>{email?.payoneerEmail}</span>
          <button
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
            onClick={() => handleDeleteEmail(email._id)}
          >
            Delete
          </button>
        </div>
      ))}
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
  </div>
</dialog>


  </div>

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="flex mt-2 lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">
       

       <div className="flex  justify-center text-center items-center">

<select
 style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
  className="border bg-white w-full     text-black border-gray-400 rounded p-2 mt-1 "
  value={selectedStatus4}
  onChange={(e) => changeTab4(e.target.value)}
>
  <option value="All">Select Payoneer email</option>
  {
                    payoneerEmail.map(email=>  <option key={email._id} value={email.payoneerEmail}>
                      {email.payoneerEmail}
                      </option>)
                  }
 
</select>
</div>
       
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
  <option value="All">Select Status</option>
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
              <tr className="text-start" style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                {
                  userr?.role === "admin" &&  <th style={{  border: 'var(--border)'}} className="p-3 ">{displayedItems.length}</th>
                }
             
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Email</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Amount</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start">Doller Rate</th>
         
              <th style={{  border: 'var(--border)'}} className="p-3 text-start"> Total BDT</th>
              <th style={{  border: 'var(--border)'}} className="p-3 text-start"> Note</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Date</th>
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
              {
                userr?.role === "admin" &&  <td style={{  border: 'var(--border)'}} className="p-3  border-r-2 border-l-2 border-gray-200 text-center">
                <div className="flex justify-center items-center gap-3 ">
                <button
                    className=" hover:bg-blue-700 text-[#f86c6b] text-xl px-2 py-1 rounded"
                    onClick={() => handleDelete(payment._id)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>
               
                  <dialog id={`modal_${payment._id}`} className="modal">
      <div className="modal-box text-start bg-white text-black font-bold">
        <form onSubmit={(e) => handleUpdatePayment(e,payment._id)}>

          <div className="grid lg:grid-cols-2">

          </div>
          <div className="">
            <h1
              className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
              onClick={() => document.getElementById(`modal_${payment._id}`).close()}
            >
              <ImCross />
            </h1>
            <div className="mb-4">
            <label className="block text-gray-250">Date</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={payment.date}
              className="w-full border text-black bg-white border-black rounded p-2 mt-1"
            />
          </div>

              <div className="grid lg:grid-cols-2 gap-3">
              <div className="mb-4 ">
            <label className="block text-gray-250">Amount</label>
            <input
              required
              type="number"
              name="amount"
              placeholder="0"
              defaultValue={payment.amount}
              className="w-full border bg-white border-black rounded p-2 mt-1"
            />
          </div>
          <div>
                <label htmlFor="dollerRate" className="block mb-1 ml-1">
                  Doller Rate
                </label>
                <input
                  step="0.01"
                  id="dollerRate"
                  name="dollerRate"
                  type="number"
                  placeholder="type dollerRate"
                  defaultValue={payment.dollerRate}
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              </div>
            
          </div>

          <div className="mb-4">
          <div className="mb-4">
                <label className="block text-black">Payoneer Email</label>
                <select
                  required
                  defaultValue={payment.payoneerEmail}
                  name="payoneerEmail"
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-2"
                >
                  <option className="text-black" value="">
                    Select an email
                  </option>
                  {
                    payoneerEmail.map(email=>  <option key={email._id} value={email.payoneerEmail}>
                      {email.payoneerEmail}
                      </option>)
                  }
                </select>
              </div>
         </div>




          <div className="mb-4">
            <label className="block text-gray-250">Note (Optional)</label>
            <input
             defaultValue={payment.note}
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
                </td>
              }
               
               
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  
                <button
                  className=" flex justify-center  items-center gap-1   px-2 py-1 rounded"
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                    {
                    userr?.role === "admin" && <FaEdit />
                  }
                    <h1> {payment.payoneerEmail}</h1>
                  </button>
                  
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-start">
                  $ {payment.amount}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-start">
                  ৳ {payment.dollerRate}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-start">
                  ৳ {payment.amount * payment.dollerRate}
                </td>
                

              
               <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-start">
                {" "}
                {payment.note}
              </td> 
               

                

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(payment.date).toLocaleDateString("en-GB")}
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
              {
                userr?.role === "admin" && <td></td>
              }
              

              <td style={{  border: 'var(--border)'}} className="p-3 text-right" >
                Total :
              </td>

              <td style={{ border: 'var(--border)' }} className="p-3 text-start">
  $ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce((acc, datas) => acc + parseFloat(datas.amount || 0), 0))}
              </td>
               <td className="p-3 text-start">
               ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce((acc, datas) => acc + parseFloat(datas.dollerRate || 0), 0))}
              </td>


              <td className="p-3 text-start">  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce(
    (sum, campaign) =>
      sum +
      (parseFloat(campaign?.amount || 0) * parseFloat(campaign?.dollerRate || 0)),
    0))}</td>
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

export default Payoneer;
