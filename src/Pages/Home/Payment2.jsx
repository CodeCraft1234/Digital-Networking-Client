import { useContext, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { AuthContext } from "../../Security/AuthProvider";
import useUsers from "../../Hook/useUsers";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";

const Payment2 = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const AxiosPublic = UseAxiosPublic();
    const [to, setTo] = useState(null);

    useEffect(() => {
        const finds = users.find(use => use.email === user?.email);
        setTo(finds || {}); // Ensure 'to' is always an object
    }, [users, user]);

    // const handleSend1 = async (e) => {
    //     e.preventDefault();
    //     const previousAmount = e.target.previousAmounnt.value;
    //     const newAmount = e.target.cashIn.value;
    //     const bkashPersonal = parseInt(previousAmount) + parseInt(newAmount);

    //     const body = { bkashPersonal };

    //     try {
    //         const response = await AxiosPublic.patch(`/users/${user?.email}`, body);
    //         Swal.fire({
    //             title: "Updated!",
    //             text: "Your balance has been updated.",
    //             icon: "success"
    //         });
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('Error updating user:', error);
    //         Swal.fire({
    //             title: "Error!",
    //             text: "Failed to update the balance.",
    //             icon: "error"
    //         });
    //     }
    // };
    const handleSend2 = async (e) => {
        e.preventDefault();
        const previousAmount = e.target.previousAmounnt2.value;
        const newAmount = e.target.cashIn2.value;
        const bkashMarcent = parseInt(previousAmount) + parseInt(newAmount);

        const body = { bkashMarcent };

        try {
            const response = await AxiosPublic.patch(`/users/${user?.email}`, body);
            Swal.fire({
                title: "Updated!",
                text: "Your balance has been updated.",
                icon: "success"
            });
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
        <div >
            {/* <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Bkash Personal</h1>
                <Form onSubmit={handleSend1}>
                    <div className="flex justify-start items-center">
                        <div className="mb-4">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                            
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
                        <button type="submit" className="font-avenir  px-5 py-3 bg-neutral rounded text-white">Send</button>
                    </div>
                </Form>
            </div> */}
            <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Bkash Marchent</h1>
                <Form onSubmit={handleSend2}>
                    <div className="flex justify-start items-center">
                        <div className="mb-4">
                            <label className="block text-black font-bold">Previous Amount</label>
                            <input
                           
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
                        <button type="submit" className="font-avenir  px-5 py-3 bg-neutral rounded text-white">Send</button>
                    </div>
                </Form>
            </div>
            {/* <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Bkash Personal</h1>
                <Form onSubmit={handleSend1}>
                    <div className="flex justify-start items-center">
                        <div className="mb-4">
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
                        <button type="submit" className="font-avenir  px-5 py-3 bg-neutral rounded text-white">Send</button>
                    </div>
                </Form>
            </div>
            <div className="flex justify-start items-center text-black bg-indigo-300  p-5 gap-3" >
                <h1 className="text-2xl font-bold">Bkash Personal</h1>
                <Form onSubmit={handleSend1}>
                    <div className="flex justify-start items-center">
                        <div className="mb-4">
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
                        <button type="submit" className="font-avenir  px-5 py-3 bg-neutral rounded text-white">Send</button>
                    </div>
                </Form>
            </div> */}
        </div>
    );
};

export default Payment2;
