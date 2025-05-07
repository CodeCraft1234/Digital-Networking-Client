import { useContext, useState } from "react";
import useUserr from "../../Hook/useUser";
import { AuthContext } from "../../Security/AuthProvider";
import useClientsPage2 from "../../Hook/useClientPage2";

const Invoice = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const { user } = useContext(AuthContext);
  const { userr } = useUserr(user?.email);

  const initialTab3 =
    userr?.role === "admin"
      ? localStorage.getItem(`activeTabag${user?.email}`) || "all"
      : localStorage.getItem(`activeTabag${user?.email}`) || user?.email;

  const [selectedEmployee3] = useState(initialTab3);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients] = useClientsPage2(selectedEmployee3, searchQuery);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for selected client
  const [selectedClient, setSelectedClient] = useState(null);

  const [items, setItems] = useState([
    { name: "Website Design", quantity: 1, unitPrice: 300, tax: "Non Taxable", subtotal: 300 }
  ]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unitPrice: "", tax: "Non Taxable", subtotal: "" });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value, subtotal: newItem.quantity * newItem.unitPrice || 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity && newItem.unitPrice) {
      setItems([...items, newItem]);
      setNewItem({ name: "", quantity: "", unitPrice: "", tax: "Non Taxable", subtotal: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="text-black">
      <div className="grid lg:grid-cols-9 gap-5">
        <div className="lg:col-span-6 p-5 bg-gray-100 h-[800px]">
          <div className="grid lg:grid-cols-2 items-start">
            <div className="p-5">
              <img
                src="https://i.ibb.co/TqHwFZFK/CJYXNmt8r-Be-Uv-USDRGq-GMCFft-PIO2y-Umax-M0m876u-Luc-Cs-Qbzvzcy-GVj-U4sqb-NJ9-Htdm-Tdm-A934y-EF-b-F9.jpg"
                alt="Logo"
              />
            </div>
            <div className="p-5 text-black">
              <div className="mb-4">
                <label className="block">Type</label>
                <select name="status" className="select2">
                  <option value="all">Select Status</option>
                  <option value="positive">Due</option>
                  <option value="negative">Advanced</option>
                  <option value="equal">Clear</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block">Issue date</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={formattedDate}
                  className="input2"
                />
              </div>

              <div className="mb-4">
                <label className="block">Due date</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={formattedDate}
                  className="input2"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="hover:border hover:border-dotted border-gray-400 p-4">
              <h1>From</h1>
              <h1>Digital Network</h1>
              <h1>MD Anowarul Islam</h1>
              <h1>Bangladesh</h1>
              <h1>info@hellodigitalnetwork.com</h1>
              <h1>+8801718767838</h1>
              <h1>www.hellodigitalnetwork.com</h1>
            </div>
            {/* Click to open modal */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="hover:border hover:border-dotted border-gray-400 p-4 cursor-pointer"
            >
              <h1>To</h1>
              {selectedClient ? (
                <>
                  <h2 className="font-bold">{selectedClient.clientName}</h2>
                  <p>{selectedClient.clientPhone}</p>
                </>
              ) : (
                <p className="text-gray-500">Click to select client</p>
              )}
            </div>
          </div>

          <div className="p-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Tax</th>
            <th className="border p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.unitPrice}</td>
              <td className="border p-2">{item.tax}</td>
              <td className="border p-2">{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-2 border p-4 grid gap-2 bg-gray-50">
          <input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleChange} className="border p-2" required />
          <input type="number" name="quantity" placeholder="Quantity" value={newItem.quantity} onChange={handleChange} className="border p-2" required />
          <input type="number" name="unitPrice" placeholder="Unit Price" value={newItem.unitPrice} onChange={handleChange} className="border p-2" required />
          <select name="tax" value={newItem.tax} onChange={handleChange} className="border p-2">
            <option>Non Taxable</option>
            <option>5% VAT</option>
            <option>10% VAT</option>
          </select>
          <input type="text" value={newItem.subtotal} disabled className="border p-2" />
          <textarea name="description" placeholder="Description" className="border p-2"></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      )}

      <button onClick={() => setShowForm(!showForm)} className="w-full mt-2 p-2 border border-dashed text-center text-gray-600">
        + Add new invoice item
      </button>
    </div>

        </div>

       
        <div className="lg:col-span-3 p-5 bg-gray-100 h-[800px]"></div>
      </div>

      {/* Modal for selecting client */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Select the client for the invoice
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-4 grid lg:grid-cols-3 gap-2">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Search by name or phone"
                  className="input2 w-full"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="add lg:col-span-1">+ Create Client</button>
            </div>

            {/* Client List with Radio Selection */}
            <div className="mt-4 border rounded-md p-4 space-y-2 max-h-[300px] overflow-y-auto">
              {clients
                .filter(
                  (item) =>
                    item.clientPhone
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.clientName
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((client) => (
                  <label
                    key={client._id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="selectedClient"
                      value={client._id}
                      onChange={() => {
                        setSelectedClient(client);
                        setIsModalOpen(false); // Close modal on selection
                      }}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{client.clientName}</h3>
                      <p>{client.clientPhone}</p>
                    </div>
                  </label>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
