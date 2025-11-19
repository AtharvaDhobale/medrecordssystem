import React, { useState } from "react";

function UploadForm({ addPatient }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hospital: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPatient(formData);
    setFormData({ name: "", phone: "", hospital: "", description: "", file: null });
    alert("Patient data uploaded!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
        Add Patient Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="hospital"
          placeholder="Hospital Name"
          value={formData.hospital}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition duration-300 font-semibold"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
