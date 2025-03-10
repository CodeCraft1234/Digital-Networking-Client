import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";
import useAllEmployee from "../../Hook/useAllEmployee";
import BalanceCard from "./BalanceCard";
import useMyContributorPayment from "../../Hook/useMyContributorPayments";

const ContributorPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [users]=useUsers()
  const [allEmployees] = useAllEmployee([]);
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`acti3${user?.email}`) || "all" 
  : localStorage.getItem(`acti3${user?.email}`) || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

  const changeTab2 = (tab) => {
    setSelectedEmployee3(tab); // Update the state
    localStorage.setItem(`acti3${user?.email}`, tab); // Update localStorage
  };

  const [MyContributorPayment,refetch]=useMyContributorPayment(selectedEmployee3)
  console.log(MyContributorPayment);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const AxiosPublic=UseAxiosPublic()

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
    const filtered = MyContributorPayment.filter((payment) => {
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
    MyContributorPayment,
    selectedStatus2,
    selectedYear,
  ]);

  useEffect(() => {
    const filtered = MyContributorPayment.filter((payment) => {
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
    MyContributorPayment,
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
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees.find(e => e.email === employeeEmail)?.name || user?.displayName;
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
      status:'pending'
    };

    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.post("/contributorPayment",
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
    const charge = e.target.charge.value;
    const note = e.target.note.value;
    const paymentMethod = e.target.paymentMethod.value;
    const status = 'pending';
    const updatedPaymentData = { status, note, payAmount,charge, date, paymentMethod };


    const datas = {
      title: `added ${payAmount} in in ${paymentMethod}`,
      date: new Date(),
      user: user?.displayName,
      email:user?.email
    };

    AxiosPublic.patch(`/contributorPayment/${id}`,
      updatedPaymentData
    )
    .then(() => {
      refetch();
      document.getElementById(`modal_${id}`).close();
      toast.success("Updated successful!");

      AxiosPublic.post("/activity", datas).then(() => {
      });
  
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

        AxiosPublic.delete(`/contributorPayment/${id}`)
          .then((res) => {
            toast.success("Delete successful!");
            refetch();
            AxiosPublic.post("/activity", datas).then(() => {
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
  
    AxiosPublic.patch(`/contributorPayment/status/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };


  const [totals, setTotals] = useState({
    nagadPersonal: 0,
    bkashPersonal: 0,
    rocketPersonal: 0,
    bank: 0,
    IBBLBank: 0,
    DBBLBank: 0,
  });
  
  useEffect(() => {
    const paymentMethods = ['nagadPersonal', 'bkashPersonal', 'rocketPersonal', 'bank', 'IBBLBank', 'DBBLBank'];
    const updatedTotals = paymentMethods.reduce((acc, method) => {
      acc[method] = filteredData2
        .filter(d => d.paymentMethod === method)
        .reduce((sum, d) => sum + parseFloat(d.payAmount || 0), 0);
      return acc;
    }, {});
    setTotals(updatedTotals);
  }, [filteredData2]);
  
  const cards = [
    { category: 'bank', img: 'https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png', bgColor: '#f2f2f2' },
    { category: 'DBBLBank', img: 'https://i.ibb.co/nnN8KW0/DBBL.png', bgColor: '#f2f2f2' },
    { category: 'IBBLBank', img: 'https://i.ibb.co.com/pnS6nt4/IBBLBank.png', bgColor: '#f2f2f2' },
    { category: 'bkashPersonal', img: 'https://i.ibb.co/520Py6s/bkash-1.png', bgColor: '#ffe6f7' },
    { category: 'nagadPersonal', img: 'https://i.ibb.co/JQBQBcF/nagad-marchant.png', bgColor: '#fff2cc' },
  ];

  return (
    <div className="mt-5">
      <ToastContainer />



<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-5 rounded-lg">
  {cards.map(({ category, img, bgColor }) => (

    <div onClick={() => setSelectedCategory(category)}  key={category}>
       <BalanceCard  img={img} amount={new Intl.NumberFormat('en-IN').format(totals[category])}></BalanceCard>
    </div>
  ))}


                 <div 
                 onClick={() => setSelectedCategory('All')}
                 style={{ backgroundColor: '#f7e8e8', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl  text-center shadow-xl transition-transform transform hover:scale-105"
                 >
                   <h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
                   <p className="card-title pb-5">
  <span>৳ </span>
  {new Intl.NumberFormat('en-IN').format(
        filteredData2.reduce((acc, item) => acc + (parseFloat(item?.charge) || 0), 0)
      )}
</p>

         </div>

              </div>





     <div className="side-space mt-5">

     <div className="flex flex-col md:flex-row justify-start lg:justify-between items-center gap-5 ">
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
      <h1
        className="text-black flex hover:text-red-500 justify-end cursor-pointer"
        onClick={() => document.getElementById("my_modal_1").close()}
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
          defaultValue={formattedDate}
          className="input2"
        />
      </div>
        {[
          { name: "payAmount", label: "Amount", placeholder: "0" },
        ].map(({ name, label, placeholder, defaultValue }) => (
          <div key={name}>
            <label className="block text-gray-250">{label}</label>
            <input
              type="number"
              name={name}
              required
              placeholder={placeholder}
              defaultValue={defaultValue}
              className="input2"
            />
          </div>
        ))}
      </div>
  
     <div>
      {userr?.role === "admin" && (
        <div className="mb-4">
          <label className="block text-black">Select Contributor</label>
          <select className="select2 w-full" name="employeeEmail">
            {allEmployees
              ?.filter((f) => f.role === "contributor")
              .map(({ _id, email, name }) => (
                <option key={_id} value={email}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      )}
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
          className="input2"
        />
      </div>
      <div className="grid mt-8 lg:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => document.getElementById("my_modal_1").close()}
          className="close"
        >
          Close
        </button>
        <button type="submit" className="add">
          Submit
        </button>
      </div>
    </form>
  </div>
</dialog>


  </div>

  <div className="lg:flex text-black lg:justify-start my-3 lg:my-0 lg:ml-5  items-center">
        
        <div className="flex mt-2  lg:mt-0 justify-center text-center gap-2 lg:gap-3 items-center">

            {userr?.role === "admin" ? (
      <select
        
        className="select2"
        value={selectedEmployee3}
        onChange={(e) => changeTab2(e.target.value)}
      >
        <option value="all">All Contributor</option>
        {allEmployees
          .filter((u) => u.role === "contributor")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
              ) : (
             <></>
               )}

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

   
          <select
  className="select2 "
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

       <div className="table-div mt-4">
          <table className="min-w-full  text-center ">
            <thead>
              <tr className="tr1">
              <th className="text-center ">{displayedItems.length}</th>
              <th>Employee Name</th>
              <th>Amount</th>
              <th className="text-center ">Payment Method</th>
              <th> Note</th>
              <th>Date</th>
              <th className="text-center ">Status</th>
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
                <td>
                <div className="f-center ">
                <button
                    className="delete"
                    onClick={() => handleDelete(payment._id,payment?.note,payment.paymentMethod,payment?.charge,payment?.payAmount,payment.date)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>
                 <button
                  className=" edit"
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
      <h1
        className="text-black flex justify-end hover:text-red-500"
        onClick={() => document.getElementById(`modal_${payment._id}`).close()}
      >
        <ImCross />
      </h1>
      <h2 className="text-xl font-bold">Edit Admin Pay Amount</h2>

      {[
        { label: "Date", type: "date", name: "date", value: payment.date },
        { label: "New Amount", type: "number", name: "payAmount", value: payment?.payAmount },
        { label: "Note", type: "text", name: "note", value: payment?.note }
      ].map(({ label, type, name, value, placeholder }, idx) => (
        <div className="mb-4" key={idx}>
          <label className="block text-left text-gray-700">{label}</label>
          <input
            type={type}
            name={name}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full border bg-white border-black rounded p-2 mt-1"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-left text-gray-700">Method</label>
        <select
          name="paymentMethod"
          defaultValue={payment.paymentMethod}
          className="w-full border bg-white border-black rounded p-2 mt-1"
          required
        >
          {[
            { value: "bank", label: "Brack Bank" },
            { value: "IBBLbank", label: "Islami Bank" },
            { value: "DBBLBank", label: "DBBL Bank" },
            { value: "bkashPersonal", label: "bKash" },
            { value: "nagadPersonal", label: "Nagad" }
          ].map(({ value, label }, idx) => (
            <option value={value} key={idx}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-action grid grid-cols-2 gap-3 mt-4">
        {[
          { label: "Close", className: "bg-red-600 hover:bg-red-700", action: () => document.getElementById(`modal_${payment._id}`).close() },
          { label: "Update", className: "bg-[#05a0db] hover:bg-indigo-700", action: null, type: "submit" }
        ].map(({ label, className, action, type }, idx) => (
          <button
            key={idx}
            type={type || "button"}
            className={`p-2 rounded-lg text-white ${className}`}
            onClick={action}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  </div>
                 </dialog>
                 </div>
                </td>

               
                <td>
                  {payment.employeeName}
                </td>
                <td>
                <span className="amount-taka">৳ </span> {payment.payAmount}
                </td>
               

                <td>
  {[
    { 
      method: "bkashPersonal", 
      src: "https://i.ibb.co.com/f8LcKV0/bKash.png", 
      width: "w-24" 
    },
    { 
      method: "rocketPersonal", 
      src: "https://i.ibb.co/QkTM4M3/rocket.png", 
      width: "w-24" 
    },
    { 
      method: "nagadPersonal", 
      src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png", 
      width: "w-24" 
    },
    { 
      method: "DBBLBank", 
      src: "https://i.ibb.co.com/nnN8KW0/DBBL.png", 
      width: "w-32" 
    },
    { 
      method: "IBBLBank", 
      src: "https://i.ibb.co.com/pnS6nt4/IBBLBank.png", 
      width: "w-32" 
    },
    { 
      method: "bank", 
      src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", 
      width: "w-13", 
      height: "h-12" 
    },
  ].map(
    ({ method, src, width, height = "h-10" }) =>
      payment.paymentMethod === method && (
        <img
          key={method}
          className={`${height} ${width} flex my-auto items-center mx-auto justify-center`}
          src={src}
          alt={method}
        />
      )
  )}
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
      className="sr-only"
      checked={payment.status !== "pending"}
      onChange={() => {
        const newStatus = payment.status !== "pending" ? "pending" : "Approved";
        handleUpdate2(payment._id, newStatus);
      }}
    />
    <div
      className={`status-switch ${payment.status !== "pending" ? "active" : "inactive"}`}
    >
      <span
        className={`status-switch-thumb ${payment.status !== "pending" ? "active" : ""}`}
      ></span>
    </div>
  </label>
</td>

              </tr>
            ))}
            <tr className="font-bold tr1">
              <td></td>
              <td></td>
              <td className="p-3 text-right" >
                Total :
              </td>
              <td>
              <span className="amount-taka">৳ </span> {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, // To ensure two decimal places if required
  }).format(
    bkashPersonal + nagadPersonal + bankTotal + DBBLBankTotal + IBBLBankTotal + rocketPersonal
  )}
              </td>

              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      {isMoreItems && <p className="text-center mt-5">Loading more clients...</p>}
    </div>
  );
};

export default ContributorPayments;
