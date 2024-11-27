import {  useEffect, useState } from 'react';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import useUsersSellery from '../../Hook/useUsersSellery';
import useAllEmployee from '../../Hook/useAllEmployee';
import useEmployeePaymentsSellery from '../../Hook/useEmployeePaymentsSellery';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const Sellery = () => {
  const [allEmployees]=useAllEmployee()
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [modalData, setModalData] = useState(null); 
  const [currentuser,setCurrentuser]=useState([])

  const [employees, setEmployees] = useState([]);
  const initialTab = localStorage.getItem("activeTabsummeryEmployeed") || "allEmployee";
  const [selectedEmployee, setSelectedEmployee] = useState(initialTab);
  const [usersSellery, refetch] = useUsersSellery(selectedEmployee);
  const [employeePaymentSellery] = useEmployeePaymentsSellery(selectedEmployee);

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem("activeTabsummeryEmployeed", tab); 
  };


  useEffect(() => {
    if (allEmployees) {
      const employeeList = allEmployees.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }
  }, [allEmployees]);

  useEffect(() => {

    if (usersSellery) {
      const { monthlySpent, sellery } = usersSellery;

      const monthlyData = months.map(month => {
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
      
      const totalSpent = monthlySpentData.reduce((acc, spent) => acc + spent.totalSpentt, 0);
        const selleryData = (sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount || 0, 0);
        const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus || 0, 0);
        
        return {
          month,
          totalSpent,
          totalSellery,
          totalBonus,
          totalBill: totalSpent * 140,
          totalSelleryPaid: totalSpent * 7 - totalSellery,
          selleryData 
        };
      });

      setEmployeeData(monthlyData);
    }
  }, [usersSellery, selectedEmployee, employeePaymentSellery]);

  const AxiosPublic = UseAxiosPublic();

  const handleSellery = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const date = new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`);

    const generateRandomId = () => Math.floor(Math.random() * 1e13);
    const id = generateRandomId();
    const selleryData = {
      id,
      amount,
      date,
      month: selectedMonth,
      selectedEmployee
    };

    AxiosPublic.post('/users/updateSellery', { email:selectedEmployee, selleryData })
      .then(res => {
        console.log(res.data);
        toast.success('sellery pay successfully')
        refetch();
        document.getElementById('paymentModal').close()
      })
      .catch(error => {
        console.error("Error posting user data:", error);
      });
  };

  const [sellery,setSellery]=useState([])

  const handleMonthClick = (data) => {
    setSelectedMonth(data.month); 
    const datass=usersSellery?.sellery?.filter(s=>s.month === data?.month)
    setSellery(datass)
    document.getElementById('monthlyModal2').showModal(); 
  };

  const handlePayNowClick = (data) => {
    setSelectedMonth(data.month); 
    setModalData(data); 
    document.getElementById('paymentModal').showModal(); 
  };

  const handleUpdate2 = async (e, spentId) => {
    e.preventDefault();
    const totalSpent = e.target.totalSpent.value;
    const totalSpentParsed = parseFloat(totalSpent);
  
    try {
      const response = await AxiosPublic.put(`/updateSellery/${currentuser?._id}/${spentId}`, {
        totalSpentt: totalSpentParsed,
      });
  
      if (response.status === 200) {
        alert('Total Amount updated successfully');
        refetch()
      }
    } catch (error) {
      console.error('Error updating total Amount:', error);
      alert('Failed to update total Amount');
    }
  };

  const handleDelete = (e, spentId) => {
    document.getElementById('monthlyModal2').close()
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/deleteSellery/${currentuser?._id}/${spentId}`).then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "The payment has been deleted.",
              icon: "success",
            });
           refetch() // Optionally reload to update the data
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the payment.",
              icon: "error",
            });
          }
        });
      }
    });
  };
  

  const downloadPDF = () => {
    const input = document.querySelector('.m-3'); // Selects the main container element
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Width of the PDF page in mm
      const pageHeight = 295; // Height of the PDF page in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('employee_summary_report.pdf');
    });
  };

  return (
    <div className='m-5'>
      <Helmet>
        <title>E.M Sellery | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="grid my-5 p-5 rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around ">
        <div className="px-5 py-10 rounded-2xl  bg-[#91a33a] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Spent</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  $ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
    employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Salery</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="text-2xl font-extrabold">৳</span>
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSellery, 0).toFixed(0)
  )}
