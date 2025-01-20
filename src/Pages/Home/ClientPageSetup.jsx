import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import { Form, Link, useParams } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";
import Swal from "sweetalert2";
import useCampaingsByEmail from "../../Hook/useCampaignsByEmail";
import useMpymentsByEmail from "../../Hook/useMpaymentByEmail";
import { FaEdit, FaMinusSquare } from "react-icons/fa";
import useFindClient from "./useFindClient";
import SummaryCard from "./SummeryCard";

const ClientPageSetup = () => {
    const { user } = useContext(AuthContext);
    const param = useParams()
    const {findClients , refetch}=useFindClient(param?.email)
    const [campaignss]=useCampaingsByEmail(param?.email)
    const [clients]=useClients()
    const [datas,setdatas]=useState()
    const AxiosPublic = UseAxiosPublic();
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [adsAccount] = useAdsAccount();

    useEffect(() => {
        const realdata = clients.find((m) => m.clientEmail === param?.email);
        setdatas(realdata)

        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 

    }, [clients, users, user, param?.email, campaignss, adsAccount]);


    const handleUpdate = (e, ids, id) => {
      e.preventDefault();
      const itemName = e.target.itemName.value;
      const pageName = e.target.pageName.value;
      const totalBill = e.target.totalBill.value;
      const pageUrl = e.target.pageUrl.value;
      const role = e.target.role.value;

      const body = { itemName, pageUrl, totalBill, role, pageName };
      console.log(body);

      const datas = {
        title: `Updated ${itemName} in My Clients`,
        date: new Date(),
        user: user?.displayName,
      };
    
      AxiosPublic.patch(`/clientPageService/updates/${id}/${ids}`, body)
        .then((res) => {
          console.log("Update response:", res.data);
          refetch();
    
          AxiosPublic.post("/activity", datas).then(() => {
            const modalElement = document.getElementById(`modal_${ids}`);
            if (modalElement) {
              modalElement.close();
            }
            toast.success(`${itemName} has been successfully updated`);
          });
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          toast.error("Failed to update campaign");
        });
    };
    
  
    const handleaddblog = (e) => {
      e.preventDefault();
      const itemName = e.target.itemName.value;
      const clientEmail = param?.email;
      const pageName = e.target.pageName.value;
      const clientName = datas?.clientName
      const totalBill = e.target.totalBill.value;
      const pageUrl = e.target.pageUrl.value;
      const role = e.target.role.value;
      const email = user?.email;
      const status = "Active";
      const date = e.target.date.value;
      const ids = param?.email;

      const generateRandomId = () => {
        let randomId = '';
        for (let i = 0; i < 20; i++) {
          randomId += Math.floor(Math.random() * 10); // Append a random digit (0-9)
        }
        return randomId;
      };

      const idu=generateRandomId()
  
      const pageService = {
        itemName,
        id: ids,
        ids: parseFloat(idu),
        clientEmail,
        pageName,
        status,
        pageUrl,
        totalBill,
        email,
        role,
        date,
        clientName:findClients?.clientName
      };

      console.log(clientName);
    
      const datas2 = {
        title: `Added ${itemName} in Client campaign`,
        date: new Date(),
        user: user?.displayName,
      };
  
      AxiosPublic.post("/clients/pageService", { // Correct endpoint
        id: ids,
        pageService,
      })
      .then((res) => {
        console.log(res.data);
        AxiosPublic.post("/activity", datas2).then(() => {
          toast.success(`${itemName} has been successfully updated`);
        });
        document.getElementById(`my_modal_2`).close();
        refetch();
      });
    };

    const handledelete = (ids, id) => {
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
              AxiosPublic.delete(`/clientPageService/delete/${id}/${ids}`)
                  .then((res) => {
                      toast.success("Campaign deleted successfully!");
                      refetch(); // Refresh data after deletion
                  })
                  .catch((error) => {
                      console.error("Error deleting campaign:", error);
                      toast.error("Failed to delete the campaign. Please try again.");
                  });
          }
      });
  };

  const handleUpdate2 = (ids, id, status) => {
    const activityData = {
        title: `Updated ${status} in Client campaigns`,
        date: new Date(),
        user: user?.displayName,
    };
    
    AxiosPublic.put(`/clientPageService/${id}/${ids}`, { status })
        .then((res) => {
            console.log("Update Response:", res.data);
            refetch(); // Refresh data after update

            // Log the activity
            AxiosPublic.post("/activity", activityData)
                .then(() => {
                    document.getElementById(`modal_${id}`).close();
                    toast.success(`${status} has been successfully updated`);
                })
                .catch((activityError) => {
                    console.error("Activity log error:", activityError);
                    toast.error("Activity logging failed");
                });

            toast.success("Campaign updated successfully");
        })
        .catch((error) => {
            console.error("Error updating campaign:", error);
            toast.error("Failed to update campaign");
        });
};

       const today = new Date();
       const formattedDate = today.toISOString()?.split('T')[0];  
       
    return (
        <div>
            <div className="mt-5">

          

      <div  className="  side-space ">
        
  <div>

    {
      user && 
      <button
      className="add"
      onClick={() => document.getElementById("my_modal_2").showModal()}
    >
      Add a Item
    </button>
    }
   
    <dialog id="my_modal_2" className="modal overflow-hidden">
      <div className="modal-box bg-white">
        <section className="dark:text-gray-100">
          <Form
            onSubmit={handleaddblog}
            className=" w-full  p-1 mx-auto space-y-5 rounded-md  text-black font-bold"
          >
            <div>
              <h1 className="text-2xl mb-4 text-center font-bold text-black">
                Add a Item
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
                  defaultValue={formattedDate}
                  className="input2"
                />
              </div>

            <div className="grid lg:grid-cols-2 mb-4 gap-3 items-center">
            <div >
                <label htmlFor="name" className="block mb-1 ml-1">
                  Item Name
                </label>
                <input
                  id="name"
                  name="itemName"
                  type="text"
                  placeholder="type...."
                  required
                  className="input2"
                />
              </div>
              <div>
                <label htmlFor="totalBudged" className="block mb-1 ml-1">
                  Total Bill
                </label>
                <input
                  step="0.01"
                  id="totalBill"
                  name="totalBudged"
                  type="number"
                  placeholder="type...."
                  required
                  className="input2"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                  className="input2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 ml-1">
                Page Url <span className="text-red-600">(Optional)</span>
                </label>
                <input
                  id="name"
                  name="pageUrl"
                  type="text"
                  placeholder="type...."
                  className="input2"
                />
              </div>
            </div>

            <div className="mt-2 grid mb-4 lg:grid-cols-2">
  {[
    { value: "pageSetup", label: "Page Setup" },
    { value: "pageMonitization", label: "Page Monitization" },
    { value: "graphicDesign", label: "Graphic Design" },
    { value: "webDesign", label: "Web Design" },
  ].map(({ value, label }) => (
    <div className="form-control" key={value}>
      <label className="label flex justify-start items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="role"
          value={value}
          className="radio radio-primary"
          required
        />
        <span className="label-text text-black">{label}</span>
      </label>
    </div>
  ))}
</div>
              
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
            <button
                type="button"
                className="close"
                onClick={() => document.getElementById("my_modal_2").close()}
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
          </Form>
        </section>
      </div>
    </dialog>
  </div>

  <div  className="table-div mt-5" >
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" > 
              {
                      user && 
                <th  className="text-center">Items {campaignss?.length}</th> }
                <th >Date</th>
                <th >Item Name</th>
                <th >Page Name</th>
                <th >Total Bill</th>
                <th >Service</th>
                {
                      user &&
                <th  className="text-center">Status</th>}
              </tr>
            </thead>
            <tbody>
              {findClients.pageService?.map((work, index) => (
                 <tr 
                 key={work._id}
                 className={`tr2`}
               >
                {
                      user &&
                <td  className="text-center">
                  <div className="f-center">
                        <button
                           className=" delete"
                          onClick={() => handledelete( work.ids ,work.id)}
                        >
                         <span >
                          <FaMinusSquare  />
                          </span>
                          
                        </button>
                        <button
                        className=" edit"
                        onClick={() =>
                          document.getElementById(`modal_${work.ids}`).showModal()
                          }
                      >
                       <FaEdit /> 
                       
                      </button>
                      </div>
              
               <dialog id={`modal_${work.ids}`} className="modal">
               <div className="modal-box bg-white text-black">
               <form onSubmit={(e) => handleUpdate(e, work.ids, work.id)}>
  <div className="grid lg:grid-cols-2 gap-3">
    <div className="mb-4">
      <label className="block text-left text-gray-700">Item Name</label>
      <input
        type="text"
        name="itemName"
        defaultValue={work.itemName}
        className="input2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-left text-gray-700">Page Name</label>
      <input
        type="text"
        name="pageName"
        defaultValue={work.pageName}
        className="input2"
      />
    </div>
  </div>

  <div className="grid lg:grid-cols-2 gap-3">
    <div className="mb-4">
      <label className="block text-left text-gray-700">Page URL</label>
      <input
        type="text"
        name="pageUrl"
        defaultValue={work.pageUrl}
        className="input2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-left text-gray-700">Total Bill</label>
      <input
        type="number"
        name="totalBill"
        defaultValue={work.totalBill}
        step="0.01"
        className="input2"
      />
    </div>
  </div>

  <div className="mt-2 grid mb-4 lg:grid-cols-2">
    {[
      { value: "pageSetup", label: "Page Setup" },
      { value: "pageMonitization", label: "Page Monitization" },
      { value: "graphicDesign", label: "Graphic Design" },
      { value: "webDesign", label: "Web Design" },
    ].map(({ value, label }) => (
      <div className="form-control" key={value}>
        <label className="label flex justify-start items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="role"
            value={value}
            defaultChecked={work?.role === value} // Check if the role matches
            className="radio radio-primary"
            required
          />
          <span className="label-text text-black">{label}</span>
        </label>
      </div>
    ))}
  </div>

  <div className="grid grid-cols-2 gap-3 mt-4">
    <button
      type="button"
      className="close"
      onClick={() =>
        document.getElementById(`modal_${work.ids}`).close()
      }
    >
      Close
    </button>
    <button type="submit" className="add">
      Update
    </button>
  </div>
</form>

               </div>
                                    </dialog>  </td>
               }
                      
                  <td>
                  {new Date(work?.date).toLocaleDateString("en-GB")}
                  </td>
                  
                  <td >
 <span>
  {work.itemName
    ?.split(' ') // Split the campaign name into words
    .slice(0, 4) // Take only the first 6 words
    .join(' ') // Join the words back into a string
    + (work.itemName?.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  }
</span>
                      
                  
                  </td>
                  <td style={{  border: 'var(--border)'}} className="p-3 hover:text-blue-700 hover:font-bold border-r-2 border-gray-200 text-left">
                  
                   <Link to={work.pageUrl}>
                   {work.pageName
    .split(' ') 
    .slice(0, 4) 
    .join(' ') 
    + (work.pageName.split(' ').length > 4 ? '...' : '') // Add "..." if there are more than 6 words
  } 
                   </Link>
                  
                  </td>
                  
                

                  <td >
                  ৳ {work.totalBill || 0}
                  </td>
                  <td >
                   {work?.role}
                  </td>

              {
                user &&
              
                  <td className="text-center">
  <label className="status-label">
  <input
    type="checkbox"
    checked={work.status === "Active"}
    onChange={() => {
      const newStatus = work.status === "Active" ? "Complete" : "Active";
      handleUpdate2(work.ids ,work.id, newStatus);
    }}
  />
  <div className={work.status === "Active" ? "active" : "inactive"}>
    <span className={work.status === "Active" ? "active" : ""}></span>
  </div>
</label>

  </td>}
                 

                </tr>
              ))}
              <tr  className="tr1 font-bold">
              {
                user &&
                <td  ></td>}
                <td   className="p-3 text-right" colSpan="3">
                  Total:
                </td>
                <td  >
                  <span className="text-sm mr-1 font-extrabold">৳</span>{""}
                  {findClients?.pageService?.reduce((acc, payment) => acc + parseFloat(payment?.totalBill || 0), 0).toFixed(0) || 0}
                </td>
                <td >
               
                </td>
                {
                  user &&  <td >
                 
                  </td>
                }
               
                {ddd?.role === "admin" ? (
                  <>
                    <td ></td>
                  
                  </>
                ) : (
                  <>
                

                 
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        </div>

      </div>
        </div>
    );
};

export default ClientPageSetup;