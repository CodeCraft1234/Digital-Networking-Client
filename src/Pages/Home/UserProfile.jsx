import { useContext, useEffect, useState } from "react";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";
import WorkList from "../../Components/WorkList/WorkList";
import { AuthContext } from "../../Security/AuthProvider";
import { useLoaderData } from "react-router-dom";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useCampaings from "../../Hook/useCampaign";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const userr = useLoaderData();
    const AxiosPublic = UseAxiosPublic();
    const [data, setData] = useState({});
    const [dataa2, setData2] = useState([]);
    const [campaign] = useCampaings();

    useEffect(() => {
        AxiosPublic.get(`https://digital-networking-server.vercel.app/users/${userr.email}`)
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, [userr.email]);

    useEffect(() => {
        const filtered = campaign.filter(campaign => campaign.clientEmail === userr?.email);
        console.log(filtered);
        setData2(filtered);
    }, [campaign, userr?.email]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const newSpent = e.target.newSpent.value;
        const previousSpent = e.target.previousSpent.value;
        const status = e.target.status.value;
        console.log(newSpent, previousSpent, status);

        // Handle the update logic here
    };

    return (
        <div>
            <div className="mt-24">
                <img className="rounded-full mx-auto w-72 h-72" src={data?.photo} alt="User Profile" />
            </div>

            <div className="flex flex-wrap justify-around p-5">
                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Spent</h2>
                    <p className="text-xl">Balance: $100.00</p>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Bill</h2>
                    <p className="text-xl">Balance: ৳100.00</p>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total Paid</h2>
                    <p className="text-xl">Balance: ৳44000</p>
                </div>

                <div className="px-24 py-16 rounded-2xl bg-green-400 shadow-lg text-center">
                    <h2 className="text-4xl font-bold">Total DUE</h2>
                    <p className="text-2xl">Balance: ৳5000</p>
                </div>
            </div>

            <div className="p-4">
                <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">Own Work List</h6>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Page Name & URL</th>
                                <th className="p-3">T. Budget</th>
                                <th className="p-3">T. Spent</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataa2.map((work, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                    <td className="p-3 text-center">{work.date}</td>
                                    <td className="p-3 text-center">{work.campaignName}</td>
                                    <td className="p-3 text-center">{work.tBudged}</td>
                                    <td className="p-3 text-center">{work.tSpent}</td>
                                    <td className={`p-3 text-center ${work.status === "Active" ? "text-green-500" : "text-red-500"}`}>{work.status}</td>
                                    <td className="p-3 text-center">
                                        <button className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white" onClick={() => document.getElementById(`modal_${index}`).showModal()}>Edit</button>
                                        <dialog id={`modal_${index}`} className="modal">
                                            <div className="modal-box">
                                                <form onSubmit={handleUpdate}>
                                                    <div className="flex justify-center items-center gap-3">
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">Previous Spent</label>
                                                            <input type="number" name="previousSpent" defaultValue={work.tSpent} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700">New Spent</label>
                                                            <input type="number" name="newSpent" defaultValue={0} className="w-full border rounded p-2 mt-1" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700">Status</label>
                                                        <select name="status" className="w-full border rounded p-2 mt-1">
                                                            <option value="In Review">In Review</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Complete">Complete</option>
                                                        </select>
                                                    </div>
                                                    <button type="submit" className="font-avenir px-3 mx-auto py-1 bg-neutral rounded text-white">Update</button>
                                                </form>
                                                <div className="modal-action">
                                                    <button className="btn" onClick={() => document.getElementById(`modal_${index}`).close()}>Close</button>
                                                </div>
                                            </div>
                                        </dialog>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-green-800 text-white font-bold">
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-right" colSpan="2">Total Spent:</td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                                <td className="p-3 text-center"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <PaymentHistory />
        </div>
    );
};

export default UserProfile;
