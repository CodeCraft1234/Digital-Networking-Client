// import { useContext } from "react";
// import UseAxiosPublic from "../../Axios/UseAxiosPublic";
// import { AuthContext } from "../../Security/AuthProvider";


// const AddAdsAccount = () => {

//     const AxiosPublic=UseAxiosPublic()
//   const {user}=useContext(AuthContext)

//     const handleaddblog=(e)=>{
//         e.preventDefault()
//         const AdAccountName=e.target.AdAccountName.value
//         const clientName=e.target.clientName.value
//         const email=user?.email
//         const clientEmail=e.target.clientEmail.value
//         const date=e.target.date.value
//         const tThreshold=0
//         const tSpent=0
//         const currentBalance=0
//         const currentStatus=e.target.currentStatus.value
//         const data={AdAccountName,clientName,clientEmail, tThreshold,email,tSpent,currentBalance,date, currentStatus};
//        console.log(data)
//        AxiosPublic.post('https://digital-networking-server.vercel.app/campaigns',data)
//        .then(res=>{
//         console.log(res.data)
//        })

//        }

//     return (
//         <div>
//                 <section className="p-6 mt-24 dark:text-gray-100">
               
//                <form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
//                <div>
//                <h1 className="text-3xl my-4 text-center font-bold  text-white">Add a Campaign </h1>
//                    <div className="flex justify-center items-center gap-3">
//                    <div>
//                        <label htmlFor="date" className="block mb-1 ml-1">Date</label>
//                        <input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
//                    </div>
//                    <div>
//                        <label htmlFor="name" className="block mb-1 ml-1">Client Name</label>
//                        <input id="name" name="clientName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
//                    </div>
//                    <div>
//                        <label htmlFor="name" className="block mb-1 ml-1">Ad Account Name</label>
//                        <input id="name" name="AdAccountName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
//                    </div>
                   
//                    </div>
//                    <div className="flex justify-left items-center gap-1">
                  
//                    <div>
//                        <label htmlFor="name" className="block mb-1 ml-1">Client Email</label>
//                        <input id="name" name="clientEmail" type="email" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
//                    </div>
//                    <div>
//                        <label htmlFor="name" className="block mb-1 ml-1">Current Status</label>
//                        <input id="name" name="currentStatus" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
//                    </div>
//                    </div>
//                    <div className="flex justify-center items-center gap-3">
                  
                   
//                    </div>
                  
                   
//                 </div>
//                   <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
//                  </form>
//                          </section>
//         </div>
//     );
// };

// export default AddAdsAccount;

import React, { useContext, useState, useEffect } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";
import useClients from "../../Hook/useClient";

const AddAdsAccount = () => {
  const AxiosPublic = UseAxiosPublic();
  const { user } = useContext(AuthContext);
  const [clients]=useClients();
  
  // State for form data
  const [formData, setFormData] = useState({
    AdAccountName: '',
    clientName: '',
    email: user?.email || '',
    clientEmail: '',
    date: '',
    tThreshold: 0,
    tSpent: 0,
    currentBalance: 0,
    currentStatus: ''
  });

  // Fetch default values (example: from an API)
  useEffect(() => {
    // Example API call to fetch default values
    AxiosPublic.get('https://digital-networking-server.vercel.appadAds')
      .then(response => {
        const defaultValues = response.data;
        setFormData({
          ...formData,
          ...defaultValues,
          email: user?.email || ''
        });
      })
      .catch(error => {
        console.error("Error fetching default values:", error);
      });
  }, [user, AxiosPublic]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

    // user role is employee filtering

    useEffect(() => {
      const filtered = clients.filter(campaign => campaign.email === user?.role === "employee");
      console.log(filtered);
      setFormData(filtered);
    }, [clients, user?.role]);

  // Handle form submission
  const handleAddBlog = (e) => {
    e.preventDefault();
    AxiosPublic.post('https://digital-networking-server.vercel.appadAds', formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.error("Error adding campaign:", error);
      });

    
  };

  return (
    <div>
      <section className="p-6 mt-24 dark:text-gray-100">
        <form onSubmit={handleAddBlog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
          <div>
            <h1 className="text-3xl my-4 text-center font-bold text-gray-350">Create Ads Account</h1>
            <div className="flex justify-center items-center gap-3">
              <div>
                <label htmlFor="date" className="block mb-1 ml-1">Date</label>
                <input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required 
                  className="block w-full p-2 rounded focus:outline-none focus:ring dark:bg-gray-800" 
                />
              </div>
              <div>
                <label htmlFor="clientName" className="block mb-1 ml-1">Employee Name</label>
                <input 
                  id="clientName" 
                  name="clientName" 
                  type="text" 
                  value={formData.clientName} 
                  onChange={handleInputChange} 
                  required 
                  className="block w-full p-2 rounded focus:outline-none focus:ring dark:bg-gray-800" 
                />
              </div>
              <div>
                <label htmlFor="AdAccountName" className="block mb-1 ml-1">Ad Account Name</label>
                <input 
                  id="AdAccountName" 
                  name="AdAccountName" 
                  type="text" 
                  value={formData.AdAccountName} 
                  onChange={handleInputChange} 
                  required 
                  className="block w-full p-2 rounded focus:outline-none focus:ring dark:bg-gray-800" 
                />
              </div>
            </div>
            <div className="flex justify-left items-center gap-1">
              <div>
                <label htmlFor="clientEmail" className="block mb-1 ml-1">Employee Email</label>
                {/* <input 
                  id="clientEmail" 
                  name="clientEmail" 
                  type="email" 
                  value={formData.clientEmail} 
                  onChange={handleInputChange} 
                  required 
                  className="block w-full p-2 rounded focus:outline-none focus:ring dark:bg-gray-800" 
                /> */}
                 <select name="clientEmail"   defaultValue='' className="w-full border text-gray-250 rounded p-2 mt-1"  >
                 {
                   clients?.map(d=><option value={d.clientEmail}>{d.clientEmail}</option>
                   )
                 }
            </select>
              </div>
              <div>
                <label htmlFor="currentStatus" className="block mb-1 ml-1">Current Status</label>
                <input 
                  id="currentStatus" 
                  name="currentStatus" 
                  type="text" 
                  value={formData.currentStatus} 
                  onChange={handleInputChange} 
                  required 
                  className="block w-full p-2 rounded focus:outline-none focus:ring dark:bg-gray-800" 
                />
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring dark:bg-violet-400 dark:text-gray-900"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddAdsAccount;