</p>

        </div>

        <div className="px-5 py-10 rounded-2xl  bg-[#ce1a38] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Unpaid</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(0)
  )}
</p>

        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#504491] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Due</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + parseFloat(data.totalSellery), 0) - 
    employeeData.reduce((acc, data) => acc + parseFloat(data.totalSelleryPaid), 0).toFixed(0)
  )}
</p>

        </div>
        <div className="px-5 py-10 rounded-2xl  bg-[#a6d427] text-white shadow-lg text-center">
          <h2 className="text-xl font-bold">Total Bonus</h2>
          <p className="lg:text-xl text-xl font-bold mt-2">
  <span className="lg:text-xl text-xl font-extrabold">৳</span> 
  {new Intl.NumberFormat('en-IN').format(
    employeeData.reduce((acc, data) => acc + data.totalBonus, 0).toFixed(0)
  )}
</p>

        </div>
      </div>



      <div className='px-5 pb-5 pt-5 my-5 mt-5  rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div className="flex mt-3 lg:mb-5 ml-1 lg:justify-between justify-center ">
        <select
         style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
          className="border bg-white text-black lg:w-auto w-full border-gray-400 rounded px-2 "
          value={selectedEmployee}
          onChange={(e) => changeTab(e.target.value)}
        >
          {employees.map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
        </select>
        <button onClick={downloadPDF} className=" bg-blue-500 text-white py-2 px-4 rounded">
          Download PDF
        </button>
      </div>



<div  className="overflow-x-auto rounded-xl  text-center " style={{  color: 'var(--text-color)'}}>
    <table className="min-w-full text-center ">
      <thead className=" ">
        <tr className="" style={{backgroundColor: 'var(--bg-color)',border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
          
              <th style={{  border: 'var(--border)'}} className="p-3">Month</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Spent</th>
              <th style={{  border: 'var(--border)'}} className="p-3">T. Sellery</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Paid</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Unpaid</th>
              <th style={{  border: 'var(--border)'}} className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((data, index) => (
              <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
              key={data._id}
              className={`${
                index % 2 === 0
                  ? "bg-white text-left text-black border-b border-opacity-20"
                  : "bg-gray-200  text-left text-black border-b border-opacity-20"
              }`}
             >
                
                <td style={{  border: 'var(--border)'}} onClick={() => handleMonthClick(data)} className="p-3 hover:text-blue-600 cursor-pointer border-r-2 border-gray-300 text-center px-5">
                  {data.month}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ${data.totalSpent.toFixed(2)}
                </td>
                <td
  style={{ border: 'var(--border)' }}
  className="p-3 border-r-2 border-gray-300 text-center"
>
  ৳ {
    (data.totalSpent * (["October", "November", "December"].includes(data.month) ? 7 : 7)).toFixed(0)
  }
</td>

                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ৳{data.totalSellery.toFixed(2)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  ৳ {data.totalSelleryPaid.toFixed(2)}
                </td>
                <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                  <button
                    className="font-avenir px-2.5 hover:bg-red-700 hover:text-white mx-auto py-0.5 bg-[#05a0db] rounded-lg text-white"
                    onClick={() => handlePayNowClick(data)}
                  >
                    Pay Now 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className=" font-bold ">
          <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
            <td style={{  border: 'var(--border)'}} className="p-3 text-right" colSpan="1">Total</td>
            <td style={{  border: 'var(--border)'}} className="p-3">
              ${employeeData.reduce((acc, data) => acc + data.totalSpent, 0).toFixed(2)}
            </td>
            <td style={{  border: 'var(--border)'}} className="p-3">
              ৳ {(employeeData.reduce((acc, data) => acc + data.totalSpent * 7, 0)).toFixed(2)}
            </td>
            <td style={{  border: 'var(--border)'}} className="p-3">
              ৳ 
            </td>
            <td style={{  border: 'var(--border)'}} className="p-3">
              ৳ {employeeData.reduce((acc, data) => acc + data.totalSelleryPaid, 0).toFixed(2)}
            </td>
          
            <td className="p-3"></td> {/* Empty for Action column */}
          </tr>
        </tfoot>
        </table>
      </div>
      </div>

      <dialog id="monthlyModal2" className="modal">
  <div className="relative modal-box bg-white text-black">
    <button
      onClick={() => document.getElementById('monthlyModal2').close()}
      className="absolute top-2 right-2 bg-transparent text-gray-600 hover:text-black"
    >
      &#10006; {/* "X" Close Icon */}
    </button>

    <table className="bg-white border border-gray-300 text-black w-full">
    <thead className="bg-[#05a0db] text-white">
            <tr>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
      <tbody>
        {sellery?.map((item) => (
          <tr key={item.id}>
            <td className="p-3 border-r-2 border-gray-300 text-center">
              ৳ {item.amount || 0}
            </td>
            <td className="p-3 border-r-2 border-gray-300 text-center">
              {item.date
                ? new Intl.DateTimeFormat('en-US').format(new Date(item.date))
                : '0'}
            </td>
            <td className="p-3 border-r text-center border-gray-400">
              <div className="flex justify-center items-center gap-3">
                <div>
                  <button
                    className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() =>
                      document.getElementById(`monthlyModal-${item.id}`).showModal()
                    }
                  >
                    Edit
                  </button>

                  {/* Edit Modal for Each Item */}
                  <dialog id={`monthlyModal-${item.id}`} className="modal">
                    <div className="relative modal-box bg-white text-black">
                      {/* Close Icon for Item Modal */}
                      <button
                        onClick={() => document.getElementById(`monthlyModal-${item.id}`).close()}
                        className="absolute top-2 right-2 bg-transparent text-gray-600 hover:text-black"
                      >
                        &#10006;
                      </button>
                      <form onSubmit={(e) => handleUpdate2(e, item.id)}>
                        <div className="mb-4">
                          <label className="block text-start text-gray-700">Total Spent</label>
                          <input
                            type="text"
                            name="totalSpent"
                            defaultValue={item.amount}
                            className="w-full bg-white border-black border rounded p-2 mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="submit"
                            className="font-avenir px-3 py-1 bg-[#05a0db] rounded-lg text-white"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </dialog>
                </div>

                <button
                  className="bg-red-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</dialog>



      {/* Payment Modal */}
      {modalData && (
        <dialog id="paymentModal" className="modal">
          <div className="modal-box bg-white">
            <h1 className="text-black font-bold text-start">Pay for {modalData.month}</h1>
            <form onSubmit={handleSellery}>
              <input type="hidden" name="month" value={modalData.month} />
              <input type="hidden" name="email" value={selectedEmployee} />
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input type="number" name="amount" placeholder="Amount" className="input bg-white text-black border border-gray-400 input-bordered" required />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Bonus</span>
                </label>
                <input type="number" name="bonus" placeholder="Bonus" className="input bg-white text-black border border-gray-400 input-bordered"  />
              </div>
              <div className="modal-action grid lg:grid-cols-2 justify-center gap-5">
              <button onClick={() => document.getElementById('paymentModal').close()} className="btn btn-secondary w-full">Close</button>
                <button type="submit" className="btn w-full btn-primary">Submit</button>
               
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Sellery;

