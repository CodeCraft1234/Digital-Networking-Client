
const UpdateForm = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-md">
      <form>
        {/* Parent Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Father's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Father's Name
            </label>
            <input
              type="text"
              placeholder="Father's Name"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mother's Name
            </label>
            <input
              type="text"
              placeholder="Mother's Name"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Guardian's Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Guardian's Phone
            </label>
            <input
              type="text"
              placeholder="Guardian's Phone"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Student Alternative Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Student Alternative Number
            </label>
            <input
              type="text"
              placeholder="Enter alternative number"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* National ID No. */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              National ID No.
            </label>
            <input
              type="text"
              placeholder="Enter National ID"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Birth Registration ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Birth Reg ID No.
            </label>
            <input
              type="text"
              placeholder="Enter Birth Reg ID"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blood Group
            </label>
            <select className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500">
              <option>A+</option>
              <option>B+</option>
              <option>O+</option>
              <option>AB+</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date Of Birth
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Religion */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Religion
            </label>
            <select className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500">
              <option>Islam</option>
              <option>Hindu</option>
              <option>Christian</option>
              <option>Buddhist</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <select className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Present Address */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Present Address
            </label>
            <textarea
              rows="2"
              placeholder="Enter Present Address"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Now Out of Country */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Now Out Of Country?
            </label>
            <select className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* Present Division */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Present Division
            </label>
            <select className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500">
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Khulna</option>
            </select>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nationality
            </label>
            <input
              type="text"
              placeholder="Enter Nationality"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
