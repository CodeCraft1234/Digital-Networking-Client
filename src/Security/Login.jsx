
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {  FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";
import "./Login.css";
import { FaSquareFacebook } from "react-icons/fa6";

const Login = () => {
  const { signIn, googleSignIn, facebookSignin, githubLogin } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        console.log(result.user);
        navigate(location?.state ? location.state : "/");
        toast.success("Google login successful");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Google login failed");
      });
  };

// facebook login
const handleFacebook = () => {
  facebookSignin()
    .then((result) => {
      console.log(result.user);

      // navigate after login
      navigate(location?.state ? location.state : "/");
      return toast.success("facebook login successfully");
    })
    .catch((error) => {
      console.log(error);
      return toast.error("password or email not match");
    });
};

  const handleGithubLogin = () => {
    githubLogin()
      .then((result) => {
        console.log(result.user);
        navigate(location?.state ? location.state : "/");
        toast.success("GitHub login successful");
      })
      .catch((error) => {
        console.log(error);
        toast.error("GitHub login failed");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    signIn(email, password)
      .then((result) => {
        console.log(result.user);
        navigate(location?.state ? location.state : "/");
        toast.success("User login successful");
      })
      .catch((error) => {
        console.log(error);
        toast.error("User login failed");
      });
  };

  return (
    <div className="mt-32 flex justify-center items-center mx-auto lg:pb-0 md:pb-0 pb-8">
      <div className="box mt-10">
        <div className="login">
          <div className="loginBx">
            <h2>
              <i className="fa-solid fa-right-to-bracket"></i> Login
              <i className="fa-solid fa-heart"></i>
            </h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                name="email"
                placeholder="Username"
                className="mb-5"
                required
              />
             
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered text-[#9F9F9F] text-xs font-normal mb-5"
                required
              />
              <input type="submit" value="Sign in" />
            </form>
            <div className="group">
              <Link className="text-[#F75B5F] " to="/forgetPassword">
                Forgot Password?
              </Link>
              <Link to="/signup">Sign up</Link>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoogleLogin}
                aria-label="Log in with Google"
                className="p-3 text-white bg-gray-800 hover:bg-gray-700 rounded-full"
              >
                <FcGoogle />
              </button>
              <button
                  onClick={handleFacebook}
                  aria-label="Log in with Facebook"
                  className="p-3 text-white bg-gray-800 hover:bg-gray-700 rounded-full"
                >
                <FaSquareFacebook className="text-[#016ecd]"/>
                </button>
              <button
                onClick={handleGithubLogin}
                aria-label="Log in with GitHub"
                className="p-3 text-white bg-gray-800 hover:bg-gray-700 rounded-full"
              >
                <FaGithub className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


