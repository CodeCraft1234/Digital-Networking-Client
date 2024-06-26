import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";

import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import { SiNamemc } from "react-icons/si";
import useUsers from "../../Hook/useUsers";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";


const UpdateProfile = () => {
    const { user } = useContext(AuthContext);
    const AxiosPublic=UseAxiosPublic()




    const [users, setUsers] = useUsers();
    const [ddd, setDdd] = useState(null);
  console.log(ddd)
    useEffect(() => {
      if (users && user) {
        const fff = users.find((u) => u.email === user?.email);
        console.log(fff);
        setDdd(fff || {}); // Update state with found user or an empty object
      }
    }, [users, user]);




    const [fullName, setFullName] = useState("");
    const [fullAddress, setfullAddress] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [contctNumber, setContctNumber] = useState("");
    const [facebookID, setfacebookID] = useState("");
    const [instagramID, setInstagramID] = useState("");
    const [linkedinID, setLinkedinID] = useState("");
    const [twitterID, setTwitterID] = useState("");
    const [youtubeID, setYoutubeID] = useState("");
    const [whatsappID, setWhatsappID] = useState("");

    console.log(fullName,fullAddress,companyName,contctNumber,facebookID,instagramID, linkedinID, twitterID, youtubeID, whatsappID)

    const [image, setImage] = useState("");
    const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
      
        try {
          const res = await AxiosPublic.post(image_hosting_api, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });
          const companyLogo = res.data.data.display_url;
      
          const updateData = {
            fullName,
            companyLogo,
            fullAddress,
            companyName,
            contctNumber,
            facebookID,
            instagramID,
            linkedinID,
            twitterID,
            youtubeID,
            whatsappID,
            bkashPersonal:7484
          };

          const body={bkashPersonal:7484}
          AxiosPublic.patch(`/users/${user?.email}`,updateData)
          .then(res=>{
            Swal.fire({
              title: "updated!",
              text: "This blog has been updated.",
              icon: "success"
            });
            console.log(res.data)      
            })
      
          const response = await AxiosPublic.patch(`https://digital-networking-server.vercel.app/users/${user?.email}`, updateData);
          console.log(response.data);
        } catch (error) {
          console.error("Error updating profile:", error);
        }


      
        setImage(null);
      };
      
  
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
      };

    return (
        <div className="mt-24">
            <section className="py-6 dark:bg-gray-800 dark:text-gray-50">
	<div className="grid max-w-6xl grid-cols-1 items-baseline px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
		<div className="py-6 mx-auto md:py-0 md:px-6">
			<h1 className="text-4xl font-bold">Update Your Info</h1>
			<p className="pt-2 pb-4">Fill in the form to start a conversation</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4">
      
          <div
            key={ddd?._id}
            className="bg-white  border border-black mx-auto shadow-md rounded-lg p-6 transform transition-all hover:shadow-xl"
            style={{ width: "300px", height: "400px" }}
          >
            <div className="text-center text-black  overflow-hidden">
              <img
                className="w-20 h-20 mx-auto rounded-full mb-4"
                src={ddd?.photo}
                alt={ddd?.name}
              />

              <h2 className="text-base font-semibold mb-4 text-red-600">
                {ddd?.name}
              </h2>
            </div>
            <div className="text-left text-black ">
              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Full Name: </span>
                <span className="text-sm text-gray-600">{ddd?.fullName}</span>
              </div>
              {/* <div className="flex items-center justify-start mb-2 gap-2">
                <span>Company Name: </span>
                <span>{em.companyName}</span>
              </div> */}
              <div className="flex items-center justify-start mb-2 gap-2">
                <span className="font-bold">Email: </span>
                <span className="text-sm text-gray-600">{ddd?.email}</span>
              </div>
              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Mob:</span>
                <span className="text-sm text-gray-600">{ddd?.contctNumber}</span>
              </div>

              <div className="flex items-center justify-start mb-2 gap-2 overflow-hidden">
                <span className="font-bold ">Address: </span>
                <span className="text-sm text-gray-600">{ddd?.fullAddress}</span>
              </div>

              <div className="flex items-center justify-center mb-2 gap-0 overflow-hidden ">
                {/* <span className=" font-bold">Facebook: </span> */}
                <button className=" text-blue-600 rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.facebookID}>
                    <FaFacebook className="w-5 h-5"></FaFacebook>
                  </Link>
                </button>
                <button className=" text-red-600 rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.instagramID}>
                    <FaInstagram className="w-5 h-5"></FaInstagram>
                  </Link>
                </button>
                <button className=" text-[#0072B9] rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.linkedinID}>
                    <FaLinkedin className="w-5 h-5"></FaLinkedin>
                  </Link>
                </button>
                <button className=" text-[#00A2FD] rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.twitterID}>
                    <FaTwitter className="w-5 h-5"></FaTwitter>
                  </Link>
                </button>
                <button className=" text-[#FF211F] rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.youtubeID}>
                    <FaYoutube className="w-5 h-5"></FaYoutube>
                  </Link>
                </button>
                <button className=" text-[#00CE6C] rounded-lg  border-gray-600 p-3">
                  <Link to={ddd?.whatsappID}>
                    <FaWhatsapp className="w-5 h-5"></FaWhatsapp>
                  </Link>
                </button>
              </div>
            </div>
          </div>
      </div>
		</div>

        <form onSubmit={handleSubmit} className="flex flex-col py-6 space-y-6 md:py-0 md:px-6" action="#" method="post">
            <label className="block">
				<span className="mb-1">Full Name</span>
				<input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full Name"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setFullName(e.target.value)}
                />
			</label>     
            <label className="block">
				<span className="mb-1">Company Name</span>
				<input
                  type="text"
                  id="fullName"
                  name="companyName"
                  placeholder="Company Name"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
               
                  onChange={(e) => setCompanyName(e.target.value)}
                />
			</label>     
            <label className="block">
				<span className="mb-1">Full Address</span>
				<input
                  type="text"
                  id="fullName"
                  name="fullAddress"
                  placeholder="Full Address"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                  
                  onChange={(e) => setfullAddress(e.target.value)}
                />
			</label>     
            <label className="block">
				<span className="mb-1">Facebook ID</span>
				<input
                  type="text"
                  id="fullName"
                  name="facebookID"
                  placeholder="Facebook ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setfacebookID(e.target.value)}
                />
			</label>
           {/* instagram */}
           <label className="block">
				<span className="mb-1">Instagram</span>
				<input
                  type="text"
                  id="fullName"
                  name="instagramID"
                  placeholder="Instagram ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setInstagramID(e.target.value)}
                />
			</label>
           {/* linkedin */}
           <label className="block">
				<span className="mb-1">LinkedIn</span>
				<input
                  type="text"
                  id="fullName"
                  name="linkedinID"
                  placeholder="Linkedin ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setLinkedinID(e.target.value)}
                />
			</label>
           {/* twitter */}
           <label className="block">
				<span className="mb-1">Twitter</span>
				<input
                  type="text"
                  id="fullName"
                  name="twitterID"
                  placeholder="Twitter ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setTwitterID(e.target.value)}
                />
			</label>
           {/* youtube */}
           <label className="block">
				<span className="mb-1">YouTube</span>
				<input
                  type="text"
                  id="fullName"
                  name="youtubeID"
                  placeholder="YouTube ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setYoutubeID(e.target.value)}
                />
			</label>
           {/* whatsapp */}
           <label className="block">
				<span className="mb-1">WhatsApp</span>
				<input
                  type="number"
                  id="fullName"
                  name="whatsappID"
                  placeholder="WhatsApp ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setWhatsappID(e.target.value)}
                />
			</label>

            <label className="block">
				<span className="mb-1">Contact Number</span>
				<input
                  type="text"
                  id="fullName"
                  name="contactNumber"
                  placeholder="Contact Number"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                 
                  onChange={(e) => setContctNumber(e.target.value)}
                />
			</label>     

            <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full p-2 mb-4 border rounded"
            accept="image/*"
            required
          />

          <button
            type="submit"
          
            className="b self-center px-8 py-3 text-lg rounded focus:ring hover:ring focus:ri dark:bg-violet-400 dark:text-gray-900 focus:ri hover:ri"
          >
            Submit
          </button>
        </form>

	</div>
</section>
        </div>
    );
};

