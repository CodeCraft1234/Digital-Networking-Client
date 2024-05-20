import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";

import UseAxiosPublic from "../../Axios/UseAxiosPublic";


const UpdateProfile = () => {
    const { user } = useContext(AuthContext);
    const AxiosPublic=UseAxiosPublic()

    const [fullName, setFullName] = useState("");
    const [fullAddress, setfullAddress] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [contctNumber, setContctNumber] = useState("");
    const [facebookID, setfacebookID] = useState("");

    console.log(fullName,fullAddress,companyName,contctNumber,facebookID)

    const [image, setImage] = useState(null);
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
          };
      
          const response = await AxiosPublic.patch(`http://localhost:5000/users/${user?.email}`, updateData);
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
                 <p className="flex items-center">
					<img className="h-20 w-20 mx-auto rounded-full" src={user?.photoURL} alt="" />
				</p>
			<h1 className="text-4xl font-bold">Update Your Info</h1>
			<p className="pt-2 pb-4">Fill in the form to start a conversation</p>
			<div className="space-y-4">
				<p className="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 sm:mr-6">
						<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
					</svg>
					<span>{user?.displayName}</span>
				</p>
				<p className="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 sm:mr-6">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
					</svg>
					<span>{user?.email}</span>
				</p>
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
