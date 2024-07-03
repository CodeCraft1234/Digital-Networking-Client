import { useContext, useEffect, useState } from "react";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import Swal from "sweetalert2";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";


const AdminPayments = () => {
    const { user }=useContext(AuthContext)
    const [employeePayment,refetch] = useEmployeePayment();
    console.log(employeePayment)
    const [payment, setPayment] = useState([]);
    const [totalPayment, setTotalPayment] = useState([]);
    const AxiosPublic=UseAxiosPublic()

    useEffect(() => {
          const realdata = employeePayment.filter(m => m.employeeEmail === user?.email);
          setPayment(realdata);
          console.log(realdata);
          const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
          setTotalPayment(totalBill);
    
    }, [employeePayment, user?.email]);
    console.log(payment,totalPayment);

    const handlePayment = (e) => {
        e.preventDefault();
        const employeeEmail = user?.email;
        const payAmount = e.target.payAmount.value;
        const paymentMethod = e.target.paymentMethod.value;
        const note= e.target.note.value;
        const date = e.target.date.value;
    
        const data = {
          employeeEmail, payAmount,note, paymentMethod, date
        };
        console.log(data);
        AxiosPublic.post("https://digital-networking-server.vercel.app/employeePayment", data)
        .then((res) => {
          // toast.success("Client Added successfully");
          console.log(res.data);
          refetch();
          Swal.fire({
            title: "Good job!",
            text: "Cashout success!",
            icon: "success"
          });
          
      })
      .catch(error => {
          console.error("Error adding cashout:", error);
          // toast.error("Failed to update campaign");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to add cashout!",
          });
        });
      };
    

      const handleUpdatePayment = (e, id) => {
        e.preventDefault();
        const payAmount = parseFloat(e.target.payAmount.value);
        const date = e.target.date.value;
        const note = e.target.note.value;
        const paymentMethod = e.target.paymentMethod.value;
        const body = { note, payAmount, date, paymentMethod };
        AxiosPublic.patch(`https://digital-networking-server.vercel.app/employeePayment/${id}`, body)
            .then(res => {
                console.log(res.data);
                window.location.reload();
                refetch();
                toast.success("Campaign updated successfully");
            })
            .catch(error => {
                console.error("Error updating campaign:", error);
                toast.error("Failed to update campaign");
            });
    };
    return (
        <div>
            <h6 className="text-center  font-bold mt-5 text-xl md:text-5xl text-green-600">
                   Admin Payment History
                </h6>

                <div>
          <button
            className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Cashout
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box text-black font-bold">
              <form onSubmit={(e) => handlePayment(e)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-250">Pay Amount</label>
                    <input
                    required
                      type="number"
                      name="payAmount"
                      defaultValue={0}
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Note</label>
                    <input
                      type="text"
                      name="note" 
                      required 
                      placeholder="type note..." 
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-250">
                      Payment Method
                    </label>
                    <select
                     required
                      name="paymentMethod"
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    >
                      <option value="bkashMarchent">Bkash Marchent</option>
                      <option value="bkashPersonal">Bkash Personal</option>
                      <option value="nagadPersonal">Nagad Personal</option>
                      <option value="rocketPersonal">Rocket Personal</option>
                      <option value="bank">Bank</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Date</label>
                    <input
                     required
                      type="date"
                      name="date"
                      className="w-full border-2 border-black rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800"
                >
                  Send
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      <div className="overflow-x-auto mt-6 mx-4">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3 ">SL</th>
                                <th className="p-3">Payment Date</th>
                                <th className="p-3">Payment Amount</th>
                                <th className="p-3">Payment Method</th>
                                <th className="p-3"> Note</th>
                                <th className="p-3">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payment.map((payment, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{payment.date}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">৳ {payment.payAmount}</td>
                                  
                                    <td className="p-3 border-r-2 border-gray-200 text-center">


                                    
                                        {payment.paymentMethod === 'bkashMarchent' && <img className="h-10 w-24 flex mx-auto my-auto items-center justify-center" src='https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'bkashPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/520Py6s/bkash-1.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'rocketPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/QkTM4M3/rocket.png' alt="" />
                                        }
                                        {payment.paymentMethod === 'nagadPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/JQBQBcF/nagad-marchant.png' alt="" /> 
                                        }
                                        {payment.paymentMethod === 'bank' && <img className="h-12 w-13 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp' alt="" />
                                        }
                                        </td>
                                        <td className="p-3 border-r-2 border-gray-200 text-center"> {payment.note}</td>
                                           <td className="p-3 border-r-2 border-gray-200 text-center">

                                           <button className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white" onClick={() => document.getElementById(`modal_${payment._id}`).showModal()}>
                                            Edit
                                            </button>

                                          <dialog id={`modal_${payment._id}`} className="modal">
                                              <div className="modal-box text-black font-bold">
                                                  <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
                                                      <div className="flex justify-center items-center gap-3">
                                                      
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> Previous Amount</label>
                                                              <input type="number" name="previousAmount" disabled   defaultValue={payment?.payAmount} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> New Amount</label>
                                                              <input required type="number" name="payAmount"   defaultValue={payment?.payAmount} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                          
                                                      </div>
                                                      <div className="flex justify-center items-center gap-3">
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700"> Date</label>
                                                              <input type="date" defaultValue={payment.date} name='date'  className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                     
                                                      <div className="mb-4">
                                                          <label className="block text-gray-700">Method</label>
                                                          <select required name="paymentMethod" defaultValue={payment.paymentMethod} className="w-full border-2 border-black rounded p-2 mt-1">
                                                          <option value="bkashMarchent">Bkash Marchent</option>
                                                             <option value="bkashPersonal">Bkash Personal</option>
                                                             <option value="nagadPersonal">Nagad Personal</option>
                                                             <option value="rocketPersonal">Rocket Personal</option>
                                                             <option value="bank">Bank</option>
                                                          </select>
                                                      </div>
                                                      </div>
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700">Note</label>
                                                              <input required type="text" name="note" defaultValue={payment?.note} className="w-full border-2 border-black rounded p-2 mt-1" />
                                                          </div>
                                                      <button onClick={() => document.getElementById(`modal_${payment._id}`).close()} type="submit"  className="font-avenir px-3 mx-auto py-1 rounded-lg flex justify-center text-white bg-green-800">Update</button>
                                                  </form>
                                                  <div className="modal-action">
                                                      <button className="p-2 rounded-lg bg-red-600 text-white text-center" onClick={() => document.getElementById(`modal_${payment._id}`).close()}>Close</button>
                                                  </div> 
                                               </div>
                                          </dialog>
                                      </td> 
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center" colSpan="2">
                                    Total Amount =
                                </td>
                                <td className="p-3 text-center">৳ {totalPayment}</td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default AdminPayments;