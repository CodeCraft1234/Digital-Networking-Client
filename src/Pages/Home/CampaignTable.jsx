import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css"
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";
import EmployeerMouthlySelery from "./EmployeerMouthlySelery";
import useClients from "../../Hook/useClient";
import { Form, Link, NavLink } from "react-router-dom";
import useAdsAccount from "../../Hook/useAdAccount";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";

import './BalanceCards.css';


const CampaignTable = ({ email }) => {
  console.log(email);
  const [clients, refetch] = useClients();
  const [adsAccount] = useAdsAccount();
  const AxiosPublic = UseAxiosPublic();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [data, setUserData] = useState([]);
  const [users] = useUsers();
  const [user, setUser] = useState(null);
  console.log("kjhgfaklhgklagshkl", clients, adsAccount);

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudged, setTotalBudged] = useState(0);
  const [totalRCV, setTotalRCV] = useState(0);
  const [totalbill, setTotalBill] = useState(0);

  console.log(totalSpent, totalBudged, totalRCV, totalbill);

  useEffect(() => {
    const filtered = clients.filter(
      (campaign) => campaign.employeeEmail === email
    );
    console.log(filtered);

    const totalRcv = filtered.reduce((acc, campaign) => {
      const payment = parseFloat(campaign.tPayment);
      return acc + (isNaN(payment) ? 0 : payment);
    }, 0);
    setTotalRCV(totalRcv);

    const tspent = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tSpent),
      0
    );
    setTotalSpent(tspent);

    const total = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBudged),
      0
    );
    setTotalBudged(total);

    const totalBill = filtered.reduce(
      (acc, campaign) => acc + parseFloat(campaign.tBill),
      0
    );
    setTotalBill(totalBill);

    setFilteredCampaigns(filtered);
  }, [clients, email]);


  const handlePayment = (e) => {};

  const handleaddblog = (e) => {
    e.preventDefault();
    const clientName = e.target.clientName.value;
    const clientPhone = e.target.clientPhone.value;
    const clientEmail = e.target.clientEmail.value;
    const employeeEmail = email;
    const tBudged = 0;
    const tSpent = 0;
    const tBill = 0;
    const tDue = 0;
    const tPaid = 0;
    const date = e.target.date.value;
    const data = {
      clientName,
      clientEmail,
      clientPhone,
      tBudged,
      employeeEmail,
      tSpent,
      tBill,
      date,
      tDue,
      tPaid,
    };
    console.log(data);

    AxiosPublic.post("https://digital-networking-server.vercel.app/clients", data)
    .then((res) => {
      toast.success("Client Added successfully");
      console.log(res.data);
    });
  };


  const [bkashMarcent,setBkashMarcentTotal]=useState(0)
  const [nagadPersonal,setNagadPersonalTotal]=useState(0)
  const [bkashPersonal,setBkashPersonalTotal]=useState(0)
  const [rocketPersonal,setRocketPersonalTotal]=useState(0)
  console.log(bkashMarcent,rocketPersonal,nagadPersonal,bkashPersonal)


  useEffect(()=>{
      AxiosPublic.get(`https://digital-networking-server.vercel.app/Mpayment`)
      .then(res => {
          console.log('sdjkhagjijkhgjkhdsajljkhgdsjkajkjkfjldfgjkgjkgd',res.data);
          const da=res.data
          const filtered=da.filter(f=> f.employeeEmail === email) 

          const filter2=filtered.filter(d=>d.paymentMethod === 'bkashMarchent')
          const total = filter2.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashMarcentTotal(total)

          const filter3=filtered.filter(d=>d.paymentMethod === 'nagadPersonal')
          const total3 = filter3.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setNagadPersonalTotal(total3)

          const filter4=filtered.filter(d=>d.paymentMethod === 'bkashPersonal')
          const total4 = filter4.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setBkashPersonalTotal(total4)

          const filter5=filtered.filter(d=>d.paymentMethod === 'rocketPersonal')
          const total5 = filter5.reduce((acc, datas) => acc + parseFloat(datas.amount),0);
          setRocketPersonalTotal(total5)
         
      })
  },[email])

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredItems = filteredCampaigns.filter((item) =>
    item.clientPhone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = selectedCategory
    ? filteredItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : filteredItems;


  return (
    <div className="my-24 mb-24">
       <div className="balance-cards-container">
      <div className="balance-card">
        <img className="balance-card-img" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
        <p className="balance-card-text">Balance: ৳ {bkashMarcent}</p>
      </div>
      <div className="balance-card">
        <img className="balance-card-img" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
        <p className="balance-card-text">Balance: ৳ {bkashPersonal}</p>
      </div>
      <div className="balance-card">
        <img className="balance-card-img" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
        <p className="balance-card-text">Balance: ৳ {nagadPersonal}</p>
      </div>
      <div className="balance-card">
        <img className="balance-card-img" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
        <p className="balance-card-text">Balance: ৳ {rocketPersonal}</p>
      </div>
      <div className="balance-card">
        <img className="balance-card-img" src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
        <p className="balance-card-text">Total USD: $4000</p>
        <p className="balance-card-text">Total Spent: ${totalSpent}</p>
      </div>
      <div className="balance-card summary-card">
        <p className="balance-card-text">Total Balance: ৳ 1000</p>
        <p className="balance-card-text">Total Received: ৳ {totalRCV}</p>
        <p className="balance-card-text">Total Cash Out: ৳ 10000</p>
      </div>
    </div>
      
      <h2 className="text-center mx-4 mt-10 py-4 text-white uppercase font-bold text-3xl md:text-5xl bg-green-800">
          Client Table
        </h2>
      <div className=" p-2  sm:p-4 ">
       
        <div className="overflow-x-auto  ">

        <div className="flex justify-start mb-5 text-gray-500 border-b border-opacity-20 mx-2 pb-1 items-center gap-3">

        <div >
          <button
            className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"

            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Add Client
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <section className="p-6 mt-24 dark:text-gray-100">
                <Form
                  onSubmit={handleaddblog}
                  className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900"
                >
                  <div>
                    <h1 className="text-3xl  text-center font-bold  text-gray-500">
                      Add a Client{" "}
                    </h1>
                    <div className="flex justify-center items-center gap-3 mt-2">
                      <div>
                        <label for="date" className="block mb-1 ml-1">
                          Date
                        </label>
                        <input
                          id="date"
                          name="date"
                          type="date"
                          placeholder="type...."
                          required=""
                          className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label for="name" className="block mb-1 ml-1">
                          Client Name
                        </label>
                        <input
                          id="name"
                          name="clientName"
                          type="text"
                          placeholder="type...."
                          required=""
                          className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                      <div>
                        <label for="name" className="block mb-1 ml-1">
                          Client Phone
                        </label>
                        <input
                          id="name"
                          name="clientPhone"
                          type="number"
                          placeholder="type...."
                          required=""
                          className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label for="name" className="block mb-1 ml-1">
                          Client Email
                        </label>
                        <input
                          id="name"
                          name="clientEmail"
                          type="text"
                          placeholder="type...."
                          required=""
                          className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 font-bold rounded-lg shadow focus:outline-none focus:ring hover:ring focus:ri bg-green-800 focus:ri hover:ri text-white">
                    Submit
                  </button>
                </Form>
              </section>
              <div className="modal-action">
                <form method="dialog">
                  <button className="p-2 rounded-lg bg-red-600 text-white text-center">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <div>
          <button
            className="font-avenir px-3  mx-auto py-1 bg-green-800 ml-10 rounded-lg text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Cashout
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <form onSubmit={(e) => handlePayment(e)}>
                <div className="flex justify-center items-center gap-3">
                  <div className="mb-4">
                    <label className="block text-gray-250">
                      Previous Received
                    </label>
                    <input
                      type="number"
                      disabled
                      name="previousReceived"
                      defaultValue={56345623}
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Pay Amount</label>
                    <input
                      type="number"
                      name="payAmount"
                      defaultValue={0}
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-250">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      className="w-full border rounded p-2 mt-1"
                    >
                      <option value="bkashMarchent">Bkash Marchent</option>
                      <option value="rocketPersonal">Bkash Personal</option>
                      <option value="rocketPersonal">Nagad Personal</option>
                      <option value="rocketPersonal">Rocket Personal</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-250">Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={0}
                      className="w-full border rounded p-2 mt-1"
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


      </div>


      <table className="min-w-full bg-white">
  <thead className="bg-red-800 text-white">
    <tr>
      <th className="p-3 text-center">Date</th>
      <th className="p-3 text-center">Client Name</th>
      <th className="p-3 text-center">Client Phone</th>
      {/* <th className="p-3 text-center">Client Email</th> */}
      <th className="p-3 text-center">T.Budget</th>
      <th className="p-3 text-center">T.Spent</th>
      <th className="p-3 text-center">Total Bill</th>
      <th className="p-3 text-center">Total Payment Rcv</th>
      <th className="p-3"></th>
    </tr>
  </thead>
  <tbody>
    {filteredByCategory.map((campaign, index) => (
      <tr
        key={campaign._id}
        className={`${
          index % 2 === 0
            ? "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
            : "text-gray-500 border-b border-opacity-20 hover:text-blue-600"
        }`}
      >
        <td className="p-3 text-center">{campaign.date}</td>
        <Link to={`/client/${campaign.clientEmail}`}>
          <td className="p-3 flex justify-center text-center">{campaign.clientName}</td>
        </Link>
        <td className="p-3 text-center">{campaign.clientPhone}</td>
        <td className="p-3 text-center">{campaign.tBudged}</td>
        <td className="p-3 text-center">{campaign.tSpent}</td>
        <td className="p-3 text-center">{campaign.tBill}</td>
        <td className="p-3 text-center">{campaign.tPayment}</td>
        <td className="p-3"></td>
      </tr>
    ))}
    <tr className="bg-green-800 text-sm text-white font-bold">
      <td className="p-3 text-center"></td>
      <td className="p-3 text-right" colSpan="2">
        Total :
      </td>
      <td className="p-3 text-center">{totalBudged}</td>
      <td className="p-3 text-center"> {totalSpent}</td>
      <td className="p-3 text-center">{totalbill}</td>
      <td className="p-3 text-center">{totalRCV}</td>
      <td className="p-3"></td>
    </tr>
  </tbody>
</table>

        </div>
      </div>
     
    </div>
  );
};
export default CampaignTable;