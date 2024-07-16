import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const AddEmployee = () => {
  const { createUser, updateProfiles,user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const AxiosPublic = UseAxiosPublic();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    createUser(email, password)
      .then((result) => {
        updateProfiles(name, "");
        console.log(result.user);
        console.log(email, name);
        const date = new Date();
        const employeeEmail=user?.email
        const userInfo = { name,phone,email,date,employeeEmail,role:'employee' };
        
        AxiosPublic.post("/users", userInfo).then((res) => {
          console.log(res.data);
        });
        
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
        return toast.success("User registered successfully");
      })
      .catch((error) => {
        console.log(error);
        return toast.error("User already exists");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-5">
       <Helmet>
        <title>Add Employees | Digital Network </title>
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

export default AddEmployee;
