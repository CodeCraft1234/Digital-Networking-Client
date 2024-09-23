import { Link } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useNotification from "../../Hook/useNotification";

const Notification = () => {
  const [notification, refetch] = useNotification();
  const AxiosPublic = UseAxiosPublic();

  // Function to handle notification status update
  const handleUpdate = (id) => {
    const data = { status: "read" };

    AxiosPublic.patch(`/notification/${id}`, data)
      .then((res) => {
        console.log("Notification status updated:", res.data);
        // Refetch notifications to update the UI
        refetch();
      })
      .catch((err) => {
        console.error("Error updating notification:", err);
      });
  };

  // Sort notifications: unread first, then by date (latest first)
  const sortedNotifications = notification
    .sort((a, b) => {
      // Sort by status first (unread first)
      if (a.status === "unread" && b.status === "read") return -1;
      if (a.status === "read" && b.status === "unread") return 1;

      // Then sort by date (latest first)
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="p-5">
      <div className="py-2 px-2 bg-blue-300 rounded-lg">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((item, index) => (
           <Link to={'/dashboard/notification/'}  key={index}>
            <div
             
              className={`grid grid-cols-2 items-center px-4 py-2 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                item.status === "read" ? "bg-white" : "bg-yellow-100"
              }`}
              onClick={() => handleUpdate(item._id)}
            >
              <div className="text-gray-700 font-semibold">{item.title}</div>
              <div className="text-gray-500 text-right">{item.name}</div>
            </div>
           </Link>
          ))
        ) : (
          <li className="px-4 py-2 text-gray-700">No notifications</li>
        )}
      </div>
    </div>
  );
};

export default Notification;
