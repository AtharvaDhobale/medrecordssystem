import React, { useEffect, useState } from "react";
import { uploadFile, addRecord, getRecordsByPatient, downloadFile, logout } from "../api";

const renderValue = (value) => (value === null || value === undefined || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : value);

function Dashboard() {
  const storedId = localStorage.getItem("patientId") || "";
  const patientName = localStorage.getItem("patientName") || "User";
  const [patientId] = useState(storedId);
  const [name, setName] = useState(patientName);
  const [hospital, setHospital] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Tab State: 'overview' | 'records' | 'upload' | 'passport' | 'settings'
  const [activeTab, setActiveTab] = useState("overview");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'pdf' | 'image' | 'doc'

  const [profile] = useState(() => {
    const saved = localStorage.getItem(`patientProfile_${storedId}`);
    return saved ? JSON.parse(saved) : {
      age: "",
      bloodGroup: "",
      weight: "",
      height: "",
      gender: "",
      emergencyContact: "",
      medicalHistory: "",
      allergies: ""
    };
  });

  useEffect(() => {
    if (patientId) {
      fetchRecords(patientId);
    }
  }, [patientId]);

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
      if (file) {
        fileId = await uploadFile(file);
      }

      const record = {
        patientId,
        doctorName: hospital || "Unknown",
        fileName: file?.name || "Untitled Medical Note",
        fileId,
        description
      };
      await addRecord(record);
      setMessage("Record added successfully!");
      setHospital("");
      setDescription("");
      setFile(null);
      fetchRecords(patientId);
      // Switch back to records tab after a successful upload
      setTimeout(() => {
        setActiveTab("records");
        setMessage("");
      }, 1500);
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

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    const fields = Object.values(profile);
    const filled = fields.filter(val => val !== null && val !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  // Filtered records based on search query and file type filter
  const filteredRecords = records.filter(r => {
    const filename = (r.fileName || "").toLowerCase();
    const doctor = (r.doctorName || "").toLowerCase();
    const desc = (r.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = filename.includes(query) || doctor.includes(query) || desc.includes(query);
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "pdf") return matchesSearch && filename.endsWith(".pdf");
    if (filterType === "image") return matchesSearch && (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg"));
    if (filterType === "doc") return matchesSearch && !filename.endsWith(".pdf") && !filename.endsWith(".png") && !filename.endsWith(".jpg") && !filename.endsWith(".jpeg");
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row text-[#1A1A18]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1B4332] text-[#FAF9F5] flex flex-col justify-between p-6 flex-shrink-0 md:min-h-screen">
        <div className="space-y-8">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#FAF9F5] text-[#1B4332] rounded-xl flex items-center justify-center font-bold text-lg">
              M
            </div>
            <span className="text-lg font-bold tracking-wide">MedRecords</span>
          </div>

          {/* User Brief Card */}
          <div className="bg-[#2D6A4F] bg-opacity-40 rounded-xl p-4 space-y-1">
            <p className="text-xs text-[#A3B19B] font-semibold uppercase tracking-wider">Patient Portal</p>
            <h4 className="font-semibold text-sm truncate">{patientName}</h4>
            <p className="text-xs text-[#A3B19B] font-mono truncate">ID: {patientId.slice(0, 12)}...</p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "overview" ? "bg-[#FAF9F5] text-[#1B4332] shadow-sm" : "hover:bg-[#2D6A4F] hover:bg-opacity-30 text-[#FAF9F5]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("records")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "records" ? "bg-[#FAF9F5] text-[#1B4332] shadow-sm" : "hover:bg-[#2D6A4F] hover:bg-opacity-30 text-[#FAF9F5]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>My Health Records</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "upload" ? "bg-[#FAF9F5] text-[#1B4332] shadow-sm" : "hover:bg-[#2D6A4F] hover:bg-opacity-30 text-[#FAF9F5]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Upload Document</span>
            </button>

            <button
              onClick={() => setActiveTab("passport")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "passport" ? "bg-[#FAF9F5] text-[#1B4332] shadow-sm" : "hover:bg-[#2D6A4F] hover:bg-opacity-30 text-[#FAF9F5]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 014 0m-3 7h2m-3 3h4" />
              </svg>
              <span>Health Passport</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "settings" ? "bg-[#FAF9F5] text-[#1B4332] shadow-sm" : "hover:bg-[#2D6A4F] hover:bg-opacity-30 text-[#FAF9F5]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Security Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout Bottom */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#D05A3F] text-[#FAF9F5] transition-colors mt-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-[#E6E4DD] h-16 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1A18] capitalize">
              {activeTab === "passport" ? "Medical Passport" : activeTab === "records" ? "My Health Records" : activeTab === "upload" ? "Upload Document" : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-[#2D6A4F] bg-[#E2ECE9] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Protected Session
            </span>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl w-full mx-auto space-y-6">
          
          {message && (
            <div className="bg-[#F0F5F3] border border-[#D5E5DF] text-[#1B4332] px-4 py-3.5 rounded-xl text-sm flex items-start space-x-2 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Records */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm hover:border-[#1B4332] transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#605E59]">Total Folders</p>
                      <h3 className="text-3xl font-bold mt-2 text-[#1A1A18]">{records.length}</h3>
                    </div>
                    <div className="w-10 h-10 bg-[#E2ECE9] rounded-xl flex items-center justify-center text-[#1B4332]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#FAF9F5]">
                    <button onClick={() => setActiveTab("records")} className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center">
                      <span>View document vault</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Uploaded Files */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm hover:border-[#1B4332] transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#605E59]">Uploaded Files</p>
                      <h3 className="text-3xl font-bold mt-2 text-[#1A1A18]">{records.filter(r => r.fileId).length}</h3>
                    </div>
                    <div className="w-10 h-10 bg-[#E2ECE9] rounded-xl flex items-center justify-center text-[#1B4332]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#FAF9F5]">
                    <button onClick={() => setActiveTab("upload")} className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center">
                      <span>Upload record details</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm hover:border-[#1B4332] transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#605E59]">Passport Strength</p>
                      <h3 className="text-3xl font-bold mt-2 text-[#1A1A18]">{calculateProfileCompletion()}%</h3>
                    </div>
                    <div className="w-10 h-10 bg-[#E2ECE9] rounded-xl flex items-center justify-center text-[#1B4332]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#FAF9F5]">
                    <button onClick={() => setActiveTab("passport")} className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center">
                      <span>Complete health details</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>

              {/* Overview Layout: Left (Health Passport Card Overview), Right (Recent Medical Files) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Health Passport Widget */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A18] font-serif-premium">Health Passport</h3>
                    <p className="text-xs text-[#605E59]">Immediate clinical vital card</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E6E4DD]">
                      <p className="text-[10px] font-semibold text-[#605E59] uppercase tracking-wider">Blood Type</p>
                      <p className="text-lg font-bold text-[#1B4332]">{renderValue(profile.bloodGroup)}</p>
                    </div>
                    <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E6E4DD]">
                      <p className="text-[10px] font-semibold text-[#605E59] uppercase tracking-wider">Age</p>
                      <p className="text-lg font-bold text-[#1A1A18]">{profile.age ? `${profile.age} yrs` : "—"}</p>
                    </div>
                    <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E6E4DD]">
                      <p className="text-[10px] font-semibold text-[#605E59] uppercase tracking-wider">Weight</p>
                      <p className="text-lg font-bold text-[#1A1A18]">{profile.weight ? `${profile.weight} kg` : "—"}</p>
                    </div>
                    <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E6E4DD]">
                      <p className="text-[10px] font-semibold text-[#605E59] uppercase tracking-wider">Height</p>
                      <p className="text-lg font-bold text-[#1A1A18]">{profile.height ? `${profile.height} cm` : "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-[#605E59] uppercase tracking-wider">Known Allergies</p>
                    <div className="bg-[#FFF0ED] text-[#9A2C14] border border-[#FAD2C8] px-3.5 py-2.5 rounded-xl text-xs font-medium">
                      {profile.allergies || "No documented allergies"}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("passport")}
                    className="w-full bg-[#FAF9F5] hover:bg-[#E6E4DD] text-[#1B4332] border border-[#E6E4DD] py-2.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Open Health Passport
                  </button>
                </div>

                {/* Recent Documents Table View */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A18] font-serif-premium">Recent Documents</h3>
                      <p className="text-xs text-[#605E59]">Latest uploads in your health container</p>
                    </div>
                    <button onClick={() => setActiveTab("records")} className="text-xs font-semibold text-[#1B4332] hover:underline">
                      View all ({records.length})
                    </button>
                  </div>

                  {records.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#E6E4DD] rounded-2xl">
                      <svg className="mx-auto h-10 w-10 text-[#A3B19B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="text-sm font-semibold text-[#1A1A18] mt-2">No records stored</h4>
                      <p className="text-xs text-[#605E59] mt-1">Add details or files to start tracking history.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#FAF9F5]">
                      {records.slice(0, 4).map((r, i) => (
                        <div key={r.id || r._id || i} className="flex justify-between items-center py-3.5">
                          <div className="flex items-center space-x-3 truncate">
                            <div className="w-9 h-9 bg-[#E2ECE9] text-[#1B4332] rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="truncate">
                              <h5 className="text-sm font-semibold text-[#1A1A18] truncate">{renderValue(r.fileName)}</h5>
                              <p className="text-xs text-[#605E59] truncate">{renderValue(r.doctorName)} • {r.uploadDate ? new Date(r.uploadDate).toLocaleDateString() : "No Date"}</p>
                            </div>
                          </div>
                          
                          {r.fileId ? (
                            <button
                              onClick={() => handleDownload(r.fileId, r.fileName)}
                              className="text-xs font-semibold text-[#1B4332] hover:underline bg-[#E2ECE9] px-3 py-1.5 rounded-lg flex-shrink-0"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#605E59] bg-[#FAF9F5] px-2 py-1 rounded-md">Note Only</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY RECORDS */}
          {activeTab === "records" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Search & Filter Controls */}
              <div className="bg-white rounded-2xl border border-[#E6E4DD] p-5 shadow-sm space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3B19B]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search records by title, clinic, diagnosis, or doctor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FAF9F5]">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterType === "all" ? "bg-[#1B4332] text-[#FAF9F5]" : "bg-[#FAF9F5] border border-[#E6E4DD] text-[#605E59]"
                    }`}
                  >
                    All Records
                  </button>
                  <button
                    onClick={() => setFilterType("pdf")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterType === "pdf" ? "bg-[#1B4332] text-[#FAF9F5]" : "bg-[#FAF9F5] border border-[#E6E4DD] text-[#605E59]"
                    }`}
                  >
                    PDF Reports
                  </button>
                  <button
                    onClick={() => setFilterType("image")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterType === "image" ? "bg-[#1B4332] text-[#FAF9F5]" : "bg-[#FAF9F5] border border-[#E6E4DD] text-[#605E59]"
                    }`}
                  >
                    Prescriptions & Images
                  </button>
                  <button
                    onClick={() => setFilterType("doc")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterType === "doc" ? "bg-[#1B4332] text-[#FAF9F5]" : "bg-[#FAF9F5] border border-[#E6E4DD] text-[#605E59]"
                    }`}
                  >
                    Other Notes
                  </button>
                </div>
              </div>

              {/* Document List */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E6E4DD]">
                  <svg className="animate-spin h-8 w-8 text-[#1B4332] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-[#605E59]">Fetching encrypted documents...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[#E6E4DD]">
                  <svg className="mx-auto h-12 w-12 text-[#A3B19B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-3 text-base font-bold text-[#1A1A18] font-serif-premium">No matching records found</h3>
                  <p className="text-xs text-[#605E59] mt-1 max-w-sm mx-auto">
                    Try checking your search query spelling, change filter options, or upload your first folder.
                  </p>
                  <button onClick={() => setActiveTab("upload")} className="mt-5 px-5 py-2 bg-[#1B4332] text-[#FAF9F5] rounded-xl text-xs font-semibold hover:bg-[#2D6A4F]">
                    Add New Record
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRecords.map((r, idx) => (
                    <div key={r.id || r._id || idx} className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-4 hover:border-[#1B4332] transition-colors relative flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 truncate">
                            <div className="w-10 h-10 bg-[#E2ECE9] text-[#1B4332] rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="truncate">
                              <h4 className="text-sm font-bold text-[#1A1A18] truncate">{renderValue(r.fileName)}</h4>
                              <p className="text-xs text-[#605E59] truncate">{renderValue(r.doctorName)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#FAF9F5]">
                          <p className="text-xs text-[#605E59] font-semibold">Diagnosis/Note</p>
                          <p className="text-xs text-[#1A1A18] mt-1 leading-relaxed line-clamp-3">
                            {r.description || "No description text uploaded with this record."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#FAF9F5] flex items-center justify-between text-xs">
                        <div className="text-[#A3B19B] font-mono text-[10px]">
                          Uploaded: {r.uploadDate ? new Date(r.uploadDate).toLocaleDateString() : "—"}
                        </div>
                        
                        {r.fileId ? (
                          <button
                            onClick={() => handleDownload(r.fileId, r.fileName)}
                            className="bg-[#1B4332] text-[#FAF9F5] hover:bg-[#2D6A4F] px-4 py-2 rounded-xl font-semibold flex items-center space-x-1.5 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download ({r.fileName ? r.fileName.split('.').pop().toUpperCase() : "FILE"})</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#605E59] bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-[#E6E4DD]">Prescription details</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: UPLOAD */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A18] font-serif-premium">Add Medical Record</h3>
                  <p className="text-xs text-[#605E59]">Decrypt keys auto-generate signature upon successful upload</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-1.5">Patient Name Reference</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-1.5">Hospital or Doctor Reference</label>
                      <input
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        placeholder="e.g. Apex Diagnostics"
                        required
                        className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-1.5">Detailed Summary / Diagnosis</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Diagnosed with mild flu, prescribed Paracetamol 650mg thrice daily..."
                      rows={4}
                      className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-1.5">Secure Document Upload</label>
                    <div className="mt-1 border-2 border-dashed border-[#E6E4DD] hover:border-[#1B4332] rounded-2xl p-8 flex flex-col items-center justify-center bg-[#FAF9F5] hover:bg-white transition-all cursor-pointer relative">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="space-y-2 text-center pointer-events-none">
                        <div className="w-12 h-12 bg-[#E2ECE9] text-[#1B4332] rounded-xl flex items-center justify-center mx-auto">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-[#1A1A18]">
                          {file ? file.name : "Select or drag health report here"}
                        </p>
                        <p className="text-xs text-[#605E59]">
                          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Click to change file` : "Supports PDFs, JPGs, or PNG reports up to 10MB"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-[#1B4332] text-[#FAF9F5] py-3.5 px-4 rounded-xl font-semibold hover:bg-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FAF9F5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Encrypting & Uploading...
                      </>
                    ) : (
                      "Encrypt & Upload to Vault"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: HEALTH PASSPORT */}
          {activeTab === "passport" && (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
              
              {/* Profile Card Header */}
              <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-[#1B4332] text-[#FAF9F5] rounded-2xl flex items-center justify-center text-xl font-bold font-serif-premium">
                    {patientName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A18] font-serif-premium">{patientName}</h3>
                    <p className="text-xs text-[#605E59]">Patient Passport ID: {patientId}</p>
                  </div>
                </div>

                <a
                  href="/profile-setup"
                  className="mt-4 md:mt-0 px-4 py-2 border border-[#E6E4DD] text-[#1B4332] rounded-xl text-xs font-semibold hover:bg-[#FAF9F5] transition-colors"
                >
                  Edit Profile Vitals
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section 1: Physical Parameters */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#605E59] border-b border-[#FAF9F5] pb-2">Physical Attributes</h4>
                  
                  <div className="divide-y divide-[#FAF9F5]">
                    <div className="flex justify-between py-2.5 text-sm">
                      <span className="text-[#605E59]">Age</span>
                      <span className="font-semibold text-[#1A1A18]">{profile.age ? `${profile.age} years old` : "—"}</span>
                    </div>
                    <div className="flex justify-between py-2.5 text-sm">
                      <span className="text-[#605E59]">Gender</span>
                      <span className="font-semibold text-[#1A1A18]">{renderValue(profile.gender)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 text-sm">
                      <span className="text-[#605E59]">Height</span>
                      <span className="font-semibold text-[#1A1A18]">{profile.height ? `${profile.height} cm` : "—"}</span>
                    </div>
                    <div className="flex justify-between py-2.5 text-sm">
                      <span className="text-[#605E59]">Weight</span>
                      <span className="font-semibold text-[#1A1A18]">{profile.weight ? `${profile.weight} kg` : "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Clinical Details */}
                <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#605E59] border-b border-[#FAF9F5] pb-2">Clinical Details</h4>
                  
                  <div className="divide-y divide-[#FAF9F5]">
                    <div className="flex justify-between py-2.5 text-sm">
                      <span className="text-[#605E59]">Blood Group</span>
                      <span className="font-bold text-[#1B4332]">{renderValue(profile.bloodGroup)}</span>
                    </div>
                    
                    <div className="py-2.5 space-y-1">
                      <p className="text-xs text-[#605E59]">Documented Allergies</p>
                      <div className="bg-[#FFF0ED] text-[#9A2C14] border border-[#FAD2C8] px-3.5 py-2 rounded-xl text-xs font-semibold">
                        {profile.allergies || "No documented allergies"}
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <p className="text-xs text-[#605E59]">Primary Medical History</p>
                      <p className="text-xs text-[#1A1A18] leading-relaxed">
                        {profile.medicalHistory || "No chronicle clinical conditions stated."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Emergency Contact Block */}
              <div className="bg-[#FFF0ED] border border-[#FAD2C8] rounded-2xl p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#FAF9F5] rounded-xl flex items-center justify-center text-[#D05A3F] border border-[#FAD2C8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-[#9A2C14] uppercase tracking-wider">Emergency SOS Contact</h5>
                  <p className="text-sm font-bold text-[#1A1A18]">{profile.emergencyContact || "No emergency contact declared"}</p>
                  <p className="text-xs text-[#605E59] leading-relaxed">
                    This contact reference will be rendered visible on emergency medical authorization cards in offline configurations.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: SECURITY SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A18] font-serif-premium">Privacy & Security Controls</h3>
                  <p className="text-xs text-[#605E59]">India Digital Personal Data Protection (DPDP) Act Compliance config</p>
                </div>

                <div className="divide-y divide-[#FAF9F5] space-y-4">
                  
                  <div className="pt-4 space-y-2">
                    <h4 className="text-sm font-bold text-[#1A1A18]">Cryptographic Encrypted Containers</h4>
                    <p className="text-xs text-[#605E59] leading-relaxed">
                      All diagnostic folders are encrypted locally at the byte level before uploading. Only authentic patient signature tokens (saved in JWT format) are authorized to download files.
                    </p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h4 className="text-sm font-bold text-[#1A1A18]">Personal Data Deletion Option</h4>
                    <p className="text-xs text-[#605E59] leading-relaxed">
                      Under section 12 of the DPDP act, patients retain absolute consent parameters over record archival. Initiating data erasure removes files permanently from server repositories.
                    </p>
                    <button
                      onClick={() => alert("Deletion feature is governed by system administrators. Contact help@medrecords.in")}
                      className="px-4 py-2 border border-[#D05A3F] text-[#D05A3F] rounded-xl text-xs font-semibold hover:bg-[#FFF0ED] transition-colors"
                    >
                      Request Complete Account Erasure
                    </button>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h4 className="text-sm font-bold text-[#1A1A18]">Connected Devices</h4>
                    <p className="text-xs text-[#605E59] leading-relaxed">
                      Active patient identification token: <code className="bg-[#FAF9F5] px-1.5 py-0.5 rounded text-[11px] font-mono">{patientId}</code>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-[#E6E4DD] bg-[#FAF9F5] flex items-center justify-between px-6 md:px-8 text-xs text-[#605E59]">
          <span>MedRecords Lifelong Archive</span>
          <span>HIPAA & DPDP Act 2023 Compliant</span>
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
