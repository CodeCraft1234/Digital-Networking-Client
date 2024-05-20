import React, { useState } from 'react';
import useCampaings from '../../Hook/useCampaign';

const CampaignTable = () => {
  const [campaigns]=useCampaings()
  const initialData = [
    { date: '4/9/2023', campaignName: '', pageName: 'Health care', tBudget: 22.00, amountSpent: 6.00, delivery: 'In Review', cashIn: 1500.00, method: '', cashOut: 0.00 },
    { date: '4/9/2023', campaignName: '', pageName: '', tBudget: 0.00, amountSpent: 0.00, delivery: 'In Review', cashIn: 0.00, method: '', cashOut: 0.00 },
    // Add additional rows as per the table
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
          Campaign Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="dark:bg-gray-700">
              <tr>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Campaign Name/URL</th>
                <th className="p-3 text-center">Page Name/URL</th>
                <th className="p-3 text-center">T.Budged</th>
                <th className="p-3 text-center">T.Spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center"> Payment Rcv</th>
                <th className="p-3 text-center">Method</th>
                <th className="p-3 text-center">Edit</th>
              </tr>
            </thead>
            {
                  campaigns.map(ini=><tbody key={ini.id}>
                    <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                        <td className="p-3 text-center">{ini.date}</td>
                        <td className="p-3 text-center">{ini.campaignName}</td>
                        <td className="p-3 text-center">{ini.pageName}</td>
                        <td className="p-3 text-center">{ini.totalBudged}</td>
                        <td className="p-3 text-center">{ini.delevery}</td>
                        <td className="p-3 text-center">{ini.status}</td>
                        <td className="p-3 text-center">{ini.cashIn}</td>
                        <td className="p-3 text-center">{ini.method}</td>
                        <td><button className="font-avenir  px-3 py-1 bg-neutral rounded text-white">Edit</button></td>
                      </tr>
                    </tbody>)
            }
            
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                
              </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
