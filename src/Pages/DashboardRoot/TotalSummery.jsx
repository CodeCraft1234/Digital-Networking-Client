import { useState, useEffect } from "react";
import useUsers from "../../Hook/useUsers";
import SummaryCard from "../Home/SummeryCard";
import useRates from "../../Hook/useRates";
import useUsersSellery2 from "../../Hook/useUsersSellery2";

const TotalSummery = () => {
  const [users] = useUsers();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const initialTab = localStorage.getItem("activeTaballClientspayss") ;
  const [sortMonth, setSortMonth] = useState(initialTab,'all'); 
  const [usersSellery2] = useUsersSellery2('all',selectedYear,sortMonth);

  console.log(usersSellery2);

  const changeTab = (tab) => {
    setSortMonth(tab);
    localStorage.setItem("activeTaballClientspayss", tab); 
  };

  useEffect(() => {
    const aggregatedData = usersSellery2?.map((user) => {

      const totalMetaSpent = (user.monthlySpent || [])
        .filter((f) => f.role === "metaSpend")
        .reduce((acc, spent) => acc + spent.totalSpentt, 0);

      const totalPageSpent = (user.monthlySpent || [])
        .filter((f) => f.role === "pageSpend")
        .reduce((acc, spent) => acc + spent.totalSpentt, 0);

      const totalGoogleSpent = (user.monthlySpent || [])
        .filter((f) => f.role === "googleSpend")
        .reduce((acc, spent) => acc + spent.totalSpentt, 0);

      return {
        ...user,
        totalMetaSpent,
        totalPageSpent,
        totalGoogleSpent,
        totalSpent : totalMetaSpent +  totalGoogleSpent,
      };
    });

    const sortedData = aggregatedData.sort((a, b) => b.totalSpent - a.totalSpent);
    setEmployeeData(sortedData);
  }, [users, usersSellery2]);

  const { rates } = useRates();
  const [costRate, setCostRate] = useState(rates?.costRate || ""); 
  const [metaRate, setMetaRate] = useState(rates?.metaRate || ""); 
  const [googleRate, setGoogleRate] = useState(rates?.googleRate || ""); 
  
  useEffect(() => {
    setCostRate(rates?.costRate || "");
    setMetaRate(rates?.metaRate || "");
    setGoogleRate(rates?.googleRate || "");
  }, [rates]);
  
  const [payment2, setModalData2] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      
    <div className="text-black hidden lg:block">
      <div className="grid grid-cols-3 rounded-lg md:grid-cols-3 lg:grid-cols-6 text-black sm:grid-cols-2 gap-5 justify-around">

      <SummaryCard
    title="Total Service"
    value={new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.pageServiceTotal || 0), 0).toFixed(0))}
  />

  <SummaryCard
    title="Total Spend"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent + user?.totalPageSpent || 0), 0)
    )}
  />
  
  <SummaryCard
    title="Total BDT"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate), 0)
    )}
  />

  <SummaryCard
    title="Payment"
    value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.clientPay || 0), 0)
    )}
  />


<SummaryCard
  title={
    employeeData.reduce((sum, user) => sum + (
      parseFloat(user?.clientPay || 0) - ( ((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) +
      (parseFloat(user?.totalSpent || 0) * 7))
    ), 0) >= 0 ? "Profit" : "Loss"
  }
  value={new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((sum, user) => sum + (
     
      parseFloat(user?.clientPay || 0) - ( ((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) +
      (parseFloat(user?.totalSpent || 0) * 7) )
    ), 0)
  )}
/>

<SummaryCard
    title="Total Due"
    value={new Intl.NumberFormat('en-IN').format(
      employeeData.reduce((sum, user) => sum + parseFloat(user?.totalDue|| 0), 0).toFixed(0))}
  />


</div>

      <div
        className="my-5 "
      >

      <div className="flex justify-end gap-3 items-center mb-5">

      <select className="select2" value={sortMonth} onChange={(e) => changeTab(e.target.value)}>
<option  value='all'>Select Month</option>
  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    .map((month, i) => <option key={i} value={i + 1}>{month}</option>)}
