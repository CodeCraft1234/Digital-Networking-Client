

const Banner = () => {
    return (
        <div className="mt-24">
             <div className="p-2 sm:p-4 dark:text-gray-100">
        <h2 className="mb-4 text-6xl text-black text-center font-semibold leading-tight">
          Employes Activities
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="dark:bg-gray-700">
              <tr>
                <th className="p-3 text-center">Ref</th>
                <th className="p-3 text-center">Name of owner</th>
                <th className="p-3 text-center">business</th>
                <th className="p-3 text-center">Bkash-Mar</th>
                <th className="p-3 text-center">Bkash-Per</th>
                <th className="p-3 text-center">Nagad-per</th>
                <th className="p-3 text-center">Rocket-Per</th>
                <th className="p-3 text-center">Total-BDT</th>
                <th className="p-3 text-center">Payoneer-USD</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                <td className="p-3 text-center">01</td>
                <td className="p-3 text-center">Raisa jaman</td>
                <td className="p-3 text-center">Degital Network</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">$0.00</td>
              </tr>
              <tr className="border-b border-opacity-20 bg-lime-700">
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center"></td>
                <td className="p-3 text-center">Total BDT</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">৳0.00</td>
                <td className="p-3 text-center">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        </div>
    );
};

export default Banner;