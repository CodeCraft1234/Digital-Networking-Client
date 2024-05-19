

const Banner = () => {
    return (
        <div className="mt-24">
             <div className="p-2 sm:p-4 dark:text-gray-100">
        <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
          Employes Activities
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-400">
              <tr>
                <th className="p-3 text-center">Worker Logo</th>
                <th className="p-3 text-center">Worker Name</th>
                <th  className="p-3  text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/520Py6s/bkash-1.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src="https://i.ibb.co/JQBQBcF/nagad-marchant.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src=" https://i.ibb.co/QkTM4M3/rocket.png" alt="" /></th>
                <th className="p-3 text-center"><img  className="w-20 h-10 mx-auto" src=" https://i.ibb.co/w0D08gS/Payoneer-Logo-wine.png" alt="" /></th>
                <th className="p-3 text-center">Total-BDT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                <td className="p-3 text-center"> <img className="w-10 h-10 mx-auto rounded-full" src="https://i.ibb.co/YBfyP2W/S-bris.jpg" alt="" /> </td>
                <td className="p-3 text-center">Raisa jaman</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">$0.00</td>
                <td className="p-3 text-center">৳0.00</td>
              </tr>
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">$0.00</td>
                <td className="p-3 text-center">৳0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        </div>
    );
};

export default Banner;