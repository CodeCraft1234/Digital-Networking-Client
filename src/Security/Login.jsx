import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../Components/firebase/firebase.config";
import Swal from "sweetalert2";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Reset errors on each login attempt
  
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
  
    signIn(email, password)
      .then((result) => {
        console.log(result.user);
        navigate(`/`);
        toast.success("Login successful");
      })
      .catch((err) => {
          setError("Your password or Email does not match our records.");
      });
  };
  

  const handleForgetPassword = () => {
    const email = emailRef.current.value;

    if (!email) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your email to reset the password.",
        icon: "error",
      });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Check your email for password reset instructions.",
          icon: "success",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Failed to send reset email. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-5 ">
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Enter your email"
              className="bg-white border border-gray-300 text-black w-full p-3 rounded-lg"
              required
            />
          </div>
          <div className="relative mb-5">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="bg-white border border-gray-300 text-black w-full p-3 rounded-lg"
              required
            />
            <span
              className="absolute top-10 right-3 cursor-pointer text-gray-500"
              onClick={() => setShow(!show)}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleForgetPassword}
            className="text-indigo-500 hover:underline"
          >
            Forgot Password?
          </button>
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="flex justify-center items-center mt-6">
          <span className="text-gray-600">Or sign in as a</span>
          <Link
            to={"/clientLogin"}
            className="ml-2 text-indigo-500 hover:underline font-bold"
          >
            Client
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
