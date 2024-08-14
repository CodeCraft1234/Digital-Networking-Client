import { useContext, useEffect, useState } from "react";
import useClients from "../../Hook/useClient";
import { AuthContext } from "../../Security/AuthProvider";
import useEmployeePayment from "../../Hook/useEmployeePayment";
import UseAxiosPublic from "../../Axios/UseAxiosPublic";
import useUsers from "../../Hook/useUsers";

const EmployeeAdminPay = ({email}) => {
    const [employeePayment] = useEmployeePayment();
    console.log(employeePayment)
      const [users] = useUsers();
      const [ddd, setDdd] = useState(null);
      useEffect(() => {
          if (users && email) {
              const fff = users.find(u => u.email === email);
              console.log(fff);
              setDdd(fff || {}); // Update state with found user or an empty object
          }
      }, [users, email]);
  
      const [payment, setPayment] = useState([]);
      const [totalPayment, setTotalPayment] = useState([]);
  
      useEffect(() => {
            const realdata = employeePayment.filter(m => m.employeeEmail === email);
            setPayment(realdata);
            console.log(realdata);
            const totalBill = realdata.reduce((acc, campaign) => acc + parseFloat(campaign.payAmount), 0);
            setTotalPayment(totalBill);
      }, [employeePayment, email]);
  


    return (
        <div>
            


    <div className="overflow-x-auto mt-6 mx-4">
                  <table className="min-w-full bg-white">
                      <thead className="bg-[#05a0db] text-white">
                          <tr>
                              <th className="p-3 ">SL</th>
                              <th className="p-3">Payment Date</th>
                              <th className="p-3">Payment Amount</th>
                              <th className="p-3">Payment Method</th>
                              <th className="p-3"> Note</th>
                          </tr>
                      </thead>
                      <tbody>
                          {payment.map((payment, index) => (
                              <tr
                                  key={index}
                                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                              >
                                  <td className="p-3  border-r-2 border-l-2 border-gray-200 text-center">{index + 1}</td>
                                  <td className="p-3 border-r-2 border-gray-200 text-center">{payment.date}</td>
                                  <td className="p-3 border-r-2 border-gray-200 text-center">৳ {payment.payAmount}</td>
                                
                                  <td className="p-3 border-r-2 border-gray-200 text-center">


                                  
                                      {payment.paymentMethod === 'bkashMarchent' && <img className="h-10 w-24 flex mx-auto my-auto items-center justify-center" src='https://i.ibb.co/bHMLyvM/b-Kash-Merchant.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'bkashPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/520Py6s/bkash-1.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'rocketPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/QkTM4M3/rocket.png' alt="" />
                                      }
                                      {payment.paymentMethod === 'nagadPersonal' && <img className="h-10 w-24 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/JQBQBcF/nagad-marchant.png' alt="" /> 
                                      }
                                      {payment.paymentMethod === 'bank' && <img className="h-12 w-13 flex my-auto items-center mx-auto justify-center" src='https://i.ibb.co/kS0jD01/bank-3d-render-icon-illustration-png.webp' alt="" />
                                      }
                                      </td>
                                      <td className="p-3 border-r-2 border-gray-200 text-center"> {payment.note}</td>
                              </tr>
                          ))}
                          <tr className="bg-[#05a0db] text-white font-bold">
                              <td className="p-3 text-center" colSpan="2">
                                  Total Amount =
                              </td>
                              <td className="p-3 text-center">৳ {totalPayment}</td>
                              <td className="p-3 text-center"></td>
                              <td className="p-3 text-center"></td>
                              
                             
                          </tr>
                      </tbody>
                  </table>
              </div>
        </div>
    );
};

export default EmployeeAdminPay;