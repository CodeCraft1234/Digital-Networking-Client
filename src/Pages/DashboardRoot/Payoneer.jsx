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
import PayoneerEmail from "./PayoneerEmail";

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

  return (
    <div className="">
      <ToastContainer />

      <Helmet>
        <title>Payoneer | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

     <div className=" side-space mb-5">
     <div className=" flex-col md:flex-row f-start lg:justify-between items-center gap-5 ">
          <div>
          {
                  userr?.role === "admin" ? 
                  <div className="f-start">
                   <button
                  className="add"
                  onClick={() => document.getElementById("my_modal_1").showModal()}
                >
                  Buy Doller
                </button>

                <PayoneerEmail></PayoneerEmail>
                 </div> :<></>

                 
                }
          </div>
                                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box overflow-hidden bg-white text-black font-bold">
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
                      
            
                      <div className="grid lg:grid-cols-2 mb-5 gap-3">
                      <div>
                        <label className="block text-gray-250">Date</label>
                        <input
                          type="date"
                          name="date"
                          required
                          defaultValue={formattedDate}
                          className="input2"
                        />
                      </div>
            
                      <div className="w-full">
                            <label className="block text-black">Payoneer Email</label>
                            <select
                              required
                              name="payoneerEmail"
                              className="select2 py-2.5 w-full"
                            >
                              <option selected disabled className="text-black" value="">
                                Select an email
                              </option>
                              {
                                payoneerEmail.map(email=> 
                                  <option key={email._id} value={email.payoneerEmail}>
                                  {email.payoneerEmail.split('@')[0]}
                                </option>
                                
                                 )
                              }
                              
                               
                            </select>
                          </div>
                     </div>
            
            
                          <div className="grid mb-4 lg:grid-cols-2 gap-3">
                          <div className=" ">
                        <label className="block text-gray-250">Amount</label>
                        <input
                          required
                          type="number"
                          name="amount"
                          placeholder="0"
                          className="input2"
                        />
                      </div>
                      <div>
                            <label htmlFor="dollerRate" className="block ">
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
                              className="input2"
                            />
                          </div>
                          </div>
                        
                      </div>
            
                     
            
            
            
                      <div className="mb-4">
                        <label className="block text-gray-250">Note (Optional)</label>
                        <input
                          type="text"
                          name="note"
                          placeholder="type note..."
                          className="input2"
                        />
                      </div>
                      <div className="grid mt-4 lg:grid-cols-2 gap-3">
              <div className="w-full col-span-1">
                <form method="dialog" className="w-full">
                  <button className="close w-full">
                    Close
                  </button>
                </form>
              </div>
              <button
                type="submit"
                className="add w-full col-span-1"
              >
                Submit
              </button>
            </div>
            
                    </form>
                  </div>
                </dialog>


  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="f-center ">
       
        

        <div className="f-center ">

<select

  className="select2 "
  value={selectedStatus4}
  onChange={(e) => changeTab4(e.target.value)}
>
  <option value="All">Payoneer email Address</option>
  {
                    payoneerEmail.map(email=>  <option key={email._id} value={email.payoneerEmail}>
                      {email.payoneerEmail}
                      </option>)
                  }
 
</select>
   </div>
       
          <div className="f-center">
          <select
  className="select2"
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
  ]
    .map((month, index) => {
      // Get the unique months from the data
      const monthsInData = [
        ...new Set(
          displayedItems?.map(item => new Date(item.date).getMonth() + 1) // Get months from the displayedItems data
        ),
      ];

      // Check if the month is in the data
      if (monthsInData.includes(index + 1)) {
        return (
          <option key={index} value={index + 1}>
            {month}
          </option>
        );
      }
      return null;
    })
    .filter(option => option !== null)}
