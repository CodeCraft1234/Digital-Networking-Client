
// import { useContext } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaSquareFacebook } from "react-icons/fa6";
// import { FaGithub } from "react-icons/fa6";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { AuthContext } from "./AuthProvider";

// const Login = () => {
//   const { signIn, googleSignIn, facebookSignin } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   // console.log('location in the login page', location);

//   // google login
//   const handleGoogleLogin = () => {
//     googleSignIn()
//       .then((result) => {
//         console.log(result.user);

//         // navigate after login
//         navigate(location?.state ? location.state : "/");
//         return toast.success("google login successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//         return toast.error("password or email not match");
//       });
//   };

//   // facebook login
//   const handleFacebook = () => {
//     facebookSignin()
//       .then((result) => {
//         console.log(result.user);

//         // navigate after login
//         navigate(location?.state ? location.state : "/");
//         return toast.success("facebook login successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//         return toast.error("password or email not match");
//       });
//   };

//   const handleLogin = (e) => {
//     // access the form data
//     e.preventDefault();
//     const form = new FormData(e.currentTarget);
//     const email = form.get("email");
//     const password = form.get("password");
//     // console.log(name, photo, email, password);

//     // sign in a user
//     signIn(email, password).then((result) => {
//       console.log(result.user);
//       e.target.reset();
//       // const user = { email };
//       navigate(location?.state ? location.state : "/");
//       return toast.success("user login successfully");
//     });
//   };

//   return (
//     <div>
//       <div className="hero min-h-screen">
//         <div className="hero-content flex-col lg:flex-row-reverse">
//           <div className="text-center lg:text-left"></div>
//           <div className="card flex-shrink-0 w-full  max-w-sm shadow-2xl border-4 box bg-violet-950">
//             <form onSubmit={handleLogin} className="card-body">
//               <div className="form-control">
//                 <h1 className="text-3xl text-center text-white font-semibold">
//                   Login your account
//                 </h1>
//                 <hr className="mt-4" />
//                 <label className="label">
//                   <span className="label-text text-white text-sm font-semibold">
//                     Email address
//                   </span>
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   name="email"
//                   className="input input-bordered text-xs font-normal "
//                   required
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text text-sm text-white font-semibold">
//                     Password
//                   </span>
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   className="input input-bordered text-[#9F9F9F] text-xs font-normal "
//                   required
//                 />
//                 <div className="flex justify-end text-xs dark:text-gray-400">
//                   {/* <a rel="noopener noreferrer" href="#">Forgot Password?</a> */}
//                   <Link className="text-[#F75B5F] " to="/forgetPassword">
//                     {" "}
//                     Forgot Password?
//                   </Link>
//                 </div>
//               </div>
//               <div className="form-control mt-1">

//                 <button className="p-2 rounded bg-[#1368c0] text-white">

//                   Login
//                 </button>
//               </div>
             
//               <div className="flex items-center pt-4 space-x-1">
//                 <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
//                 <div className=" flex flex-col w-full">
//                   <p className="px-3 divider divider-neutral  text-sm text-white">
//                     Login with social accounts
//                   </p>
//                 </div>
//                 <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
//               </div>
//               <div className="flex justify-center space-x-4">
//                 <button
//                   onClick={handleGoogleLogin}
//                   aria-label="Log in with Google"
//                   className="p-3 hover:bg-[#e7e9eb] rounded-full"
//                 >
//                <FcGoogle />


//                 </button>
//                 <button
//                   onClick={handlefacebooksignin}
//                   aria-label="Log in with Facebook"
//                   className="p-3 hover:bg-[#e7e9eb] rounded-full"
//                 >
//                 <FaSquareFacebook className="text-[#016ecd]"/>
//                 </button>
//                 <button
//                   aria-label="Log in with GitHub"
//                   className="p-3 text-white hover:bg-[#e7e9eb] rounded-full"
//                 >
//                 <FaGithub className="text-black"/>
//                 </button>
//               </div>

//               <p className="text-center text-white font-semibold text-xs mt-4">
//                { `Don't Have An Account ?`}
//                 <Link className="text-[#F75B5F]" to="/signup">
//                   {" "}
//                   Register
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


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