</select>
<select
  className="select2"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="all">Select Year</option> {/* Default option */}
  {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>


      </div>

        <div className="table-div">
        <table className="min-w-full text-center">
  <thead>
    <tr className="tr1">
    
      <th>SL</th>
      <th className="flex justify-start">Employee Name</th>

      
      <th>
           <div className="flex justify-center items-center gap-2">
             Service
           </div>
         </th>
      <th>
           <div className="flex justify-center items-center gap-2">
             Total Spend
           </div>
         </th>
      <th>
           <div className="flex justify-center items-center gap-2">
           Total BDT
           </div>
         </th>

        {/* <th>
           <div className="flex justify-center items-center gap-2">
           Total Cost
           </div>
         </th> */}

     
      <th className="text-center">Payment</th>
      <th className="text-center">Loss\Prfit</th>
      <th className="text-center">Client Due</th>
    </tr>
  </thead>
  
  <tbody className="divide-y divide-gray-200 bg-white">
  {employeeData.map((user, index) => {
      const totalSpent = parseFloat(user?.totalSpent || 0);
      const totalMetaSpent = parseFloat(user?.totalMetaSpent || 0);
      const totalPageSpent = parseFloat(user?.totalPageSpent || 0);
      const totalGoogleSpent = parseFloat(user?.totalGoogleSpent || 0);
      const spendBDT = (totalMetaSpent  * metaRate) + (totalGoogleSpent * googleRate)  
      const salary = parseFloat(user?.totalSpent * 7 || 0);
      const salaryPay = parseFloat(user?.salaryPay || 0);
      const clientPay = parseFloat(user?.clientPay || 0);
      const pageServiceTotal = parseFloat(user?.pageServiceTotal || 0);
      const tiktokCost = parseFloat(user?.tiktokCost  || 0) * costRate;
      const totalCast = ((totalSpent + totalPageSpent) * costRate ) + tiktokCost  + salary ;
      const profitLoss =  clientPay - totalCast ; 
      const dueAdv =  clientPay - spendBDT ; 

        return (
          <tr 
                key={user._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white text-left text-black border-b border-opacity-20"
                    : "bg-gray-100  text-left text-black border-b border-opacity-20"
                }`}
              >
              <td>{index +1 }</td>
            <td className="px-2 py-3 sm:px-4 sm:py-3 text-sm font-medium text-gray-900 ">
              <div className="flex items-center gap-2">
                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user.photo} alt="" />
                <span className="whitespace-nowrap"><div className="flex flex-col space-y-1">
              <p className="text-lg flex justify-start items-center gap-1 ">{user.name}</p>
            </div></span>
              </div>
            </td>

          

            <td>
                <span className="amount-taka">৳ </span> {pageServiceTotal.toLocaleString('en-IN')}
                </td>

            <td>
                <span className="amount-taka">৳ </span> {totalSpent.toLocaleString('en-IN')}
                </td>

            <td>
                <span className="amount-taka">৳ </span> {Number(spendBDT.toFixed(0)).toLocaleString('en-IN')}
                </td>
            {/* <td>
                <span className="amount-taka">৳ </span> {Number(totalCast.toFixed(0)).toLocaleString('en-IN')}
                </td> */}

            <td>
                <span className="amount-taka">৳ </span> {Number(clientPay.toFixed(0)).toLocaleString('en-IN')}
                </td>



                <td>
  <div
    className={`px-2 py-1 rounded text-xs sm:text-sm 
      ${profitLoss > 0 ? 'text-green-600 font-normal' : profitLoss < 0 ? 'text-red-600 font-bold' : 'text-gray-600 font-normal'}`}
  >
    {profitLoss !== 0 && (
      <span>
        <span className="amount-taka">৳</span>
        {Math.abs(
          isNaN(profitLoss) || profitLoss === undefined ? 0 : profitLoss
        ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </span>
    )}
  </div>
</td>





<td>
  <div
    className={`px-2 py-1 rounded text-xs sm:text-sm 
      ${dueAdv > 0 ? 'text-green-600 font-normal' : dueAdv < 0 ? 'text-red-600 font-bold' : 'text-gray-600 font-normal'}`}
  >
    {dueAdv !== 0 && (
      <span>
        <span className="amount-taka">৳</span>
        {Math.abs(
          isNaN(dueAdv) || dueAdv === undefined ? 0 : dueAdv
        ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </span>
    )}
  </div>
</td>


               
          </tr>
        );
      })}
    </tbody>

    <tfoot className="font-bold">
  <tr className="tr1">
    <td className="text-right px-2 py-3 text-xs sm:text-sm md:text-base" colSpan="2">Total:</td>

    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + parseFloat(user?.pageServiceTotal || 0), 0).toFixed(0))}</span></td>

    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + parseFloat(user?.totalSpent || 0), 0)
          )}</span></td>




    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + (
              (parseFloat(user?.totalMetaSpent || 0) * metaRate) + 
              (parseFloat(user?.totalGoogleSpent || 0) * googleRate)
            ), 0).toFixed(0))}</span></td>






    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + parseFloat(user?.clientPay || 0), 0).toFixed(0))}</span></td>

{/* <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + (
              parseFloat(user?.adminPay || 0) - (
                ((parseFloat(user?.totalSpent || 0) + parseFloat(user?.totalPageSpent  || 0)) * costRate) + 
                (parseFloat(user?.totalSpent || 0) * 7) + 
                (parseFloat(user?.tiktokCost || 0) * costRate) + 
                parseFloat(user?.charge || 0)
              )
            ), 0).toFixed(0))}</span></td> */}

    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    employeeData.reduce((sum, user) => sum + (
     
      parseFloat(user?.clientPay || 0) - ( ((parseFloat(user?.totalSpent + user?.tiktokCost || 0) + parseFloat(user?.totalPageSpent || 0)) * costRate) +
      (parseFloat(user?.totalSpent || 0) * 7) )
    ), 0)
  )}</span></td>
    <td> <span className=""><span className="amount-doller">$</span> {new Intl.NumberFormat('en-IN').format(
            employeeData.reduce((sum, user) => sum + parseFloat(user?.totalDue|| 0), 0).toFixed(0))}</span></td>



            


  </tr>
</tfoot>

</table>

        </div>
      </div>

    </div>

    <div className="bg-white pt-40 pb-16 lg:pt-8 font-sans max-w-2xl lg:hidden mx-auto text-sm ">
  <div className="space-y-4">
    {employeeData.map((user, index) => {
      const totalSpent = parseFloat(user?.totalSpent || 0);
      const totalMetaSpent = parseFloat(user?.totalMetaSpent || 0);
      const totalPageSpent = parseFloat(user?.totalPageSpent || 0);
      const totalGoogleSpent = parseFloat(user?.totalGoogleSpent || 0);
      const spendBDT = (totalMetaSpent * metaRate) + (totalGoogleSpent * googleRate);
      const salary = parseFloat(totalSpent * 7 || 0);
      const clientPay = parseFloat(user?.clientPay || 0);
      const tiktokCost = parseFloat(user?.tiktokCost || 0) * costRate;
      const totalCast = ((totalSpent + totalPageSpent) * costRate) + tiktokCost + salary;
      const profitLoss = clientPay - totalCast;
      const dueAdv = clientPay - spendBDT;

      return (
        <div
          key={user._id}
          className="bg-gray-50 rounded-xl shadow-md px-5 py-4 mb-4 hover:shadow-lg transition duration-300"
        >
          <div className="flex items-end justify-between gap-4">
            {/* Left Content */}
            <div className="flex items-start gap-3 flex-1">
              {/* Image */}
              <img
               className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover mt-1.5"
                src={user.photo}
                alt="Employee"
              />

              {/* Info */}
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <p className="text-black  text-sm sm:text-base hover:text-blue-800 transition-colors">{user.name}</p>

                <p>
  <span className="font-medium">Spend:</span>{" "}
  <span className="amount-taka">৳</span>{" "}
  {Number(totalSpent.toFixed(0)).toLocaleString("en-IN")}
</p>

<p>
  <span className="font-medium">Bill:</span>{" "}
  <span className="amount-taka">৳</span>{" "}
  {Number(spendBDT.toFixed(0)).toLocaleString("en-IN")}
</p>


        
              </div>
            </div>

            {/* Right Content */}
            <div className="text-right space-y-1 text-sm text-gray-700">
            
              <p>
                <span className="font-medium">Payment:</span>{" "}
                <span className="amount-taka">৳</span>{" "}
                {Number(clientPay.toFixed(0)).toLocaleString("en-IN")}
              </p>



              <p>
  <span className="font-medium">
    {dueAdv < 0 ? "Due" : "Advance"}:
  </span>{" "}
  <span
    className={`font-semibold ${
      dueAdv < 0 ? "text-red-600" : "text-green-600"
    }`}
  >
      <span className="amount-taka">৳</span>{" "} {Math.abs(Number(dueAdv.toFixed(0))).toLocaleString("en-IN")}
  </span>
</p>


            </div>
          </div>
        </div>
      );
    })}
  </div>
   </div>
  
    </div>
  );
};

export default TotalSummery;
