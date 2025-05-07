import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCopy, FiShare2, FiX, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

const BankInfo = () => {
  // ... (banks array remains the same)
  const banks = [
    {
        id: 1,
        name: "BRAC Bank PLC",
        holder: "DIGITAL NETWORK",
        account: "2071478740001",
        branch: "AGENT BANKING",
        district: "DHAKA-SOUTH",
        routing: "060270609",
        swift: "BRAKBDDH",
        cardNumber: "N/A",
        color: "#004c9b", // BRAC Bank Blue
    },
    {
        id: 2,
        name: "BRAC Bank PLC",
        holder: "MD ANOWARUL ISLAM",
        account: "2071478740001",
        branch: "SATKHIRA",
        district: "SATKHIRA",
        routing: "060871095",
        swift: "BRAKBDDH",
        cardNumber: "4777920004008043",
        color: "#004c9b", // BRAC Bank Blue
    },
    {
        id: 3,
        name: "The City Bank PLC",
        holder: "MD ANOWARUL ISLAM",
        account: "N/A",
        branch: "SATKHIRA",
        district: "SATKHIRA",
        routing: "225871098",
        swift: "CIBLBDDH",
        cardNumber: "N/A",
        color: "#d71921", // City Bank Red
    },
    {
        id: 4,
        name: "Dutch Bangla Bank PLC",
        holder: "MD ANOWARUL ISLAM",
        account: "1801510129698",
        branch: "SATKHIRA",
        district: "SATKHIRA",
        routing: "090871094",
        swift: "DBBLBDDH180",
        cardNumber: "012 777 80307",
        color: "#0996b3", // Dutch Bangla Bank Blue
    },
    {
        id: 5,
        name: "Islami Bank Bangladesh PLC",
        holder: "MD ANOWARUL ISLAM",
        account: "20503360202781706",
        branch: "SHYAMNAGAR",
        district: "SATKHIRA",
        routing: "125871219",
        swift: "IBBLBDDH",
        cardNumber: "4170336042185201",
        color: "#006a4d", // Islami Bank Green
    },
    {
        id: 6,
        name: "Agrani Bank PLC",
        holder: "MD ANOWARUL ISLAM",
        account: "0200009112344",
        branch: "NURNAGAR",
        district: "SATKHIRA",
        routing: "010872031",
        swift: "AGBKBDDH",
        cardNumber: "N/A",
        color: "#008000", // Agrani Bank Green
    }
];



  const [copiedBankId, setCopiedBankId] = useState(null);
  const [sharingBank, setSharingBank] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const copyBankInfoToClipboard = (bank) => {
    const bankDetails = `Account Number: ${bank.account}
Account Name: ${bank.holder}
Bank Name: ${bank.name}
Branch Name: ${bank.branch}
Routing Number: ${bank.routing}
SWIFT Code: ${bank.swift}`;

    navigator.clipboard.writeText(bankDetails)
      .then(() => {
        setCopiedBankId(bank.id);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch(console.error);
  };

  const handleShare = (bank) => {
    const shareText = `Account Number: ${bank.account}
Account Name: ${bank.holder}
Bank Name: ${bank.name}
Branch Name: ${bank.branch}
Routing Number: ${bank.routing}
SWIFT Code: ${bank.swift}`;

    if (navigator.share) {
      navigator.share({
        title: 'Bank Account Details',
        text: shareText
      });
    } else {
      setSharingBank(bank);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0 px-5">
      <Helmet>
        <title>Bank Information | Digital Network</title>
        <meta name="description" content="Professional banking information for Digital Network" />
        <link rel="canonical" href="https://www.example.com/bank-info" />
      </Helmet>

      <div className="mx-auto ">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Bank Accounts</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => (
            <div 
              key={bank.id}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
             <div className="absolute top-0 h-2 w-full" style={{ backgroundColor: bank.color }} />

              
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{bank.name}</h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {bank.district}
                  </span>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <InfoRow label="Account Number" value={bank.account} />
                  <InfoRow label="Account Holder" value={bank.holder} />
                  <InfoRow label="Branch" value={`${bank.branch}, ${bank.district}`} />
                  <InfoRow label="Routing No" value={bank.routing} />
                  <InfoRow label="SWIFT Code" value={bank.swift} />
                  <InfoRow label="Card Number" value={bank.cardNumber} />
                </div>

                <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => copyBankInfoToClipboard(bank)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 px-4 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <FiCopy className="h-5 w-5" />
                    {copiedBankId === bank.id ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleShare(bank)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <FiShare2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {sharingBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Share Bank Details</h3>
              <button
                onClick={() => setSharingBank(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              <ShareButton
                icon={<FiMessageSquare className="h-6 w-6 text-green-500" />}
                label="Share via WhatsApp"
                onClick={() => {
                  // WhatsApp sharing logic
                }}
              />
              <ShareButton
                icon={<FiCopy className="h-6 w-6 text-blue-500" />}
                label="Copy to Clipboard"
                onClick={() => {
                  // Copy logic
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg">
          <FiCheckCircle className="h-6 w-6 text-green-500" />
          <span className="font-medium text-gray-900">Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-medium text-gray-900">
      {value}
    </span>
  </div>
);

const ShareButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50"
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
      {icon}
    </span>
    <span className="font-medium text-gray-900">{label}</span>
  </button>
);

export default BankInfo;