</select>
          </div>

          <div className=" lg:f-center ">
        <select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="">Select Year</option> {/* Default option */}
  {[...new Set(displayedItems?.map((campaign) => new Date(campaign.date).getFullYear()))]
    .sort((a, b) => a - b) // Ensure the years are sorted in ascending order
    .map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
</select>
      </div>
         
      <div className="f-center ">

<select
  className="select2 "
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



      <div  className="table-div mt-5">
          <table className="min-w-full  text-center ">
            <thead className=" ">
              <tr className="tr1">
                {
                  userr?.role === "admin" &&  <th s className="p-3 text-center">Items {displayedItems.length}</th>
                }
             
              <th >Email</th>
              <th >Amount</th>
              <th >Doller Rate</th>
         
              <th > Total BDT</th>
              <th > Note</th>
              <th >Date</th>
               <th  className="p-3 text-center">Status</th>
              
              
             
            </tr>
          </thead>
          <tbody>
            {displayedItems?.map((payment, index) => (
               <tr 
               key={payment._id}
               className={`tr2`}
             >
              {
                userr?.role === "admin" &&  <td>
                <div className="flex justify-center items-center gap-3 ">
                <button
                    className=" delete"
                    onClick={() => handleDelete(payment._id)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>

                  <div>
                  <FaEdit />
                  </div>

                  <dialog id={`modal_${payment._id}`} className="modal">
      <div className="modal-box text-start bg-white text-black font-bold">
        <form onSubmit={(e) => handleUpdatePayment(e,payment._id)}>

          <div className="">
            <h1
              className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
              onClick={() => document.getElementById(`modal_${payment._id}`).close()}
            >
              <ImCross />
            </h1>

            <div className="grid lg:grid-cols-2 gap-3">

            <div className="mb-4">
            <label className="block text-gray-250">Date</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={payment.date}
              className="input2"
            />
          </div>

          <div className="mb-4">
                <label className="block text-black">Payoneer Email</label>
                <select
                  required
                  defaultValue={payment.payoneerEmail}
                  name="payoneerEmail"
                  className="select2"
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


              <div className="grid lg:grid-cols-2 gap-3">
              <div className="mb-4 ">
            <label className="block text-gray-250">Amount</label>
            <input
              required
              type="number"
              name="amount"
              placeholder="0"
              defaultValue={payment.amount}
              className="input2"
            />
          </div>

             <div>
                <label htmlFor="dollerRate" className="block ">
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
                  className="input2"
                />
              </div>

              </div>
            
          </div>

        




          <div className="mb-4">
            <label className="block text-gray-250">Note (Optional)</label>
            <input
             defaultValue={payment.note}
              type="text"
              name="note"
              placeholder="type note..."
              className="input2"
            />
          </div>
          <div className="grid mt-8 lg:grid-cols-2 gap-3">
  <form method="dialog" className="w-full">
    <button className="close w-full">
      Close
    </button>
  </form>
  <button
    type="submit"
    className="add w-full"
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
               
               
                <td>
                  
                <button
                  className=" f-center "
                    onClick={() =>
                      document
                        .getElementById(`modal_${payment._id}`)
                        .showModal()
                    }
                  >
                    <h1> {payment.payoneerEmail}</h1>
                  </button>
                  
                </td>
                <td>
                  $ {payment.amount}
                </td>
                <td>
                  ৳ {payment.dollerRate}
                </td>
                <td>
                  ৳ {payment.amount * payment.dollerRate}
                </td>
                

              
               <td>
                {" "}
                {payment.note}
              </td> 
               

                

                <td>
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>

                <td className="text-center">
  <label className="status-label">
    <input
      type="checkbox"
      className="sr-only" // Hides the default checkbox
      checked={payment.status !== "pending"} // Based on current status
      onChange={() => {
        const newStatus = payment.status !== "pending" ? "pending" : "Approved"; // Toggle status
        handleUpdate2(payment._id, newStatus); // Call the update function
      }}
    />
    <div className={payment.status !== "pending" ? "active" : "inactive"}>
      <span className={payment.status !== "pending" ? "active" : ""}></span>
    </div>
  </label>
</td>

                

               

                
              </tr>
            ))}
            <tr className="tr1 font-bold">
              {
                userr?.role === "admin" && <td></td>
              }
              

              <td  className="text-right" >
                Total :
              </td>

              <td >
  $ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce((acc, datas) => acc + parseFloat(datas.amount || 0), 0))}
              </td>
               <td >
               ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce((acc, datas) => acc + parseFloat(datas.dollerRate || 0), 0)) / displayedItems?.length}
              </td>


              <td >  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(displayedItems.reduce(
    (sum, campaign) =>
      sum +
      (parseFloat(campaign?.amount || 0) * parseFloat(campaign?.dollerRate || 0)),
    0))}</td>
              <td ></td>
              <td ></td>
              <td ></td>
          
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
