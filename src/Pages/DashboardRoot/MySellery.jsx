import React, { useContext, useState } from 'react';
import useMonthlySpent from "../../Hook/useMonthlySpent";
import useEmployeePayment from '../../Hook/useEmployeePayment';
import { useParams } from 'react-router-dom';
import useSellery from '../../Hook/useSellery';
import { FaEdit } from 'react-icons/fa';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
// Assuming AxiosPublic is configured

const MySellery = () => {
    const {user}=useContext(AuthContext)
    const [sellery, refetch] = useSellery();
    const [monthlySpent] = useMonthlySpent();
    const [employeePayment] = useEmployeePayment();

    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));

    // Function to calculate total spent for the given month and employee
    const calculateTotalSpent = (month) => {
        let total = 0;

        monthlySpent.forEach(spent => {
            const spentDate = new Date(spent.date);
            const spentMonth = spentDate.toLocaleString('default', { month: 'long' });

            if (spentMonth === month && spent.employeeEmail === user?.email) {
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
            return paymentMonth === month && payment.employeeEmail === user?.email;
        });

        return payments.reduce((acc, payment) => acc + parseFloat(payment.payAmount), 0);
    };

    const AxiosPublic=UseAxiosPublic()
    // Handle Sellery Submission
    const handleSellery = (e, month) => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const bonus = e.target.bonus.value;
        const date = new Date(`${month} 1, ${new Date().getFullYear()}`); // Create a date based on the month
        const email=user?.email
        const bodyy = { amount, date,bonus, email };
        AxiosPublic.post('/sellery', bodyy)
            .then(res => {
                console.log(res.data);
                refetch(); // Refetch sellery data after posting
            })
            .catch(error => {
                console.error("Error posting sellery:", error);
            });
    };

    const calculateTotalSelleryAndBonus = (month) => {
        let totalSellery = 0;
        let totalBonus = 0;
    
        sellery.forEach(s => {
            const selleryDate = new Date(s.date);
            const selleryMonth = selleryDate.toLocaleString('default', { month: 'long' });
    
            if (selleryMonth === month && s.email === user?.email) {
                totalSellery += parseFloat(s.amount) || 0;
                totalBonus += parseFloat(s.bonus) || 0;
            }
        });
    
        return { totalSellery, totalBonus };
    };
    return (
        <div className='m-5'>
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

    // Calculate total sellery and bonus for the month
    const { totalSellery, totalBonus } = calculateTotalSelleryAndBonus(month);

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
                                        <div className="relative group flex items-center justify-center">
                                            <h1>৳ {totalSellery}</h1>
                                            <button
                                                className="text-black text-right px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                onClick={() =>
                                                    document
                                                        .getElementById(`my_modal_6d-${index}`)
                                                        .showModal()
                                                }
                                            >
                                                <FaEdit />
                                            </button>

                                            <dialog id={`my_modal_6d-${index}`} className="modal">
                                                <div className="modal-box bg-white">
                                                    <form
                                                        onSubmit={(e) => handleSellery(e, month)}
                                                    >
                                                        <h1 className="text-black font-bold text-start">Sellery Amount</h1>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            step="0.01"
                                                            placeholder="0"
                                                            className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
                                                        />
                                                       <h1 className="text-black mt-3 font-bold text-start">Bonus</h1>
                                                        <input
                                                            type="number"
                                                            name="bonus"
                                                            step="0.01"
                                                            placeholder="0"
                                                            className="w-full rounded p-2 mt-3 bg-white text-black border border-gray-700"
                                                        />

                                                        <button
                                                            type="submit"
                                                            className="mt-4 font-avenir px-3 mx-auto py-1 rounded-lg text-white bg-[#05a0db]"
                                                        >
                                                            Update
                                                        </button>
                                                    </form>
                                                    <form method="dialog">
                                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                            ✕
                                                        </button>
                                                    </form>
                                                </div>
                                            </dialog>
                                        </div>
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                        ৳ {totalSalary - totalSellery}
                                    </td>
                                    <td className="p-3 border-r-2 border-gray-300 text-center">
                                    ৳ {totalBonus}
                                       
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
        <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSelleryAndBonus(month).totalSellery, 0)}</td>
        <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + (calculateTotalSpent(month) * 7 - calculateTotalSelleryAndBonus(month).totalSellery), 0).toFixed(2)}</td>
        <td className="p-3 text-center font-bold">৳ {months.reduce((acc, month) => acc + calculateTotalSelleryAndBonus(month).totalBonus, 0)}</td>
    </tr>
</tfoot>

                </table>
            </div>
        </div>
    );
};

export default MySellery;
