import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useCampaings from "../../Hook/useCampaign";
import "react-toastify/dist/ReactToastify.css";
import useClients from "../../Hook/useClient";
import useUsers from "../../Hook/useUsers";
import useAdsAccount from "../../Hook/useAdAccount";

const ClientCampaign2 = () => {
    const { user } = useContext(AuthContext);
    const [clients]=useClients()
    const [campaign] = useCampaings();
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalBills, setTotalBills] = useState(0);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const [dataa2, setData2] = useState([]);
    const [adsAccount] = useAdsAccount();

    useEffect(() => {
        const fff = users.find((u) => u.email === user?.email);
        setDdd(fff || {}); 

      const filtered = campaign.filter(
        (campaign) => campaign.clientEmail === user?.email
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


    }, [clients,users, user,campaign, user?.email,adsAccount, user?.email]);

    
    return (
        <div>
            <div className="p-4">
  <div>
  </div>
        <div className="overflow-x-auto text-black rounded-xl mt-5">
          <table className="min-w-full bg-white">
            <thead className="bg-[#05a0db] text-white">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Page Name</th>
                <th className="p-3">Ads Account</th>
                <th className="p-3">T. Budget</th>
                <th className="p-3">T. Spent</th>
                <th className="p-3">Total Bill</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataa2.map((work, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                       
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
                </tr>
              ))}
              <tr className="bg-[#05a0db] text-white font-bold">
                <td className="p-3  text-center"></td>
                <td className="p-3 text-right" colSpan="4">
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

export default ClientCampaign2;