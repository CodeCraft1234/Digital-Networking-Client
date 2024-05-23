import { Form } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";


const UserCampaign = () => {
    const AxiosPublic=UseAxiosPublic();
    const handleaddblog=(e)=>{
        e.preventDefault()
        const userName=e.target.userName.value
        const email=e.target.email.value
        const phonenumber=e.target.phonenumber.value
        const data={userName,email,phonenumber}
       console.log(data)
       AxiosPublic.post('http://localhost:5000/usercampaigns',data)
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
			<label htmlFor="name" className="block mb-1 ml-1">User Name</label>
			<input id="name" name="userName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Email</label>
			<input id="name" name="email" type="email" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Phone Number</label>
			<input id="name" name="phonenumber" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
     </div>
       <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri dark:bg-violet-400 focus:ri hover:ri dark:text-gray-900">Submit</button>
      </Form>
              </section>
        </div>
    );
};

export default UserCampaign;