import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import useBankInfo from '../../Hook/useBankInfo';
import useUsers from '../../Hook/useUsers';
import { AuthContext } from '../../Security/AuthProvider';

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
      ? `https://digital-networking-server.vercel.app/bankInfo/${selectedBankId}`
      : 'https://digital-networking-server.vercel.app/bankInfo';

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
      bankName: info.bankname || '',
      name: info.name || '',
      account: info.account || '',
      branch: info.branch || '',
      district: info.district || '',
      swiftCode: info.swiftcode || '',
      routingNumber: info.routingnumber || '',
      card: info.card || ''
    });
    setSelectedBankId(info._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this bank info?")) {
      Axios.delete(`https://digital-networking-server.vercel.app/bankInfo/${id}`)
        .then((res) => {
          console.log("Deleted successfully:", res.data);
          refetch();
        })
        .catch((err) => {
          console.error("Error deleting data:", err);
        });
    }
  };

  const [users] = useUsers();
  const [ddd, setDdd] = useState(null);
  const {user}=useContext(AuthContext)

  useEffect(() => {
      if (users && user) {
          const foundUser = users.find(u => u.email === user.email);
          setDdd(foundUser || {}); // Update state with found user or an empty object
      }
  }, [users, user]);



  return (
    <div className="p-5">
      {
        ddd?.role === 'admin' && <button 
        className="bg-blue-500 text-white py-2 px-4 my-5 rounded hover:bg-blue-600"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        Add Bank Details
      </button>
      }

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
                    <label className="block text-black bg-white font-medium mb-2">{label.replace(/([A-Z])/g, ' $1')}: </label>
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
          <h2 className="text-2xl font-bold text-white bg-blue-600 p-4 rounded-t-lg text-center">Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-black gap-3 mt-6">
            {bankInfo.map((info) => (
              <div className='text-black border-black' key={info._id} style={{ width: '100%', margin: 'auto', padding: '5px', border: '2px solid #ccc', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr className='bg-blue-100'>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Bank Name:</td>
                      <td className='font-bold' style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.bankName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Name:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.name || 'N/A'}</td>
                    </tr>
                    <tr className='bg-gray-200'>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>A/C:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.account || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Branch:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.branch || 'N/A'}</td>
                    </tr>
                    <tr className='bg-gray-200'>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>District:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.district || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>SWIFT Code:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.swiftCode || 'N/A'}</td>
                    </tr>
                    <tr className='bg-gray-200'>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Routing Number:</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.routingNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold', padding: '10px', borderBottom: '1px solid #ccc' }}>Card:</td>
                      <td className='font-bold' style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{info.card || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
                {
        ddd?.role === 'admin' && <>
        <button
                  className="bg-yellow-500 text-white py-1 px-3 mt-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(info)}
                  style={{ float: 'right', margin: '10px' }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 mt-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(info._id)}
                  style={{ float: 'left', margin: '10px' }}
                >
                  Delete
                </button>
        </>
        
        }
                
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No bank info found.</p>
      )}
    </div>
  );
};

export default BankInfo;
