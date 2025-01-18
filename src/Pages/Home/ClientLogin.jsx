import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { AuthContext } from "../../Security/AuthProvider";


const ClientLogin = () => {
  const { user, logOut } = useContext(AuthContext); // Get user and logOut function from AuthContext
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate(); 

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber) {
      localStorage.removeItem("clientUser");
      localStorage.setItem("clientUser", phoneNumber);
      if (user) {
        try {
          await logOut(); // Log the user out
          console.log("User logged out successfully.");
        } catch (error) {
          console.error("Error logging out user:", error);
        }
      }

      navigate("/"); 
    } else {
      alert("Please enter both a valid phone number and username");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-black text-center">Login</h1>
        <form onSubmit={handlePhoneSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            Token Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter a Token Number"
              className="border border-gray-400 rounded bg-white text-black w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;
