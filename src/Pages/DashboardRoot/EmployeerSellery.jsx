import React, { useState, useEffect } from 'react';
import useMonthlySpent from "../../Hook/useMonthlySpent";
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { useParams } from 'react-router-dom';

const EmployeerSellery = () => {
    const { email } = useParams();
    const [monthlySpent] = useMonthlySpent();
    const [employeePayment] = useEmployeePayment();
  
    const [sortByEmployeeName, setSortByEmployeeName] = useState(null);

    // Function to aggregate totalSpent by employee names and months
    const aggregateAccountsByEmployee = (data) => {
        const aggregated = {};
    
        data.forEach(account => {
            const date = new Date(account.date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const key = `${account.employeeName}-${month}-${year}`;
    
            if (!aggregated[key]) {
                aggregated[key] = { 
                    employeeName: account.employeeName,
                    accountName: account.accountName,
                    totalSpentt: 0, 
                    month, 
                    year,
                    employeeEmail: account.employeeEmail 
                };
            }
            aggregated[key].totalSpentt += account.totalSpentt;
        });
    
        return Object.values(aggregated);
    };

    // Function to calculate total payment for the given month and employee
    const calculateTotalPayment = (month) => {
        const currentYear = new Date().getFullYear();
        let total = 0;

        employeePayment.forEach(payment => {
            const paymentDate = new Date(payment.date);
            const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
            const paymentYear = paymentDate.getFullYear();
            
            if (paymentMonth === month && paymentYear === currentYear && payment.employeeEmail === email) {
                total += parseFloat(payment.payAmount);
            }
        });

        return total;
    };

    // Function to calculate total spent for the given month and employee
    const calculateTotalSpent = (month) => {
        let total = 0;

        monthlySpent.forEach(spent => {
            const spentDate = new Date(spent.date);
            const spentMonth = spentDate.toLocaleString('default', { month: 'long' });
            
            if (spentMonth === month && spent.employeeEmail === email) {
                total += spent.totalSpentt;
            }
        });

        return total;
    };

    // Function to calculate Admin Pay
    const calculateAdminPay = (month) => {
        const payments = employeePayment.filter(payment => {
            const paymentDate = new Date(payment.date);
            const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
            return paymentMonth === month && payment.employeeEmail === email;
        });

        return payments.reduce((acc, payment) => acc + parseFloat(payment.payAmount), 0);
    };

    // Filter and aggregate data
    const aggregatedAccounts = aggregateAccountsByEmployee(monthlySpent);
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
  
    return (
        <div className='m-5'>
            <div className="flex justify-between mb-4">
                <select
                    className="px-4 py-2 border rounded bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500 text-white"
                    onChange={(e) => setSortByEmployeeName(e.target.value)}
                    value={sortByEmployeeName || ""}
                >
                    <option value="">Select Employee</option>
                    {[...new Set(aggregatedAccounts.map(account => account.employeeName))].map(employeeName => (
                        <option key={employeeName} value={employeeName}>{employeeName}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto text-center border border-black">
                <table className="min-w-full text-center bg-white">
                    <thead className="bg-[#05a0db] text-white">
                        <tr>
                            <th className="p-3">SL</th>
                            <th className="p-3">Months</th>
                            <th className="p-3">Total Spent</th>
                            <th className="p-3">Total Bill</th>
                            <th className="p-3">Admin Pay</th>
                            <th className="p-3">Total Due</th>
                            <th className="p-3">Total Salary</th>
                            <th className="p-3">Salary Paid</th>
                            <th className="p-3">Salary Unpaid</th>
                            <th className="p-3">Bonus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map((month, index) => {
                            const totalSpent = calculateTotalSpent(month);
                            const totalBill = totalSpent * 140;
                            const adminPay = calculateAdminPay(month);
                            const totalDue = totalBill - adminPay;
                            const totalSalary = totalSpent * 7;
                            const salaryPaid = totalSalary;
                            const salaryUnpaid = totalSalary - salaryPaid;
                            const bonus = totalSalary;

                            return (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-white text-left text-gray-500 border-b border-opacity-20"
                                            : "bg-gray-200 text-left text-gray-500 border-b border-opacity-20"
                                    }`}
                                >
                                    <td className="p-3 border-r-2 border-gray-300 text-center px-5">{index + 1}</td>
                                    <td className="p-3 border-l-2 border-r-2 text-center border-gray-300">
                                        {month}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        $ {totalSpent}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        $ {totalBill}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {adminPay}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {totalDue.toFixed(2)}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {totalSalary}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {salaryPaid.toFixed(2)}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {salaryUnpaid.toFixed(2)}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {bonus.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-[#05a0db] text-white">
                        <tr>
                            <td colSpan="2" className="p-3 text-right font-bold">Total:</td>
                            <td className="p-3 text-center font-bold">$ {months.reduce((acc, month) => acc + calculateTotalSpent(month), 0)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSpent(month) * 140, 0)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateAdminPay(month), 0)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSpent(month) * 140 - calculateAdminPay(month), 0)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSpent(month) * 7, 0)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSpent(month) * 7, 0).toFixed(2)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + 0, 0).toFixed(2)}</td>
                            <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSpent(month) * 7, 0).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default EmployeerSellery;
