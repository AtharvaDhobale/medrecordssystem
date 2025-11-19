// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { uploadFile, addRecord, getRecordsByPatient, downloadFile, logout } from "../api";

const renderValue = (value) => (value === null || value === undefined ? "—" : typeof value === "object" ? JSON.stringify(value) : value);

function Dashboard() {
  const storedId = localStorage.getItem("patientId") || "";
  const patientName = localStorage.getItem("patientName") || "User";
  const [patientId, setPatientId] = useState(storedId);
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { if (patientId) fetchRecords(patientId); }, [patientId]);

  const fetchRecords = async (pid) => {
    setIsLoading(true);
    try {
      const res = await getRecordsByPatient(pid);
      setRecords(Array.isArray(res) ? res : []);
      setMessage("");
    } catch (err) {
      setMessage("Failed to fetch records: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!patientId) return setMessage("No patientId. Login first.");
    setIsUploading(true);
    setMessage("");
    try {
      let fileId = null;
      if (file) fileId = await uploadFile(file);

      const record = { patientId, doctorName: hospital || "Unknown", fileName: file?.name, fileId, description };
      await addRecord(record);
      setMessage("Record added successfully!");
      setName(""); setHospital(""); setDescription(""); setFile(null);
      fetchRecords(patientId);
    } catch (err) {
      setMessage("Upload failed: " + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const blob = await downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = filename || fileId; 
      a.click(); 
      a.remove(); 
      window.URL.revokeObjectURL(url);
    } catch (err) { 
      setMessage("Download failed: " + (err.message || err)); 
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">MedRecords</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-blue-200 group">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{records.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-green-200 group">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300">Files Uploaded</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">{records.filter(r => r.fileId).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-purple-200 group">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300">Patient ID</p>
                <p className="text-sm font-mono text-gray-900 group-hover:text-purple-700 transition-colors duration-300">{patientId.slice(0, 8)}...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Record Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 animate-slide-in hover-lift">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Medical Record
            </h2>
          </div>
          
          {message && (
            <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center ${
              message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <svg className={`w-5 h-5 mr-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`} fill="currentColor" viewBox="0 0 20 20">
                {message.includes("success") ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message}
            </div>
          )}

          <form onSubmit={handleUpload} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                <input 
                  value={name} 
                  onChange={(e)=>setName(e.target.value)} 
                  placeholder="Enter patient name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor/Hospital</label>
                <input 
                  value={hospital} 
                  onChange={(e)=>setHospital(e.target.value)} 
                  placeholder="Enter doctor or hospital name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={(e)=>setDescription(e.target.value)} 
                placeholder="Enter record description" 
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105 resize-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-all duration-300 hover:bg-blue-50 hover:scale-105">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
          <input
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={(e)=>setFile(e.target.files[0])}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  {file && (
                    <p className="text-sm text-blue-600 mt-2">Selected: {file.name}</p>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Add Medical Record"
              )}
          </button>
          </form>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in hover-lift">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Medical Records ({records.length})
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="animate-bounce-slow w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="animate-bounce-slow w-2 h-2 bg-blue-600 rounded-full" style={{animationDelay: '0.1s'}}></div>
                    <div className="animate-bounce-slow w-2 h-2 bg-blue-600 rounded-full" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="ml-3 text-gray-600">Loading records...</span>
                </div>
                {/* Loading Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-shimmer"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                        <div className="w-20 h-8 bg-gray-200 rounded-lg animate-shimmer"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first medical record.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {records.map((r, index) => (
                  <div key={r.id || r._id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-200 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                            <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{renderValue(r.fileName || r.title) || "Untitled Record"}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Doctor/Hospital</p>
                            <p className="text-sm text-gray-900">{renderValue(r.doctorName || r.hospital)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Description</p>
                            <p className="text-sm text-gray-900">{renderValue(r.description)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0018 0z" />
                            </svg>
                            <span>Uploaded: {r.uploadDate ? new Date(r.uploadDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Unknown'}</span>
                          </div>
                          {r.fileId && (
                            <div className="flex items-center text-green-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0018 0z" />
                              </svg>
                              <span>File attached</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                  {r.fileId ? (
                          <button 
                            onClick={()=>handleDownload(r.fileId, r.fileName)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">No file</span>
                        )}
                      </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
