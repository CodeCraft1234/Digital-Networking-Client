/////// payment /////
import { useContext, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import Payment2 from "./Payment2";

const Payment = ({id}) => {
    const { user } = useContext(AuthContext);
    const [users,refetch] = useUsers();
    const AxiosPublic = UseAxiosPublic();
    const [to, setTo] = useState(null);

    useEffect(() => {
        const finds = users.find(use => use._id === id);
        setTo(finds || {}); // Ensure 'to' is always an object
    }, [users, user]);

    const handleSend1 = async (e) => {
        e.preventDefault();
        const previousAmount = e.target.previousAmounnt.value;
        const newAmount = e.target.cashIn.value;
        const bkashPersonal = parseInt(previousAmount) + parseInt(newAmount);

        const previousAmount2 = e.target.previousAmounnt2.value;
        const newAmount2 = e.target.cashIn2.value;
        const bkashMarcent = parseInt(previousAmount2) + parseInt(newAmount2);

        const previousAmount3 = e.target.previousAmounnt3.value;
        const newAmount3 = e.target.cashIn3.value;
        const nagadPersonal = parseInt(previousAmount3) + parseInt(newAmount3);

        const previousAmount4 = e.target.previousAmounnt4.value;
        const newAmount4 = e.target.cashIn4.value;
        const rocketPersonal = parseInt(previousAmount4) + parseInt(newAmount4);

        const body = { bkashPersonal,bkashMarcent,nagadPersonal,rocketPersonal };

        try {
            const response = await AxiosPublic.put(`/users/${id}`, body);
            refetch()
            console.log(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update the balance.",
                icon: "error"
            });
        }
    };
   

    return (
        <div className="">
            <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <Form className="text-start" onSubmit={handleSend1}>
                    <div className="flex ml-5 justify-start items-center">
                    <h1 className="text-2xl font-bold">Bkash Personal</h1>
                        <div className="mb-4 ml-8 ">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                            disabled
                                type="number"
                                name="previousAmounnt"
                                defaultValue={to?.bkashPersonal } 
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black font-bold">Cash IN</label>
                            <input
                                type="number"
                                name="cashIn"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <button type="submit" className="font-avenir  px-5 py-2 mt-1 bg-neutral rounded text-white">Send</button>
                    </div>
                    <div className="flex gap-5 justify-start items-center text-black bg-indigo-300  p-5" >
                <h1 className="text-2xl font-bold">Bkash Marchent</h1>
                    <div className="flex justify-start items-center">
                        <div className="mb-4">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                           disabled
                                type="number"
                                name="previousAmounnt2"
                                defaultValue={to?.bkashMarcent } 
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black font-bold">Cash IN</label>
                            <input
                                type="number"
                                name="cashIn2"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <button type="submit" className="font-avenir  px-5 py-2 mt-1 bg-neutral rounded text-white">Send</button>
                    </div>
            </div>
                    <div className="flex  justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Nagad Personal</h1>
              
                    <div className="flex ml-3 justify-start items-center">
                        <div className="mb-4">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                           disabled
                                type="number"
                                name="previousAmounnt3"
                                defaultValue={to?.nagadPersonal } 
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black font-bold">Cash IN</label>
                            <input
                                type="number"
                                name="cashIn3"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <button type="submit" className="font-avenir  px-5 py-2 mt-1 bg-neutral rounded text-white">Send</button>
                    </div>
            </div>
                    <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Rocket Personal</h1>
              
                    <div className="flex ml-2 justify-start items-center">
                        <div className="mb-4">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                           disabled
                                type="number"
                                name="previousAmounnt4"
                                defaultValue={to?.rocketPersonal } 
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black font-bold">Cash IN</label>
                            <input
                                type="number"
                                name="cashIn4"
                                defaultValue={0}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>
                        <button type="submit" className="font-avenir  px-5 py-2 mt-1 bg-neutral rounded text-white">Send</button>
                    </div>
            </div>
            </Form>
            </div>
            
        </div>
    );
};

export default Payment;