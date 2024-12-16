import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useUserr from "../../Hook/useUser";
import useUsers from "../../Hook/useUsers";
import useMySalaryPayments from "../../Hook/useMySalaryPayment";
import useUserr2 from "../../Hook/useUser2";
import useAllEmployee from "../../Hook/useAllEmployee";
import BalanceCard from "../DashboardRoot/BalanceCard";

const SalaryPayments = () => {
  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)
  const [users]=useUsers()
  const [allEmployees] = useAllEmployee([]);
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem("ac") || "all" 
  : localStorage.getItem("ac") || user?.email; 

  const [selectedEmployee3, setSelectedEmployee3] = useState(initialTab3);

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
    const employeeEmail = e.target.employeeEmail?.value || user?.email;
    const employeeName = allEmployees?.find(e => e.email === employeeEmail)?.name || user?.displayName;
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

  const options = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const years = Array.from({ length: 31 }, (_, i) => 2020 + i);
  return (
    <div className="">
      <ToastContainer />


        <div className="grid grid-cols-2 rounded-lg sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5 lg:grid-cols-6 ">
<div onClick={() => setSelectedCategory('bank')}>
<BalanceCard  img={`https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png`} amount={bankTotal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('DBBLBank')}>
<BalanceCard  img={`https://i.ibb.co.com/nnN8KW0/DBBL.png`} amount={DBBLBankTotal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('IBBLBank')}>
<BalanceCard  img={`https://i.ibb.co.com/yfMSDcd/IBBL.png`} amount={IBBLBankTotal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('bkashPersonal')}>
<BalanceCard  img={`https://i.ibb.co/520Py6s/bkash-1.png`} amount={bkashPersonal}></BalanceCard>
</div>
<div onClick={() => setSelectedCategory('nagadPersonal')}>
<BalanceCard  img={`https://i.ibb.co/JQBQBcF/nagad-marchant.png`} amount={nagadPersonal}></BalanceCard>
</div>

<div onClick={() => setSelectedCategory('All')}
                   style={{ backgroundColor: '#d9f8d9', border: 'var(--border)' }} 
                   className="balance-card rounded-2xl p-5 text-center shadow-xl transition-transform transform hover:scale-105">
<h1 className="px-3 text-black text-xl font-bold text-center">TOTAL</h1>
      <p className="balance-card-text text-lg mt-2 lg:text-xl font-bold text-gray-700">
        <span className="text-lg lg:text-xl font-extrabold">৳</span> {bankTotal + DBBLBankTotal + IBBLBankTotal + bkashPersonal + nagadPersonal }
      </p>
    </div>
        </div>


     <div className="side-space my-5">

     <div className="flex flex-col mb-4 md:flex-row justify-start lg:justify-between items-center gap-5  ">

     <div className="f-start">

    <button
      className="add"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Pay Admin
    </button>

    <dialog id="my_modal_1" className="modal">
      <div className="modal-box bg-white text-black font-bold">
        <form onSubmit={handlePayment}>

          <div className="flex justify-end">
            <ImCross
              className="cursor-pointer hover:text-red-500"
              onClick={() => document.getElementById("my_modal_1").close()}
            />
          </div>

          
<div className="grid lg:grid-cols-2 gap-3">
<div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                required
                defaultValue={formattedDate}
                className="input2"
              />
            </div>

            {userr?.role === "admin" && (
            <div >
              <label className="block text-black" >Select Employee</label>
              <select name="employeeEmail" className="select2 w-full">
                {allEmployees
                  ?.filter((f) => f.role === "employee")
                  .map((employee) => (
                    <option key={employee._id} value={employee.email}>
                      {employee.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

</div>


          <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <div>
              <label>Amount</label>
              <input
                type="number"
                name="payAmount"
                required
                placeholder="0"
                className="input2"
              />
            </div>
         
            <div>
              <label>Charge</label>
              <input
                type="number"
                name="charge"
                required
                defaultValue={0}
                className="input2"
              />
            </div>

          </div>


         

          <div className="grid lg:grid-cols-3 gap-3 mt-4">
            {["bank", "DBBLBank", "IBBLBank", "bkashPersonal", "nagadPersonal"].map(
              (method, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    className="radio radio-primary"
                  />
                  <span>{method}</span>
                </label>
              )
            )}
          </div>
          <div className="mt-4">
            <label>Note (Optional)</label>
            <input
              type="text"
              name="note"
              placeholder="Type note..."
              className="input2"
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-3 mt-5">
            <button
              type="button"
              onClick={() => document.getElementById("my_modal_1").close()}
              className="close"
            >
              Close
            </button>
            <button
              type="submit"
              className="add"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>
     </div>

     <div className="lg:ml-5 f-start">
    <div className="f-center">
      {userr?.role === "admin" && (
        <select
          className="select2"
          value={selectedEmployee3}
          onChange={(e) => changeTab2(e.target.value)}
        >
          <option value="all">All Employees</option>
          {users.filter((u) => ["employee", "graphicDesign", "webDeveloper", "staf"].includes(u.role)).map((employee) => (
            <option key={employee._id} value={employee.email}>{employee.name}</option>
          ))}
        </select>
      )}

      <select
        className="select2"
        value={sortMonth}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="">Select Month</option>
        {options.map((month, i) => (
          <option key={i + 1} value={i + 1}>{month}</option>
        ))}
      </select>

      <select
        className="select2"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        className="select2"
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



       <div  className="table-div">
          <table className="min-w-full  text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th className="text-center ">Items {displayedItems.length}</th>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th> Note</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems?.map((payment, index) => (
               <tr 
               key={payment._id}
               className={`tr2`}
             >
                <td className="text-center">
                <div className="f-center">
                <button
                    className="delete"
                    onClick={() => handleDelete(payment._id,payment?.note,payment.paymentMethod,payment?.charge,payment?.payAmount,payment.date)}
                  >
                     <span >
                          <FaMinusSquare  />
                          </span>
                  </button>
                 <button
                  className="edit"
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
        className="text-black flex hover:text-red-500 justify-end"
        onClick={() => document.getElementById(`modal_${payment._id}`).close()}
      >
        <ImCross />
      </h1>
      <h2 className="text-xl font-bold">Edit Admin Pay Amount</h2>

      {[
        { label: "Date", name: "date", type: "date", value: payment.date },
        { label: "New Amount", name: "payAmount", type: "number", value: payment.payAmount },
        { label: "Charge", name: "charge", type: "number", value: payment.charge },
        { label: "Note", name: "note", type: "text", value: payment.note },
      ].map(({ label, name, type, value }, idx) => (
        <div key={idx} className="mb-4">
          <label className="block text-left text-gray-700">{label}</label>
          <input
            required
            type={type}
            name={name}
            defaultValue={value}
            className="input2"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-left text-gray-700">Method</label>
        <select
          required
          name="paymentMethod"
          defaultValue={payment.paymentMethod}
          className="select2 w-full"
        >
          {["bank", "IBBLbank", "DBBLBank", "bkashPersonal", "nagadPersonal"].map((method, idx) => (
            <option key={idx} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="modal-action grid grid-cols-2 gap-3 mt-4">
        {[
          { label: "Close", color: "bg-red-600 hover:bg-red-700", action: () => document.getElementById(`modal_${payment._id}`).close() },
          { label: "Update", color: "bg-[#05a0db] hover:bg-indigo-700", action: null },
        ].map(({ label, color, action }, idx) => (
          <button
            key={idx}
            type={action ? "button" : "submit"}
            className={`p-2 rounded-lg text-white ${color}`}
            onClick={action || null}
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
                  {new Date(payment.date).toLocaleDateString("en-GB")}
                </td>

                <td>
                  {payment.employeeName}
                </td>

                <td>
                  ৳ {payment.payAmount}
                </td>

                <td>
  {[
    { method: "bkashPersonal", src: "https://i.ibb.co.com/f8LcKV0/bKash.png", size: "h-10 w-24" },
    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png", size: "h-10 w-24" },
    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png", size: "h-10 w-24" },
    { method: "DBBLBank", src: "https://i.ibb.co.com/nnN8KW0/DBBL.png", size: "h-10 w-32" },
    { method: "IBBLBank", src: "https://i.ibb.co.com/yfMSDcd/IBBL.png", size: "h-10 w-32" },
    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", size: "h-12 w-13" },
  ].map(
    (item) =>
      payment.paymentMethod === item.method && (
        <img
          key={item.method}
          className={`${item.size} flex my-auto items-center mx-auto justify-center`}
          src={item.src}
          alt=""
        />
      )
  )}
               </td>

                <td>
                  {" "}
                  {payment.note}
                </td>
            
                <td> 

             <label className="inline-flex items-center cursor-pointer">

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
            <tr className="font-bold tr1">
              <td></td>
              <td></td>
              <td className="text-right" >
                Total :
              </td>
              <td>
  ৳ {new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2, 
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

export default SalaryPayments;
