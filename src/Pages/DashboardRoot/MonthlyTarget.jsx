import  { useState, useEffect } from 'react';
import useUsers from '../../Hook/useUsers';
import useMySalaryPayments from '../../Hook/useMySalaryPayment';
import SummaryCard from '../Home/SummeryCard';
import useMyUser from '../../Hook/useMyUser';
import useAllEmployee from '../../Hook/useAllEmployee';
import useMyUserRunningMonthSpent from '../../Hook/MyUserRunningMonthSpent';

const MonthlyTarget = () => {
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [MySalaryPayment] = useMySalaryPayments('all');
  const [myUser]=useMyUser('all')
  const [allEmployees]=useAllEmployee()

  const [myUserRunningMonthSpent]=useMyUserRunningMonthSpent('all')

  const monthNames = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
  ];

  const [sortMonth, setSortMonth] = useState(monthNames[new Date().getMonth()]);
  
  useEffect(() => {

    const aggregatedData = allEmployees?.map(user => {
        


      const selleryData = MySalaryPayment.filter(sell => sell.month === sortMonth);
      const adminPayData = MySalaryPayment.filter(pay => {
        const payDate = new Date(pay.date);
        return payDate.toLocaleString('default', { month: 'long' }) === sortMonth 
      });

      const totalSpentMeta = parseFloat(myUser.totalSpentMeta?.['February'] || 0);
      const totalSpentGoogle = parseFloat(myUser.totalSpentGoogle?.['February'] || 0);
      const totalSpent = totalSpentMeta + totalSpentGoogle;

      const totalSellery = selleryData.reduce((acc, sell) => acc + sell.amount, 0);
      const totalBonus = selleryData.reduce((acc, sell) => acc + sell.bonus, 0);
      const totalAdminPay = adminPayData.reduce((acc, pay) => acc + pay.adminPayAmount, 0);

      return {
        ...user,
        totalSpent,
        totalSellery,
        totalBonus,
        totalAdminPay,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);

    setEmployeeData(sortedData);

  }, [users,myUser,MySalaryPayment,  sortMonth]);

  const totalSpent = employeeData.reduce((acc, user) => acc + user.totalSpent, 0);

  return (
    <div className=' text-black'>

      <div  className="grid mb-5  rounded-lg grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-black sm:grid-cols-2 gap-5 justify-around ">

<SummaryCard title="Total Spend" value={totalSpent.toFixed(2)} />
<SummaryCard title="Daily Spend" value={employeeData.reduce((acc, user) => acc + (user.totalSpent / new Date().getDate()), 0).toFixed(2)} />
<SummaryCard title="Monthly Target" value={employeeData.reduce((acc, user) => acc + ((user.totalSpent / new Date().getDate()) * 30), 0).toFixed(2)} />
<SummaryCard title="Yearly Target" value={employeeData.reduce((acc, user) => acc + ((user.totalSpent / new Date().getDate()) * 30) * 12, 0).toFixed(2)} />
     </div>


      <div className='px-5 py-5 rounded-md' style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)',border: 'var(--border)'}}>

      <div  className="table-div " style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)'}}>
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >
              <th className='text-center'>SL</th>
              <th>Employee Name</th>
              <th>Total Spend</th>
              <th>Daily Spend</th>
              <th>Target Spend</th>
           
            </tr>
          </thead>
          <tbody className='text-black'>
            {myUserRunningMonthSpent.sort((a, b) => (b.totalSpentGoogle + b.totalSpentMeta) - (a.totalSpentGoogle + a.totalSpentMeta)).map((user, index) => (
              <tr  key={user?._id}
              className={`tr2`}
            >
                 <td className='text-center'>{index + 1}</td>
                <td >
               <div className='flex justify-start items-center gap-1'>
               <img className='h-10 w-10 rounded-full flex justify-center' src={user.photo} alt="" /><span>{user.name}</span>
               </div>
                </td>

                 <td >$ {(user.totalSpentGoogle + user.totalSpentMeta)?.toFixed(2)}</td>

                 <td>
               $ {((user.totalSpentGoogle + user.totalSpentMeta) / new Date().getDate()).toFixed(2)}
                </td>

                 <td>
               $ {(((user.totalSpentGoogle + user.totalSpentMeta).toFixed(2) / new Date().getDate())* 30 ).toFixed(2)}
                </td>

              </tr>
            ))}
          </tbody>
          <tfoot className="font-bold">
  <tr className="tr1">
    <td></td>
    <td>Total</td>
    <td>
      $ {myUserRunningMonthSpent.reduce((acc, user) => acc + (user.totalSpentGoogle + user.totalSpentMeta), 0).toFixed(2)}
    </td>
    <td>
      $ {myUserRunningMonthSpent.reduce((acc, user) => acc + ((user.totalSpentGoogle + user.totalSpentMeta) / new Date().getDate()), 0).toFixed(2)}
    </td>
    <td>
      $ {myUserRunningMonthSpent.reduce((acc, user) => acc + (((user.totalSpentGoogle + user.totalSpentMeta) / new Date().getDate()) * 30), 0).toFixed(2)}
    </td>
  </tr>
</tfoot>

        </table>
      </div>
      </div>

    </div>
  );
};

export default MonthlyTarget;
