import React, { useState } from 'react';

const CampaignTable = () => {
  const initialData = [
    { date: '4/9/2023', campaignName: 'কোন প্রকার পার্শ্বপ্রতিক্রিয়া ছাড়া স্থায়ী', pageName: 'Health care', tBudget: 22.00, amountSpent: 6.00, delivery: 'In Review', cashIn: 1500.00, method: '', cashOut: 0.00 },
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

export default CampaignTable;
