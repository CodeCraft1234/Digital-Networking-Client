import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./Components/Navber/Navber";
import Footer from "./Components/Footer/Footer";
import ScrollTop from "./ScrollTop";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const Root = () => {
    const location = useLocation();
    const noheaderfooter = location.pathname.includes("dashboard","login");
    return (
      <div>
        <ScrollTop />
        {noheaderfooter || <NavBar></NavBar>}
        <div className="min-h-screen max-w-auto mx-auto">
          <Outlet>
      <Helmet>
        <title> Dashboard | Digital Network</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
          </Outlet>
        </div>
        {noheaderfooter || <Footer></Footer>}
        <Toaster />
      </div>
    );
  };
  
  export default Root;