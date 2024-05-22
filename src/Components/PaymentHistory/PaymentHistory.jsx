import  { useState } from "react";
import { FaEdit } from "react-icons/fa";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import usePaymentHistory from "../../Hook/usePaymentHistory";

const PaymentHistory = () => {
  const [payments, refetch] = usePaymentHistory();
  console.log(payments);

  // const [payments, setPayments] = useState([
  //   { id: 1, date: "01/01/2024", amount: 1000, method: "bKash Personal" },
  //   { id: 2, date: "01/01/2024", amount: 900, method: "Nagad Personal" },
  //   { id: 3, date: "01/01/2024", amount: 800, method: "Roket Personal" },
  //   { id: 4, date: "01/01/2024", amount: 600, method: "Bank" },
  //   { id: 5, date: "01/01/2024", amount: 1000, method: "Bank" },
  //   { id: 6, date: "01/01/2024", amount: 500, method: "Bank" },
  // ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AxiosPublic = UseAxiosPublic();

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleUpdate = (e) => {
    refetch();
    e.preventDefault();
    const updatedPayment = {
      ...selectedPayment,
      date: e.target.date.value,
      amount: parseFloat(e.target.amount.value),
      method: e.target.method.value,
    };

    AxiosPublic.patch(
      `http://localhost:5000/payments/${selectedPayment.id}`,
      updatedPayment
    ).then((res) => {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === selectedPayment.id ? updatedPayment : payment
        )
      );
      handleCancel();
    });
  };

  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="mt-24 p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        Payment History
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Payment Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 text-center">{payment.date}</td>
                <td className="p-3 text-center">৳ {payment.amount}</td>
                <td className="p-3 text-center">{payment.method}</td>
                <td className="p-3 text-center">
                  <FaEdit
                    onClick={() => handleEditClick(payment)}
                    className="cursor-pointer text-gray-600"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-gray-800 text-white font-bold">
              <td className="p-3 text-center" colSpan="2">
                Total Spent :
              </td>
              <td className="p-3 text-center">৳ {totalSpent}</td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Edit Payment
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Payment Date</label>
                  <input
                    type="date"
                    name="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedPayment.date}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Payment Amount</label>
                  <input
                    type="number"
                    name="amount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedPayment.amount}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700">Payment Method</label>
                  <select
                    name="method"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedPayment.method}
                  >
                    <option value="bKash Personal">bKash Personal</option>
                    <option value="Nagad Personal">Nagad Personal</option>
                    <option value="Roket Personal">Rocket Personal</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
