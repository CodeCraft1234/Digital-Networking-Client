import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import UseAxiosPublic from "../Axios/UseAxiosPublic";
import { useForm } from "react-hook-form";
import "./Register.css";

const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const Register = () => {
  const { createUser, updateProfiles } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const AxiosPublic = UseAxiosPublic();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data.image);
    // access the form data
    const image = { image: data.image[0] };
    const res = await AxiosPublic.post(image_hosting_api, image, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    const name = data.name;
    const email = data.email;
    const password = data.password;
    const photo = res.data.data.display_url;
    const bkashMarcent=0
    const bkashPersonal=0
    const nagadPersonal=0
    const rocketPersonal=0
    const payoneer=0
    const totalBDT=0
    
    console.log(res.data.data.display_url);
    console.log(name, email, password, photo);

    // create user and update profiles
    createUser(email, password)
      .then((result) => {
        navigate(location.state ? location.state : "/");
        updateProfiles(name, photo);
        console.log(result.user);
        console.log(email, name, photo);
        const date = new Date();
        const userInfo = { email, name, photo, date, role: 'user',bkashMarcent,bkashPersonal,nagadPersonal,rocketPersonal,payoneer,totalBDT };
        AxiosPublic.post("/users", userInfo).then((res) => {
          console.log(res.data);
        });
        // new product created for server side here
        navigate("/");
        return toast.success("user created successfully");
      })
      .catch((error) => {
        console.log(error);
        return toast.error("user already exists");
      });
  };

  return (
    <div className="lg:mt-24 md:mt-24 mt-20 mb-10">
      <div className=" flex justify-center items-center mx-auto">
        <div className="boxS mt-10">
          <div className="loginN">
            <div className="loginBxx">
              <h2>
                <i className="fa-solid fa-right-to-bracket"></i> Register
                <i className="fa-solid fa-heart"></i>
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Enter your name"
                  className="input  input-bordered text-black text-xs font-normal "
                  required
                />

                <input
                  {...register("image")}
                  type="file"
                  placeholder="Enter your photo url"
                  className="file-input file-input-bordered w-full max-w-xs my-5"
                />

                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Enter your email address"
                  className="input input-bordered text-black text-xs font-normal "
                  required
                />

                <input
                  {...register("password", {
                    required: true,
                    maxLength: 20,
                    minLength: 6,
                  })}
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered text-black text-xs font-normal my-5"
                  required
                />

                {errors.password?.type === "required" && (
                  <span className="text-white"> password is required</span>
                )}
                {errors.password?.type === "maxLength" && (
                  <span className="text-white"> max 20 carecter</span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="text-white"> min 6 carecter</span>
                )}

                <div className="flex mt-3">
                  
                  <p className="flex font-normal text-xs">
                  <input type="checkbox" className="justify-start" name="checkbox" id="" />
                     <span className="font-bold">Accept Term & Conditions</span>
                  </p>
                </div>
                <input type="submit" value="Register" className="my-5"/>

                <div className="group mb-5">
                  <Link className="text-[#F75B5F] " to="/forgetPassword">
                    Already Have An Account ?
                  </Link>
                  <Link to="/login">Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
