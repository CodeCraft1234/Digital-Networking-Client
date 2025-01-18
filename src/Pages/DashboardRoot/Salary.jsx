import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import MarketerSummery from './MarketerSummery';
import MarketerSalary from './MarketerSalary';
import DevGraphicSalary from './DevGraphicsSalary';
import MonthlySalary from './MonthlySelary';

const Salary = () => {

    const { user } = useContext(AuthContext);
    const {userr}=useUserr(user?.email)

    const initialTab = localStorage.getItem("activeTabP66") || "employeerPay";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabP66", tab); 
    };

    const getButtonClass = (tab) => 
        `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
            activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
                : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
        }`;

    return (
        <div>
            <Helmet>
                <title>{activeTab} | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>


                <div className="flex justify-center items-center gap-5 mb-5">
                    {/* Employeer Pay Button */}
                    <button
                        className={getButtonClass('Digital Marketer')}
                        onClick={() => changeTab('Digital Marketer')}
                    >
                        Digital Marketer 
                    </button>
                    <button
                        className={getButtonClass('Monthly Salary')}
                        onClick={() => changeTab('Monthly Salary')}
                    >
                       Monthly Salary
                    </button>



                    {
                        userr?.role === 'admin' &&  <button
                        className={getButtonClass('Graphic & Web Designer')}
                        onClick={() => changeTab('Graphic & Web Designer')}
                    >
                        Graphic & Web Designer
                    </button>
                    }
                   

                </div>
                {activeTab === 'Graphic & Web Designer' && <DevGraphicSalary></DevGraphicSalary>}
                {activeTab === 'Monthly Salary' && <MonthlySalary></MonthlySalary>}
                {activeTab === 'Digital Marketer' && <MarketerSalary></MarketerSalary>}
         

        </div>
    );
};

export default Salary;
