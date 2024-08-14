import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useLoaderData, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import PaymentHistry from "./PaymentHistry";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const userr = useLoaderData();
  const param = useParams();
  console.log(param?.email);

  const [clients]=useClients()
  const [datas,setdatas]=useState()
  console.log(datas);
  useEffect(() => {
  if (param?.email) {
      const realdata = clients.find((m) => m.clientEmail === param?.email);
      setdatas(realdata)
    }
  }, [param?.email, clients]);

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
      const fff = users.find((u) => u.email === user?.email);
      console.log(fff);
      setDdd(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  console.log(ddd?.role);

  useEffect(() => {
    AxiosPublic.get(
      `https://digital-networking-server.vercel.app/users/${userr.email}`
    )
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      });

    AxiosPublic.get(`https://digital-networking-server.vercel.app/MPayment`)
      .then((res) => {
        const mdata = res.data;
        console.log(mdata);

        const realdata = mdata.filter((m) => m.clientEmail === param?.email);
        setHistry(realdata);
        const totalBill = realdata.reduce(
          (acc, campaign) => acc + parseFloat(campaign.amount),
          0
        );
        setTotalPayment(totalBill);
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
        toast.error("Failed to fetch payment data");
      });
  }, [param?.email]);



  const [dataa2, setData2] = useState([]);
  console.log(param?.email);
  useEffect(() => {
    const filtered = campaign.filter(
      (campaign) => campaign.clientEmail === param?.email
    );
    console.log("hdjklhgsfdakgDSAOPJGIOJFDJGJHJFD", filtered);
    setData2(filtered);

    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(totalBill);

    const dollerRate = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.dollerRate),
      0
    );
    const vag = dollerRate / filtered.length;
    setDollerRate(vag);

    const total = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);
  }, [campaign, param?.email]);

  const handleUpdateTotalBudget = (e, id) => {
    e.preventDefault();
    const tBudged = e.target.tBudged.value;
    const body = { tBudged: tBudged };
    console.log(body);
    axios.put(`https://digital-networking-server.vercel.app/campaings/totalBudged/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        toast("update successfully")
        setTotalBudged(null);
      })
  };

  const handleUpdateTotalSpent = (e, id) => {
    e.preventDefault();
    const tSpent = e.target.tSpent.value;
    const body = { tSpent: tSpent };
    console.log(body);
    axios.put(`https://digital-networking-server.vercel.app/campaings/totalSpent/${id}`, body)
      .then((res) => {
        console.log(res.data);
        refetch();
        toast("update successfully")
        setTotalSpent(null);
      })
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const tSpent = e.target.totalSpent.value;
    const status = e.target.status.value;
    const dollerRate = e.target.dollerRate.value;
    const tBudged = e.target.tBudged.value;
    const body = { tSpent, status, dollerRate, tBudged };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/campaings/${id}`,
      body
    )
      .then((res) => {
        console.log(res.data);
        refetch();
        toast.success("Campaign updated successfully");
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };


  const handleaddblog = (e) => {
    e.preventDefault();
    const campaignName = e.target.campaignName.value;
    const clientEmail = param?.email;
    const pageName = e.target.pageName.value;
    const clientName = datas?.clientName
    const tBudged = e.target.totalBudged.value;
    const adsAccount = e.target.adsAccount.value;
    const email = user?.email;
    const tSpent = 0;
    const dollerRate = 140;
    const status = "In Review";
    const date = e.target.date.value;
    const data = {
      campaignName,
      clientEmail,
      pageName,
      adsAccount,
      status,
      tBudged,
      email,
      tSpent,
      dollerRate,
      date,
      clientName
    };
    console.log(data);

    AxiosPublic.post(
      "https://digital-networking-server.vercel.app/campaigns",
      data
    ).then((res) => {
      console.log(res.data);
      refetch();
      toast.success("add successful");
    });
  };

  const [dataa22, setData22] = useState([]);
  console.log(dataa2);

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.email === user?.email
    );
    console.log(filtered);
    setData22(filtered);
  }, [clients, user?.email]);

  const handledelete = (id) => {
        AxiosPublic.delete(`/campaigns/${id}`).then((res) => {
          refetch();
          toast.success("delete successful");
        });

     }
 

  const [adsAccount, refetchh] = useAdsAccount();
  const [adsAccounts, setAdsAccounts] = useState([]);
  console.log(adsAccounts);

  useEffect(() => {
    const filterdata = adsAccount.filter(
      (m) => m.employeeEmail === user?.email
    );
    console.log(filterdata);
    setAdsAccounts(filterdata);
  }, [adsAccount, user?.email]);

  return (
    <div className="mt-5">
       <Helmet>
       <title>{`User Profile | ${user?.displayName}`}</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around p-5">
        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="text-2xl font-bold">Total Spent</h2>
          <p className="text-4xl font-bold mt-2"> $ {totalSpent}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="text-2xl font-bold">Total Bill</h2>
          <p className="text-4xl font-bold mt-2">
             <span className="text-4xl font-extrabold">৳</span> {parseInt(totalSpent * dollerRate)}
          </p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="text-2xl font-bold">Total Paid</h2>
          <p className="text-4xl font-bold mt-2"> <span className="text-4xl font-extrabold">৳</span> {parseInt(totalPaymeent)}</p>
        </div>

        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="text-2xl font-bold">Total DUE</h2>
          <p className="text-4xl font-bold mt-2">
          <span className="text-4xl font-extrabold">৳</span> {parseInt(totalSpent * dollerRate - totalPaymeent)}
          </p>
        </div>
      </div>

      <div className="p-4">
        
        <div className="flex  text-start justify-start items-center ">
  <div>
    <button
      className="font-avenir px-6 mx-auto py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add Campaign
    </button>
    <dialog id="my_modal_2" className="modal overflow-y-hidden">
      <div className="modal-box bg-white">
        <section className="dark:text-gray-100">
          <Form
            onSubmit={handleaddblog}
            className=" w-full  p-3 mx-auto space-y-6 rounded-md  text-black font-bold"
          >
            <div>
              <h1 className="text-3xl my-4 text-center font-bold text-white">
                Add a Campaign
              </h1>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 ml-1">
                  Campaign Name
                </label>
                <input
                  id="name"
                  name="campaignName"
                  type="text"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-black">Ads Account</label>
                <select
                  required
                  name="adsAccount"
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                >
                  <option className="text-black" value="">
                    All Ads Account
                  </option>
                  {adsAccounts.map((ads) => (
                    <option key={ads._id} value={ads?.accountName}>
                      {ads?.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="pageName" className="block mb-1 ml-1">
                  Page Name
                </label>
                <input
                  id="pageName"
                  name="pageName"
                  type="text"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
              <div>
                <label htmlFor="totalBudged" className="block mb-1 ml-1">
                  Total Budged
                </label>
                <input
                  step="0.01"
                  id="totalBudged"
                  name="totalBudged"
                  type="number"
                  placeholder="type...."
                  required
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
            </div>

            {/* Buttons at the bottom in a two-grid layout */}
            <div className="grid grid-cols-2 gap-3 mt-4">
            <button
                type="button"
                className="p-2 rounded-lg bg-red-600 text-white text-center"
                onClick={() => document.getElementById("my_modal_2").close()}
              >
                Close
              </button>
              <button
                type="submit"
                className="font-avenir px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
              >
                Submit
              </button>
              
            </div>
          </Form>
        </section>
      </div>
    </dialog>
  </div>
</div>


        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3">SL</th>
                
                <th className="p-3">Date</th>
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Ads Account</th>

                <th className="p-3">T. Budget</th>
                <th className="p-3">T. Spent</th>
                <th className="p-3">Total Bill</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
               
              </tr>
            </thead>
            <tbody>
              {dataa2.map((work, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td className="p-3 border-r-2 border-gray-200 text-left">
                    {work.campaignName}
                  
                  </td>
                  
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    {work.adsAccount}
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  <div className="relative group flex items-center justify-center ">
                   
                   $ {work.tBudged}
                    <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_1`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>
                      <dialog id={`my_modal_1`} className="modal">
                        <div className="modal-box bg-white">
                          <form
                            onSubmit={(e) =>
                              handleUpdateTotalBudget(e, work._id)
                            }
                          >
                            <input
                              type="number"
                              name="tBudged"
                              step="0.01"
                              defaultValue={work?.tBudged}
                              className="w-full border bg-white rounded p-2 mt-1 text-gray-500"
                            />
                            <button
                              type="submit"
                              className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
                            >
                              Update
                            </button>
                          </form>

                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                        </div>
                      </dialog>
                    </div>
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  <div className="relative group flex items-center justify-center ">
                    
                    $ {work.tSpent}
                    <button
                        className="text-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() =>
                          document.getElementById(`my_modal_6`).showModal()
                        }
                      >
                        <FaEdit />
                      </button>
                      <dialog id={`my_modal_6`} className="modal">
                        <div className="modal-box bg-white">
                          <form
                            onSubmit={(e) =>
                              handleUpdateTotalSpent(e, work._id)
                            }
                          >
                            <input
                              type="number"
                              name="tSpent"
                              step="0.01"
                              defaultValue={work?.tSpent}
                              className="w-full border bg-white rounded p-2 mt-1 text-gray-500"
                            />
                            <button
                              type="submit"
                              className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-green-800"
                            >
                              Update
                            </button>
                          </form>

                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                        </div>
                      </dialog>
                    </div>
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {parseInt(work.tSpent * work.dollerRate)}
                  </td>
                  <td
                    className={`p-3 text-center border-r-2 border-gray-200 ${
                      work.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {work.status}
                  </td>
                  <td
                    className={`p-3 text-center border-r-2 border-gray-200`}
                  >
                   <div className="flex justify-start gap-3">

                   <div>
  <button
    className="text-blue-700 text-3xl"
    onClick={() =>
      document.getElementById(`modal_${index}`).showModal()
    }
  >
    <MdEditSquare />
  </button>
  <dialog id={`modal_${index}`} className="modal">
    <div className="modal-box bg-white text-black">
      <form onSubmit={(e) => handleUpdate(e, work._id)}>
        <h1 className="text-md mb-5">
          Ads Account:{" "}
          <span className="text-blue-600 text-xl font-bold">
            {work.adsAccount}
          </span>
        </h1>

        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Total Budged
          </label>
          <input
            type="number"
            name="tBudged"
            defaultValue={work.tBudged}
            step="0.01"
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Total Spent
          </label>
          <input
            type="number"
            name="totalSpent"
            defaultValue={work.tSpent}
            step="0.01"
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Dollers Rate
          </label>
          <input
            step="0.01"
            type="number"
            name="dollerRate"
            defaultValue={work.dollerRate}
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Status
          </label>
          <select
            defaultValue={work.status}
            name="status"
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          >
            <option value="In Review">In Review</option>
            <option value="Active">Active</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        {/* Buttons at the bottom in a two-grid layout */}
        <div className="grid grid-cols-2 gap-3 mt-4">
        <button
            type="button"
            className="p-2 rounded-lg bg-red-600 text-white text-center"
            onClick={() =>
              document.getElementById(`modal_${index}`).close()
            }
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
          >
            Update
          </button>
        
        </div>
      </form>
    </div>
  </dialog>
</div>

<button
                          className="text-start flex justify-start text-black text-3xl"
                          onClick={() => handledelete(work._id)}
                        >
                          <MdDelete />
                        </button>

</div>
                  </td>
                 
                </tr>
              ))}
              <tr className="bg-[#05a0db] text-white font-bold">
                <td className="p-3  text-center"></td>
                <td className="p-3 text-right" colSpan="4">
                  Total Spent:
                </td>
                <td className="p-3 text-start">
                  <span className="text-md mr-1 font-extrabold">$</span>{" "}
                  {totalSpent}
                </td>
                <td className="p-3 text-start">
                  <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                  {totalSpent * dollerRate}
                </td>


                {ddd?.role === "admin" ? (
                  <>
                    <td className="p-3 text-center"></td>
                    <td className="p-3 text-center"></td>
                  </>
                ) : (
                  <>
                   <td className="p-3 text-center"></td>
                  <td className="p-3 text-center"></td>
                
                  </>
                 
                )}
                 
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
