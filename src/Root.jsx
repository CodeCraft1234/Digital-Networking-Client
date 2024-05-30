import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Components/Navber/Navber";
import Footer from "./Components/Footer/Footer";


const Root = () => {
    const location = useLocation();
    const noheaderfooter = location.pathname.includes("/login");
    return (
        <div>
            {noheaderfooter || <NavBar></NavBar>}
           <div className="min-h-screen">
           <Outlet></Outlet>
           </div>
           {noheaderfooter || <Footer></Footer>}
        </div>
    );
};

export default Root;