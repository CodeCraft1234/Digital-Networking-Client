import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";

import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddEmployee = () => {
  const { createUser, updateProfiles, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const AxiosPublic = UseAxiosPublic();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await AxiosPublic.post(image_hosting_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.url; // Return the image URL from ImgBB
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const photo = await uploadImage(); // Upload image and get URL
      const result = await createUser(email, password);

      await updateProfiles(name, photo);

      const date = new Date();
      const employeeEmail = user?.email;
      const userInfo = { name, phone, email, password, date, employeeEmail, role, photo };

      // Post user info to the server
      const response = await AxiosPublic.post("/users", userInfo);
      console.log("User info posted to server:", response.data);

      // Clear form inputs after successful submission
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setImage(null);
      
      toast.success("User registered successfully");

    } catch (error) {
      console.error("Error during user registration:", error);

      if (error.response && error.response.status === 409) {
        toast.error("User already exists");
      } else {
        toast.error("An error occurred during registration");
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <Helmet>
        <title>Add Employees | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">Add New User</h2>
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
              className="mt-1 block w-full p-2 border bg-white border-gray-700 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user name..."
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
              className="mt-1 block w-full p-2 bg-white border border-gray-700 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full p-2 border bg-white border-gray-700 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full p-2 border bg-white border-gray-700 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border w-full bg-white text-black border-gray-700 rounded"
            >
              <option value="" disabled>Select role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
              <option value="contributor">Contributor</option>
              <option value="webDeveloper">Web Developer</option>
              <option value="graphicDesigner">Graphic Designer</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 border bg-white border-gray-700 rounded shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
