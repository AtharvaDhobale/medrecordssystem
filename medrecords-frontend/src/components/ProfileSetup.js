// src/components/ProfileSetup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [step, setStep] = useState(1);
  const patientId = localStorage.getItem("patientId") || "default";
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(`patientProfile_${patientId}`);
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleComplete = async () => {
    setIsLoading(true);
    // Save to local storage for dynamic rendering on the dashboard
    localStorage.setItem(`patientProfile_${patientId}`, JSON.stringify(formData));
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#E2ECE9] text-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          1
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A18] font-serif-premium">Basic Information</h2>
        <p className="text-sm text-[#605E59]">Help us document your physical attributes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Age</label>
          <input
            type="number"
            placeholder="e.g. 28"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">Select gender</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Height (cm)</label>
          <input
            type="number"
            placeholder="e.g. 175"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Weight (kg)</label>
          <input
            type="number"
            placeholder="e.g. 70"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#E2ECE9] text-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          2
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A18] font-serif-premium">Medical Information</h2>
        <p className="text-sm text-[#605E59]">Help clinical providers understand your history</p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Blood Group</label>
        <select
          value={formData.bloodGroup}
          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
          className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200 bg-white"
        >
          <option value="">Select blood group</option>
          {bloodGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Allergies</label>
        <textarea
          placeholder="List any known allergies (e.g. Penicillin, Pollen, Peanuts)"
          value={formData.allergies}
          onChange={(e) => handleInputChange('allergies', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Medical History</label>
        <textarea
          placeholder="Briefly list existing conditions (e.g. Hypertension, Asthma, Type 2 Diabetes)"
          value={formData.medicalHistory}
          onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#E2ECE9] text-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          3
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A18] font-serif-premium">Emergency Contact</h2>
        <p className="text-sm text-[#605E59]">In case of emergencies, who should we notify?</p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">Contact Name & Phone</label>
        <input
          type="text"
          placeholder="e.g. Jane Doe - 9876543210"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          className="w-full px-4 py-3 border border-[#E6E4DD] rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="bg-[#F0F5F3] border border-[#D5E5DF] rounded-xl p-5">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-[#2D6A4F] mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-[#1B4332]">Security & Privacy</h3>
            <p className="text-xs text-[#605E59] mt-1 leading-relaxed">
              This information is stored on your secure medical file container. It is fully encrypted at rest and is only visible to you and clinic entities you choose to authorize.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Progress Tracker Bar */}
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-md">
            <div className="flex items-center space-x-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 1 ? 'bg-[#1B4332] text-[#FAF9F5]' : 'bg-[#E6E4DD] text-[#605E59]'
              }`}>
                1
              </span>
              <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[#1B4332]' : 'bg-[#E6E4DD]'}`}></div>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 2 ? 'bg-[#1B4332] text-[#FAF9F5]' : 'bg-[#E6E4DD] text-[#605E59]'
              }`}>
                2
              </span>
              <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-[#1B4332]' : 'bg-[#E6E4DD]'}`}></div>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 3 ? 'bg-[#1B4332] text-[#FAF9F5]' : 'bg-[#E6E4DD] text-[#605E59]'
              }`}>
                3
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-[#605E59] hover:text-[#1B4332] transition-colors"
            >
              Skip configuration
            </button>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-2xl border border-[#E6E4DD] p-8 shadow-sm animate-fade-in">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Action Row */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#FAF9F5]">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="px-5 py-2.5 border border-[#E6E4DD] rounded-xl text-sm font-semibold text-[#605E59] hover:bg-[#FAF9F5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex space-x-3 items-center">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#1B4332] text-[#FAF9F5] rounded-xl text-sm font-semibold hover:bg-[#2D6A4F] transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-[#1B4332] text-[#FAF9F5] rounded-xl text-sm font-semibold hover:bg-[#2D6A4F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FAF9F5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finalizing...
                    </>
                  ) : (
                    "Save & Finish"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#605E59]">
            Step {step} of 3 • MedRecords Patient Setup Wizard
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProfileSetup;
