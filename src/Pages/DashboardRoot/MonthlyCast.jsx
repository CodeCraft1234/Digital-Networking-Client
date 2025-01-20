import  { useState, useMemo, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import useAllEmployee from '../../Hook/useAllEmployee';
import useMyEmployeePayments from '../../Hook/useMyemployeePayments';
import { AuthContext } from '../../Security/AuthProvider';
import useUserr from '../../Hook/useUser';
import useMyUser from '../../Hook/useMyUser';
import SummaryCard from '../Home/SummeryCard';
import useMySalaryPayments from '../../Hook/useMySalaryPayment';
import useMyEmployeePaymentsCharge from '../../Hook/UseMyEmployeePaymentCharge';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlyCast = () => {
  const {user}=useContext(AuthContext)
  const [allEmployees]=useAllEmployee()
  const {userr}=useUserr(user?.email)
  
  const initialTab3 =
  userr?.role === "admin"
  ? localStorage.getItem(`ac2${user?.email}`) || "all" 
  : localStorage.getItem(`ac2${user?.email}`) || user?.email; 

  const [selectedEmployee, setSelectedEmployee] = useState(initialTab3);
  const [MyEmployeePayment]=useMyEmployeePayments(selectedEmployee)

  const [myUser]=useMyUser(selectedEmployee)
  const [MyEmployeePaymentCharge]=useMyEmployeePaymentsCharge(selectedEmployee)
  const [MySalaryPayment]=useMySalaryPayments(selectedEmployee)

  const changeTab = (tab) => {
    setSelectedEmployee(tab);
    localStorage.setItem(`ac2${user?.email}`, tab); 
  };

  const getRecentMonths = () => {
    const today = new Date();
    let monthsList = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsList.push(month.toLocaleString('default', { month: 'long' }));
    }
    return monthsList.reverse();
  };

  const recentMonths = getRecentMonths();

  const employeeData = useMemo(() => {
    if (!myUser || !recentMonths) return [];
  
    const relevantUsers = selectedEmployee === "all" 
      ? myUser.filter(u => u.role === 'employee')
      : myUser.filter(u => u.email === selectedEmployee && u.role === 'employee');
  
    return recentMonths.map(month => {
      const aggregatedData = relevantUsers.reduce((acc, user) => {
        // Monthly Spent Data
        const monthlySpentData = (user?.monthlySpent || [])
          .filter(spent => new Date(spent.date).toLocaleString('default', { month: 'long' }) === month)
          .reduce((spentAcc, current) => {
            const existingAccount = spentAcc.find(item => item.accountName === current.accountName);
            if (existingAccount) {
              if (new Date(current.date) > new Date(existingAccount.date)) {
                spentAcc = spentAcc.filter(item => item.accountName !== existingAccount.accountName);
                spentAcc.push(current);
              }
            } else {
              spentAcc.push(current);
            }
            return spentAcc;
          }, []);
  

        const totalSpent = monthlySpentData.reduce((sum, spent) => sum + spent.totalSpentt, 0);
        const totalSpentMeta = monthlySpentData.filter(f => f.role === 'pageSpend').reduce((sum, spent) => sum + spent.totalSpentt, 0);
        const totalMetaData = monthlySpentData.filter(f => f.role === 'metaSpend' || f.role === 'googleSpend').reduce((sum, spent) => sum + spent.totalSpentt, 0);
  

        const selleryData = (user?.sellery || []).filter(sell => sell.month === month);
        const totalSellery = selleryData.reduce((sum, sell) => sum + sell.amount, 0);
        const totalBonus = selleryData.reduce((sum, sell) => sum + sell.bonus, 0);
  
        // Payments
        const paymentSalaryByMonth = MySalaryPayment.reduce((payAcc, payment) => {
          const paymentMonth = new Date(payment.date).toLocaleString('default', { month: 'long' });
          if (paymentMonth === month) {
            payAcc += parseFloat(payment.payAmount);
          }
          return payAcc;
        }, 0);
  
        const paymentByMonthCharge = MyEmployeePaymentCharge?.reduce((payAcc, payment) => {
          const paymentMonth = new Date(payment.date).toLocaleString('default', { month: 'long' });
          if (paymentMonth === month) {
            payAcc += parseFloat(payment.charge || 0); 
          }
          return payAcc;
        }, 0);

        const paymentByMonthAdminpay = MyEmployeePaymentCharge?.reduce((payAcc, payment) => {
          const paymentMonth = new Date(payment.date).toLocaleString('default', { month: 'long' });
          if (paymentMonth === month) {
            payAcc += parseFloat(payment.payAmount || 0); 
          }
          return payAcc;
        }, 0);
  
        acc.totalSpentMeta += totalSpentMeta;
        acc.totalSpent += totalSpent;
        acc.totalMetaData += totalMetaData;
        acc.totalSellery += totalSellery;
        acc.totalBonus += totalBonus;
        acc.totalAdminPay = paymentByMonthCharge;
        acc.totalPayAdmin = paymentByMonthAdminpay ;
        acc.totalSalaryPay += paymentSalaryByMonth;
  
        return acc;
      }, {
        month,
        totalSpentMeta: 0,
        totalSpent: 0,
        totalMetaData: 0,
        totalSellery: 0,
        totalBonus: 0,
        totalAdminPay: 0,
        totalPayAdmin: 0,
        totalSalaryPay: 0,
      });
  
      aggregatedData.totalBill = aggregatedData.totalMetaData * 7;
      aggregatedData.totalMeta = aggregatedData.totalSpentMeta * 130;
      aggregatedData.totalDue = aggregatedData.totalSpent * 142 - aggregatedData.totalAdminPay;
      aggregatedData.totalSelleryPaid = aggregatedData.totalSpent * 7 - aggregatedData.totalSellery;
  
      return aggregatedData;
    }).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [myUser, selectedEmployee, MyEmployeePaymentCharge, recentMonths]);
  
  return (
    <div className=''>
      <Helmet>
        <title>Monthly Cast | Digital Network </title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      
<div  className="grid grid-cols-2  rounded-lg md:grid-cols-2 lg:grid-cols-7 text-black sm:grid-cols-2 gap-5 justify-around">

<SummaryCard title="Total Spend" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0).toFixed(2))} />
<SummaryCard title="Total BDT" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalMeta, 0).toFixed(0))} />
<SummaryCard title="Admin Pay" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))} />
<SummaryCard title="Charge" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0).toFixed(0))} />
<SummaryCard title="Salary Pay" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalSalaryPay, 0).toFixed(0))} />

