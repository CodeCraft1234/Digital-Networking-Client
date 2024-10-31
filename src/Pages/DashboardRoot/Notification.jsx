import { useEffect, useState } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useNotification from "../../Hook/useNotification";
import useEditNotification from "../../Hook/useEditNotificaation";
import useUsers from "../../Hook/useUsers";

const Notification = () => {
  const [notification, refetch] = useNotification();
  const [editNotification] = useEditNotification();
  const AxiosPublic = UseAxiosPublic();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedEditNotification, setSelectedEditNotification] = useState(null);

  // Function to handle notification status update and display modal
  const handleUpdate = (notification) => {
    const data = { status: "read" };
    AxiosPublic.patch(`/notification/${notification._id}`, data)
      .then(() => {
        refetch();
      })
      .catch((err) => console.error("Error updating notification:", err));
    setSelectedNotification(notification); // Show the modal with notification details
  };

  const handleUpdate2 = (editNotification) => {
    const data = { status: "read" };
    AxiosPublic.patch(`/editNotification/${editNotification._id}`, data)
      .then(() => {
        refetch();
      })
      .catch((err) => console.error("Error updating notification:", err));
    setSelectedEditNotification(editNotification); // Show the modal with notification details
  };

  // Sort notifications: unread first, then by date (latest first)
  const sortedNotifications = notification.sort((a, b) => {
    if (a.status === "unread" && b.status === "read") return -1;
    if (a.status === "read" && b.status === "unread") return 1;
    return new Date(b.date) - new Date(a.date);
  });
  const sortedNotifications2 = editNotification.sort((a, b) => {
    if (a.status === "unread" && b.status === "read") return -1;
    if (a.status === "read" && b.status === "unread") return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const [users] = useUsers();
  const [employees, setEmployees] = useState([]);
  useEffect(() => {

      const employeeList = users.filter((u) => u.role === "employee");
      setEmployees(employeeList);

  }, [users]);


  const initialTab = localStorage.getItem("activeTaballClientsS") ;
  const [selectedClient, setSelectedClient] = useState(initialTab);
  
  const activeTab = (tab) => {
    setSelectedClient(tab);
    localStorage.setItem("activeTaballClientsS", tab); 
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
              <select
           style={{ backgroundColor: 'var(--bg-color2)',border: 'var(--border)', color: 'var(--text-color2)'}}
            name="email"
            className="border bg-white w-auto mb-5 ml-5 lg:ml-0 border-gray-700 text-black rounded p-2 mt-1"
            onChange={(e) => activeTab(e.target.value)}
            value={selectedClient}
          >
            <option value="all">All Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.email}>
                {employee.name}
              </option>
            ))}
          </select>
        <div className="grid lg:grid-cols-2 gap-3 ">
        <div className="py-6 px-5 bg-white rounded-2xl shadow-2xl border-t-4 border-blue-300">
        <h2 className="text-3xl font-bold text-blue-700 mb-5 text-center">Delete Notifications</h2>
        {sortedNotifications.length > 0 ? (
          sortedNotifications.filter(client => 
            selectedClient === 'all' || client.email === selectedClient).map((item) => (
            <div
              key={item._id}
              className={`flex items-center justify-between px-6 py-4 mb-4 rounded-xl cursor-pointer shadow-lg transition-colors ${
                item.status === "read" ? "bg-white" : "bg-yellow-100"
              } hover:bg-blue-100 border-l-4 ${item.status === "read" ? "border-gray-200" : "border-yellow-500"}`}
              onClick={() => handleUpdate(item)}
            >
              <div className="text-blue-700 font-semibold">{item.name}</div>
              <div className="text-gray-600 truncate">{item.message}</div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-600 text-center">No notifications</div>
        )}
      </div>
      <div className="py-6 px-5 bg-white rounded-2xl shadow-2xl border-t-4 border-blue-300">
        <h2 className="text-3xl font-bold text-blue-700 mb-5 text-center">Edit Notifications</h2>
        {sortedNotifications2.length > 0 ? (
          sortedNotifications2.filter(client => 
            selectedClient === 'all' || client.email === selectedClient).map((item) => (
            <div
              key={item._id}
              className={`flex items-center justify-between px-6 py-4 mb-4 rounded-xl cursor-pointer shadow-lg transition-colors ${
                item.status === "read" ? "bg-white" : "bg-yellow-100"
              } hover:bg-blue-100 border-l-4 ${item.status === "read" ? "border-gray-200" : "border-yellow-500"}`}
              onClick={() => handleUpdate2(item)}
            >
              <div className="text-blue-700 font-semibold">{item.name}</div>
              <div className="text-gray-600 truncate">{item.message}</div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-600 text-center">No notifications</div>
        )}
      </div>
        </div>

      {/* Modal for displaying notification details */}
      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl transform transition-all w-11/12 max-w-lg relative">
            <div className="text-center mb-5">
              <img
                className="h-24 w-24 rounded-full shadow-md border-4 border-blue-300 mx-auto"
                src={selectedNotification.photo}
                alt=""
              />
            </div>
            <h3 className="text-center text-2xl font-bold text-blue-800 mb-3">
              {selectedNotification.name}
            </h3>
            <p className="text-center text-lg text-gray-700 mb-6">
              {selectedNotification.message}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Payment Date</p>
                <p className="text-gray-800">{new Date(selectedNotification.date).toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Delete Date</p>
                <p className="text-gray-800">{new Date(selectedNotification.deleteDate).toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Payment Method</p>
                <p className="text-gray-800">{selectedNotification.paymentMethod}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Charge</p>
                <p className="text-gray-800">{selectedNotification.charge}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Amount</p>
                <p className="text-gray-800">৳ {selectedNotification.payAmount}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Status</p>
                <p className="text-gray-800 capitalize">{selectedNotification.status}</p>
              </div>
            </div>
            <button
              className="mt-5 w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              onClick={() => setSelectedNotification(null)}
            >
              Close
            </button>
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {selectedEditNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl transform transition-all w-11/12 max-w-lg relative">
            <div className="text-center mb-5">
              <img
                className="h-24 w-24 rounded-full shadow-md border-4 border-blue-300 mx-auto"
                src={selectedEditNotification.photo}
                alt=""
              />
            </div>
            <h3 className="text-center text-2xl font-bold text-blue-800 mb-3">
              {selectedEditNotification.name}
            </h3>
            <p className="text-center text-lg text-gray-700 mb-6">
              {selectedEditNotification.message}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Payment Date</p>
                <p className="text-gray-800">{new Date(selectedEditNotification.date).toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Edit Date</p>
                <p className="text-gray-800">{new Date(selectedEditNotification.editDate).toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Method</p>
                <p className="text-gray-800">{selectedEditNotification.paymentMethod}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">New Method</p>
                <p className="text-gray-800">{selectedEditNotification.paymentMethod}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Charge</p>
                <p className="text-gray-800">{selectedEditNotification.charge}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">New Charge</p>
                <p className="text-gray-800">{selectedEditNotification.charge}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">Amount</p>
                <p className="text-gray-800">৳ {selectedEditNotification?.ppayAmount}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold text-blue-600">New Amount</p>
                <p className="text-gray-800">৳ {selectedEditNotification?.payAmount}</p>
              </div>
            </div>
            <button
              className="mt-5 w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              onClick={() => setSelectedEditNotification(null)}
            >
              Close
            </button>
            <button
              onClick={() => setSelectedEditNotification(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
