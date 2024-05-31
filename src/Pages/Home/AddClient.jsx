import { Form } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../../Security/AuthProvider";
import Swal from 'sweetalert2'

const AddClient = () => {
  const AxiosPublic=UseAxiosPublic()
  const {user}=useContext(AuthContext)
    const handleaddblog=(e)=>{
        e.preventDefault()
    
        const clientName=e.target.clientName.value
        const clientPhone=e.target.clientPhone.value
        const clientEmail=e.target.clientEmail.value
        const email=user?.email
        const tBudged=0
        const tSpent=0
        const tBill=0
        const tDue=0
        const tPaid=0
        const date=e.target.date.value
        const data={clientName,clientEmail,clientPhone,tBudged,email,tSpent,tBill,date, tDue,tPaid}
       console.log(data)
       AxiosPublic.post('https://digital-networking-server.vercel.app/clients',data)
       .then(res=>{
        console.log(res.data)
        Swal.fire({
            title: "Good job!",
            text: "Client add success!",
            icon: "success"
          });
          
      })
      .catch(error => {
          console.error("Error adding client:", error);
          // toast.error("Failed to update campaign");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to add client!",
          });
     
       })

       }


    return (
        <div>
            <section className="p-6 mt-24 dark:text-gray-100">
               
    <Form onSubmit={handleaddblog} className="container w-full max-w-xl p-8 mx-auto space-y-6 rounded-md shadow dark:bg-gray-900">
    <div>
    <h1 className="text-3xl my-4 text-center font-bold  text-gray-350">Add a Client </h1>
        <div className="flex justify-center items-center gap-3">
        <div>
			<label htmlFor="date" className="block mb-1 ml-1">Date</label>
			<input id="date" name="date" type="date" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Client Name</label>
			<input id="name" name="clientName" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
       
       
        </div>
        <div className="flex justify-center items-center gap-3">
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Client Phone</label>
			<input id="name" name="clientPhone" type="number" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
        <div>
			<label htmlFor="name" className="block mb-1 ml-1">Client Email</label>
			<input id="name" name="clientEmail" type="text" placeholder="type...." required="" className="block w-full p-2 rounded focus:outline-none focus:ring focus:ri focus:ri dark:bg-gray-800" />
		</div>
    
        </div>
     </div>
       <button  className="w-full px-4 py-2 font-bold rounded shadow focus:outline-none focus:ring hover:ring focus:ri bg-green-800 focus:ri hover:ri text-white">Submit</button>
      </Form>
              </section>
        </div>
    );
};

export default AddClient;