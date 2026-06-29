import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const location = useLocation();
  const email = location.state?.email || 'your email address';
  const flow = location.state?.flow || 'forgot';

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    console.log("Mã OTP đã nhập:", otpCode);
    if (flow === 'register') {
      navigate('/register', { state: { email } });
    } else {
      navigate('/reset-password', { state: { email } });
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col font-sans antialiased">
      {/* Khối nội dung chính - ĐÃ ĐỒNG BỘ CHUẨN LOGIN: flex items-center justify-center p-6 */}
      <main className="flex-grow flex items-center justify-center p-6">
        {/* Card wrapper - p-8 md:p-12 tương tự LoginPage */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-[440px]">
          
          {/* Icon and Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-6">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We sent a 6-digit verification code to<br />
              <span className="font-medium text-gray-700 break-all">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP Input Grid */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-full h-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-[#4B3277] focus:ring-2 focus:ring-[#4B3277] transition-all outline-none bg-white p-0"
                  placeholder="-"
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* Countdown Timer */}
            <div className="text-center mb-8 flex items-center justify-center space-x-1 text-blue-600 font-medium text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>01:59</span>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              className="w-full bg-[#4B3277] hover:bg-[#3d2861] text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 mb-6 shadow-md shadow-purple-200"
            >
              Verify OTP
            </button>
          </form>

          {/* Resend Link */}
          <div className="text-center text-sm text-gray-500 mb-10">
            Didn't receive the code?<br />
            <button type="button" className="text-gray-400 hover:text-gray-600 font-medium transition-colors mt-1">
              Resend Code
            </button>
          </div>

          {/* Secure Footer within Card */}
          <div className="border-t border-gray-50 pt-6 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span>Secure Verification</span>
          </div>

        </section>
      </main>
    </div>
  );
}