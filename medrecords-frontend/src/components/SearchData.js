import React, { useState } from "react";

function SearchData({ patients }) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
        Search Patient Data
      </h2>
      <input
        type="text"
        placeholder="Enter patient name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredPatients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((p, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl bg-green-50 flex flex-col gap-1"
            >
              <p><strong>Name:</strong> {p.name}</p>
              <p><strong>Phone:</strong> {p.phone}</p>
              <p><strong>Hospital:</strong> {p.hospital}</p>
              <p><strong>Description:</strong> {p.description}</p>
              <p><strong>File:</strong> {p.file ? p.file.name : "No file"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchData;
