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
  
  return (
    <div className="mt-10">
      <ToastContainer></ToastContainer>
      <Helmet>
        <title>All Clients | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="grid grid-cols-2 justify-center items-center gap-5 px-5 text-white pb-5">

  <div className="bg-blue-600 rounded-lg p-5">

  </div>

  <div className="bg-red-600 p-5 rounded-lg">
   
  </div>
</div>




      <div className="lg:flex gap-5 mr-5 lg:justify-end  items-center">
        <div className="flex justify-center ">
          <select
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
            type="text"
            placeholder="Search by Phone..."
            className="rounded-lg bg-white w-full ml-5 lg:ml-0 placeholder-black border border-gray-700 px-5 p-2 text-black text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-5  text-black">
        <div className="overflow-x-auto rounded-lg text-black border-black">
          <table className="min-w-full text-black bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
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
              {filteredByCategory.map((campaign, index) => (
                <tr
                  key={campaign._id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white  border-b border-opacity-20"
                      : "bg-gray-200  border-b border-opacity-20"
                  }`}
                >
                  <td className="p-3 border-l-2 border-r-2 border-gray-300 text-center">
                    {index + 1}
                  </td>
<td className="p-3 border-r-2 hover:text-blue-700 hover:font-bold text-start border-gray-300 ">
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

                  <td className="p-3 border-r-2 border-gray-300 text-center">
                    {campaign.clientPhone}
                    </td>
                    <td className="p-3 border-r border-gray-400 text-center">

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
                  <td className="p-3 border-r border-gray-400 text-center">
  
  ৳ 
  {
  (
    Mpayment
      .filter(payment => payment.clientEmail === campaign.clientEmail)
      .reduce((acc, payment) => acc + parseFloat(payment?.amount || 0), 0).toFixed(2) 
  ) 
}
</td>

     <td className="p-3 border-r border-gray-400 text-center">
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

                  <td className="p-3 border-r-2 border-gray-200 text-center">
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
              <tr className="bg-[#05a0db] text-sm text-white font-bold">
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllClients;
