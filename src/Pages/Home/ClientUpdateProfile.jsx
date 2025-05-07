import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useFindClient from "./useFindClient";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";

const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ClientUpdateProfile = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const {user}=useContext(AuthContext)

    const param = useParams();
    const { findClients ,refetch} = useFindClient(param?.id);

    console.log(findClients);

    const AxiosPublic=UseAxiosPublic()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const clientName = form.fullName.value || findClients?.clientName
    const clientPhone = form.clientPhone.value || findClients?.clientPhone
    const clientEmail = form.email.value || findClients?.clientEmail
    const dob = form.dob.value || findClients?.dob
    const gender = form.gender.value || findClients?.gender
  
    let companyLogo = null;
  
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
  
      try {
        const res = await axios.post(image_hosting_api, formData, {
          headers: { "content-type": "multipart/form-data" },
        });
        companyLogo = res.data.data.display_url;
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }
  
    const body = {
      clientName,
      clientEmail,
      clientPhone,
      dob,
      gender,
      image: companyLogo || findClients?.image,
    };
  
    try {
      const res=await AxiosPublic.patch(`/clients2/${findClients?.id }`, body);
   
      console.log(res.data);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${clientName} has been successfully updated`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      
      refetch();
    } catch (error) {
      toast.error("Update failed");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
   <form
  onSubmit={handleSubmit}
  className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-5"
>
  {/* Profile Image Upload */}
  <div className="flex flex-col items-center">
    <div className="relative">
      <img
        src={
          preview ||
          findClients?.image ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Profile"
        className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
      />
      <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <svg
          className="w-4 h-4 text-black bg-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm10.293 5.293l-3 3a1 1 0 01-1.414 0l-1-1L6 12h8l-2.293-2.707z" />
        </svg>
      </label>
    </div>
  </div>

  {/* Full Name */}
  <div>
    <label className="text-gray-600 text-sm">Full Name</label>
    <input
      name="fullName"
      type="text"
      required
      defaultValue={findClients?.clientName || ""}
      className="w-full mt-1 border text-black bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>

  {
    user && 
    <div>
    <label className="text-gray-600 text-sm">Mobile</label>
    <input
      name="clientPhone"
      type="number"
      required
      defaultValue={findClients?.clientPhone || ""}
      className="w-full mt-1 border text-black bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
  }


  {/* Email */}
  <div>
    <label className="text-gray-600 text-sm">E-mail</label>
    <input
      name="email"
      type="email"
      required
      defaultValue={findClients?.clientEmail || ""}
      className="w-full mt-1 border text-black bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>

  {/* Date of Birth */}
  <div>
    <label className="text-gray-600 text-sm">Date of Birth</label>
    <div className="relative">
      <input
        name="dob"
        type="date"
        required
        defaultValue={
          findClients?.dob && !isNaN(Date.parse(findClients.dob))
            ? new Date(findClients.dob).toISOString().split("T")[0]
            : ""
        }
        className="w-full mt-1 border text-black bg-white border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div className="absolute right-3 top-3 text-gray-400">📅</div>
    </div>
  </div>

  {/* Gender */}
  <div>
    <label className="text-sm text-gray-600 mb-1 block">Gender</label>
    <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2">
      <span className="text-sm text-gray-700">
        {findClients?.gender || "Male"}
      </span>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="gender"
            value="Male"
            defaultChecked={!findClients?.gender || findClients?.gender === "Male"}
            className="accent-blue-600"
          />
          Male
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="gender"
            value="Female"
            defaultChecked={findClients?.gender === "Female"}
            className="accent-blue-600"
          />
          Female
        </label>
      </div>
    </div>
  </div>

  {/* Save Button */}
  <button
    type="submit"
    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold transition"
  >
    Save
  </button>
</form>

    </div>
  );
};

export default ClientUpdateProfile;
