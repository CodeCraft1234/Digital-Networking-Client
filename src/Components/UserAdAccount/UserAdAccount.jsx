import useAdAccount from "../../Hook/useAdAccount";
import useUserAdAccount from "../../Hook/useUserAdAccount";

const UserAdAccount = () => {
    const [UserAdAccount, refetch] = useUserAdAccount();
  console.log(UserAdAccount);

 

  return (
    <div className="mt-24 p-4">
      <h6 className="text-center font-bold text-3xl md:text-5xl text-green-800">
        User Ads Account Activities
      </h6>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Ad Account Name</th>
              <th className="p-3">Ad Account ID</th>
              <th className="p-3">Threshold</th>
              <th className="p-3">Current Balance</th>
              <th className="p-3">Active Spent</th>
              <th className="p-3">Delete Spent</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {UserAdAccount.map((account, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 text-center">{account.date}</td>
                <td className="p-3 text-center">{account.name}</td>
                <td className="p-3 text-center">{account.id}</td>
                <td className="p-3 text-center">
                  ${account.threshold.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.currentBalance.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.activeSpent.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.deleteSpent.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  ${account.totalSpent.toLocaleString()}
                </td>
                <td
                  className={`p-3 text-center ${
                    account.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {account.status}
                </td>
              </tr>
            ))}
            <tr className="bg-green-800 text-white font-bold">
              <td className="p-3 text-center" colSpan="3">
                Total
              </td>
              <td className="p-3 text-center">
                $
                {UserAdAccount
                  .reduce((sum, account) => sum + account.threshold, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
              {UserAdAccount
                  .reduce((sum, account) => sum + account.currentBalance, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {UserAdAccount
                  .reduce((sum, account) => sum + account.activeSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {UserAdAccount
                  .reduce((sum, account) => sum + account.deleteSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center">
                $
                {UserAdAccount
                  .reduce((sum, account) => sum + account.totalSpent, 0)
                  .toLocaleString()}
              </td>
              <td className="p-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAdAccount;