export default UpdateProfile;



{/* <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-6 space-y-6 md:py-0 md:px-6">
			<label className="block">
				<span className="mb-1">Full Name</span>
				<input
                  {...register("fullName", { required: true })}
                  type="text"
                  placeholder="Full Name"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                  required
                />
			</label>
			<label className="block">
				<span className="mb-1">Company Name</span>
				<input
                  {...register("companyName", { required: true })}
                  type="text"
                  placeholder="Company Name"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                  required
                />
			</label>
			<label className="block">
				<span className="mb-1">Company Logo</span>
                <input
                  {...register("companyLogo")}
                  type="file"
                  placeholder="Company Logo"
                  className="file-input file-input-bordered block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                />
			</label>
			<label className="block">
				<span className="mb-1">Full Address</span>
                <input
                  {...register("fullAddress")}
                  type="text"
                  placeholder="Full Address"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                />
			</label>
			<label className="block">
				<span className="mb-1">Facebook ID</span>
				<input
                  {...register("facebookID")}
                  type="text"
                  placeholder="Facebook ID"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                />
			</label>
			<label className="block">
				<span className="mb-1">Contact Number</span>
				<input
                  {...register("contactNumber")}
                  type="type"
                  placeholder="Contact Number"
                  className="block bg-white py-3 px-3 border border-white w-full rounded-md shadow-sm focus:ring focus:ri focus:ri dark:bg-gray-800"
                />
			</label>
			<button type="button" className="self-center px-8 py-3 text-lg rounded focus:ring hover:ring focus:ri dark:bg-violet-400 dark:text-gray-900 focus:ri hover:ri">Submit</button>
		</form> */}
