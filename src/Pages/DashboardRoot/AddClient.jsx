import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const AddClientTwo = () => {
  const { createUser, updateProfiles, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const AxiosPublic = UseAxiosPublic();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create user
    createUser(email, password)
      .then((result) => {
        updateProfiles(name, "");
        console.log(result.user);
        console.log(email, name);

        const date = new Date();
        const employeeEmail = user?.email; // Keep this variable unique
        const userInfo = { name, phone, email, date, employeeEmail, role: 'client' };

        // Post user info
        AxiosPublic.post("/users", userInfo)
          .then((res) => {
            console.log(res.data);
            toast.success("User registered successfully");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error registering user");
          });

        // Prepare client data
        const clientName = name;
        const clientPhone = phone;
        const clientEmail = email; // Keep this variable unique
        const tBudged = 0;
        const tSpent = 0;
        const tBill = 0;
        const tDue = 0;
        const tPaid = 0;
        const dateValue = e.target.date ? e.target.date.value : ""; // Assuming you have a date input
        const clientData = { clientName, clientEmail, clientPhone, tBudged, employeeEmail, tSpent, tBill, date: dateValue, tDue, tPaid };

        console.log(clientData);

        // Post client data
        AxiosPublic.post('/clients', clientData)
          .then(res => {
            console.log(res.data);
            Swal.fire({
              title: "Good job!",
              text: "Client added successfully!",
              icon: "success"
            });
          })
          .catch(error => {
            console.error("Error adding client:", error);
          });

        // Clear form fields
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        console.log(error);
        toast.error("User already exists");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-5">
      <Helmet>
        <title>Add Client | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Client</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter client name"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientTwo;
