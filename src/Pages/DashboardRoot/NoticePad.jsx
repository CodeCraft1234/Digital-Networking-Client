import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toJpeg } from "html-to-image";
import { Helmet } from "react-helmet-async";

const NoticePad = () => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    date: "",
  });

  const printRef = useRef();

  useEffect(() => {
    const today = new Date();
    
    // Format the date in Bengali
    const formattedDate = today.toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate,
    }));
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      description: content,
    }));
  };

  const downloadJPG = async () => {
    if (printRef.current) {
      try {
        const dataUrl = await toJpeg(printRef.current, {
          quality: 0.95,
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = "noticepad.jpg";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to download the image:", error);
      }
    }
  };

  return (
    <div className="min-w-full w-full lg:w-auto">
        <div className="grid text-black w-full lg:grid-cols-2 gap-5 p-4">

        <Helmet>
             <title>{`Notice Pad`} | Digital Network</title>
              <link rel="canonical" href="https://www.example.com/" />
        </Helmet>

        <div className="w-full bg-white p-5 border border-gray-500 rounded-lg  space-y-6">
        <form >
        <div>
          <label className="block text-gray-700 font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Type Subject..."
            className="w-full px-4 py-2 bg-white text-gray-800 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Description</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            theme="snow"
          />
        </div>
      
      </form>
      <button
          onClick={downloadJPG}
          className="px-4 py-2 mt-5 bg-blue-600 text-white rounded-md"
        >
          Download JPG
        </button>
        </div>

      <div className="w-full overflow-hidden lg:w-auto">
        <div
          ref={printRef}
          className="relative lg:h-[1000px]  lg:w-[750px]  rounded-lg bg-white border border-gray-500"
        >
          <img
            className="absolute rounded-lg h-full w-full"
            src="https://i.ibb.co.com/RQjSdk2/Pad.png"
            alt="Background Design"
          />
          <img
            className="absolute rounded-lg bottom-24 object-cover left-24"
            src="https://i.ibb.co.com/HgScmp2/Sill.png"
            alt="Background Design"
          />
          <div className="">
            <h1 className="absolute top-48 left-10 text-sm font-semibold mb-5">
              তাং- {formData.date || "________"}
            </h1>
            <h1 className="absolute top-56 left-10 text-sm font-semibold mb-5">
              বিষয়- {formData.subject || "................................................................"}
            </h1>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                formData.description ||
                `প্রিয় টিম মেম্বারগণ, <br /><br />আপনাদের প্রতিদিনের নিবেদন...`,
            }}
            className="absolute top-56 text-black px-10 mt-10 text-justify text-sm leading-6"
          ></div>
        </div>
       
      </div>
    </div>
    </div>
  );
};

export default NoticePad;
