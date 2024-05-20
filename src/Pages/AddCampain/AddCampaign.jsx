import { Form } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";


const AddCampaign = () => {
  const AxiosPublic=UseAxiosPublic()
    const handleaddblog=(e)=>{
        e.preventDefault()
        const campaignName=e.target.campaignName.value
        const pageName=e.target.pageName.value
        const totalBudged=e.target.totalBudged.value
        const data={campaignName,pageName,totalBudged}
       console.log(data)
       AxiosPublic.post('http://localhost:5000/campaigns',data)
       .then(res=>{
        console.log(res.data)
       })

       }


    return (
        <div>
            <section className="p-6 mt-24 dark:text-gray-100">
               
    <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
    <div>
    <h1 className="text-3xl my-4 font-bold  text-white">Add a Campaign </h1>
        <div>
			<label for="name" className="block mb-1 ml-1">Campaign Name</label>
			<input id="name" name="campaignName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label for="name" className="block mb-1 ml-1">Page Name</label>
			<input id="name" name="pageName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label for="name" className="block mb-1 ml-1">Page URL</label>
			<input id="name" name="pageURL" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label for="name" className="block mb-1 ml-1">Total Budged</label>
			<input id="name" name="totalBudged" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
     </div>
       <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
      </Form>
              </section>
        </div>
    );
};

export default AddCampaign;