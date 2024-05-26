import { useContext, useEffect, useState } from "react";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useLoaderData } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useClients from "../../Hook/useClient";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const userr = useLoaderData();
    const AxiosPublic = UseAxiosPublic();
    const [data, setData] = useState({});
    const [dataa2, setData2] = useState([]);
    const [campaign, refetch] = useCampaings();
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalPaymeent, setTotalPayment] = useState([]);
    const [Histry, setHistry] = useState([]);
    console.log(totalSpent, totalPaymeent);

    useEffect(() => {
        AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data");
            });

        AxiosPublic.get(`http://localhost:5000/MPayment`)
            .then(res => {
                const mdata = res.data;
                const realdata = mdata.filter(m => m.email === userr?.email);
                setHistry(realdata);
                const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
                setTotalPayment(totalBill);
            })
            .catch(error => {
                console.error("Error fetching payment data:", error);
                toast.error("Failed to fetch payment data");
            });
    }, [userr.email]);

    useEffect(() => {
        const filtered = campaign.filter(campaign => campaign.clientEmail === userr?.email);
        console.log(filtered);
        setData2(filtered);

        const totalBill = filtered.reduce((acc, campaign) => acc + parseFloat(campaign.tSpent), 0);
        setTotalSpent(totalBill);
    }, [campaign, userr?.email]);

    const handleUpdate = (e, id) => {
        e.preventDefault();
        const newSpent = e.target.newSpent.value;
        const previousSpent = e.target.previousSpent.value;
        const status = e.target.status.value;
        console.log(newSpent, previousSpent, status);

        const tSpent = (parseFloat(previousSpent) + parseFloat(newSpent));
        const body = { tSpent, status };

        AxiosPublic.patch(`http://localhost:5000/campaings/${id}`, body)
            .then(res => {
                console.log(res.data);
                refetch();
                toast.success("Campaign updated successfully");
            })
            .catch(error => {
                console.error("Error updating campaign:", error);
                toast.error("Failed to update campaign");
            });
    };

    const handlePayment = (e) => {
        e.preventDefault();
        const paymentMethod = e.target.paymentMethod.value;
        const amount = e.target.amount.value;
        const date = e.target.date.value;
        const email = userr?.email;
        console.log(paymentMethod, amount);
        const body = { paymentMethod, amount, email, date };

        AxiosPublic.post(`http://localhost:5000/MPayment`, body)
            .then(res => {
                console.log(res.data);
                toast.success("Payment successful");
            })
            .catch(error => {
                console.error("Error processing payment:", error);
                toast.error("Failed to process payment");
            });
    };


    const [clients]=useClients()

    const handleaddblog=(e)=>{
        e.preventDefault()
        const campaignName=e.target.campaignName.value
        const clientEmail=userr?.email
        const pageName=e.target.pageName.value
        const tBudged=e.target.totalBudged.value
        const email=user?.email
        const tSpent=0
        const dollerRate=140
        const date=e.target.date.value
        const data={campaignName,clientEmail,pageName,tBudged,email,tSpent,dollerRate,date}
       console.log(data)
       
       AxiosPublic.post('https://digital-networking-server.vercel.app/campaigns',data)
       .then(res=>{
        console.log(res.data)
        toast.success("add successful");
       })
       }

       const [dataa22,setData22]=useState([])
       console.log(dataa2)

       useEffect(() => {
        const filtered = clients.filter(campaign => campaign.email === user?.email);
        console.log(filtered);
        setData22(filtered);
      }, [clients, user?.email]);

    return (
        <div>
            <div className="mt-24">
                <img className="rounded-full mx-auto w-72 h-72" src={data?.photo} alt="User Profile" />
            </div>

            <div className="flex flex-wrap justify-around p-5">
                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Spent</h2>
                    <p className="text-xl">Balance: $ {totalSpent}</p>
                    <button className="font-avenir px-3 mt-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById('my_modal_2').showModal()}>Add Campaign</button>
                    <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                            
                        <section className="p-6 mt-24 dark:text-gray-100">
               
               <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
               <div>
               <h1 className="text-3xl my-4 text-center font-bold  text-white">Add a Campaign </h1>
                   <div className="flex justify-center  items-center gap-10">
                   <div>
                       <label for="date" className="block mb-1 ">Date</label>
                       <input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                   <div className="flex justify-center items-center gap-3">
                   
                   <div>
                       <label for="name" className="block mb-1 ml-1">Campaign Name</label>
                       <input id="name" name="campaignName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Page Name</label>
                       <input id="name" name="pageName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                       <label for="name" className="block mb-1 ml-1">Page URL</label>
                       <input id="name" name="pageURL" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Total Budged</label>
                       <input id="name" name="totalBudged" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                  
                   
                </div>
                  <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
                 </Form>
                         </section>








                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Bill</h2>
                    <p className="text-xl">Balance: ৳ {totalSpent * 140}</p>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Paid</h2>
                    <p className="text-xl">Balance: ৳{totalPaymeent}</p>
                    <button className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Pay Now</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <form onSubmit={(e) => handlePayment(e)}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Amount</label>
                                    <input type="number" name="amount" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                </div>
                                <div className="flex justify-center items-center gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Payment Method</label>
                                        <select name="paymentMethod" className="w-full border rounded p-2 mt-1">
                                            <option value="bkashMarchent">Bkash Marchent</option>
                                            <option value="rocketPersonal">Bkash Personal</option>
                                            <option value="rocketPersonal">Nagad Personal</option>
                                            <option value="rocketPersonal">Rocket Personal</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Date</label>
                                        <input type="date" name="date" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                    </div>
                                </div>
                                <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white">Pay</button>
                            </form>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total DUE</h2>
                    <p className="text-2xl">Balance: ৳{totalSpent * 140 - totalPaymeent}</p>
                </div>
            </div>

            <div className="p-4">
                <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">Own Work List</h6>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Page Name & URL</th>
                                <th className="p-3">T. Budget</th>
                                <th className="p-3">T. Spent</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataa2.map((work, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                    <td className="p-3 text-center">{work.date}</td>
                                    <td className="p-3 text-center">{work.campaignName}</td>
                                    <td className="p-3 text-center">{work.tBudged}</td>
                                    <td className="p-3 text-center">{work.tSpent}</td>
                                    <td className={`p-3 text-center ${work.status === "Active" ? "text-green-500" : "text-red-500"}`}>{work.status}</td>
                                    <td className="p-3 text-center">
                                        <button className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById(`modal_${index}`).showModal()}>Edit</button>
                                        <dialog id={`modal_${index}`} className="modal">
                                            <div className="modal-box">
                                                <form onSubmit={(e) => handleUpdate(e, work._id)}>
                                                    <div className="flex justify-center items-center gap-3">
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">Previous Spent</label>
                                                            <input type="number" name="previousSpent" defaultValue={work.tSpent} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">New Spent</label>
                                                            <input type="number" name="newSpent" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700">Status</label>
                                                        <select name="status" className="w-full border rounded p-2 mt-1">
                                                            <option value="In Review">In Review</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Complete">Complete</option>
                                                        </select>
                                                    </div>
                                                    <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white">Update</button>
                                                </form>
                                                <div className="modal-action">
                                                    <button className="btn" onClick={() => document.getElementById(`modal_${index}`).close()}>Close</button>
                                                </div>
                                            </div>
                                        </dialog>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right" colSpan="2">Total Spent:</td>
                                <td className="p-3 text-center"> {totalSpent}</td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-24 p-2 sm:p-4 dark:text-green-600">
                <h6 className="text-center font-bold text-3xl md:text-5xl text-green-600">
                    Payment History
                </h6>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3">Payment Date</th>
                                <th className="p-3">Payment Amount</th>
                                <th className="p-3">Payment Method</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Histry.map((payment, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <td className="p-3 text-center">{payment.date}</td>
                                    <td className="p-3 text-center">৳ {payment.amount}</td>
                                    <td className="p-3 text-center">{payment.paymentMethod}</td>
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center" colSpan="1">
                                    Total Amount =
                                </td>
                                <td className="p-3 text-center">৳ {totalPaymeent}</td>
                                <td className="p-3 text-center"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UserProfile;
