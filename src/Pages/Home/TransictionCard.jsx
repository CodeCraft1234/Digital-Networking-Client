// CardDesign.js
import React from 'react';

const TransictionCard = () => {
  return (
    <div className="  grid px-24 lg:grid-cols-6 items-center gap-5 justify-center mt-24">
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44 ' src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="bKash" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 44,000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44' src="https://i.ibb.co/520Py6s/bkash-1.png" alt="bKash" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 44,000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14  mx-auto text-center w-44' src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="Nagad" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : $ 1000.00</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-14 mx-auto text-center w-44' src="https://i.ibb.co/QkTM4M3/rocket.png" alt="Rocket" />
        <p className='text-xl text-center mt-5 font-bold'>Balance : ৳ 1000</p>
      </div>
      <div className=" p-5 py-12 bg-white shadow-2xl  rounded-lg">
        <img className='h-8 mx-auto text-center w-72' src="https://i.ibb.co/3WVZGdz/PAYO-BIG-aa26e6e0.png" alt="Payoneer" />
        <p className='text-xl mt-5 text-center font-bold'>T.USD : $4000</p>
        <p className='text-xl text-center font-bold'>T.Spent: $1000</p>
      </div>
      <div className=" px-10 py-3 bg-white shadow-2xl  rounded-lg">
        <p className='text-xl text-center font-bold'> T.Balance: ৳ 1000</p>
        <p className='text-xl text-center font-bold'>T.Received: ৳ 1000</p>
        <p className='text-xl text-center font-bold'>T.Cash Out: ৳ 10000</p>
      </div>
    </div>
  );
}

export default TransictionCard;
