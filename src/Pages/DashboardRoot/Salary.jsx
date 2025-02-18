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
    const { userr } = useUserr(user?.email);

    const initialTab = localStorage.getItem("activeTabP66") || "Digital Marketer";
    const [activeTab, setActiveTab] = useState(initialTab);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTabP66", tab); // Store the active tab in local storage
    };

    return (
        <div>
            <Helmet>
                <title>{activeTab} | Digital Network</title>
                <link rel="canonical" href="https://www.example.com/" />
            </Helmet>

            <div className="flex justify-center items-center gap-5 mb-5">
                {/* Tab Buttons */}
                <button
                    className={`tab-button ${activeTab === 'Digital Marketer' ? 'active' : ''}`}
                    onClick={() => changeTab('Digital Marketer')}
                >
                    Digital Marketer
                </button>
                <button
                    className={`tab-button ${activeTab === 'Monthly Salary' ? 'active' : ''}`}
                    onClick={() => changeTab('Monthly Salary')}
                >
                    Monthly Salary
                </button>

                {/* Admin-only tab for Graphic & Web Designer */}
                {userr?.role === 'admin' && (
                    <button
                        className={`tab-button ${activeTab === 'Graphic & Web Designer' ? 'active' : ''}`}
                        onClick={() => changeTab('Graphic & Web Designer')}
                    >
                        Graphic & Web Designer
                    </button>
                )}
            </div>

            {/* Render content based on the selected tab */}
            {activeTab === 'Graphic & Web Designer' && <DevGraphicSalary />}
            {activeTab === 'Monthly Salary' && <MonthlySalary />}
            {activeTab === 'Digital Marketer' && <MarketerSalary />}
        </div>
    );
};

export default Salary;
