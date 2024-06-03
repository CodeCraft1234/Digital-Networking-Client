
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { useParams,  } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useMpayment from "../../Hook/UseMpayment";
import useCampaings from "../../Hook/useCampaign";


const PaymentHistry = () => {
    const { user } = useContext(AuthContext);
    const param = useParams();
    const [MPayment, refetch] = useMpayment();
    const AxiosPublic = UseAxiosPublic();
    const [totalPayment, setTotalPayment] = useState(0);
    const [Histry, setHistry] = useState([]);

    useEffect(() => {
        if (param?.email) {
            const realdata = MPayment.filter(m => m.clientEmail === param.email);
            setHistry(realdata);
            console.log('Filtered Data:', realdata);
            const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
            setTotalPayment(totalBill);
        }
    }, [param?.email, MPayment]);



    const [dataa2, setData2] = useState([]);

    const [campaign] = useCampaings();

    const [totalSpent, setTotalSpent] = useState(0);
    const [dollerRate, setDollerRate] = useState(0);
    const [totalBudged, setTotalBudged] = useState(0);
    console.log(param?.email)
    useEffect(() => {
        const filtered = campaign.filter(campaign => campaign.clientEmail === param?.email);
        console.log('hdjklhgsfdakgDSAOPJGIOJFDJGJHJFD',filtered);
        setData2(filtered);

        const totalBill = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tSpent), 0);
        setTotalSpent(totalBill);

        const dollerRate = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.dollerRate), 0);
        const vag=dollerRate/filtered.length
        setDollerRate(vag);

        const total = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tBudged), 0);
        setTotalBudged(total);

    }, [campaign, param?.email]);

    const handlePayment = async (e) => {
        e.preventDefault();
        const paymentMethod = e.target.paymentMethod.value;
        const amount = parseFloat(e.target.amount.value);
        const date = e.target.date.value;
        const note = e.target.note.value;
        const clientEmail = param?.email;
        const employeeEmail = user?.email;
        const body = { paymentMethod, amount, note, clientEmail, employeeEmail, date };
        try {
            await AxiosPublic.post(`https://digital-networking-server.vercel.app/MPayment`, body);
            toast.success("Payment successful");
            refetch(); // Automatically refetch after successful payment
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("Failed to process payment");
        }

        const tSpent = totalSpent;
        const tBill = totalSpent * dollerRate;
        const tPayment = totalPayment + amount; // Ensure this variable is defined and correct
        const tBudged = totalBudged;
    
        const data = { tSpent, tBill, tPayment, tBudged };
    
        AxiosPublic.patch(`https://digital-networking-server.vercel.app/clients/${param?.email}`, data)
            .then(res => {
                console.log(res.data);
                refetch(); // Ensure this function is defined and correct
                toast.success("Campaign updated successfully");
                // window.location.reload(); // Generally better to avoid reloading the page
            })
            .catch(error => {
                console.error("Error updating campaign:", error);
                toast.error("Failed to update campaign");
            });
    };

    const handleUpdatePayment = (e, id) => {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value);
        const previousAmount = parseFloat(e.target.previousAmount.value);
        const date = e.target.date.value;
        const note = e.target.note.value;
        const method = e.target.method.value;
        const body = { note, amount, date, method };
        AxiosPublic.patch(`https://digital-networking-server.vercel.app/Mpayment/${id}`, body)
            .then(res => {
                console.log(res.data);
                refetch();
                toast.success("Campaign updated successfully");
            })
            .catch(error => {
                console.error("Error updating campaign:", error);
                toast.error("Failed to update campaign");
            });

            const calculate=amount-previousAmount
            const tSpent = totalSpent;
            const tBill = totalSpent * dollerRate; 
            const tPayment = totalPayment + calculate; // Ensure this variable is defined and correct
            const tBudged = totalBudged;
        
            const data = { tSpent, tBill, tPayment, tBudged };
        
            AxiosPublic.patch(`https://digital-networking-server.vercel.app/clients/${param?.email}`, data)
                .then(res => {
                    console.log(res.data);
                    refetch(); // Ensure this function is defined and correct
                    toast.success("Campaign updated successfully");
                    // window.location.reload(); // Generally better to avoid reloading the page
                })
                .catch(error => {
                    console.error("Error updating campaign:", error);
                    toast.error("Failed to update campaign");
                });
    };
    return (
        <div>
            <div className=" p-2 sm:p-4 dark:text-green-600">
                <h6 className="text-center font-bold text-3xl md:text-5xl text-green-600">
                    Payment History
                </h6>
                <div>
                 <button className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white" onClick={() => document.getElementById('my_modal_8').showModal()}>Pay Now</button>
                                     <dialog id="my_modal_8" className="modal">
                                         <div className="modal-box">
                                             <form onSubmit={(e) => handlePayment(e)}>
                                                <div className="flex justify-center items-center gap-3">
                                                
                                                 <div className="mb-4">
                                                     <label className="block text-gray-700">New Amount</label>
                                                     <input required type="number" name="amount"  className="w-full border rounded p-2 mt-1" />
                                                 </div>
                                                 <div className="mb-4">
                                                     <label className="block text-gray-700">Note</label>
                                                     <input required type="text" name="note"  className="w-full border rounded p-2 mt-1" />
                                                 </div>
                                                </div>
                                                 <div className="flex justify-center items-center gap-4">
                                                     <div className="mb-4">
                                                         <label className="block text-gray-700">Payment Method</label>
                                                         <select  name="paymentMethod" className="w-full border rounded p-2 mt-1">
                                                         <option disabled value="">Select an Method</option>
                                                             <option value="bkashMarchent">Bkash Marchent</option>
                                                             <option value="bkashPersonal">Bkash Personal</option>
                                                             <option value="nagadPersonal">Nagad Personal</option>
                                                             <option value="rocketPersonal">Rocket Personal</option>
                                                             <option value="bank">Bank</option>
                                                         </select>
                                                     </div>
                                                     <div className="mb-4">
                                                         <label className="block text-gray-700">Date</label>
                                                         <input required type="date" name="date" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                                     </div>
                                                 </div>
                                                 <button type="submit" className="font-avenir flex justify-center  px-3 mx-auto py-1 bg-neutral rounded text-white">Pay Now</button>
                                             </form>
                                             <div className="modal-action lex justify-center">
                                                 <form method="dialog">
                                                     <button className="btn btn-primary">Close</button>
                                                 </form>
                                             </div>
                                         </div>
                                     </dialog>
                 </div>
                <div className="overflow-x-auto mt-6">
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
                            {Histry.map((payment, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{payment.date}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">৳ {payment.amount}</td>
                                  
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

                                           <button className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById(`modal_${payment._id}`).showModal()}>
                                            Edit
                                            </button>

                                          <dialog id={`modal_${payment._id}`} className="modal">
                                              <div className="modal-box">
                                                  <form onSubmit={(e) => handleUpdatePayment(e, payment._id)}>
                                                      <div className="flex justify-center items-center gap-3">
                                                      
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> Previous Amount</label>
                                                              <input type="number" name="previousAmount" disabled   defaultValue={payment?.amount} className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700"> New Amount</label>
                                                              <input type="number" name="amount"   defaultValue={payment.amount} className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                          
                                                      </div>
                                                      <div className="flex justify-center items-center gap-3">
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700"> Date</label>
                                                              <input type="date" defaultValue={payment.date} name='date'  className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                     
                                                      <div className="mb-4">
                                                          <label className="block text-gray-700">Method</label>
                                                          <select name="method" defaultValue={payment.paymentMethod} className="w-full border rounded p-2 mt-1">
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
                                                              <input type="text" name="note" defaultValue={payment?.note} className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                      <button onClick={() => document.getElementById(`modal_${payment._id}`).close()} type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white">Update</button>
                                                  </form>
                                                  {/* <div className="modal-action">
                                                      <button className="btn" onClick={() => document.getElementById(`modal_${payment._id}`).close()}>Close</button>
                                                  </div> */}
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
        </div>
    );
};

export default PaymentHistry;