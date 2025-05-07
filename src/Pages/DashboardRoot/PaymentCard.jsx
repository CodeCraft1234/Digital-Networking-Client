// src/components/PaymentCard/PaymentCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useAllEmployee from '../../Hook/useAllEmployee';

const PaymentCard = ({ 
  payment, 
  setModalData, 
  handleDelete, 
  handleUpdate2 
}) => {
  const [allEmployees] = useAllEmployee([]);

  const employee = allEmployees.find(f => f.email === payment.employeeEmail);

  const logos = [
    { method: "bkashMarchent", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
    { method: "bkashPersonal", src: "https://i.ibb.co/520Py6s/bkash-1.png" },
    { method: "rocketPersonal", src: "https://i.ibb.co/QkTM4M3/rocket.png" },
    { method: "nagadPersonal", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
    { method: "nagadMarchent", src: "https://i.ibb.co/JQBQBcF/nagad-marchant.png" },
    { method: "DBBLBank", src: "https://i.ibb.co/nnN8KW0/DBBL.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
    { method: "IBBLBank", src: "https://i.ibb.co/pnS6nt4/IBBLBank.png", width: "w-24 sm:w-28", height: "h-7 sm:h-8" },
    { method: "bank", src: "https://i.ibb.co/PZc0P4w/brac-bank-seeklogo.png", width: "w-10 sm:w-12", height: "h-8 sm:h-10" },
  ];

  const logo = logos.find(item => item.method === payment?.paymentMethod);

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <img 
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover" 
              src={employee?.photo || "https://via.placeholder.com/150"} 
              alt="Employee" 
            />
            <div>
              <h3 className="font-semibold text-emerald-600 text-sm sm:text-base">
                <span className="text-sm sm:text-base font-extrabold mr-1">৳</span>
                {payment.amount?.toLocaleString()}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500">
                {new Date(payment.date).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1 ml-8 sm:ml-10">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-700">{employee?.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-400">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </span>
              <Link 
                to={`/client/${payment?.clientEmail}`}
                className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                {payment?.clientName}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="text-right">
          {/* Payment Logo */}
          <div className="mb-2">
            {logo && (
              <img
                src={logo.src}
                alt={payment?.paymentMethod}
                className={`ml-auto ${logo.width || "w-auto"} ${logo.height || "h-6"}`}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="inline-flex items-center bg-green-100 text-green-800 px-1.5 py-1 sm:px-2 rounded-full text-[10px] sm:text-xs">
            <div className="flex items-center gap-1">
              <button onClick={() => setModalData(payment)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>

              <button onClick={() => handleDelete(payment.ids, payment.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>

            {/* Status Switch */}
            <label className="status-label ml-2">
              <input
                type="checkbox"
                className="sr-only"
                checked={(payment?.status || "Approved") !== "pending"}
                onChange={() => {
                  const currentStatus = payment?.status || "Approved";
                  const newStatus = currentStatus !== "pending" ? "pending" : "Approved";
                  handleUpdate2(payment.ids, payment.id, newStatus);
                }}
              />
              <div className={`status-switch ${(payment?.status || "Approved") !== "pending" ? "active" : "inactive"}`}>
                <span className={`status-switch-thumb ${(payment?.status || "Approved") !== "pending" ? "active" : ""}`}></span>
              </div>
            </label>
          </div>

          {/* TrxID */}
          <div className="mt-1 sm:mt-2">
            <p className="text-[9px] sm:text-[10px] font-mono text-gray-400">
              TrxID: {payment?.transactionId}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentCard;
