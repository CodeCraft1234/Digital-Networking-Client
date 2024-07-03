
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {  FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";
import "./Login.css";
import { FaSquareFacebook } from "react-icons/fa6";
import useUsers from "../Hook/useUsers";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../Components/firebase/firebase.config";
import Swal from "sweetalert2";

const Login = () => {
  const { signIn, googleSignIn, facebookSignin, githubLogin } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const emailRef=useRef(null)


  const { user } = useContext(AuthContext);
  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
      if (users && user) {
          const fff = users.find(u => u.email === user?.email);
          console.log(fff);
          setDdd(fff || {}); // Update state with found user or an empty object
      }
  }, [users, user]);

  console.log(ddd?.name);

  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        console.log(result.user);
        {
          ddd?.role === 'employee' ?  navigate(location?.state ? location.state : `/userInfo/${ddd?.email}`) :  navigate(location?.state ? location.state : "/");
        }
       
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
        {
          ddd?.role === 'employee' ? navigate(`/dashboard/employee/home`) :  navigate("/dashboard/admin/home")
        }
      
        Swal.fire({
          title: "successfully login!",
          text: "login!",
          icon: "success"
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "error",
          text: "wrong password",
          icon: "error"
        });
      });
  };

 const handleForgetPassword=(e)=>{
  const email=emailRef.current.value
  if(!email){
    console.log('reset email or password',emailRef.current.value)
    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success"
    });
    return;
  }
  sendPasswordResetEmail(auth, email)
  .then(() => {
    Swal.fire({
      title: "check your email",
      text: "check!",
      icon: "success"
    });
   
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  console.log('kladshijkg',emailRef.current.value)
 }

 const [show,setShow]=useState(false)
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
                type="email"
                name="email"
                ref={emailRef}
                placeholder="Type your email"
                className="mb-5"
                required
              />
             
            <div className="relative w-full">
            <input
                type={show ? "text":"password"}
                name="password"
                placeholder="Enter your password"
                className="input w-full input-bordered text-[#9F9F9F] text-xs font-normal mb-5"
                required
              />
              <span className="absolute mt-4 right-3" onClick={()=>setShow(!show)}>{
                show ? <FaEyeSlash  /> : <FaEye />
              }</span>
            </div>
              
              <input type="submit" value="Sign in" />
            </form>
            <div className="group">
              <btn onClick={handleForgetPassword} className="text-[#F75B5F] " >
                Forgot Password?
              </btn>

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


