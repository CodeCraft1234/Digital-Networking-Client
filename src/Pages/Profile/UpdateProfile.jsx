import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useUsers from "../../Hook/useUsers";

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const AxiosPublic = UseAxiosPublic();

  const [users, setUsers] = useUsers();
  const [ddd, setDdd] = useState(null);

  useEffect(() => {
    if (users && user) {
      const fff = users.find((u) => u.email === user?.email);
      setDdd(fff || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  const [fullName, setFullName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [number, setNumber] = useState("");
  const [facebookID, setFacebookID] = useState("");
  const [instagramID, setInstagramID] = useState("");
  const [linkedinID, setLinkedinID] = useState("");
  const [twitterID, setTwitterID] = useState("");
  const [youtubeID, setYoutubeID] = useState("");
  const [whatsappID, setWhatsappID] = useState("");

  const [image, setImage] = useState(null);
  const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let companyLogo;

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const res = await AxiosPublic.post(image_hosting_api, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        companyLogo = res.data.data.display_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return; // Exit the function if image upload fails
      }
    } else {
      // If no new image is selected, keep the previous image data
      companyLogo = ddd?.companyLogo;
    }

    const updateData = {
      fullName: fullName || ddd?.fullName,
      companyLogo: companyLogo || ddd?.companyLogo,
      fullAddress: fullAddress || ddd?.fullAddress,
      companyName: companyName || ddd?.companyName,
      number: number || ddd?.number,
      facebookID: facebookID || ddd?.facebookID,
      instagramID: instagramID || ddd?.instagramID,
      linkedinID: linkedinID || ddd?.linkedinID,
      twitterID: twitterID || ddd?.twitterID,
      youtubeID: youtubeID || ddd?.youtubeID,
      whatsappID: whatsappID || ddd?.whatsappID,
      bkashPersonal: 7484, // Assuming this is always updated
    };

    try {
      const response = await AxiosPublic.patch(
        `https://digital-networking-server.vercel.app/users/${user?.email}`,
        updateData
      );
      Swal.fire({
        title: "Updated!",
        text: "Your profile has been updated.",
        icon: "success",
      });
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
    <div className="mt-0 bg-white text-black">
      <section className="py-6 bg-white">
        <div className="grid max-w-6xl grid-cols-1 items-baseline px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
          <div className="mx-auto md:py-0 md:px-6">
            <h1 className="text-4xl font-bold">Update Your Info</h1>
            <p className="pt-2 pb-4">Fill in the form to update your profile</p>
            <div className="overflow-x-auto shadow-xl rounded-lg p-3">
            <div className="border border-gray-300 p-3">
            <img
                        className="w-20 h-20 flex justify-center  m-3 mx-auto rounded-full"
                        src={ddd?.companyLogo}
                        alt={ddd?.name}
                      />
                      <h1 className="text-blue-700 text-center font-bold text-xl">{ddd?.name}</h1>
            </div>
              <table className="table-auto border-collapse w-full text-left text-sm">
                <tbody>
                  <tr>
                  
                  
                  </tr>
                  <tr>
                    <th className="border p-2">Full Name</th>
                    <td className="border p-2">{ddd?.fullName}</td>
                  </tr>
                  <tr>
                    <th className="border p-2">Email</th>
                    <td className="border p-2">{ddd?.email}</td>
                  </tr>
                  <tr>
                    <th className="border p-2">Mobile</th>
                    <td className="border p-2">{ddd?.contactNumber}</td>
                  </tr>
                  <tr>
                    <th className="border p-2">Address</th>
                    <td className="border p-2">{ddd?.fullAddress}</td>
                  </tr>
                  <tr>
                    <th className="border p-2">Social Links</th>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <Link to={ddd?.facebookID}>
                          <FaFacebook className="w-5 h-5 text-blue-600" />
                        </Link>
                        <Link to={ddd?.instagramID}>
                          <FaInstagram className="w-5 h-5 text-red-600" />
                        </Link>
                        <Link to={ddd?.linkedinID}>
                          <FaLinkedin className="w-5 h-5 text-[#0072B9]" />
                        </Link>
                        <Link to={ddd?.twitterID}>
                          <FaTwitter className="w-5 h-5 text-[#00A2FD]" />
                        </Link>
                        <Link to={ddd?.youtubeID}>
                          <FaYoutube className="w-5 h-5 text-[#FF211F]" />
                        </Link>
                        <Link to={ddd?.whatsappID}>
                          <FaWhatsapp className="w-5 h-5 text-[#00CE6C]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col px-5 text-black shadow-2xl rounded-xl py-6 space-y-6 md:py-0 md:px-6"
            action="#"
            method="post"
          >
            <div className="grid lg:grid-cols-2 gap-2">
              <div>
              <label className="block">
              <span className="mb-1">Full Name</span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                defaultValue={ddd?.fullName}
                placeholder="Full Name"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
              </div>
              <div>
              <label className="block">
              <span className="mb-1">Company Name</span>
              <input
                type="text"
                id="companyName"
                name="companyName"
                defaultValue={ddd?.name}
                placeholder="Company Name"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
              </div>

            </div>
            <div>
              <label className="block">
              <span className="mb-1">Mobile Number</span>
              <input
                type="number"
                id="number"
                name="number"
                placeholder="Number..."
                defaultValue={ddd?.number}
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setNumber(e.target.value)}
              />
            </label>
              </div>
            <div>
              <label className="block">
              <span className="mb-1">Full Address</span>
              <input
                type="text"
                id="fullAddress"
                name="fullAddress"
                placeholder="Full Address"
                defaultValue={ddd?.fullAddress}
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </label>
              </div>
            <div className="grid lg:grid-cols-2 gap-2">
              <div>
              <label className="block">
              <span className="mb-1">Facebook ID</span>
              <input
                type="text"
                id="facebookID"
                name="facebookID"
                defaultValue={ddd?.facebookID}
                placeholder="Facebook ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFacebookID(e.target.value)}
              />
            </label>
              </div>
              <div>
 
              <label className="block">
              <span className="mb-1">Instagram ID</span>
              <input
                type="text"
                id="instagramID"
                name="instagramID"
                defaultValue={ddd?.instagramID}
                placeholder="Instagram ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setInstagramID(e.target.value)}
              />
            </label>
              </div>
              <div>
              <label className="block">
              <span className="mb-1">LinkedIn ID</span>
              <input
                type="text"
                id="linkedinID"
                name="linkedinID"
                defaultValue={ddd?.linkedinID}
                placeholder="LinkedIn ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setLinkedinID(e.target.value)}
              />
            </label>
              </div>
              <div>
 
              <label className="block">
              <span className="mb-1">Twitter ID</span>
              <input
                type="text"
                id="twitterID"
                name="twitterID"
                defaultValue={ddd?.twitterID}
                placeholder="Twitter ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setTwitterID(e.target.value)}
              />
            </label>
              </div>
              <div>
              <label className="block">
              <span className="mb-1">YouTube ID</span>
              <input
                type="text"
                id="youtubeID"
                name="youtubeID"
                defaultValue={ddd?.youtubeID}
                placeholder="YouTube ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setYoutubeID(e.target.value)}
              />
            </label>
              </div>
              <div>
              <label className="block">
              <span className="mb-1">WhatsApp ID</span>
              <input
                type="text"
                id="whatsappID"
                name="whatsappID"
                defaultValue={ddd?.whatsappID}
                placeholder="WhatsApp ID"
                className="block bg-white py-3 px-3 border w-full border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setWhatsappID(e.target.value)}
              />
            </label>
              </div>
          
            </div>
            <div>
              <label className="block">
              <span className="mb-1">Change Logo</span>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm py-3 px-3 text-gray-900 border-gray-700 border  rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
            </label>
              </div>
         
           
            
         
         
          
          
         
            <div className="flex justify-center pb-5 mt-6">
              <button
                type="submit"
                className="px-6 py-2 font-bold text-white bg-blue-600 border-gray-700 rounded-md hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UpdateProfile;
