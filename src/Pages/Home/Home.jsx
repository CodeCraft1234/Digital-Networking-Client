
import { useContext } from "react";
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";
import { AuthContext } from "../../Security/AuthProvider";
import SalarySheet from "../../Components/SalarySheet/SalarySheet";

const Home = () => {
    const {user} = useContext(AuthContext);

    return (
        <div>
            {
                user?.email==="admin25@gmail.com" ? <Banner></Banner> : <CampaignTable></CampaignTable>
            }
            <SalarySheet></SalarySheet>
            <AdAccountTable></AdAccountTable>
        </div>
    );
};

export default Home;