
import { useState } from 'react';
import useAdAccount from '../../Hook/useAdAccount';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';

const AdAccountTable = () => {
  const [ads, refetch] = useAdAccount();
  console.log(ads);

  const [data,setdata]=useState();
  const AxiosPublic=UseAxiosPublic();
 
  

  const handleaddblog=(e)=>{
    e.preventDefault()
    const adAccountName=e.target.adAccountName.value
    const threshold=e.target.threshold.value
    const spent=e.target.spent.value
    const status=e.target.status.value
    const payment=e.target.payment.value
    const data={adAccountName,threshold,spent,status,payment}
   console.log(data)
   setdata(data)
   }

   const hadleclick=(id)=>{
    console.log(data)
    AxiosPublic.patch(`https://digital-networking-server.vercel.app/ads/${id}`,data)
    .then(res=>{
     console.log(res.data)
     refetch()
    })
   }

  return (
    <div>
      <div className="p-2 mt-24 sm:p-4 dark:text-gray-100">
        <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
          Ad Account Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="dark:bg-gray-700">
              <tr>
                <th className="p-3 text-center">Ads Id</th>
                <th className="p-3 text-center">Ad Account Name</th>
                <th className="p-3 text-center">Threshold</th>
                <th className="p-3 text-center">Spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Payment</th>
              </tr>
            </thead>
            {
                  ads.map(ad=><tbody key={ad.id}>
                    <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                        <td className="p-3 text-center">{ad._id}</td>
                        <td className="p-3 text-center">{ad.adAccountName}</td>
                        <td className="p-3 text-center">${ad.threshold}</td>
                        <td className="p-3 text-center">${ad.spent}</td>
                        <td className="p-3 text-center">{ad.status}</td>
                        <td className="p-3 text-center">{ad.payment}</td>
                      </tr>
                    </tbody>)
            }
            
              {/* <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">$৳0.00</td>
                <td className="p-3 text-center">$৳0.00</td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
              </tr> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdAccountTable;
