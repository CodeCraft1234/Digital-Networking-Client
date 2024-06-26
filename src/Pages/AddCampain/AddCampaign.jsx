import { Form } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import useClients from "../../Hook/useClient";
import Swal from 'sweetalert2'

const AddCampaign = () => {
  const AxiosPublic=UseAxiosPublic()
  const {user}=useContext(AuthContext)
  const [clients]=useClients()

    const handleaddblog=(e)=>{
        e.preventDefault()
        const campaignName=e.target.campaignName.value
        const clientEmail=e.target.clientEmail.value
        const pageName=e.target.pageName.value
        const tBudged=e.target.totalBudged.value
        const email=user?.email
        const tSpent=0
        const dollerRate=140
        const date=e.target.date.value
        const data={campaignName,clientEmail,pageName,tBudged,email,tSpent,dollerRate,date}
       console.log(data)
       
       AxiosPublic.post('https://digital-networking-server.vercel.app/campaigns',data)
       .then(res=>{
        console.log(res.data)
        Swal.fire({
            title: "Good job!",
            text: "Campaign add success!",
            icon: "success"
          });
          
      })
      .catch(error => {
          console.error("Error adding campaign:", error);
          // toast.error("Failed to update campaign");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to add campaign!",
          });
     
       })

       }
      

       const [dataa2,setData2]=useState([])
      

       useEffect(() => {
        const filtered = clients.filter(campaign => campaign.email === user?.email);
        console.log(filtered);
        setData2(filtered);
      }, [clients, user?.email]);
      

    return (
        <div>
            <section className="p-6 mt-24 dark:text-gray-100">
               
    <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
    <div>
    <h1 className="text-3xl my-4 text-center font-bold  text-gray-350">Add a Campaign </h1>
        <div className="flex justify-center  items-center gap-10">
        <div>
			<label htmlFor="date" className="block mb-1 ">Date</label>
			<input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div className="md:col-span-2 text-gray-250">
        <label htmlFor="email" className="block mb-1 ">Email</label>
			<input required id="date" name="clientEmail" type="email" placeholder="type...." className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />  
        </div>
        </div>
        <div className="flex justify-center items-center gap-3">
        
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Campaign Name</label>
			<input id="name" name="campaignName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Page Name</label>
			<input id="name" name="pageName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        </div>
        <div className="flex justify-center items-center gap-3">
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Page URL</label>
			<input id="name" name="pageURL" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Total Budged</label>
			<input id="name" name="totalBudged" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        </div>
       
        
     </div>
       <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri text-white focus:ri hover:ri bg-green-800">Submit</button>
      </Form>
              </section>
        </div>
    );
};

export default AddCampaign;