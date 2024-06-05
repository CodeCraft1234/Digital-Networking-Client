import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useLoaderData, useParams,  } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import PaymentHistry from "./PaymentHistry";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const userr = useLoaderData();
    const param=useParams()
    console.log(param?.email)

    const AxiosPublic = UseAxiosPublic();
    const [data, setData] = useState({});

    const [campaign, refetch] = useCampaings();

    const [totalSpent, setTotalSpent] = useState(0);
    const [dollerRate, setDollerRate] = useState(0);
    const [totalBudged, setTotalBudged] = useState(0);
    const [totalPaymeent, setTotalPayment] = useState([]);
    const [Histry, setHistry] = useState([]);
    console.log(Histry);



    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
  
    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === user?.email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user]);
  
    console.log(ddd?.role);


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

        AxiosPublic.get(`https://digital-networking-server.vercel.app/MPayment`)
            .then(res => {
                const mdata = res.data;
                console.log(mdata)

                const realdata = mdata.filter(m => m.clientEmail === param?.email);
                setHistry(realdata);
                const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.amount), 0);
                setTotalPayment(totalBill);
            })
            .catch(error => {
                console.error("Error fetching payment data:", error);
                toast.error("Failed to fetch payment data");
            });
    }, [param?.email]);

    const handlePayment = async (e) => {
        e.preventDefault();
        const paymentMethod = e.target.paymentMethod.value;
        const amount = parseFloat(e.target.amount.value);
        const date = e.target.date.value;
        const note = e.target.note.value;
        const clientEmail = param?.email;
        const employeeEmail = user?.email;
    
        const body = { paymentMethod, amount,note, clientEmail, employeeEmail, date };
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
        const tPayment = totalPaymeent + amount; // Ensure this variable is defined and correct
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

    const [dataa2, setData2] = useState([]);
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

    const handleUpdate = (e, id) => {
        e.preventDefault();
        const tSpent = e.target.totalSpent.value;
        const status = e.target.status.value;
        const dollerRate = e.target.dollerRate.value;
        const tBudged = e.target.tBudged.value;

       

        const body = { tSpent, status,dollerRate,tBudged }

        AxiosPublic.patch(`https://digital-networking-server.vercel.app/campaings/${id}`, body)
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

   


    
    

    const [clients]=useClients()

    const handleaddblog=(e)=>{
        e.preventDefault()
        const campaignName=e.target.campaignName.value
        const clientEmail=param?.email
        const pageName=e.target.pageName.value
        const pageURL=e.target.pageURL.value
        const tBudged=e.target.totalBudged.value
        const adsAccount=e.target.adsAccount.value
        const email=user?.email
        const tSpent=0
        const dollerRate=140
        const status='In Review'
        const date=e.target.date.value
        const data={campaignName,clientEmail,pageURL,pageName,adsAccount,status,tBudged,email,tSpent,dollerRate,date}
       console.log(data)
       
       AxiosPublic.post('https://digital-networking-server.vercel.app/campaigns',data)
       .then(res=>{
        console.log(res.data)
        refetch()
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


    const handleUpdatePayment=(e, id)=>{
        e.preventDefault();
        const amount = e.target.amount.value;
        const date = e.target.date.value;
        const note = e.target.note.value;
        const method = e.target.method.value;
        const body = { note,amount,date,method }

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
     }


     const [adsAccount, refetchh] = useAdsAccount();
     const [adsAccounts, setAdsAccounts] = useState([]);
     console.log(adsAccounts)
   
     useEffect(() => {
       const filterdata = adsAccount.filter((m) => m.employeeEmail === user?.email);
       console.log(filterdata);
       setAdsAccounts(filterdata);
   
     }, [adsAccount, user?.email]);

    return (
        <div className="mt-24">
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 justify-around p-5">
                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Spent</h2>
                    <p className="text-xl">Balance: $ {totalSpent}</p>
                    
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Bill</h2>
                    <p className="text-xl">Balance: ৳ {parseInt(totalSpent * dollerRate)}</p>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Paid</h2>
                    <p className="text-xl">Balance: ৳ {parseInt(totalPaymeent)}</p>

                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total DUE</h2>
                    <p className="text-2xl">Balance: ৳{ parseInt(totalSpent * dollerRate - totalPaymeent)}</p>
                </div>
            </div>


           
              



            <div className="p-4">
                <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">Campaign List </h6>
                 <div className="flex ml-10 text-start justify-start items-center ">
                 <div>

                 <button className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white" onClick={() => document.getElementById('my_modal_2').showModal()}>Add Campaign</button>
                                     <dialog id="my_modal_2" className="modal">
                                         <div className="modal-box">        
                                         <section className=" dark:text-gray-100">
                                
                                <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow text-black font-bold">
                                <div>
                                <h1 className="text-3xl my-4 text-center font-bold  text-white">Add a Campaign </h1>
                                    <div className="flex justify-center  items-center gap-10">
                                    <div>
                                        <label for="date" className="block mb-1 ">Date</label>
                                        <input id="date" name="date" type="date" placeholder="type...." required className="block w-full p-2 border-2 border-black rounded focus:outline-none focus:ring focus:ri focus:ri " />
                                    </div>
                                    
                                    </div>
                                    <div>
                                        <label for="name" className="block mb-1 ml-1">Campaign Name</label>
                                        <input id="name" name="campaignName" type="text" placeholder="type...." required className="block w-full p-2 rounded focus:outline-none focus:ring border-2 border-black focus:ri focus:ri " />
                                    </div>
                                    <div className="flex justify-center items-center gap-3">
                                    
                                   

                                    <div className="">
                                            <label className="block  text-black">Ads Account</label>
                                            <select required  name="adsAccount" className="w-full border rounded p-2 mt-1  border-black">
                                            <option className="text-black" value="">All Ads Account</option>
                                            {
                                            adsAccounts.map(ads=> <option  key={ads._id} value={ads?.accountName}>{ads?.accountName}</option>)
                                            } 
                                            </select>
                                        </div>
                                   
                                       
                                        
                                    <div>
                                        <label for="name" className="block mb-1 ml-1">Page URL</label>
                                        <input id="name" name="pageURL" type="text" placeholder="type...." required className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri border-2 border-black" />
                                    </div>
                                    </div>
                                    <div className="flex justify-center items-center gap-3">


                                    <div>
                                        <label for="name" className="block mb-1 ml-1">Page Name</label>
                                        <input id="name" name="pageName" type="text" placeholder="type...." required className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri border-2 border-black" />
                                    </div>



                                  
                                    <div>
                                        <label for="name" className="block mb-1 ml-1">Total Budged</label>
                                        <input step="0.01" id="name" name="totalBudged" type="number" placeholder="type...." required className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri border-black border-2" />
                                    </div>
                                    </div>
                                   
                                    
                                 </div>
                                   <button method="dialog"  className="font-avenir px-3 flex justify-center  mx-auto py-1 bg-green-800  rounded-lg text-white">Submit</button>
                                  </Form>
                                          </section>
                                             <div className="modal-action flex justify-end">
                                                 <form method="dialog">
                                                     <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                                                 </form>
                                             </div>
                                         </div>
                                     </dialog>
                 </div>

                 
                
                               </div> 
            



                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Campaign Name</th>
                                <th className="p-3">Ads Account</th>
                                
                                <th className="p-3">T. Budget</th>
                                <th className="p-3">T. Spent</th>
                                <th className="p-3">Total Bill</th>
                                <th className="p-3">Status</th>
                                {
                                     ddd?.role === 'admin' ? <></> :  <th className="p-3">Edit</th>
                                }
                               
                            </tr>
                        </thead>
                        <tbody>
                            {dataa2.map((work, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                    <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">{work._id.slice(-5)}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{work.date}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{work.campaignName}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center">{work.adsAccount}</td>
                                    
                                    <td className="p-3 border-r-2 border-gray-200 text-center"><span className="text-md mr-1 font-extrabold">$</span>  {work.tBudged}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center"><span className="text-md mr-1 font-extrabold">$</span>  {work.tSpent}</td>
                                    <td className="p-3 border-r-2 border-gray-200 text-center"><span className="text-md mr-1 font-extrabold">৳</span> 
                                         {parseInt(work.tSpent * work.dollerRate)}</td>
                                    <td className={`p-3 text-center border-r-2 border-gray-200 ${work.status === "Active" ? "text-green-500" : "text-red-500"}`}>{work.status}</td>
                                    {
                                          ddd?.role === 'admin' ? <></> :    <td className="p-3 text-center border-r-2 border-gray-200">
                                          <button className="font-avenir px-3 flex justify-center  mx-auto py-1 bg-green-800  rounded-lg text-white" onClick={() => document.getElementById(`modal_${index}`).showModal()}>Edit</button>
                                          <dialog id={`modal_${index}`} className="modal">
                                              <div className="modal-box">
                                                  <form onSubmit={(e) => handleUpdate(e, work._id)}>
                                                  <h1 className="text-md mb-5">Ads Account: <span className="text-blue-600 text-xl font-bold">{work.adsAccount}</span></h1>
                                                      <div className="flex justify-center items-center gap-3">
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700">Total Budged</label>
                                                              <input type="number" name="tBudged" defaultValue={work.tBudged} 
                                                              step="0.01" className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                          <div className="mb-4">
                                                              <label className="block text-gray-700">Total Spent</label>
                                                              <input type="number" name="totalSpent" defaultValue={work.tSpent}  
                                                              step="0.01"
                                                              className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                      </div>
                                                      <div className="flex justify-center items-center gap-3">
                                                      <div className="mb-4">
                                                              <label className="block text-gray-700">Dollers Rate</label>
                                                              <input step="0.01" type="number" name="dollerRate" defaultValue={work.dollerRate} className="w-full border rounded p-2 mt-1" />
                                                          </div>
                                                      <div className="mb-4">
                                                          <label className="block text-gray-700">Status</label>
                                                          <select defaultValue={work.status}  name="status" className="w-full border rounded p-2 mt-1">
                                                              <option value="In Review">In Review</option>
                                                              <option value="Active">Active</option>
                                                              <option value="Complete">Complete</option>
                                                          </select>
                                                      </div>
                                                      </div>
                                                     
                                                      <button onClick={() => document.getElementById(`modal_${index}`).close()} type="submit" className="font-avenir px-3 flex justify-center  mx-auto py-1 bg-green-800  rounded-lg text-white">Update</button>
                                                  </form>
                                                  <div className="modal-action">
                                                      <button className="p-2 rounded-lg bg-red-600 text-white text-center" onClick={() => document.getElementById(`modal_${index}`).close()}>Close</button>
                                                  </div>
                                              </div>
                                          </dialog>
                                      </td>
                                    }
                                 
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3  text-center"></td>
                               
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right" colSpan="2">Total Spent:</td>
                                <td className="p-3 text-center"><span className="text-md mr-1 font-extrabold">$</span>  {totalSpent}</td>
                                <td className="p-3 text-center"><span className="text-md mr-1 font-extrabold">৳</span>  {totalSpent * dollerRate}</td>
                                <td className="p-3 text-center"></td>
                                {
                                     ddd?.role === 'admin' ? <></> :  <td className="p-3 text-center"></td>
                                }
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

 <PaymentHistry email={param?.email}></PaymentHistry>
            <ToastContainer />
        </div>
    );
};

export default UserProfile;