<SummaryCard title="Total Cast" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalMeta + data.totalAdminPay +  data.totalSalaryPay, 0).toFixed(0))} />
<SummaryCard title="Loss" value={new Intl.NumberFormat('en-IN').format(employeeData.reduce((acc, data) => acc + data.totalMeta + data.totalAdminPay +  data.totalSalaryPay, 0).toFixed(0))} />


</div>




      <div className="side-space mt-5">

      <div className="w-full lg:w-auto mb-5 flex justify-start gap-3">
  {userr?.role === "admin" ? (
    <div className="flex mt-1.5 justify-center">
      <select
        className="select2"
        value={selectedEmployee}
        onChange={(e) => changeTab(e.target.value)}
      >
        <option value="all">Select Digital Marketer</option>
        {allEmployees
          .filter((u) => u.role === "employee")
          .map((employee) => (
            <option key={employee._id} value={employee.email}>
              {employee.name}
            </option>
          ))}
      </select>
    </div>
  ) : (
   <></>
  )}
</div>
     
      <div  className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1">
              <th>Month</th>
              <th>Monthly Spend</th>
              <th>Page Spend</th>
              <th>Spend BDT</th>
              <th>Charge</th>
              <th>Salary</th>
              <th>Total Cost</th>
              <th>Admin Pay</th>
              <th>Loss</th>
            </tr>
          </thead>
          <tbody>
          {employeeData.map((data, index) => (
    <tr
    key={data._id}
    className={`tr2`}
  >
      
      <td >{data.month}</td>

<td>
  ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalMetaData)}
</td>

<td >
  ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.totalSpentMeta)}
</td>
<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format((data.totalMetaData  + data.totalSpentMeta) * 130)}
</td>
<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalAdminPay)}
</td>


<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalBill)}
</td>

<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format( (data.totalMetaData * 130) + data.totalBill + data.totalMeta + data.totalAdminPay)}
</td>

<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(data.totalPayAdmin)}
</td>
<td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(((data.totalMetaData * 130) + data.totalBill + data.totalMeta + data.totalAdminPay) - data.totalPayAdmin )}
</td>

    </tr>
  ))}

</tbody>


    <tfoot className="font-bold">
      <tr className="tr1">
        <td className="text-right" colSpan="1">Total</td>
        <td>
          ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
            employeeData.reduce((acc, data) => acc + data.totalSpentMeta, 0)
          )}
        </td>
        <td>
          ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
            employeeData.reduce((acc, data) => acc + data.totalMetaData, 0)
          )}
        </td>
        <td>
          ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
            employeeData.reduce((acc, data) => acc + (data.totalMetaData + data.totalSpentMeta) * 130, 0)
          )}
        </td>
        <td>
          ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
            employeeData.reduce((acc, data) => acc + data.totalAdminPay, 0)
          )}
        </td>
        <td>
          ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
            employeeData.reduce((acc, data) => acc + data.totalBill, 0)
          )}
        </td>
        <td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => {
      return acc + (data.totalMetaData * 130) + data.totalBill + data.totalMeta + data.totalAdminPay;
    }, 0)
  )}
</td>

        <td>
          ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
            employeeData.reduce((acc, data) => acc + data.totalPayAdmin, 0)
          )}
        </td>
        <td>
  ৳{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((acc, data) => {
      return acc + ((data.totalMetaData * 130) + data.totalBill + data.totalMeta + data.totalAdminPay) - data.totalPayAdmin;
    }, 0)
  )}
</td>

      </tr>
    </tfoot>


        </table>
      </div>
    </div>

    </div>
  );
};

export default MonthlyCast;


