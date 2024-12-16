import { useContext, useState } from 'react';
import Axios from 'axios';
import useBankInfo from '../../Hook/useBankInfo';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaEdit, FaFileDownload, FaMinusSquare, FaRegCopy } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import useUserr from '../../Hook/useUser';

const BankInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [bankInfo, refetch] = useBankInfo();
  const [formData, setFormData] = useState({
    bankName: '',
    name: '',
    account: '',
    branch: '',
    district: '',
    swiftCode: '',
    routingNumber: '',
    card: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditing
      ? `https://hishab-2025.vercel.app/bankInfo/${selectedBankId}`
      : 'https://hishab-2025.vercel.app/bankInfo';

    const method = isEditing ? 'patch' : 'post';

    Axios[method](url, formData)
      .then((res) => {
        console.log('Response data:', res.data);
        setShowModal(false);
        refetch();
        resetForm();
      })
      .catch((err) => {
        console.error('Error posting data:', err);
      });
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      name: '',
      account: '',
      branch: '',
      district: '',
      swiftCode: '',
      routingNumber: '',
      card: ''
    });
    setSelectedBankId(null);
    setIsEditing(false);
  };

  const handleEdit = (info) => {
    setFormData({
      bankName: info.bankName || '',
      name: info.name || '',
      account: info.account || '',
      branch: info.branch || '',
      district: info.district || '',
      swiftCode: info.swiftCode || '',
      routingNumber: info.routingNumber || '',
      card: info.card || ''
    });
    setSelectedBankId(info._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const AxiosPublic = UseAxiosPublic();
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bank info?')) {
      AxiosPublic.delete(`/bankInfo/${id}`)
        .then((res) => {
          console.log('Deleted successfully:', res.data);
          refetch();
        })
        .catch((err) => {
          console.error('Error deleting data:', err);
        });
    }
  };

  const { user } = useContext(AuthContext);
  const {userr}=useUserr(user?.email)

const generatePDFForBank = (bankId) => {
  const input = document.getElementById(`bank-info-${bankId}`);
  const buttons = input.querySelector('.bank-buttons'); // Select the button container

  buttons.style.display = 'none';

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`bank_info_${bankId}.pdf`);
    buttons.style.display = '';
  }).catch((err) => {
    console.error('Error generating PDF:', err);
    buttons.style.display = '';
  });
};

  const [copiedBankId, setCopiedBankId] = useState(null); 

  const copyBankInfoToClipboard = (info) => {
    const bankDetails = `
      Bank Name: ${info.bankName || 'N/A'}
      Holder Name: ${info.name || 'N/A'}
      Account: ${info.account || 'N/A'}
      Branch: ${info.branch || 'N/A'}
      District: ${info.district || 'N/A'}
      Swift Code: ${info.swiftCode || 'N/A'}
      Routing Number: ${info.routingNumber || 'N/A'}
      Card: ${info.card || 'N/A'}
    `;

    navigator.clipboard.writeText(bankDetails)
      .then(() => {
        setCopiedBankId(info._id); 
        setTimeout(() => {
          setCopiedBankId(null); 
        }, 2000);
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
      });
  };


  return (
    <div className=''>
       <Helmet>
        <title>Bank info | Digital Network</title>
        <link rel="canonical" href="https://www.example.com/" />
      </Helmet>

      <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-color3)', color: 'var(--text-color)', border: 'var(--border)' }}>
        <div className="p-5">
          

          {showModal && (
            <div className="fixed inset-0 flex text-black items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  {isEditing ? 'Edit Bank Details' : 'Enter Bank Details'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['bankName', 'name', 'account', 'branch', 'district', 'swiftCode', 'routingNumber', 'card'].map((label, idx) => (
                      <div key={idx} className="col-span-1">
                        <label className="block text-black bg-white font-medium mb-2">
                          {label.replace(/([A-Z])/g, ' $1')}: 
                        </label>
                        <input
                          type="text"
                          name={label}
                          value={formData[label]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6 space-x-4">
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      {isEditing ? 'Update' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

{userr?.role === 'admin' && (
            <button
              className="bg-blue-500 mr-5 text-white py-2 px-4 mb-5 rounded hover:bg-blue-600"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Bank Details
            </button>
          )}
          {bankInfo && bankInfo.length > 0 ? (
            <div>
            


 <div className="table-div ">
          <table className="min-w-full text-center ">
            <thead className=" ">
              <tr className="tr1" >  
                {userr.role === 'admin' && <th className="text-center">Items {bankInfo?.length}</th>}
                <th >Bank Name</th>
                <th >Holder Name</th>
                <th >Account</th>
                <th >Branch</th>
                <th >District</th>
                <th >Routing Number</th>
                <th >Card</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {bankInfo
              .map((work, index) => (
                 <tr 
                 key={work._id}
                 className={`tr2`}
               >
                {
                  userr.role === 'admin' && <td className="text-center"> 
                  <button
                     className=" delete"
                     onClick={() => handleDelete(work._id)}
                  >
                   <span >
                    <FaMinusSquare  />
                    </span>
                  </button> 
              </td>
                }
                     
                      
                  <td>
                  {work?.bankName}
                  </td>
                  <td>
                    {
                       userr.role === 'admin' ?  <button
                       className="f-start edit"
                       onClick={() => handleEdit(work)}
                     >
                      <FaEdit /> 
                      <span>
 {work.name
   ?.split(' ') 
   .slice(0, 4) 
   .join(' ') 
   + (work.name?.split(' ').length > 4 ? '...' : '') 
 }
</span>
                   </button> :  <span>
 {work.name
   ?.split(' ') 
   .slice(0, 4) 
   .join(' ') 
   + (work.name?.split(' ').length > 4 ? '...' : '') 
 }
</span>
                    }
                  </td>
                  <td>
                  {work?.account}
                  </td>
                  <td>
                  {work?.branch}
                  </td>
                  <td>
                  {work?.district}
                  </td>
                  <td>
                  {work?.routingNumber}
                  </td>
                  <td>
                  {work?.card}
                  </td>
                  <td>
                  <div className="text-center  bank-buttons">
  <button
    className=" py-2  rounded hover:bg-green-600"
    onClick={() => generatePDFForBank(work._id)}
  >
    <FaFileDownload />
  </button>
  <button
    className={` py-2 px-4 rounded hover:bg-green-600`}
    onClick={() => copyBankInfoToClipboard(work)}
  >
    {copiedBankId === work._id ? 'Copied' : <FaRegCopy />}
  </button>
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            </div>
          ) : (
            <div>No bank information found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankInfo;
