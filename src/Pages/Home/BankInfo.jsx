import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import useBankInfo from '../../Hook/useBankInfo';
import useUsers from '../../Hook/useUsers';
import { AuthContext } from '../../Security/AuthProvider';
import UseAxiosPublic from '../../Axios/UseAxiosPublic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFileDownload, FaRegCopy, FaUserEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

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
      ? `https://new-hishab.vercel.app/bankInfo/${selectedBankId}`
      : 'https://new-hishab.vercel.app/bankInfo';

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

  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (users && user) {
      const foundUser = users.find((u) => u.email === user.email);
      setDdd(foundUser || {}); // Update state with found user or an empty object
    }
  }, [users, user]);

  // Generate PDF for each individual bank info
  // Generate PDF for each individual bank info
const generatePDFForBank = (bankId) => {
  const input = document.getElementById(`bank-info-${bankId}`);
  const buttons = input.querySelector('.bank-buttons'); // Select the button container

  // Temporarily hide the buttons
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

    // Save the PDF with a unique filename
    pdf.save(`bank_info_${bankId}.pdf`);

    // Show the buttons again after generating the PDF
    buttons.style.display = '';
  }).catch((err) => {
    console.error('Error generating PDF:', err);
    // Ensure that the buttons are shown again in case of an error
    buttons.style.display = '';
  });
};





  const [copiedBankId, setCopiedBankId] = useState(null); // State to track the copied bank info ID

  // Copy bank info to clipboard and update button text to 'Copied'
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
        setCopiedBankId(info._id); // Set the copied bank info ID to show 'Copied' text
        setTimeout(() => {
          setCopiedBankId(null); // Revert back to 'Copy' after 2 seconds
        }, 2000);
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
      });
  };


  return (
    <div className='m-5'>
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

          {bankInfo && bankInfo.length > 0 ? (
            <div>
            
              {ddd?.role === 'admin' && (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 ">
                {bankInfo.map((info) => (
                  <div
                  id={`bank-info-${info._id}`} // Assign a unique ID to each bank info
                  className="text-black   shadow-lg rounded-lg my-6"
                  key={info._id}
                  style={{
                    width: '100%',
                    margin: 'auto',
                   border: 'var(--border)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Highlighted Bank Name */}
                  <div  
                    style={{
                      backgroundColor: 'var(--bg-color)',
                      color: 'var(--text-color)',
                      padding: '15px 20px',
                      textAlign: 'center'
                    }}
                  >
                    <h1  className="font-bold text-xl">
                      {info.bankName || 'N/A'}
                    </h1>
                  </div>
                
                  {/* Bank Details Table */}
                  <table className='text-black px-10'  style={{ color: 'var(--text-color2)', width: '100%',   }}>
                    <tbody>
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Bank Name:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.bankName || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Holder Name:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.name || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Account:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.account || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Branch:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.branch || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          District:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.district || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px',border: 'var(--border)' }}>
                          Swift Code:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.swiftCode || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Routing Number:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.routingNumber || 'N/A'}
                        </td>
                      </tr>
                
                      <tr className="">
                        <td style={{ fontWeight: 'bold', padding: '12px', border: 'var(--border)' }}>
                          Card:
                        </td>
                        <td style={{ padding: '12px', border: 'var(--border)' }}>
                          {info.card || 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                
                  {/* Admin Controls */}
                   {/* Admin Controls */}
<div className="text-center space-x-2 p-4 bank-buttons">
  {ddd?.role === 'admin' && ( <>
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onClick={() => handleEdit(info)}
    >
      <FaUserEdit />
    </button>

    <button
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      onClick={() => handleDelete(info._id)}
    >
      <MdDeleteOutline />
    </button>
  </>)}
  <button
    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    onClick={() => generatePDFForBank(info._id)}
  >
    <FaFileDownload />
  </button>
  <button
    className={`bg-[#8189dc] text-white py-2 px-4 rounded hover:bg-green-600`}
    onClick={() => copyBankInfoToClipboard(info)}
  >
    {copiedBankId === info._id ? 'Copied' : <FaRegCopy />}
  </button>
</div>

                
                </div>
                
                ))}
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
