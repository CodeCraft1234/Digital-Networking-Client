import { useContext } from 'react';
import Swal from 'sweetalert2';
import usePayoneerEmail from '../../Hook/usePayoneerEmail';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import toast from 'react-hot-toast';
import { ImCross } from 'react-icons/im';

const PayoneerEmail = () => {
    const [payoneerEmail,refetch]=usePayoneerEmail()
    const AxiosPublic=UseAxiosPublic()
    const { user } = useContext(AuthContext);
      const {userr}=useUserr(user?.email)
  
 
    const handlePayment2 = async (e) => {
      e.preventDefault();
      const payoneerEmail = e.target.payoneerEmail.value;
    
      const data = {
        payoneerEmail,
      };
  
      AxiosPublic.post("/payoneerEmail",
        data
      )
        .then((res) => {
          toast.success("Send successful!");
          refetch();
          console.log(res.data);
          document.getElementById("my_modal_2").close()
         
        })
  
    };
  
    const handleDeleteEmail = (id) => {
        AxiosPublic.delete(`/payoneerEmail/${id}`)
        .then((res) => {
          toast.success("Delete successful!");
          refetch();
        })
        .catch((error) => {
          toast.error("Failed to delete. Please try again.");
        });
      }
  
    return (
        <div>
                
                {
                  userr?.role === "admin" ? <div className="f-start ">
                      <button
                  className="add"
                  onClick={() => document.getElementById("my_modal_3").showModal()}
                >
                  My Emails
                </button>
                   <button
                  className="add"
                  onClick={() => document.getElementById("my_modal_2").showModal()}
                >
                  Add Email
                </button>
            
                 
                  </div> : <></>
                }
              
            

            
                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box bg-white text-black font-bold">
                    <form onSubmit={(e) => handlePayment2(e)}>
            
                      <div className="grid lg:grid-cols-2">
            
                      </div>
                      <div className="">
                        <h1
                          className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
                          onClick={() => document.getElementById("my_modal_2").close()}
                        >
                          <ImCross />
                        </h1>
            
                          
                          <div className="mb-4 ">
                        <label className="block text-gray-250">Payoneer Email</label>
                        <input
                          required
                          type="email"
                          name="payoneerEmail"
                       
                          className="input2"
                        />
                      </div>
                    
                
                        
                      </div>
            
                      <div className="grid mt-8 lg:grid-cols-2 gap-3">
              <form method="dialog" className="w-full">
                <button className="close w-full">
                  Close
                </button>
              </form>
              <button
                type="submit"
                className="add w-full"
              >
                Submit
              </button>
            </div>
            
                    </form>
                  </div>
                </dialog>
               <dialog id="my_modal_3" className="modal">
              <div className="modal-box bg-white text-black font-bold">
                <div className="flex justify-between items-start">
                <h2 className="text-xl mb-4">Payoneer Email</h2>
                <h1
                          className="text-black flex hover:text-red-500 justify-end text-end cursor-pointer"
                          onClick={() => document.getElementById("my_modal_3").close()}
                        >
                          <ImCross />
                        </h1>
                </div>
                <div className="grid gap-3">
                  {payoneerEmail?.map((email, index) => (
                    <div
                      key={index}
                      className="f-between  border p-2 rounded-lg bg-gray-100"
                    >
                      <span>{email?.payoneerEmail}</span>
                      <button
                        className="delete"
                        onClick={() => handleDeleteEmail(email._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid mt-8 lg:grid-cols-2 gap-3">
              <form method="dialog" className="w-full">
                <button className="close w-full">
                  Close
                </button>
              </form>
              <button
                type="submit"
                className="add w-full"
              >
                Submit
              </button>
            </div>
            
              </div>
            </dialog>
            
            
              </div>
  
    );
};

export default PayoneerEmail;