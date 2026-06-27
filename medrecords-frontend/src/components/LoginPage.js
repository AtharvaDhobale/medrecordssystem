// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPatient } from "../api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const data = await loginPatient(email, password);
      if (data.token) {
        localStorage.setItem("patientId", data.patient.id);
        localStorage.setItem("patientName", data.patient.name);
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      setMessage(err.message || "Connection refused. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row">
      {/* Left Panel - Hero Branding (Visible on md and up) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1B4332] p-16 flex-col justify-between text-[#FAF9F5] relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-[#2D6A4F] opacity-30 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-[#081C15] opacity-20 blur-3xl"></div>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 bg-[#FAF9F5] text-[#1B4332] rounded-xl flex items-center justify-center shadow-lg font-bold text-xl">
            M
          </div>
          <span className="text-xl font-bold tracking-wide">MedRecords</span>
        </div>

        {/* Value Prop */}
        <div className="my-auto max-w-lg z-10 space-y-6">
          <span className="text-[#A3B19B] text-xs font-semibold uppercase tracking-wider bg-[#2D6A4F] bg-opacity-30 px-3 py-1.5 rounded-full">
            HIPAA Compliant System
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-serif-premium">
            Secure Digital Hub for Lifelong Medical Record Retention.
          </h1>
          <p className="text-[#D8E2DC] text-base leading-relaxed">
            Take full ownership of your health records. MedRecords secures, encrypts, and retains your diagnostics, doctor prescriptions, and medical history in an easily accessible portal.
          </p>
        </div>

        {/* Footer Notes */}
        <div className="flex justify-between items-center text-xs text-[#A3B19B] border-t border-[#2D6A4F] pt-6 z-10">
          <span>© 2026 MedRecords System</span>
          <span>India DPDP Compliant</span>
        </div>
      </div>

      {/* Right Panel - Form (Always Visible) */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="text-center md:hidden mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1B4332] text-[#FAF9F5] rounded-2xl mb-3 shadow-md font-bold text-lg">
              M
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A18]">MedRecords</h2>
            <p className="text-xs text-[#605E59]">Secure Medical Record Retention</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#1A1A18] tracking-tight">Welcome back</h2>
            <p className="text-sm text-[#605E59]">
              Please sign in to access your secure health panel.
            </p>
          </div>

          {message && (
            <div className="bg-[#FFF0ED] border border-[#FAD2C8] text-[#9A2C14] px-4 py-3.5 rounded-xl text-sm flex items-start space-x-2 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 text-[#D05A3F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3B19B]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#E6E4DD] rounded-xl bg-white text-[#1A1A18] placeholder-[#A3A19B] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#605E59]">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#2D6A4F] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3B19B]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#E6E4DD] rounded-xl bg-white text-[#1A1A18] placeholder-[#A3A19B] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1B4332] text-[#FAF9F5] py-3.5 px-4 rounded-xl font-medium hover:bg-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FAF9F5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Decrypting...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-[#605E59]">
              New to MedRecords?{" "}
              <a href="/register" className="font-semibold text-[#1B4332] hover:text-[#2D6A4F] hover:underline transition-colors">
                Create an account
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
