import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from "sweetalert2";

const ClientCampaign = () => {
    const { user } = useContext(AuthContext);
    const param = useParams();
    const [clients]=useClients()
    const [datas,setdatas]=useState()
    const AxiosPublic = UseAxiosPublic();
    const [campaign, refetch] = useCampaings();
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalBills, setTotalBills] = useState(0);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [dataa2, setData2] = useState([]);
    const [adsAccount] = useAdsAccount();
    const [adsAccounts, setAdsAccounts] = useState([]);

    useEffect(() => {
        const realdata = clients.find((m) => m.clientEmail === param?.email);
        setdatas(realdata)

        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 

      const filtered = campaign.filter(
        (campaign) => campaign.clientEmail === param?.email
      );
      setData2(filtered);

      const totalBill = filtered.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
      );
      setTotalBills(totalBill);
    
      const totalSpent = filtered.reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent),
        0
      );
      setTotalSpent(totalSpent);

      const filterdata = adsAccount.filter(
        (m) => m.employeeEmail === user?.email
      );
      setAdsAccounts(filterdata);

    }, [clients,users, user,campaign, param?.email,adsAccount, user?.email]);

    
    const handleUpdate = (e, id) => {
      e.preventDefault();
      const tSpent = e.target.totalSpent.value;
      const campaignName = e.target.campaignName.value;
      const status = e.target.status.value;
      const dollerRate = e.target.dollerRate.value;
      const tBudged = e.target.tBudged.value;
      const body = { tSpent,campaignName, status, dollerRate, tBudged };
  
      AxiosPublic.patch(
        `https://digital-networking-server.vercel.app/campaings/${id}`,
        body
      )
        .then((res) => {
          console.log(res.data);
          refetch();
          document.getElementById(`modal_${id}`).close();
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
      const pageUrl = e.target.pageUrl.value;
      const adsAccount = e.target.adsAccount.value;
      const email = user?.email;
      const tSpent = tBudged
      const dollerRate = 140;
      const status = "Active";
      const date = e.target.date.value;
      const data = {
        campaignName,
        clientEmail,
        pageName,
        adsAccount,
        status,
        pageUrl,
        tBudged,
        email,
        tSpent,
        dollerRate,
        date,
        clientName
      };
      console.log(data);
  
      AxiosPublic.post("/campaigns",data)
      .then((res) => {
        console.log(res.data);
        document.getElementById(`my_modal_2`).close();
        refetch();
      });
    };
    const handledelete = (id) => {
      // Show confirmation dialog
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
          // Proceed with delete
          AxiosPublic.delete(`/campaigns/${id}`)
            .then((res) => {
              toast.success("Delete successful!");
              refetch(); // Update the data after deletion
            })
            .catch((error) => {
              toast.error("Failed to delete. Please try again."); // Handle errors
            });
        }
      });
    };

    const handleUpdate2 = (id, newStatus) => {
      const body = { status: newStatus };
      AxiosPublic.patch(`https://digital-networking-server.vercel.app/campaings/status/${id}`, body)
        .then((res) => {
          console.log(res.data);
          refetch();
          toast.success(`Campaign updated successfully`);
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
       };

    return (
        <div>
            <div className="p-4">
        
  <div>
    <button
      className="font-avenir hover:bg-indigo-700 px-6 lg:w-auto w-full mx-auto  py-2 bg-[#05a0db] rounded-lg text-white"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add Campaign
    </button>
    <dialog id="my_modal_2" className="modal overflow-hidden">
      <div className="modal-box bg-white">
        <section className="dark:text-gray-100">
          <Form
            onSubmit={handleaddblog}
            className=" w-full  p-1 mx-auto space-y-5 rounded-md  text-black font-bold"
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
                  className="w-full border border-gray-600 text-black bg-green-300 rounded p-2 mt-1"
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
            <div className="flex items-center gap-2">
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
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 ml-1">
                Page Url
                </label>
                <input
                  id="name"
                  name="pageUrl"
                  type="text"
                  placeholder="type...."
                  className="w-full border border-gray-600 text-black bg-white rounded p-2 mt-1"
                />
              </div>
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

            <div className="grid grid-cols-2 gap-3 mt-4">
            <button
                type="button"
                className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
                onClick={() => document.getElementById("my_modal_2").close()}
              >
                Close
              </button>
              <button
                type="submit"
                className="font-avenir px-3 py-2 hover:bg-indigo-700 bg-[#05a0db] rounded-lg text-white text-center"
              >
                Submit
              </button>
              
            </div>
          </Form>
        </section>
      </div>
    </dialog>
  </div>

        <div className="overflow-x-auto text-black rounded-xl mt-5">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3">OFF/ON</th>    
                <th className="p-3">Date</th>
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Page Name</th>
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
                        <td className="p-3 border-r-2 border-l-2 border-gray-200 text-center">  <label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only"
    checked={work.status === "Active"}
    onChange={() => {
      const newStatus = work.status === "Active" ? "Complete" : "Active";
      handleUpdate2(work._id, newStatus);
    }}
  />
  <div
    className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
      work.status === "Active" ? "bg-blue-700" : "bg-gray-500"
    }`}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-linear transform ${
        work.status === "Active" ? "translate-x-6" : ""
      }`}
    ></span>
  </div>
</label>
</td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td className="p-3 border-r-2 border-gray-200 text-left">
                    {work.campaignName}
                  
                  </td>
                  <td className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-left">
                   <a href={`${work.pageUrl}`}> {work.pageName}</a>
                  
                  </td>
                  
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    {work.adsAccount}
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  $ {work.tBudged}
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                  $ {work.tSpent}
                  </td>

                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <span className="text-md mr-1 font-extrabold">৳</span>
                    {parseInt(work.tSpent * work.dollerRate)}
                  </td>
                  <td
                    className={`p-3 text-center border-r-2 border-gray-200 ${
                      work.status === "Active"
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }`}
                  >
                    {work.status}
                  </td>
                  <td
                    className={`p-3 text-center border-r-2 border-gray-200`}
                  >
                   <div className="flex justify-center gap-3">

                   <div>
  <button
    className="bg-green-700 hover:bg-blue-700 text-white px-2 py-1 rounded"
    onClick={() =>
      document.getElementById(`modal_${work._id}`).showModal()
    }
  >
      Edit
  </button>
  <dialog id={`modal_${work._id}`} className="modal">
    <div className="modal-box bg-white text-black">
      <form onSubmit={(e) => handleUpdate(e, work._id)}>
        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Campaign Name
          </label>
          <input
            type="text"
            name="campaignName"
            defaultValue={work.campaignName}
         
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            name="adsAccount"
            defaultValue={work.adsAccount}
          disabled
            className="w-full bg-white border border-gray-700 rounded p-2 mt-1"
          />
        </div>

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
            className="p-2 hover:bg-red-700 rounded-lg bg-red-600 text-white text-center"
            onClick={() =>
              document.getElementById(`modal_${work._id}`).close()
            }
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir hover:bg-indigo-700 px-3 py-2 bg-[#05a0db] rounded-lg text-white text-center"
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
                          onClick={() => handledelete(work._id)}
                        >
                        Delete
                        </button>

</div>
                  </td>
                 
                </tr>
              ))}
              <tr className="bg-[#05a0db] text-white font-bold">
                <td className="p-3  text-center"></td>
                <td className="p-3 text-right" colSpan="5">
                  Total Spent:
                </td>
                <td className="p-3 text-center">
                  <span className="text-md mr-1 font-extrabold">$</span>{" "}
                  {totalSpent}
                </td>
                <td className="p-3 text-center">
                  <span className="text-md mr-1 font-extrabold">৳</span>{" "}
                  {totalBills}
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
        </div>
    );
};

export default ClientCampaign;