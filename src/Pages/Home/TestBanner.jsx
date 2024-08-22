import React, { useContext, useEffect, useState } from 'react';
import useUsers from '../../Hook/useUsers';
import useEmployeePayment from '../../Hook/useEmployeePayment';
import useAdsAccount from '../../Hook/useAdAccount';
import { AuthContext } from '../../Security/AuthProvider';
import { Link } from 'react-router-dom';
import useMpayment from '../../Hook/UseMpayment';

const TestBanner = () => {
    const [users, refetch] = useUsers();
    const [employeePayment] = useEmployeePayment();
    const [MPayment] = useMpayment();
    const [adsAccount] = useAdsAccount();
    const [payoneerTotal, setPayoneerTotal] = useState(0);
    const { user } = useContext(AuthContext);
    const [ddd, setDdd] = useState(null);
    const [employee, setEmployee] = useState([]);

    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === user?.email);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user]);

    useEffect(() => {
        if (users) {
            const fff = users.filter(u => u.role === 'employee');
            setEmployee(fff || []); // Update state with found users or an empty array
        }
    }, [users]);

    const calculateTotalByPaymentMethod = (employeeEmail, paymentMethod) => {
        return employeePayment
            .filter(payment => payment.employeeEmail === employeeEmail && payment.paymentMethod === paymentMethod)
            .reduce((total, payment) => total + parseFloat(payment.payAmount), 0)
            .toFixed(2); 
    };

    const calculateTotalByPaymentMethod2 = (employeeEmail, paymentMethod) => {
        return MPayment
            .filter(payment => payment.employeeEmail === employeeEmail && payment.paymentMethod === paymentMethod)
            .reduce((total, payment) => total + parseFloat(payment.amount), 0)
            .toFixed(2); 
    };

    return (
        <div>
            <div className="">
                <div className="overflow-x-auto text-black border-l rounded-xl border-gray-400">
                    <table className="min-w-full text-xs md:text-base">
                        <thead className="bg-[#05a0db] text-white font-bold text-sm md:text-xl">
                            <tr>
                                <th className="p-3 text-center">SL</th>
                                {ddd?.role === 'admin' && (
                                    <>
                                        <th className="p-3 text-center">Employee Name</th>
                                        <th className="p-3 text-center">
                                            <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash Merchant" />
                                        </th>
                                        <th className="p-3 text-center">
                                            <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash Personal" />
                                        </th>
                                        <th className="p-3 text-center">
                                            <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad Personal" />
                                        </th>
                                        <th className="p-3 text-center">
                                            <img className="w-18 h-9 mx-auto" src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket Personal" />
                                        </th>
                                        <th className="p-3 text-center">
                                            bank
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        {employee.map((userr, index) => (
                            <tbody key={userr._id}>
                                <tr>
                                    <td className="p-3 border border-gray-300 text-center font-bold"> {index + 1}</td>
                                    <td className="p-3 hover:text-blue-600 font-bold hover:text-sm md:hover:text-sm sm:hover:text-sm flex flex-col md:flex-row justify-start text-center items-center gap-2 border border-gray-300">
                                        <Link to={`/dashboard/userInfo/${userr?.email}`}>
                                            <img className="w-10 h-10 rounded-full" src={userr?.photo} alt="" />
                                        </Link>
                                        <Link to={`/dashboard/userInfo/${userr?.email}`}>{userr.name}</Link>
                                    </td>
                                    {ddd?.role === 'admin' && (
                                        <>
                                            <td className="p-3 border border-gray-300 text-center">
                                                ৳ {calculateTotalByPaymentMethod2(userr.email, 'bkashMarchent') - calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')}
                                            </td>
                                            <td className="p-3 border border-gray-300 text-center">
                                                ৳ {calculateTotalByPaymentMethod2(userr.email, 'bkashPersonal') - calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')}
                                            </td>
                                            <td className="p-3 border border-gray-300 text-center">
                                                ৳ {calculateTotalByPaymentMethod2(userr.email, 'nagadPersonal') - calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')}
                                            </td>
                                            <td className="p-3 border border-gray-300 text-center">
                                                ৳ {calculateTotalByPaymentMethod2(userr.email, 'rocketPersonal') - calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')}
                                            </td>
                                            <td className="p-3 border border-gray-300 text-center">
                                                ৳ {calculateTotalByPaymentMethod(userr.email, 'bank') - calculateTotalByPaymentMethod(userr.email, 'bank')}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            </tbody>
                        ))}
                        <tfoot>
                            <tr className="bg-[#05a0db] text-white">
                                <td className="p-3 text-center font-bold"></td>
                                <td className="p-3 text-center font-bold">Total</td>
                                {ddd?.role === 'admin' && (
                                    <>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashMarchent')), 0).toFixed(2)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bkashPersonal')), 0).toFixed(2)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'nagadPersonal')), 0).toFixed(2)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'rocketPersonal')), 0).toFixed(2)
                                        }</td>
                                        <td className="p-3 text-center font-bold">৳ {
                                            employee.reduce((total, userr) => total + parseFloat(calculateTotalByPaymentMethod(userr.email, 'bank')), 0).toFixed(2)
                                        }</td>
                                    </>
                                )}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestBanner;
