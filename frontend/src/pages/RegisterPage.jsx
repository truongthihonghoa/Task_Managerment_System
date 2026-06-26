import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompleteAccount() {
  const navigate = useNavigate();
  // Quản lý dữ liệu Form
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  // Trạng thái ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trạng thái xử lý form và hiển thị màn hình thành công
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Kiểm tra điều kiện mật khẩu độc lập
  const requirements = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  // Tính toán độ mạnh của mật khẩu dựa trên số lượng điều kiện thỏa mãn
  const calculateStrength = () => {
    const score = Object.values(requirements).filter(Boolean).length;
    if (!formData.password) return { text: 'Weak', barWidth: '20%', colorClass: 'bg-error text-error' };
    if (score <= 2) return { text: 'Weak', barWidth: '33%', colorClass: 'bg-[#ba1a1a] text-[#ba1a1a]' };
    if (score <= 4) return { text: 'Medium', barWidth: '66%', colorClass: 'bg-[#943700] text-[#943700]' };
    return { text: 'Strong', barWidth: '100%', colorClass: 'bg-[#004ac6] text-[#004ac6]' };
  };

  const strength = calculateStrength();

  // Xử lý thay đổi Input
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Xử lý Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsProcessing(true);

    // Giả lập gọi API 1.5s
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Sau 2s hiện success → chuyển về Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  };

  // MÀN HÌNH THÀNH CÔNG (SUCCESS STATE)
  if (isSuccess) {
    return (
      <section className="fixed inset-0 z-50 bg-[#faf8ff] flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] text-center space-y-6 animate-fade-in">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-[#004ac6]/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-[#004ac6] text-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-[36px] font-bold text-[#191b23] tracking-tight">Welcome Aboard!</h2>
            <p className="text-[16px] text-[#434655]">
              Your TaskFlow account is ready. We're redirecting you to your workspace now.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#004ac6] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#004ac6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#004ac6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-[12px] font-medium text-[#737686] tracking-widest uppercase">
              Initializing Workspace
            </span>
          </div>
        </div>
      </section>
    );
  }

  // GIAO DIỆN CHÍNH (Đã đồng bộ hóa chiều ngang max-w-[500px] và màu nền trơn)
  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen flex flex-col font-sans">
      <main className="flex-grow px-6 pt-8 pb-24 mt-0">
        <div className="w-full max-w-[500px] mx-auto bg-white border border-[#c3c6d7] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.05)] rounded-[20px] overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Header Section */}
            <header className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#dbe1ff] text-[#004ac6] mb-2">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="text-[24px] font-semibold text-[#191b23] tracking-tight">Complete Your Account</h1>
                <p className="text-[14px] text-[#434655] px-4">
                  Your email has been successfully verified. Complete your profile to start using TaskFlow.
                </p>
              </div>
              {/* Verified Email Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#ededf9] rounded-full border border-[#c3c6d7]/30">
                <span className="text-[13px] font-medium text-[#434655]">user@example.com</span>
                <span className="material-symbols-outlined text-[16px] text-[#004ac6]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </header>

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#434655] block" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">person</span>
                  <input
                    className="w-full pl-12 pr-4 py-[10px] bg-[#faf8ff] rounded-lg border border-[#c3c6d7] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-all text-[14px]"
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#434655] block" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">lock</span>
                  <input
                    className="w-full pl-12 pr-12 py-[10px] bg-[#faf8ff] rounded-lg border border-[#c3c6d7] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-all text-[14px]"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191b23] transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Strength Meter */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#434655]">
                    Strength: <span className={`font-semibold ${strength.colorClass.split(' ')[1]}`}>{strength.text}</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#e1e2ed] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ease-in-out ${strength.colorClass.split(' ')[0]}`}
                    style={{ width: strength.barWidth }}
                  ></div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#434655] block" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">lock</span>
                  <input
                    className="w-full pl-12 pr-12 py-[10px] bg-[#faf8ff] rounded-lg border border-[#c3c6d7] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-all text-[14px]"
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191b23] transition-colors"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Password Checklist */}
              <div className="grid gap-y-2 bg-[#f3f3fe] p-4 rounded-lg border border-[#c3c6d7]/20">
                {[
                  { key: 'length', label: 'Minimum 8 characters' },
                  { key: 'upper', label: 'One uppercase letter' },
                  { key: 'lower', label: 'One lowercase letter' },
                  { key: 'number', label: 'One number' },
                  { key: 'special', label: 'One special character' },
                ].map((req) => (
                  <div key={req.key} className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-[16px] transition-all`}
                      style={{ fontVariationSettings: requirements[req.key] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {requirements[req.key] ? 'check_circle' : 'circle'}
                    </span>
                    <span className="text-[12px] text-[#434655]">{req.label}</span>
                  </div>
                ))}
              </div>

              {/* Submit CTA Button */}
              <button
                className="w-full py-4 px-6 bg-[#4B3277] hover:bg-[#3d2861] text-white font-semibold text-[18px] rounded-lg shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Support Link */}
        <p className="text-center mt-6 text-[14px] text-[#434655]">
          Already have an account?{' '}
          <a className="text-[#004ac6] font-semibold hover:underline transition-all duration-200" href="#">
            Sign In
          </a>
        </p>
      </main>
    </div>
  );
}