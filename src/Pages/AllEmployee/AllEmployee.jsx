import { useEffect, useState } from "react";

import useUsers from "../../Hook/useUsers";
import "tailwindcss/tailwind.css";

const AllEmployee = () => {
  const [users, setUsers] = useUsers();
  const [totals, setTotals] = useState({
    bkashMarcentTotal: 0,
    bkashPersonalTotal: 0,
    nagadPersonalTotal: 0,
    rocketPersonalTotal: 0,
    payoneerTotal: 0,
    totalBDT: 0,
  });

  const [editValues, setEditValues] = useState({
    bkashMarcentTotal: 0,
    bkashPersonalTotal: 0,
    nagadPersonalTotal: 0,
    rocketPersonalTotal: 0,
    payoneerTotal: 0,
    totalBDT: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const calculateTotals = () => {
      const newTotals = {
        bkashMarcentTotal: users.reduce(
          (acc, user) => acc + (user.bkashMarcent || 0),
          0
        ),
        bkashPersonalTotal: users.reduce(
          (acc, user) => acc + (user.bkashPersonal || 0),
          0
        ),
        nagadPersonalTotal: users.reduce(
          (acc, user) => acc + (user.nagadPersonal || 0),
          0
        ),
        rocketPersonalTotal: users.reduce(
          (acc, user) => acc + (user.rocketPersonal || 0),
          0
        ),
        payoneerTotal: users.reduce(
          (acc, user) => acc + (user.payoneer || 0),
          0
        ),
        totalBDT: users.reduce((acc, user) => acc + (user.totalBDT || 0), 0),
      };
      setTotals(newTotals);
      setEditValues(newTotals);
    };

    calculateTotals();
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: parseFloat(value),
    });
  };

  const handleUpdate = () => {
    setTotals(editValues);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: parseFloat(value),
    });
  };

  const updateUser = () => {
    setUsers(
      users.map((user) => (user._id === selectedUser._id ? selectedUser : user))
    );
    closeModal();
  };


  const handleupdate =(e)=>{
    e.preventDefault();
    const bkashMrchent=e.target.bkashMarcent.value 
    console.log(bkashMrchent)
  }


  return (
    <div className="mt-36">
      <h6 className="text-center text-4xl font-bold text-green-600 mb-10">
        All Employee
      </h6>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white mx-auto shadow-md rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl"
            style={{ width: "250px", height: "400px" }}
          >
            <div className="text-center">
              <img
                className="w-20 h-20 mx-auto rounded-full mb-4"
                src={user.photo}
                alt={user.name}
              />
              <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
            </div>
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <span>Bkash Merchant:</span>
                <span>৳ {user.bkashMarcent}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Bkash Personal:</span>
                <span>৳ {user.bkashPersonal}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Nagad Personal:</span>
                <span>৳ {user.nagadPersonal}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Rocket Personal:</span>
                <span>৳ {user.rocketPersonal}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Payoneer:</span>
                <span>$ {user.payoneer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total BDT:</span>
                <span>৳ {user.totalBDT}</span>
              </div>
              <button
                onClick={() => openModal(user)}
                className="w-full bg-blue-500 text-white py-2 rounded mt-4 transform transition-all hover:scale-105 hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleupdate}>
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <h6 className="text-center text-2xl font-bold text-green-600 mb-6">
              Edit {selectedUser.name}
            </h6>
            <div className="mb-4">
              <label className="block text-gray-700">Bkash Merchant:</label>
              <input
                type="number"
                name="bkashMarcent"
                value={selectedUser.bkashMarcent}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Bkash Personal:</label>
              <input
                type="number"
                name="bkashPersonal"
                value={selectedUser.bkashPersonal}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nagad Personal:</label>
              <input
                type="number"
                name="nagadPersonal"
                value={selectedUser.nagadPersonal}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Rocket Personal:</label>
              <input
                type="number"
                name="rocketPersonal"
                value={selectedUser.rocketPersonal}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payoneer:</label>
              <input
                type="number"
                name="payoneer"
                value={selectedUser.payoneer}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total BDT:</label>
              <input
                type="number"
                name="totalBDT"
                value={selectedUser.totalBDT}
                onChange={handleUserInputChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="bg-blue-500 text-white py-2 px-4 rounded transform transition-all hover:scale-105 hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AllEmployee;