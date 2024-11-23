import { Link } from "react-router-dom";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import useCampaings from "../../Hook/useCampaign";
import useMpayment from "../../Hook/UseMpayment";

const AllClients = ({}) => {
  const [users] = useUsers();
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [clients, refetch] = useClients();
  const [filteredClients, setFilteredClients] = useState([]);
  const initialTab = localStorage.getItem("activeTaballClients") ;
  const [selectedClient, setSelectedClient] = useState(initialTab);
  
  const activeTab = (tab) => {
    setSelectedClient(tab);
    localStorage.setItem("activeTaballClients", tab); 
  };

  useEffect(() => {
    if (users && user) {
      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);
    }


  }, [users, user]);

  useEffect(() => {
    if (clients) {
      setFilteredClients(clients);
    }

    const email = selectedClient
    if (email === "") {
      setFilteredClients(clients); 
    } else {
      const filtered = clients.filter((c) => c.employeeEmail === email);
      setFilteredClients(filtered);
    }
  }, [clients,selectedClient]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredClients.filter((item) =>
    item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;

  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  useEffect(() => {
    const totalRcv = filteredByCategory.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);
    }, 0);
    setTotalRCV(totalRcv);

    const totalBill = filteredByCategory.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBill),
      0
    );
    setTotalBill(totalBill);
  }, [filteredByCategory]);

  const AxiosPublic = UseAxiosPublic();
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this client!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete client",
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosPublic.delete(`/clients/${id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your client has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const clientPhone = e.target.clientPhone.value;
    const clientEmail = e.target.clientEmail.value;
    const body = { clientName, clientEmail,  clientPhone };

    AxiosPublic.patch(
      `https://digital-networking-server.vercel.app/client/update/${id}`,
      body
    )
      .then((res) => {
        refetch();
        toast.success("client updated successfully");
        document.getElementById(`modal_${id}`).close()
      })
      .catch((error) => {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign");
      });
  };


  const [campaigns]=useCampaings()
  const [Mpayment]=useMpayment()
  

  const totalSpent = campaigns.reduce(
    (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
    0
  );
  
  const totalPayment = Mpayment.reduce(
    (acc, payment) => acc + parseFloat(payment?.amount || 0),
    0
  );

  const total = (totalSpent - totalPayment).toFixed(2);



  const [showAll, setShowAll] = useState(false);
  const [itemsToShow] = useState(50); 
  const displayedItems = showAll ? filteredByCategory : filteredByCategory.slice(0, itemsToShow);
  
  return (
    <div className="mt-5">
      <ToastContainer></ToastContainer>
      <Helmet>
        <title>All Clients | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      {/* <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}} className="grid lg:grid-cols-4 mx-5 grid-cols-2 text-black sm:grid-cols-2 gap-3 lg:gap-5 justify-around p-5 rounded-lg lg:py-5 pb-5">
      <div className="px-5 py-10 rounded-2xl bg-[#b7cc50] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">Total Spent</h2>
  <p className="lg:text-2xl md:text-3xl text-md font-bold mt-2">
  $ {
    filteredClients
      ?.flatMap(client => client?.campaigns || []) // Use an empty array if campaigns is undefined
      ?.reduce((acc, curr) => acc + (parseFloat(curr.tSpent) || 0), 0).toFixed(0) // Sum up `tSpent` values
  }
</p>

</div>


<div className="px-5 py-10 rounded-2xl bg-[#5422c0] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">Total Bill</h2>
  <p className="lg:text-2xl md:text-3xl text-md font-bold mt-2">
        <span className='font-extrabold lg:text-4x text-md'> ৳ </span>
        {
          (filteredClients
            ?.flatMap(client => client.campaigns || [])
            ?.reduce((acc, curr) => {
              const tSpent = parseFloat(curr.tSpent).toFixed(0) || 0;
              const dollerRate = parseFloat(curr.dollerRate).toFixed(0) || 0;
              return acc + (tSpent * dollerRate)
            }, 0)
          )
        }
      </p>
</div>


        <div className="px-5 py-10 rounded-2xl bg-[#05a0db] text-white shadow-lg text-center">
          <h2 className="lg:text-2xl text-xl font-bold">Total Paid</h2>
          <p className="lg:text-2xl md:text-3xl text-md font-bold mt-2">
  <span className='font-extrabold lg:text-4x text-md'> ৳ </span>
  {
    filteredClients
      ?.flatMap(client => client.payments || []) 
      ?.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toFixed(0) 
  }
</p>

        </div>

    





        <div  className="px-5 py-10 rounded-2xl bg-[#ce1a38] text-white shadow-lg text-center">
  <h2 className="lg:text-2xl text-xl font-bold">
    {
      ((
        (filteredClients
          ?.flatMap(client => client.campaigns || []) 
          ?.reduce((acc, curr) => {
            const tSpent = parseFloat(curr.tSpent) || 0; // Safely parse tSpent
            const dollerRate = parseFloat(curr.dollerRate) || 0; // Safely parse dollerRate
            return acc + (tSpent * dollerRate); // Accumulate the total
          }, 0) || 0 // Fallback to 0 if no campaigns exist
        ).toFixed(0) - 
        (filteredClients
          ?.flatMap(client => client.payments || []) 
          ?.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0).toFixed(0) 
      ) > 0 ? "Avarage":"Avarage")
    }
  </h2>
  <p className="lg:text-2xl md:text-3xl text-md font-bold mt-2">
    <span className='font-extrabold text-md'> ৳ </span> 
    {
      Math.abs(
        (
          (filteredClients
            ?.flatMap(client => client.campaigns || []) 
            ?.reduce((acc, curr) => {
              const tSpent = parseFloat(curr.tSpent) || 0; // Safely parse tSpent
              const dollerRate = parseFloat(curr.dollerRate) || 0; // Safely parse dollerRate
              return acc + (tSpent * dollerRate); // Accumulate the total
            }, 0) || 0 // Fallback to 0 if no campaigns exist
          ).toFixed(0) - 
          (filteredClients
            ?.flatMap(client => client.payments || []) 
            ?.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0).toFixed(0)
        )
      )
    }
  </p>
</div>

      </div> */}



      <div className='px-5 pb-5 mx-5 my-5 mt-5 rounded-lg' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>
      <div className="lg:flex gap-3 mr-3 lg:justify-start mt-5  items-center">
        <div className="flex justify-center ">
          <select
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            name="email"
            className="border bg-white w-full ml-5 lg:ml-0 border-gray-700 text-black rounded p-2 mt-1"
            onChange={(e) => activeTab(e.target.value)}
            value={selectedClient}
          >
            <option value="">All Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.email}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mt-5 lg:mt-0">
          <input
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            type="text"
            placeholder="Search by Phone..."
           className="border bg-white w-full ml-5 lg:ml-0 border-gray-700 text-black rounded p-2 mt-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className=" mt-5  text-black">
      <div  className="overflow-x-auto rounded-xl  text-center " style={{  color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="" style={{backgroundColor: 'var(--bg-color)', border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}}>
                <th className="p-3 text-center">SL</th>
                <th className="p-3 text-start">Client Name</th>
                <th className="p-3 text-center">Client Phone</th>
                <th className="p-3 text-center">Total Bill</th>
                <th className="p-3 text-center">Total Payment Rcv</th>
                <th className="p-3 text-center">Total Due</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((campaign, index) => (
               <tr style={{ backgroundColor: 'var(--bg-table)', color: 'var(--text-color2)'}}
               key={campaign._id}
               className={`${
                 index % 2 === 0
                   ? "bg-white text-left text-black border-b border-opacity-20"
                   : "bg-gray-200  text-left text-black border-b border-opacity-20"
               }`}
             >
                  <td style={{  border: 'var(--border)'}} className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
                    {index + 1}
                  </td>
<td style={{  border: 'var(--border)'}} className="p-3 border-r-2 hover:text-blue-700 hover:font-bold text-start border-gray-300 ">
  <Link to={`/dashboard/client/${campaign.clientEmail}`} className="flex justify-start items-center">
    {campaign.clientName}
    {
      (() => {
        const balance = (
          (
            campaigns
              .filter(payment => payment.clientEmail === campaign.clientEmail)
              .reduce(
                (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
                0
              )
          ) -
          (
            Mpayment
              .filter(payment => payment.clientEmail === campaign.clientEmail)
              .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
          )
        ).toFixed(2);

        if (balance > 0) {
          return <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">Due</span>;
        } else if (balance < 0) {
          return <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">Advance</span>;
        } else {
          return <span className="ml-2 px-2 py-1 bg-blue-200 text-green-600 text-xs font-semibold rounded-full">Clear</span>
        }
      })()
    }
  </Link>
</td>

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-300 text-center">
                    {campaign.clientPhone}
                    </td>
                    <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">

৳ 
  {
  (
    campaigns
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce(
        (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
        0
           ).toFixed(2)
   )
}

</td>
                  <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">
  
  ৳ 
  {
  (
    Mpayment
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2) 
  ) 
}
</td>

     <td style={{  border: 'var(--border)'}} className="p-3 border-r border-gray-400 text-center">
  ৳
  {
    (
      (
        campaigns
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce(
            (acc, campaign) => acc + parseFloat(campaign.tSpent) * parseFloat(campaign.dollerRate),
            0
          )
      )
      -
      (
        Mpayment
          .filter(payment => payment.clientEmail === campaign.clientEmail)
          .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0)
      )
    ).toFixed(2)
  }
</td>

                  <td style={{  border: 'var(--border)'}} className="p-3 border-r-2 border-gray-200 text-center">
                  <button
 className="bg-green-700 hover:bg-blue-700 mr-3 text-white px-2 py-1 rounded"
    onClick={() =>
      document.getElementById(`modal_${campaign._id}`).showModal()
    }
  >
    Edit
  </button>

  <dialog id={`modal_${campaign._id}`} className="modal">
    <div className="modal-box bg-white text-black">
      <form onSubmit={(e) => handleUpdate(e, campaign._id)}>
        <h1 className="text-md mb-5">
          Client Name:{" "}
          <span className="text-blue-600 text-xl font-bold">
            {campaign.clientName}
          </span>
        </h1>

        <div className="mb-4">
          <label className="block text-start text-gray-700">Client Name</label>
          <input
            type="text"
            name="clientName"
            defaultValue={campaign?.clientName}
            className="w-full border-black bg-white border rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-start text-gray-700">Phone</label>
          <input
            type="text"
            name="clientPhone"
            defaultValue={campaign?.clientPhone}
            className="w-full bg-white border-black border rounded p-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-start text-gray-700">Email</label>
          <input
            type="email"
            name="clientEmail"
            disabled
            defaultValue={campaign?.clientEmail}
            className="w-full border-black bg-white border rounded p-2 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              document.getElementById(`modal_${campaign._id}`).close()
            }
            type="button"
            className="font-avenir hover:bg-red-700 px-3 py-1 bg-red-600 rounded-lg text-white"
          >
            Close
          </button>
          <button
            type="submit"
            className="font-avenir hover:bg-indigo-700 px-3 py-1 bg-[#05a0db] rounded-lg text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </dialog>
                    <button
                       className="bg-red-700 text-white px-2 py-1 rounded"
                      onClick={() => handledelete(campaign._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {/* <tr style={{border: 'var(--border)',borderLeft: 'var(--border)', borderRight: 'var(--border)', color: 'var(--text-color)'}} className=" text-sm  font-bold">
             
                <td className="p-3 border-black text-right" colSpan="3">
                  Total :
                </td>
               
                <td className="p-3 border-black text-center">
                  ৳ {totalbill.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center">
                  ৳ {(totalbill - totalRCV).toFixed(2)}
                </td>
                <td className="p-3 border-black text-center">
                  ৳ {totalRCV.toFixed(2)}
                </td>
                <td className="p-3 border-black text-center"></td>
              </tr> */}
            </tbody>
          </table>
         
        </div>
      </div>
      </div>
      {!showAll && filteredByCategory.length > itemsToShow && (
  <button
    onClick={() => setShowAll(true)}
    className="mt-4 p-2 mx-auto flex justify-center my-10 bg-blue-500 text-white rounded"
  >
    Show All
  </button>
)}
{showAll && (
  <button
    onClick={() => setShowAll(false)}
    className="mt-4 p-2  mx-auto flex justify-center my-10 bg-gray-500 text-white rounded"
  >
    Show Less
  </button>
)}
    </div>
  );
};

export default AllClients;
