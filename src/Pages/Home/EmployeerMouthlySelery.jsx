
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useOwnSelary from "../../Hook/useOwnSelary";


const EmployeerMouthlySelery = () => {

  const [ownSelary, refetch] = useOwnSelary();
  const AxiosPublic = UseAxiosPublic();



  const handleSalary = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const totalWork = e.target.threshold.value;
    const dollarRet = e.target.dollarRet.value;
    const totalSalary = e.target.totalSalary.value;
    const paid = e.target.paid.value;
    const unpaid = e.target.unpaid.value;
    const bonus = e.target.bonus.value;
    const status = e.target.status.value;
    const photo = e.target.photo.value;
    const data = {
      name,
      totalWork,
      dollarRet,
      totalSalary,
      paid,
      unpaid,
      bonus,
      status,
      photo,
    };
    setData(data);
  };


  const totals = {
    totalWork: 6000,
    dollarRet: 42,
    totalSalary: 18000,
    paid: 18000,
    unpaid: 0,
    bonus: 6000,
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log(id);
  
    // Parse the input values to floats
    const totalWork = parseFloat(e.target.totalWork.value);
    const paid = parseFloat(e.target.paid.value);
    const saleryRate = parseFloat(e.target.saleryRate.value);
    const bonus = parseFloat(e.target.bonus.value);
  
    const data = { totalWork, paid, saleryRate, bonus };
    console.log(data);
  
    // Make the patch request
    AxiosPublic.patch(`/salary/${id}`, data)
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch((error) => {
        console.error('Error updating salary:', error);
      });
  };
  

  return (
    <div className="mt-5 p-4">
      <h6 className="text-center mb-5 font-bold text-3xl md:text-5xl text-green-800">
      Employeers Own Mouthly Salary Sheet
      </h6>
      <div className="overflow-x-auto mt-0">
        <table className="min-w-full text-xs md:text-sm lg:text-base bg-white">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Total Work</th>
              <th className="p-3">Basic Salary</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Total Salary</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Unpaid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ownSelary.map((employee, index) => (
              <tr
                key={employee._id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="p-3 flex items-center space-x-3">
                  <span>{employee.mounth}</span>
                </td>
                <td className="p-3 text-center">{employee.totalWork}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100}
                </td>
                <td className="p-3 text-center">৳ {employee.bonus}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100 + employee.bonus}
                </td>
                <td className="p-3 text-center">৳ {employee.paid}</td>
                <td className="p-3 text-center">
                  ৳ {(employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid}
                </td>
                <td
                  className={`p-3 text-center ${
                    (employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid  <= 0 ? 'text-blue-500'   : "text-red-500"
                  }`}
                >
                  {(employee.totalWork * 5.4) / 100 + employee.bonus - employee.paid  <= 0 ? (
                    <p>Paid</p>
                  ) : (
                    <p>UnPaid</p>
                  )}
                </td>
                <td className="p-3 text-center">
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeerMouthlySelery;
