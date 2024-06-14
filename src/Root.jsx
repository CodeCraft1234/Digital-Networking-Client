import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Components/Navber/Navber";
import Footer from "./Components/Footer/Footer";
import ScrollTop from "./ScrollTop";
import { Toaster } from "react-hot-toast";

const Root = () => {
    const location = useLocation();
    const noheaderfooter = location.pathname.includes("dashboard","login");
    return (
      <div>
        <ScrollTop />
        {noheaderfooter || <NavBar></NavBar>}
        <div className="min-h-screen max-w-auto mx-auto">
          <Outlet></Outlet>
        </div>
        {noheaderfooter || <Footer></Footer>}
        <Toaster />
      </div>
    );
  };
  
  export default Root;