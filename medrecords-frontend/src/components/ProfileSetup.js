import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    bloodGroup: "",
    weight: "",
    height: "",
    gender: "",
    emergencyContact: "",
    medicalHistory: "",
    allergies: ""
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
    // Here you would save the profile data to the backend
    // For now, we'll just navigate to dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-600">Let's start with some basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            placeholder="Enter your height"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter your weight"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
        <p className="text-gray-600">Help us understand your medical background</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
        <select
          value={formData.bloodGroup}
          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
        >
          <option value="">Select blood group</option>
          {bloodGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
        <textarea
          placeholder="List any allergies you have (e.g., Penicillin, Nuts, Pollen)"
          value={formData.allergies}
          onChange={(e) => handleInputChange('allergies', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
        <textarea
          placeholder="Briefly describe any significant medical history (e.g., Diabetes, Heart condition)"
          value={formData.medicalHistory}
          onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105 resize-none"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contact</h2>
        <p className="text-gray-600">Who should we contact in case of emergency?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
        <input
          type="text"
          placeholder="Name and phone number of emergency contact"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:scale-105"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Privacy Notice</h3>
            <p className="text-sm text-blue-700 mt-1">
              All your medical information is encrypted and stored securely. 
              Only you and authorized healthcare providers can access this data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {step} of 3 - {step === 1 ? 'Basic Information' : step === 2 ? 'Medical Information' : 'Emergency Contact'}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
