import useRates from '../../../Hook/useRates';
import UseAxiosPublic from '../../../Axios/UseAxiosPublic';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Settings = () => {

    const { rates, refetch } = useRates();
    const AxiosPublic = UseAxiosPublic();
    
    const handleAddClient = async (e) => {
      e.preventDefault();
      
      const costRate = e.target.costRate.value;
      const coinRate = e.target.coinRate.value;
      const contributorRate = e.target.contributorRate.value;
      const salaryRate = e.target.salaryRate.value;
      const metaRate = e.target.metaRate.value;
      const googleRate = e.target.googleRate.value;
      const tiktokRate = e.target.tiktokRate.value;
    
      const data = { salaryRate,coinRate,contributorRate, costRate, metaRate, googleRate, tiktokRate };
    
      try {
        await AxiosPublic.post("/rates", data);
        refetch();
        toast.success("Rates updated successfully!");
        document.getElementById("my_modal_2").close()
      } catch (error) {
        toast.error("Failed to update rates");
        console.error(error);
      }
    };
    
    // State to display the fetched rates
    const [salaryRate, setSalaryRate] = useState(rates?.salaryRate || ""); 
    const [coinRate, setCoinRate] = useState(rates?.coinRate || ""); 
    const [contributorRate, setContributorRate] = useState(rates?.contributorRate || ""); 
    const [costRate, setCostRate] = useState(rates?.costRate || ""); 
    const [metaRate, setMetaRate] = useState(rates?.metaRate || ""); 
    const [googleRate, setGoogleRate] = useState(rates?.googleRate || ""); 
    const [tiktokRate, setTiktokRate] = useState(rates?.tiktokRate || ""); 
    
    // Update state when `rates` change
    useEffect(() => {
      setSalaryRate(rates?.salaryRate || "");
      setCoinRate(rates?.coinRate || "");
      setContributorRate(rates?.contributorRate || "");
      setCostRate(rates?.costRate || "");
      setMetaRate(rates?.metaRate || "");
      setGoogleRate(rates?.googleRate || "");
      setTiktokRate(rates?.tiktokRate || "");
    }, [rates]);
  return (
    <div>
       <div className=" p-5 rounded-lg w-[500px] mx-auto bg-white text-black font-bold">
                      <form onSubmit={handleAddClient}>
                      
                        <div className="grid gap-3 lg:grid-cols-2">
        {[
          { label: "Salary Rate", name: "salaryRate", type: "number", value: salaryRate, },
          { label: "Cost Rate", name: "costRate", type: "number", value: costRate },
          { label: "Meta Rate", name: "metaRate", type: "number", value: metaRate },
          { label: "Google Rate", name: "googleRate", type: "number", value: googleRate },
          { label: "Tiktok Rate", name: "tiktokRate", type: "number", value: tiktokRate },
          { label: "Coin Rate", name: "coinRate", type: "number", value: coinRate, },
          { label: "Contributor Rate", name: "contributorRate", type: "number", value: contributorRate, },
        ].map((field, i) => (
          <div key={i} className={` ${field.fullWidth ? "lg:col-span-2" : ""}`}>
            <label className="block">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              required
              step="0.01"
              defaultValue={field.value}
              className="w-full bg-white border-2 border-black rounded p-2 mt-1"
            />
          </div>
        ))}
      </div>
      
                        <div className="grid mt-8 grid-cols-2 gap-3">
                          <button
                            type="button"
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                            onClick={() => document.getElementById("my_modal_2").close()}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-[#05a0db] hover:bg-indigo-700 rounded text-white"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
    </div>
  );
};

export default Settings;