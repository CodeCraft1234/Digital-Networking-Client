import { useContext } from "react";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { AuthContext } from "../../Security/AuthProvider";


const AddAdsAccount = () => {

    const AxiosPublic=UseAxiosPublic()
  const {user}=useContext(AuthContext)

    const handleaddblog=(e)=>{
        e.preventDefault()
        const AdAccountName=e.target.AdAccountName.value
        const AdAccountId=e.target.AdAccountId.value
        const email=user?.email
        const date=e.target.date.value
        const data={campaignName,clientName,pageName,clientPhone,tBudged,email,tSpent,dollerRate,date}
       console.log(data)
       AxiosPublic.post('https://digital-networking-server.vercel.app/campaigns',data)
       .then(res=>{
        console.log(res.data)
       })

       }

    return (
        <div>
                <section className="p-6 mt-24 dark:text-gray-100">
               
               <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
               <div>
               <h1 className="text-3xl my-4 text-center font-bold  text-white">Add a Campaign </h1>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                       <label for="date" className="block mb-1 ml-1">Date</label>
                       <input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Client Name</label>
                       <input id="name" name="clientName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Client Phone</label>
                       <input id="name" name="clientPhone" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                       <label for="name" className="block mb-1 ml-1">Campaign Name</label>
                       <input id="name" name="campaignName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Page Name</label>
                       <input id="name" name="pageName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                   <div className="flex justify-center items-center gap-3">
                   <div>
                       <label for="name" className="block mb-1 ml-1">Page URL</label>
                       <input id="name" name="pageURL" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   <div>
                       <label for="name" className="block mb-1 ml-1">Total Budged</label>
                       <input id="name" name="totalBudged" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
                   </div>
                   </div>
                  
                   
                </div>
                  <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
                 </Form>
                         </section>
        </div>
    );
};

export default AddAdsAccount;