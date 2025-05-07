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
<div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 px-4">
  <div className="relative w-full max-w-md rounded-3xl p-10 bg-white/60 backdrop-blur-2xl border border-white/30 shadow-[0_10px_50px_rgba(0,0,0,0.1)] overflow-hidden">

    {/* Colorful glow orbs */}
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-400 opacity-30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-pink-300 via-indigo-300 to-blue-300 opacity-10 blur-3xl rounded-full pointer-events-none" />

    {/* Heading */}
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
      Sign In
    </h2>

    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

    {/* Form */}
    <form onSubmit={handleLogin} className="space-y-5 text-sm text-gray-700">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          ref={emailRef}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-800"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label htmlFor="password" className="block font-medium mb-1">
          Password
        </label>
        <input
          type={show ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-800"
          required
        />
        <span
          className="absolute top-10 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 duration-300"
      >
        Sign In
      </button>
    </form>

    {/* Links */}
    <div className="flex justify-between mt-4 text-sm text-indigo-600">
      <button onClick={handleForgetPassword} className="hover:underline">
        Forgot Password?
      </button>
      <Link to="/signup" className="hover:underline font-medium">
        Register
      </Link>
    </div>

    {/* Divider */}
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-xs text-gray-500">OR</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>

    {/* Client Login */}
    <div className="text-center text-sm text-gray-600">
      Sign in as a
      <Link to="/clientLogin" className="text-pink-500 ml-1 hover:underline font-semibold">
        Client
      </Link>
    </div>
  </div>
</div>


  
  );
};

export default Login;
