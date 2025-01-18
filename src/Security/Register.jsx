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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
          {/* Name Input */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          {/* Image Upload */}
          <div>
            <input
              {...register("image", { required: "Profile image is required" })}
              type="file"
              className="block w-full text-sm bg-white text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && <span className="text-red-500 text-xs">{errors.image.message}</span>}
          </div>

          {/* Email Input */}
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
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* Phone Input */}
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
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" />
            <label className="text-gray-600">Accept Terms & Conditions</label>
          </div>

          {/* Submit Button */}
          <div>
            <input
              type="submit"
              value="Register"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all cursor-pointer"
            />
          </div>

          {/* Links */}
          <div className="text-center text-sm">
            <Link to="/login" className="text-blue-500 hover:underline">
              Already Have An Account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
