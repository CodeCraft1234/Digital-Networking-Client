import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import useWorkList from "../../Hook/useWorkList";

const WorkList = () => {
  const [works, refetch] = useWorkList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  const handleEditClick = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  const handleUpdate = () => {
    // Add your update logic here
    // For example, you might want to send a request to update the work item in the backend
    // After updating, refetch the data and close the modal
    refetch();
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  return (
    <div className=" p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        Own Work List
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Page Name & URL</th>
              <th className="p-3">T. Budget</th>
              <th className="p-3">T. Spent</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "text-black border-b border-opacity-20" : "text-black border-b border-opacity-20"}`}
              >
                <td className="p-3 text-center">{work.date}</td>
                <td className="p-3 text-center">{work.pageName}</td>
                <td className="p-3 text-center">
                  ${work.budget.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${work.spent.toLocaleString()}
                </td>
               
                <td
                  className={`p-3 text-center ${
                    work.status === "Active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {work.status}
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
             
              <td className="p-3 text-center">
              
              </td>
              <td className="p-3 text-right" colSpan="2">
                Total Spent:
              </td>
              
              <td className="p-3 text-center">
                ৳{" "}
                {works
                  .reduce((sum, work) => sum + work.totalBill, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
             
              </td>
             
            
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-2xl text-green-600 font-bold mb-4 text-center">Edit Work</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Date</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.date}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Page Name & URL</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.pageName}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">T. Budget</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.budget}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">T. Spent</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.spent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Dollar Rate</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.dollarRate}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Total Bill</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.totalBill}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Paid</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.paid}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">T. Due</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.due}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700">Status</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={selectedWork.status}
                  />
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
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={handleUpdate}
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

export default WorkList;
