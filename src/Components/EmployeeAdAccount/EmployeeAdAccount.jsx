import { useParams } from "react-router-dom";
import useAddAdsAccount from "../../Hook/useAddAdsAccount";

const EmployeeAdAccount = () => {
  const [useradAdd] = useAddAdsAccount();
  const { id, adAccountName } = useParams(); 
  console.log(useradAdd);

  return (
    <div className="mt-44">
      <h6 className="text-center text-green-600 dark:text-green-600 font-bold text-4xl">
        Employee Ad Account
      </h6>
      
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Ad Account Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-center">{id}</td>
            </tr>
            <tr>
              <td className="p-3 text-center">{adAccountName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAdAccount;
