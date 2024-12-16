import  { useState } from "react";
import Select from "react-select";

// Example data for districts and areas
const districtOptions = [
  { value: "dhaka", label: "Dhaka" },
  { value: "chattogram", label: "Chattogram" },
  { value: "khulna", label: "Khulna" },
  { value: "sylhet", label: "Sylhet" },
];

const areaOptions = {
  dhaka: [
    { value: "uttara", label: "Uttara" },
    { value: "gulshan", label: "Gulshan" },
    { value: "dhanmondi", label: "Dhanmondi" },
  ],
  chattogram: [
    { value: "agrabad", label: "Agrabad" },
    { value: "pahartali", label: "Pahartali" },
  ],
  khulna: [
    { value: "sonadanga", label: "Sonadanga" },
    { value: "khulna-sadar", label: "Khulna Sadar" },
  ],
  sylhet: [
    { value: "zubilee", label: "Zubilee" },
    { value: "amberkhana", label: "Amberkhana" },
  ],
};

const Sellery2 = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedArea(null); // Reset area selection when district changes
  };

  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption);
  };

  const checkAvailability = () => {
    if (selectedDistrict && selectedArea) {
      alert(
        'sagdsag'
      );
    } else {
      alert("Please select both district and area.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Check Coverage</h2>
      <div style={{ marginBottom: "20px" }}>
        <Select
          options={districtOptions}
          placeholder="Select District"
          onChange={handleDistrictChange}
          value={selectedDistrict}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Select
          options={selectedDistrict ? areaOptions[selectedDistrict.value] : []}
          placeholder="Select Area"
          onChange={handleAreaChange}
          value={selectedArea}
          isDisabled={!selectedDistrict} // Disable until district is selected
        />
      </div>
      <button
        onClick={checkAvailability}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Check Availability
      </button>
    </div>
  );
};

export default Sellery2;