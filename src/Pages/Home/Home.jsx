
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <CampaignTable></CampaignTable>
            <AdAccountTable></AdAccountTable>
        </div>
    );
};

export default Home;