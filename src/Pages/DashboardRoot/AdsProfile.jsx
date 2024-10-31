import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Security/AuthProvider';
import useUsers from '../../Hook/useUsers';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdsUserPayments from './AdsUserPayments';
import AdsUserAdsAccount from './AdsUserAdsAccount';
import ContributorHistory from './ContributorHistory';
import ContributorSummery from './ContributorSummery';


const AdsProfile = () => {
    const { user } = useContext(AuthContext);
    const [users] = useUsers();
    const [ddd, setDdd] = useState(null);
    const {email}=useParams()

    useEffect(() => {
        if (users && user) {
            const fff = users.find(u => u.email === email);
            console.log(fff);
            setDdd(fff || {}); // Update state with found user or an empty object
        }
    }, [users, user,email]);
  
  
    const [activeTab, setActiveTab] = useState('summery'); // Default to 'userAdAccount'

    const getButtonClass = (tab) => 
      `px-3 py-1 lg:px-4 lg:py-2 text-md lg:text-lg rounded-lg transition duration-300 ease-in-out ${
          activeTab === tab 
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'  // Active tab styles
              : 'bg-red-400 text-white hover:bg-gray-300 hover:shadow-md' // Inactive tab styles
      }`;
    return (
        <div  className='my-5'>
          
        <div className=" px-5 dark:text-green-800">
        <Helmet>
         <title>Ads user profile | Digital Network </title>
         <link rel="canonical" href="https://www.example.com/" />
       </Helmet>

       <div style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }}  className="p-5 rounded-lg">
       <div >

       <div  className="">
        <img 
          className="rounded-full border-2 p-2 border-black mx-auto w-20 h-20 lg:w-32 lg:h-32" 
          src={ddd?.photo} 
          alt="" 
        />
        <h1 style={{  color: 'var(--text-color2)'}} className="lg:text-4xl mt-4 text-black sm:text-2xl md:text-3xl font-bold text-center">
          {ddd?.name}
        </h1>
      </div>

      <div  className="flex p-5 justify-center items-center gap-5 mt-5">
      <button 
          className={getButtonClass('summery')}
          onClick={() => setActiveTab('summery')}
        >
          Summery
        </button>
      <button 
          className={getButtonClass('payment')}
          onClick={() => setActiveTab('payment')}
        >
          Payment
        </button>
      
        <button 
          className={getButtonClass('adsAccount')}
          onClick={() => setActiveTab('adsAccount')}
        >
          Ads Account
        </button>
    
        <button 
          className={getButtonClass('history')}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      
       

      </div>

      </div>
      </div>

      {activeTab === 'payment' && <AdsUserPayments email={email} />}
      {activeTab === 'adsAccount' && <AdsUserAdsAccount email={email} />}
      {activeTab === 'history' && <ContributorHistory email={email} />}
      {activeTab === 'summery' && <ContributorSummery email={email} />}



   </div>

  

     
    </div>
    );
};

export default AdsProfile;