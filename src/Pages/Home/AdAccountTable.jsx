import React, { useState } from 'react';

const AdAccountTable = () => {
  const initialData = [
    { adAccountName: 'Sabur_Boost_03', threshold: 0, spent: 0, status: 'Active', payment: '11/04/2023' },
    { adAccountName: 'Sabur_Boost_04', threshold: 15, spent: 0, status: 'Active', payment: '11/07/2023' },
    { adAccountName: 'Sabur_Boost_06', threshold: 2, spent: 0, status: 'Active', payment: '10/20/2023' },
    { adAccountName: 'Sabur_Boost_09', threshold: 10, spent: 0, status: 'Active', payment: '10/13/2023' },
    { adAccountName: 'Ads_Sheba', threshold: 42, spent: 20, status: 'Active', payment: '03/23/2024' },
    { adAccountName: 'Ads_Sheba', threshold: 75, spent: 0, status: 'Active', payment: '04/24/2024' },
    { adAccountName: 'Sabur_Agency', threshold: 400, spent: 100, status: 'Active', payment: '05/17/2024' },
    { adAccountName: 'Sabur_Agency', threshold: 900, spent: 400, status: 'Active', payment: '06/09/2024' },
    { adAccountName: 'Boost_House_01', threshold: 7, spent: 0, status: 'Active', payment: '04/11/2024' },
    { adAccountName: 'Boost_House_02', threshold: 12.1, spent: 2, status: 'Active', payment: '04/03/2024' },
    { adAccountName: 'Boost_House_03', threshold: 2, spent: 0, status: 'Active', payment: '04/19/2024' },
    { adAccountName: 'Digital_Network_01', threshold: 75, spent: 0, status: 'Active', payment: '02/15/2024' },
    { adAccountName: 'Digital_Network_02', threshold: 12, spent: 5, status: 'Active', payment: '01/15/2024' },
    { adAccountName: 'Digital_Network_03', threshold: 7, spent: 5, status: 'Active', payment: '01/15/2024' },
    { adAccountName: 'Boost_Service_01', threshold: 25, spent: 20, status: 'Active', payment: '04/04/2024' },
    { adAccountName: 'Boost_Service_02', threshold: 7, spent: 0, status: 'Active', payment: '05/29/2024' },
    { adAccountName: 'Boost_Service_03', threshold: 125, spent: 60, status: 'Active', payment: '06/12/2024' },
  ];

  const [data, setData] = useState(initialData);

  const handleEdit = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

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
                <th className="p-3 text-center">Ref</th>
                <th className="p-3 text-center">Ad Account Name</th>
                <th className="p-3 text-center">Threshold</th>
                <th className="p-3 text-center">Spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Payment</th>
              </tr>
            </thead>
            {
                  initialData.map(ini=><tbody key={ini.id}>
                    <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                        <td className="p-3 text-center">01</td>
                        <td className="p-3 text-center">{ini.adAccountName}</td>
                        <td className="p-3 text-center">${ini.threshold}</td>
                        <td className="p-3 text-center">${ini.spent}</td>
                        <td className="p-3 text-center">{ini.status}</td>
                        <td className="p-3 text-center">{ini.payment}</td>
                      </tr>
                    </tbody>)
            }
            
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">$৳0.00</td>
                <td className="p-3 text-center">$৳0.00</td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
              </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdAccountTable;
