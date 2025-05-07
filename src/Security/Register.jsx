import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
  const { createUser, updateProfiles } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const AxiosPublic = UseAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      // Upload image to ImgBB
      const imageResponse = await AxiosPublic.post(image_hosting_api, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (!imageResponse.data.success) {
        throw new Error("Image upload failed. Please try again.");
      }

      const photo = imageResponse.data.data.display_url;
      const { name, email, phone: contactNumber, password } = data;
      const role = "client";

      // Create user with Firebase Auth
      await createUser(email, password);

      // Update profile with name and photo
      await updateProfiles(name, photo);

      // Save user information to the database
      const userInfo = {
        email,
        name,
        photo,
        contactNumber,
        role,
        date: new Date(),
      };

      await AxiosPublic.post("/users", userInfo);

      toast.success(`${name} created successfully`);

      // Redirect to the desired page
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
  
    {/* Background Blur Effects */}
    <div className="absolute w-80 h-80 bg-pink-400 rounded-full blur-[120px] opacity-30 -top-20 -left-20 z-0"></div>
    <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[100px] opacity-30 top-10 right-0 z-0"></div>
    <div className="absolute w-60 h-60 bg-blue-400 rounded-full blur-[100px] opacity-30 bottom-0 left-10 z-0"></div>
    
    <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
    
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
    
        {/* Name */}
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>
    
        {/* Image Upload */}
        <div>
          <input
            {...register("image", { required: "Profile image is required" })}
            type="file"
            className="block w-full text-sm bg-white/70 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.image && <span className="text-red-500 text-xs">{errors.image.message}</span>}
        </div>
    
        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>
    
        {/* Phone */}
        <div>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid phone number",
              },
            })}
            type="text"
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
          {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
        </div>
    
        {/* Password */}
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
              maxLength: {
                value: 20,
                message: "Maximum 20 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
          <span
            className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>
    
        {/* Terms */}
        <div className="flex items-center text-sm text-gray-700">
          <input type="checkbox" className="mr-2" />
          <label>Accept Terms & Conditions</label>
        </div>
    
        {/* Submit Button */}
        <div>
          <input
            type="submit"
            value="Register"
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 cursor-pointer"
          />
        </div>
    
        {/* Login Link */}
        <div className="text-center text-sm mt-4">
          <Link to="/login" className="text-pink-500 hover:underline font-semibold">
            Already have an account? Login
          </Link>
        </div>
    
      </form>
    </div>
  </div>
  
  
  );
};

export default Register;
