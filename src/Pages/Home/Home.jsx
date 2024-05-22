
import { useContext } from "react";
import AdAccountTable from "./AdAccountTable";
import Banner from "./Banner";
import CampaignTable from "./CampaignTable";
import { AuthContext } from "../../Security/AuthProvider";
import SalarySheet from "../../Components/SalarySheet/SalarySheet";
import UserAdAccount from "../../Components/UserAdAccount/UserAdAccount";
import WorkList from "../../Components/WorkList/WorkList";
import PaymentHistory from "../../Components/PaymentHistory/PaymentHistory";

const Home = () => {
    const {user} = useContext(AuthContext);

    return (
        <div>
            {
                user?.email==="admin25@gmail.com" ? <Banner></Banner> : <CampaignTable></CampaignTable>
            }
            <SalarySheet></SalarySheet>
            <UserAdAccount></UserAdAccount>
            <WorkList></WorkList>
            <PaymentHistory></PaymentHistory>
            <AdAccountTable></AdAccountTable>
        </div>
    );
};

export default Home;