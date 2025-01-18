import { useContext, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Swal from "sweetalert2";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import useUserr3 from "../../Hook/useUserr3";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { useCallback } from "react";
import {  FaPen } from "react-icons/fa";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
const image_hosting_key = "6fbc3358bbb1a92b78e2dee0f5ca1b94";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const {userr3,refetch}=useUserr3(user?.email)
  const AxiosPublic = UseAxiosPublic();

  const [fullName, setFullName] = useState();
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");
  const [nationality, setNationality] = useState("");
  const [NID, setNID] = useState("");
  const [birthRegId, setBirthRegId] = useState("");

  const [blood, setBlood] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [religion, setReligion] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  const [selectedDivision, setSelectedDivision] = useState(userr3?.selectedDivision);
  const [selectedDistrict, setSelectedDistrict] = useState(userr3?.selectedDistrict);
  const [selectedUpazila, setSelectedUpazila] = useState(userr3?.selectedUpazila);
  const [presentAddress, setPresentAddress] = useState("");
  
  const [selectedDivision2, setSelectedDivision2] = useState(userr3?.selectedDivision2);
  const [selectedDistrict2, setSelectedDistrict2] = useState(userr3?.selectedDistrict2);
  const [selectedUpazila2, setSelectedUpazila2] = useState(userr3?.selectedUpazila2);
  const [permanentAddress, setPermanentAddress] = useState("");
  
  const [facebookID, setFacebookID] = useState(userr3?.facebookID);
  const [instagramID, setInstagramID] = useState(userr3?.instagramID);
  const [linkedinID, setLinkedinID] = useState(userr3?.linkedinID);
  const [twitterID, setTwitterID] = useState(userr3?.twitterID);
  const [youtubeID, setYoutubeID] = useState(userr3?.youtubeID);
  const [whatsappID, setWhatsappID] = useState(userr3?.whatsappID);

  const [Occupation, setOccupation] = useState(userr3?.occupation);
  const [skill, setSkill] = useState(userr3?.skill);
  const [lastEducationDegree, setLastEducationDegree] = useState(userr3?.lastEducationDegree);
  const [lastEducationBoard, setLastEducationBoard] = useState(userr3?.lastEducationBoard);
  const [lastEducationInstitute, setLastEducationInstitute] = useState(userr3?.lastEducationInstitute);
  const [groupName, setGroupName] = useState(userr3?.groupName);
  const [yearOfPassing, setYearOfPassing] = useState(userr3?.yearOfPassing);
  const [status, setStatus] = useState(userr3?.status);
  const [gpaCgpa, setGpaCgpa] = useState(userr3?.gpaCgpa);


  const [image, setImage] = useState(null);

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
        return; 
      }
    } else {
      companyLogo = userr3?.companyLogo;
    }
  
    const updateData = {
      name: fullName || userr3?.name,
      companyLogo: companyLogo || userr3?.companyLogo,
      companyName: companyName || userr3?.companyName,
      contactNumber: contactNumber || userr3?.contactNumber,
      fatherName: fatherName || userr3?.fatherName,
      motherName: motherName || userr3?.motherName,
      guardianMobile: guardianMobile || userr3?.guardianMobile,
      nationality: nationality || userr3?.nationality,
      NID: NID || userr3?.NID,
      birthRegId: birthRegId || userr3?.birthRegId,
      blood: blood || userr3?.blood,
      dateOfBirth: dateOfBirth || userr3?.dateOfBirth,
      religion: religion || userr3?.religion,
      gender: gender || userr3?.gender,
      maritalStatus: maritalStatus || userr3?.maritalStatus,

      selectedDivision: selectedDivision || userr3?.selectedDivision,
      selectedDistrict: selectedDistrict || userr3?.selectedDistrict,
      selectedUpazila: selectedUpazila || userr3?.selectedUpazila,
      presentAddress: presentAddress || userr3?.presentAddress,
    
      selectedDivision2: selectedDivision2 || userr3?.selectedDivision2,
      selectedDistrict2: selectedDistrict2 || userr3?.selectedDistrict2,
      selectedUpazila2: selectedUpazila2 || userr3?.selectedUpazila2,
      permanentAddress: permanentAddress || userr3?.permanentAddress,
    
      facebookID: facebookID || userr3?.facebookID,
      instagramID: instagramID || userr3?.instagramID,
      linkedinID: linkedinID || userr3?.linkedinID,
      twitterID: twitterID || userr3?.twitterID,
      youtubeID: youtubeID || userr3?.youtubeID,
      whatsappID: whatsappID || userr3?.whatsappID,
    
      occupation: Occupation || userr3?.occupation,
      skill: skill || userr3?.skill,
      lastEducationDegree: lastEducationDegree || userr3?.lastEducationDegree,
      lastEducationBoard: lastEducationBoard || userr3?.lastEducationBoard,
      lastEducationInstitute: lastEducationInstitute || userr3?.lastEducationInstitute,
      groupName: groupName || userr3?.groupName,
      yearOfPassing: yearOfPassing || userr3?.yearOfPassing,
      status: status || userr3?.status,
      gpaCgpa: gpaCgpa || userr3?.gpaCgpa,
    };
    
    try {
      const response = await AxiosPublic.patch(`/users/${user?.email}`,updateData);
      Swal.fire({
        title: "Updated!",
        text: "Your profile has been updated.",
        icon: "success",
      });
      console.log(response.data);
      refetch()
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue updating your profile. Please try again.",
        icon: "error",
      });
    }
  
    setImage(null);
  };
  
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const divisionsData = {
      "Dhaka": {
        "districts": {
          "Dhaka": [
            "Dhanmondi",
            "Gulshan",
            "Mirpur",
            "Savar",
            "Uttara",
            "Tejgaon",
            "Rampura",
            "Jatrabari",
            "Motijheel",
            "Mohammadpur",
            "Hazaribagh",
            "Demra",
            "Khilgaon",
            "Keraniganj",
            "Lalbagh",
            "Badda",
            "Shyampur",
            "Kamrangirchar"
          ],
          "Gazipur": [
            "Gazipur Sadar",
            "Kaliakair",
            "Kapasia",
            "Sreepur",
            "Tongi"
          ],
          "Narayanganj": [
            "Narayanganj Sadar",
            "Sonargaon",
            "Rupganj",
            "Bandar",
            "Araihazar"
          ],
          "Manikganj": [
            "Manikganj Sadar",
            "Singair",
            "Shibalaya",
            "Harirampur",
            "Saturia",
            "Ghior",
            "Daulatpur"
          ],
          "Munshiganj": [
            "Munshiganj Sadar",
            "Sirajdikhan",
            "Louhajang",
            "Gazaria",
            "Sreenagar",
            "Tongibari"
          ],
          "Narsingdi": [
            "Narsingdi Sadar",
            "Raipura",
            "Belabo",
            "Shibpur",
            "Monohardi",
            "Palash"
          ],
          "Kishoreganj": [
            "Kishoreganj Sadar",
            "Bhairab",
            "Pakundia",
            "Hossainpur",
            "Tarail",
            "Itna",
            "Karimganj",
            "Katiadi",
            "Bajitpur",
            "Mithamain",
            "Austagram",
            "Nikli"
          ],
          "Tangail": [
            "Tangail Sadar",
            "Sakhipur",
            "Basail",
            "Madhupur",
            "Gopalpur",
            "Kalihati",
            "Nagarpur",
            "Delduar",
            "Ghatail",
            "Mirzapur",
            "Dhanbari",
            "Bhuapur"
          ],
          "Faridpur": [
            "Faridpur Sadar",
            "Nagarkanda",
            "Boalmari",
            "Alfadanga",
            "Charbhadrasan",
            "Bhanga",
            "Sadarpur",
            "Madhukhali",
            "Saltha"
          ],
          "Madaripur": [
            "Madaripur Sadar",
            "Rajoir",
            "Shibchar",
            "Kalkini"
          ],
          "Shariatpur": [
            "Shariatpur Sadar",
            "Damudya",
            "Naria",
            "Zajira",
            "Bhedarganj",
            "Gosairhat"
          ],
          "Gopalganj": [
            "Gopalganj Sadar",
            "Tungipara",
            "Kashiani",
            "Kotalipara",
            "Muksudpur"
          ]
        }
      },
    
      "Chattogram": {
        "districts": {
          "Chattogram": [
            "Chattogram Sadar",
            "Kotwali",
            "Pahartali",
            "Sitakunda",
            "Double Mooring",
            "Raozan",
            "Boalkhali",
            "Anwara",
            "Hathazari",
            "Mirsharai",
            "Sandwip",
            "Banshkhali",
            "Satkania",
            "Lohagara",
            "Fatikchhari",
            "Rangunia"
          ],
          "Cox's Bazar": [
            "Cox's Bazar Sadar",
            "Chakaria",
            "Ramu",
            "Ukhia",
            "Teknaf",
            "Moheshkhali",
            "Kutubdia",
            "Pekua"
          ],
          "Cumilla": [
            "Cumilla Sadar",
            "Debidwar",
            "Muradnagar",
            "Homna",
            "Daudkandi",
            "Titas",
            "Nangalkot",
            "Brahmanpara",
            "Chandina",
            "Meghna",
            "Monohorgonj",
            "Laksam"
          ],
          "Noakhali": [
            "Noakhali Sadar",
            "Begumganj",
            "Chatkhil",
            "Companiganj",
            "Subarnachar",
            "Hatiya",
            "Senbagh",
            "Kabirhat"
          ],
          "Feni": [
            "Feni Sadar",
            "Chhagalnaiya",
            "Parshuram",
            "Daganbhuiyan",
            "Fulgazi"
          ],
          "Brahmanbaria": [
            "Brahmanbaria Sadar",
            "Nabinagar",
            "Ashuganj",
            "Bancharampur",
            "Kasba",
            "Sarail",
            "Bijoynagar"
          ],
          "Bandarban": [
            "Bandarban Sadar",
            "Thanchi",
            "Ruma",
            "Rowangchhari",
            "Lama",
            "Alikadam",
            "Naikhongchhari"
          ],
          "Khagrachhari": [
            "Khagrachhari Sadar",
            "Dighinala",
            "Matiranga",
            "Ramgarh",
            "Panchhari",
            "Laxmichhari",
            "Mahalchhari",
            "Manikchhari"
          ],
          "Rangamati": [
            "Rangamati Sadar",
            "Kaptai",
            "Baghaichhari",
            "Juraichhari",
            "Barkal",
            "Langadu",
            "Rajasthali",
            "Belaichhari"
          ]
        }
      },
      "Khulna": {
        "districts": {
          "Khulna": [
            "Khulna Sadar",
            "Dumuria",
            "Phultala",
            "Paikgachha",
            "Terokhada",
            "Batiaghata",
            "Dakop",
            "Koyra"
          ],
          "Jessore": [
            "Jessore Sadar",
            "Sharsha",
            "Jhikargacha",
            "Manirampur",
            "Bagherpara",
            "Abhaynagar",
            "Keshabpur"
          ],
          "Satkhira": [
            "Satkhira Sadar",
            "Kaliganj",
            "Debhata",
            "Shyamnagar",
            "Tala",
            "Ashashuni"
          ],
          "Bagerhat": [
            "Bagerhat Sadar",
            "Mongla",
            "Rampal",
            "Fakirhat",
            "Chitalmari",
            "Kachua",
            "Sarankhola",
            "Morrelganj"
          ],
          "Narail": [
            "Narail Sadar",
            "Kalia",
            "Lohagara"
          ],
          "Chuadanga": [
            "Chuadanga Sadar",
            "Damurhuda",
            "Jibannagar",
            "Alamdanga"
          ],
          "Kushtia": [
            "Kushtia Sadar",
            "Khoksa",
            "Kumarkhali",
            "Daulatpur",
            "Bheramara",
            "Mirpur"
          ],
          "Magura": [
            "Magura Sadar",
            "Mohammadpur",
            "Shalikha",
            "Sreepur"
          ],
          "Jhenaidah": [
            "Jhenaidah Sadar",
            "Maheshpur",
            "Kotchandpur",
            "Shailkupa",
            "Harinakunda",
            "Kaliganj"
          ]
        }
      },

      "Rajshahi": {
        "districts": {
          "Rajshahi": [
            "Rajshahi Sadar",
            "Boalia",
            "Matihar",
            "Shah Makhdum",
            "Motihar",
            "Godagari",
            "Paba",
            "Durgapur",
            "Mohonpur",
            "Charghat",
            "Bagha",
            "Putia",
            "Tanore"
          ],
          "Natore": [
            "Natore Sadar",
            "Baraigram",
            "Bagatipara",
            "Lalpur",
            "Singra",
            "Gurudaspur"
          ],
          "Chapainawabganj": [
            "Chapainawabganj Sadar",
            "Shibganj",
            "Nachole",
            "Gomastapur",
            "Bholahat"
          ],
          "Pabna": [
            "Pabna Sadar",
            "Bera",
            "Atgharia",
            "Chatmohar",
            "Ishwardi",
            "Santhia",
            "Sujanagar",
            "Faridpur"
          ],
          "Bogra": [
            "Bogra Sadar",
            "Sherpur",
            "Shibganj",
            "Dupchanchia",
            "Kahaloo",
            "Sariakandi",
            "Dhunat",
            "Gabtali",
            "Adamdighi",
            "Sonatala",
            "Nandigram"
          ],
          "Joypurhat": [
            "Joypurhat Sadar",
            "Akkelpur",
            "Kalai",
            "Khetlal",
            "Panchbibi"
          ],
          "Naogaon": [
            "Naogaon Sadar",
            "Manda",
            "Atrai",
            "Raninagar",
            "Patnitala",
            "Porsha",
            "Sapahar",
            "Badalgachhi",
            "Mohadevpur",
            "Dhamoirhat",
            "Niamatpur"
          ],
          "Sirajganj": [
            "Sirajganj Sadar",
            "Belkuchi",
            "Chauhali",
            "Kamarkhanda",
            "Kazipur",
            "Raiganj",
            "Shahjadpur",
            "Tarash",
            "Ullapara"
          ]
        }
      },
    
    "Sylhet": {
      "districts": {
        "Sylhet": [
          "Sylhet Sadar",
          "Balaganj",
          "Bishwanath",
          "Zakiganj",
          "Golapganj",
          "Beanibazar",
          "Jaintiapur",
          "Companiganj",
          "Kanaighat",
          "Dakshin Surma",
          "Osmaninagar"
        ],
        "Moulvibazar": [
          "Moulvibazar Sadar",
          "Srimangal",
          "Kamalganj",
          "Rajnagar",
          "Kulaura",
          "Juri",
          "Barlekha"
        ],
        "Habiganj": [
          "Habiganj Sadar",
          "Chunarughat",
          "Nabiganj",
          "Baniachong",
          "Ajmiriganj",
          "Bahubal",
          "Lakhai",
          "Madhabpur"
        ],
        "Sunamganj": [
          "Sunamganj Sadar",
          "Tahirpur",
          "Jamalganj",
          "Shalla",
          "Dirai",
          "Dharampasha",
          "Jagannathpur",
          "Chhatak",
          "Biswamvarpur",
          "South Sunamganj"
        ]
      }
    },
      "Barisal": {
        "districts": {
          "Barisal": [
            "Barisal Sadar",
            "Bakerganj",
            "Banaripara",
            "Gournadi",
            "Hizla",
            "Mehendiganj",
            "Muladi",
            "Wazirpur"
          ],
          "Patuakhali": [
            "Patuakhali Sadar",
            "Kalapara",
            "Mirzaganj",
            "Bauphal",
            "Dashmina",
            "Galachipa",
            "Rangabali"
          ],
          "Bhola": [
            "Bhola Sadar",
            "Char Fasson",
            "Daulatkhan",
            "Burhanuddin",
            "Tazumuddin",
            "Lalmohan",
            "Manpura"
          ],
          "Jhalokati": [
            "Jhalokati Sadar",
            "Nalchity",
            "Rajapur",
            "Kathalia"
          ],
          "Pirojpur": [
            "Pirojpur Sadar",
            "Nazirpur",
            "Kawkhali",
            "Zianagar",
            "Bhandaria",
            "Mathbaria"
          ],
          "Barguna": [
            "Barguna Sadar",
            "Amtali",
            "Taltali",
            "Patharghata",
            "Betagi",
            "Bamna"
          ]
        }
      },
        "Rangpur": {
          "districts": {
            "Rangpur": [
              "Rangpur Sadar",
              "Badarganj",
              "Gangachara",
              "Kaunia",
              "Mithapukur",
              "Pirganj",
              "Pirgachha",
              "Taraganj"
            ],
            "Dinajpur": [
              "Dinajpur Sadar",
              "Birganj",
              "Birampur",
              "Biral",
              "Bochaganj",
              "Chirirbandar",
              "Fulbari",
              "Ghoraghat",
              "Hakimpur",
              "Kaharole",
              "Khansama",
              "Nawabganj",
              "Parbatipur"
            ],
            "Thakurgaon": [
              "Thakurgaon Sadar",
              "Baliadangi",
              "Haripur",
              "Pirganj",
              "Ranisankail"
            ],
            "Panchagarh": [
              "Panchagarh Sadar",
              "Boda",
              "Debiganj",
              "Tetulia",
              "Atwari"
            ],
            "Kurigram": [
              "Kurigram Sadar",
              "Bhurungamari",
              "Nageshwari",
              "Phulbari",
              "Rajarhat",
              "Ulipur",
              "Rowmari",
              "Char Rajibpur",
              "Chilmari"
            ],
            "Nilphamari": [
              "Nilphamari Sadar",
              "Saidpur",
              "Jaldhaka",
              "Kishoreganj",
              "Dimla",
              "Domar"
            ],
            "Gaibandha": [
              "Gaibandha Sadar",
              "Sundarganj",
              "Gobindaganj",
              "Sadullapur",
              "Palashbari",
              "Phulchhari",
              "Shaghata"
            ],
            "Lalmonirhat": [
              "Lalmonirhat Sadar",
              "Aditmari",
              "Kaliganj",
              "Hatibandha",
              "Patgram"
            ]
          }
        },
          "Mymensingh": {
            "districts": {
              "Mymensingh": [
                "Mymensingh Sadar",
                "Muktagachha",
                "Fulbaria",
                "Trishal",
                "Gouripur",
                "Ishwarganj",
                "Nandail",
                "Dhobaura",
                "Haluaghat",
                "Tarakanda"
              ],
              "Netrokona": [
                "Netrokona Sadar",
                "Madan",
                "Khaliajuri",
                "Atpara",
                "Barhatta",
                "Mohanganj",
                "Purbadhala",
                "Kalmakanda",
                "Durgapur"
              ],
              "Sherpur": [
                "Sherpur Sadar",
                "Nalitabari",
                "Nakla",
                "Jhenaigati",
                "Sreebardi"
              ],
              "Jamalpur": [
                "Jamalpur Sadar",
                "Sarishabari",
                "Madarganj",
                "Dewanganj",
                "Islampur",
                "Baksiganj",
                "Melandaha"
              ]
            }
          },
       }
  
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [selectedImage, setSelectedImage] = useState(null);
       const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
       const [crop, setCrop] = useState({ x: 0, y: 0 });
       const [zoom, setZoom] = useState(1);
     
       const openModal = () => {
         setIsModalOpen(true);
       };
     
       const closeModal = () => {
         setIsModalOpen(false);
         setSelectedImage(null);
       };
     
       const handleImageChange2 = (e) => {
         const file = e.target.files[0];
         if (file) {
           const reader = new FileReader();
           reader.onload = () => {
             setSelectedImage(reader.result);
           };
           reader.readAsDataURL(file);
         }
       };
     
       const onCropComplete = useCallback((_, croppedAreaPixels) => {
         setCroppedAreaPixels(croppedAreaPixels);
       }, []);
     
       const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
         const createImage = (url) =>
           new Promise((resolve, reject) => {
             const image = new Image();
             image.onload = () => resolve(image);
             image.onerror = (error) => reject(error);
             image.src = url;
           });
     
         const getCroppedCanvas = (image, crop) => {
           const canvas = document.createElement("canvas");
           canvas.width = crop.width;
           canvas.height = crop.height;
           const ctx = canvas.getContext("2d");
     
           ctx.drawImage(
             image,
             crop.x,
             crop.y,
             crop.width,
             crop.height,
             0,
             0,
             crop.width,
             crop.height
           );
     
           return canvas;
         };
     
         try {
           const image = await createImage(imageSrc);
           const canvas = getCroppedCanvas(image, croppedAreaPixels);
           return new Promise((resolve) => {
             canvas.toBlob((blob) => {
               resolve(blob);
             }, "image/jpeg");
           });
         } catch (e) {
           console.error("Failed to crop the image:", e);
           throw e;
         }
       };
     
       const uploadCroppedImage = async () => {
         try {
           const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
           const formData = new FormData();
           formData.append("image", croppedImage);
     
           const response = await AxiosPublic.post(image_hosting_api, formData);
           console.log("Uploaded Image URL:", response.data.data.url);

           const photoUrl = response.data.data.display_url;
           const updateData2 ={
            photo:photoUrl
           }

           AxiosPublic.patch(`/users-photo/${user?.email}`,updateData2)
           .then(res=>{
            console.log(res.data);
            refetch()
           })

           closeModal();
         } catch (error) {
           console.error("Error uploading image:", error);
         }
       };

  return (
    <div className="mt-0  text-black">

      <section className=" ">
      <section
      style={{
        backgroundColor: "var(--bg-color3)",
        color: "var(--text-color2)",
        border: "var(--border)",
      }}
      className="p-10 border border-gray-400 shadow-lg rounded-lg m-5 text-black"
    >
      <div className="flex justify-start items-center gap-3">
        <div className="relative group">
          <img
            className="rounded-full h-32 w-32 border border-gray-400 p-2"
            src={userr3?.photo}
            alt=""
          />
          <div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={openModal}
          >
            <FaPen className="text-white text-xl" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl uppercase font-bold">{userr3?.name}</h1>
          <p className="font-bold ml-6">{userr3?.companyName}</p>
          <p className="flex items-center">
            <FaPhoneAlt className="mr-2" /> {userr3?.contactNumber}
          </p>
          <p className="flex items-center">
            <MdEmail className="mr-2" /> {userr3?.email}
          </p>
          <div className="flex justify-center gap-4 mt-4">
                    <a
                      href={userr3?.facebookID}
                      target="_blank"
                      rel="noopener noreferrer"
                     className="icon2"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href={userr3?.twitterID}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon2"
                    >
                      <FaXTwitter />
                    </a>
                    <a
                      href={userr3?.instagramID}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon2"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href={userr3?.linkedinID}
                      target="_blank"
                      rel="noopener noreferrer"
                     className="icon2"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href={userr3?.whatsappID}
                      target="_blank"
                      rel="noopener noreferrer"
                     className="icon2"
                    >
                      <FaYoutube />
                    </a>
                   
                  </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Image"
        className="bg-white rounded-lg shadow-lg p-6 w-96 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Edit Image</h2>
        <div className="relative w-full h-64 bg-gray-200">
          {selectedImage && (
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange2}
          className="w-full mt-4"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={uploadCroppedImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </Modal>
    </section>
        <div className=" items-baseline  mx-auto md:grid-cols-2 ">
         
          <form
            onSubmit={handleSubmit}
            className="flex flex-col font-normal  text-black  rounded-xl py-6 space-y-6 md:py-0 md:px-6"
            action="#"
            method="post"
          >

            <div className="grid lg:grid-cols-5 gap-5">

              <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="border col-span-3 shadow-xl border-gray-400  p-10 rounded-lg">
              <h1 className="text-xl font-bold mb-5">Personal Information</h1>
              <div className="grid lg:grid-cols-3 gap-3">
  {[
    { label: "Full Name", id: "fullName", type: "text", value: fullName || userr3?.name, onChange: setFullName },
    { label: "Company Name", id: "companyName", type: "text", value: companyName || userr3?.companyName, onChange: setCompanyName },
    { label: "Mobile Number", id: "contactNumber", type: "number", value:contactNumber || userr3?.contactNumber, onChange: setNumber },
    { label: "Father Name", id: "fatherName", type: "text", value:fatherName || userr3?.fatherName, onChange: setFatherName },
    { label: "Mother Name", id: "motherName", type: "text", value:motherName || userr3?.motherName, onChange: setMotherName },
    { label: "Guardian Mobile", id: "guardianMobile", type: "number", value:guardianMobile || userr3?.guardianMobile, onChange: setGuardianMobile },
    { label: "Nationality", id: "nationality", type: "select", value:nationality || userr3?.nationality, options: ["Bangladeshi"], onChange: setNationality },
    { label: "NID Number", id: "NID", type: "number", value:NID || userr3?.NID, onChange: setNID },
    { label: "Birth Reg ID No.", id: "birthRegId", type: "number", value:birthRegId || userr3?.birthRegId, onChange: setBirthRegId },
  ].map(({ label, id, type, value, options, onChange }, idx) => (
    <div key={idx}>
      <label className="block space-y-1">
        <span className="mb-1">{label}</span>
        {type === "select" ? (
          <select
            id={id}
            className="select2 space-y-4 w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            placeholder={`Enter ${label}`}
            value={value}
            className="input2 space-y-4"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </label>
    </div>
  ))}
           </div>





 <div>
      {/* Blood Group, Date of Birth, Religion */}
      <div className="grid lg:grid-cols-3 mt-3 gap-3 items-center">
        <label className="block space-y-1">
          <span className="mb-1">Blood Group</span>
          <select className="select2 space-y-4 w-full" onChange={(e) => setBlood(e.target.value)} value={userr3?.blood}>
            <option value="" disabled>Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1">Date of Birth</span>
          <input onChange={(e) => setDateOfBirth(e.target.value)} type="date" className="input2" value={userr3?.dateOfBirth} />
        </label>
        <label className="block">
          <span className="mb-1">Religion</span>
          <select className="select2 w-full" onChange={(e) => setReligion(e.target.value)} value={userr3?.religion}>
            <option value="" disabled>Select Religion</option>
            {["Muslim", "Hindu", "Buddhist", "Christian"].map((religion) => (
              <option key={religion} value={religion}>{religion}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Gender, Marital Status, Educational Qualification */}
      <div className="grid mt-3 lg:grid-cols-3 gap-3">
        <label className="block space-y-1">
          <span className="mb-1">Gender</span>
          <select className="select2 w-full" onChange={(e) => setGender(e.target.value)} value={userr3?.gender}>
            <option value="" disabled>Select Gender</option>
            {["Male", "Female", "Others"].map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="mb-1">Marital Status</span>
          <select className="select2 w-full" onChange={(e) => setMaritalStatus(e.target.value)} value={userr3?.maritalStatus}>
            <option value="" disabled>Select Marital Status</option>
            {["Single", "Married"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
       
      </div>

            <h1 className="border-t border-gray-400 mt-7"></h1>

      {/* Address Section */}
      <div className="mt-3 ">

      <div>
          <label className="block space-y-1 mt-3">
            <span className="mb-1">Present Address</span>
            <input onChange={(e) => setPresentAddress(e.target.value)} value={presentAddress || userr3?.presentAddress} placeholder="Enter your address..." className="input2 "></input>
          </label>
        </div>

        <div className="grid lg:grid-cols-3 mt-3 gap-3">
         
          <div>
      <label className="block space-y-1">
        <span className="mb-1 text-gray-700">Division</span>
        <select
          value={selectedDivision || userr3?.selectedDivision}
          onChange={(e) => {
            setSelectedDivision(e.target.value);
            setSelectedDistrict(""); // Reset District when Division changes
            setSelectedUpazila(""); // Reset Upazila when Division changes
          }}
          className="select2 w-full"
        >
          <option value="">Select Division</option>
          {Object.keys(divisionsData).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
          </div>

          <div>
  <label className="block space-y-1">
    <span className="mb-1 text-gray-700">District</span>
    <select
      value={selectedDistrict || userr3?.selectedDistrict}
      onChange={(e) => setSelectedDistrict(e.target.value)}
      disabled={!selectedDivision && !userr3?.selectedDivision}
      className={`select2 w-full`}
    >
      <option value="">Select District</option>
      {selectedDivision || userr3?.selectedDivision
        ? Object.keys(
            divisionsData[selectedDivision || userr3?.selectedDivision]?.districts || {}
          ).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))
        : null}
    </select>
  </label>
</div>


          <div>
  <label className="block space-y-1">
    <span className="mb-1 text-gray-700">Upazila</span>
    <select
      value={selectedUpazila || userr3?.selectedUpazila}
      onChange={(e) => setSelectedUpazila(e.target.value)}
      disabled={!selectedDistrict && !userr3?.selectedUpazila}
      className={`select2 w-full `}
    >
      <option value="">Select Upazila</option>
      {selectedDistrict || userr3?.selectedDistrict
        ? divisionsData[selectedDivision || userr3?.selectedDivision]?.districts[
            selectedDistrict || userr3?.selectedDistrict
          ]?.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))
        : null}
    </select>
  </label>
</div>

        </div>
        
      </div>
      
      <h1 className="border-t border-gray-400 mt-7"></h1>

      {/* Permanent Address Section */}
      <div className=" mt-3">
      <div>
          <label className="block space-y-1 mt-3">
            <span className="mb-1">Permanent Address</span>
            <input onChange={(e) => setPermanentAddress(e.target.value)} value={permanentAddress || userr3?.permanentAddress} placeholder="Enter your address..." className="input2"></input>
          </label>
        </div>
        <div className="grid lg:grid-cols-3 mt-3 gap-3">
         
          <div>
            <label className="block space-y-1">
              <span className="mb-1 text-gray-700">Division</span>
              <select value={selectedDivision2 || userr3?.selectedDivision2 } onChange={(e) => setSelectedDivision2(e.target.value)} className="select2 w-full">
                <option value="">Select Division</option>
                {Object.keys(divisionsData).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </div>

          <div>
  <label className="block space-y-1">
    <span className="mb-1 text-gray-700">District</span>
    <select
      value={selectedDistrict2 || userr3?.selectedDistrict2}
      onChange={(e) => setSelectedDistrict2(e.target.value)}
      disabled={!selectedDivision2 && !userr3?.selectedDivision2}
      className={`select2 w-full`}
    >
      <option value="">Select District</option>
      {selectedDivision2 || userr3?.selectedDivision2
        ? Object.keys(
            divisionsData[selectedDivision2 || userr3?.selectedDivision2]?.districts || {}
          ).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))
        : null}
    </select>
  </label>
</div>


          <div>
  <label className="block space-y-1">
    <span className="mb-1 text-gray-700">Upazila</span>
    <select
      value={selectedUpazila2 || userr3?.selectedUpazila2}
      onChange={(e) => setSelectedUpazila2(e.target.value)}
      disabled={!selectedDistrict2 && !userr3?.selectedUpazila2}
      className={`select2 w-full`}
    >
      <option value="">Select Upazila</option>
      {selectedDistrict2 || userr3?.selectedDistrict2
        ? divisionsData[selectedDivision2 || userr3?.selectedDivision2]?.districts[
            selectedDistrict2 || userr3?.selectedDistrict2
          ]?.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))
        : null}
    </select>
  </label>
</div>


        </div>

       
      </div>
    </div>

   

            <div className="mt-3">
              <label className="block space-y-1">
              <span className="mb-1">Change Logo</span>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input2 "
              />
            </label>
            </div>

              </div>

             <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color2)', border: 'var(--border)' }} className="border col-span-2 border-gray-400 shadow-lg p-10 rounded-lg">

             <h1 className="text-xl font-bold mb-5">Vocational Skills</h1>

          <div className=" border-t border-gray-400 pt-4">
          <label className="block mb-3 space-y-2">
          <span className="mb-1">Occupation</span>
          <input onChange={(e) => setOccupation(e.target.value)} type="text" className="input2" value={Occupation || userr3?.occupation} />
        </label>
          <label className="block mb-3 space-y-2">
          <span className="mb-1">Skill</span>
          <textarea onChange={(e) => setSkill(e.target.value)} type="text" className="input2" value={skill || userr3?.skill} />
        </label>

          </div>
          <h1 className="text-xl font-bold my-5">Education</h1>

          <div className="grid lg:grid-cols-4 border-t border-gray-400 pt-4 gap-3 items-center">
  {[
    {
      id: 'lastEducationDegree',
      label: 'Educational Qualification',
      value: lastEducationDegree || userr3?.lastEducationDegree,
      setter: setLastEducationDegree,
      options: ["Primary Education", "JSC", "SSC", "HSC", "Diploma", "Bachelor's Degree", "Master's Degree", "Doctorate (Ph.D.)", "Madrasa Education", "Vocational/Technical"],
      className: 'col-span-2' // Span 2 columns for Educational Qualification
    },
    {
      id: 'lastEducationBoard',
      label: 'Last Education Board',
      value: lastEducationBoard || userr3?.lastEducationBoard,
      setter: setLastEducationBoard,
      options: [
        'Dhaka Board',
        'Chattogram Board',
        'Rajshahi Board',
        'Khulna Board',
        'Sylhet Board',
        'Barisal Board',
        'Rangpur Board',
        'Cumilla Board',
        'Mymensingh Board',
        'Technical Education Board',
        'Madrasa Education Board',
      ],
      className: 'col-span-2' // Span 2 columns for Last Education Board
    },
    { 
      id: 'lastEducationInstitute', 
      label: 'Last Education Institute Name', 
      value: lastEducationInstitute || userr3?.lastEducationInstitute, 
      setter: setLastEducationInstitute, 
      className: 'col-span-4' // This input spans the entire width of the grid
    },
    { 
      id: 'groupName', 
      label: 'Group Name', 
      value: groupName || userr3?.groupName, 
      setter: setGroupName,
      className: 'col-span-1' // Group Name takes 1 column in grid 4
    },
    { 
      id: 'yearOfPassing', 
      label: 'Year of Passing', 
      value: yearOfPassing || userr3?.yearOfPassing, 
      setter: setYearOfPassing,
      className: 'col-span-1' // Year of Passing takes 1 column in grid 4
    },
    {
      id: 'status',
      label: 'Select Status',
      value: status || userr3?.status,
      setter: setStatus,
      options: ['Studying', 'Completed', 'Dropped'],
      className: 'col-span-1' // Select Status takes 1 column in grid 4
    },
    { 
      id: 'gpaCgpa', 
      label: 'GPA/CGPA', 
      value: gpaCgpa || userr3?.gpaCgpa, 
      setter: setGpaCgpa,
      className: 'col-span-1' // GPA/CGPA takes 1 column in grid 4
    },
  ].map((field) => (
    <div key={field.id} className={field.className}>
      <label className="block space-y-1">
        <span className="mb-1">{field.label}</span>
        {field.options ? (
          <select
            id={field.id}
            name={field.id}
            value={field.value}
            className="input2"
            onChange={(e) => field.setter(e.target.value)}
          >
            <option value="" disabled>
              Select {field.label}
            </option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id={field.id}
            name={field.id}
            value={field.value}
            placeholder={field.label}
            className="input2"
            onChange={(e) => field.setter(e.target.value)}
          />
        )}
      </label>
    </div>
  ))}
</div>


           <h1 className="text-xl font-bold mt-7">Social</h1>
           <h1 className="border-t mt-5 border-gray-500"></h1>


           <div className="mt-7 grid lg:grid-cols-2 gap-6 items-center">
  {[ 
    { id: 'facebookID', icon: <FaFacebook size={20} />, value: facebookID || userr3?.facebookID, setter: setFacebookID },
    { id: 'instagramID', icon: <FaInstagram size={20} />, value: instagramID || userr3?.instagramID, setter: setInstagramID },
    { id: 'linkedinID', icon: <FaLinkedin size={20} />, value: linkedinID || userr3?.linkedinID, setter: setLinkedinID },
    { id: 'twitterID', icon: <FaXTwitter size={20} />, value: twitterID || userr3?.twitterID, setter: setTwitterID },
    { id: 'youtubeID', icon: <FaYoutube size={20} />, value: youtubeID || userr3?.youtubeID, setter: setYoutubeID },
    { id: 'whatsappID', icon: <FaYoutube size={20} />, value: whatsappID || userr3?.whatsappID, setter: setWhatsappID },
  ].map((field) => (
    <div key={field.id} className="flex  items-center space-x-4 p-3 border rounded-lg border-gray-300 table-div shadow-md hover:shadow-lg transition duration-200">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-blue-600">
        <span className="text-xl">{field.icon}</span>
      </div>
      <div className="flex-1">
       
        <input
          type="text"
          id={field.id}
          name={field.id}
          value={field.value}
          placeholder={`Enter ${field.id.replace('ID', '')}`}
          className="input2"
          onChange={(e) => field.setter(e.target.value)}
        />
      </div>
    </div>
  ))}
</div>




     
    </div>


            </div>

            <div className="f-end pb-5 mt-6">
              <button
                type="submit"
                className="add"
              >
                Update
              </button>
            </div>
          </form>

        </div>
      </section>

    </div>
  );
};

export default UpdateProfile;
