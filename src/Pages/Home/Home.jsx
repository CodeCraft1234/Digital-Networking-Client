
import { useContext } from "react";
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";
import { AuthContext } from "../../Security/AuthProvider";

const Home = () => {
    const {user}=useContext(AuthContext)
    console.log(user?.email)
    return (
        <div>
            {/* {
                user?.email === "admin25@gmail.com" ? <Banner></Banner> : <CampaignTable></CampaignTable>
            } */}
            <Banner></Banner>
            <AdAccountTable></AdAccountTable>
        </div>
    );
};

export default Home;