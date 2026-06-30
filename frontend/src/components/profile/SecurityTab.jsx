import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SecurityTab() {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Chrome - Windows',
      location: 'Ho Chi Minh City, Vietnam',
      status: 'Active Now',
      ip: '192.168.1.1',
      isCurrent: true
    },
    {
      id: 2,
      device: 'iPhone 14 Pro - Safari',
      location: 'Hanoi, Vietnam',
      status: '2 hours ago',
      ip: '192.168.1.2',
      isCurrent: false
    }
  ]);

  const isMinLength = passwordData.newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
  const hasLowercase = /[a-z]/.test(passwordData.newPassword);
  const hasNumber = /[0-9]/.test(passwordData.newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordData.newPassword);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [showPasswords, passwordStrength, sessions, isMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      let strength = 0;
      if (value.length >= 8) strength += 20;
      if (/[A-Z]/.test(value)) strength += 20;
      if (/[a-z]/.test(value)) strength += 20;
      if (/[0-9]/.test(value)) strength += 20;
      if (/[^A-Za-z0-9]/.test(value)) strength += 20;
      setPasswordStrength(strength);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    if (passwordStrength < 100) {
      alert('Password does not meet all requirements!');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      alert('New password must be different from current password!');
      return;
    }

    setUpdateSuccess(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordStrength(0);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleLogoutSession = (sessionId) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const handleLogoutCurrent = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleLogoutAll = () => {
    setSessions(sessions.filter(session => session.isCurrent));
    alert('All other sessions have been logged out');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 20) return 'Weak';
    if (passwordStrength <= 40) return 'Fair';
    if (passwordStrength <= 60) return 'Good';
    if (passwordStrength <= 80) return 'Strong';
    return 'Very Strong';
  };
    const renderStatusIcon = (isValid) => {
    if (isValid) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Left Column - Change Password Section (Kích thước vừa vặn cân bằng) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-[#5e4db2] font-semibold text-gray-900 text-base tracking-tight">Change Password</h2>

        {updateSuccess && (
          <div className="p-3 text-sm bg-green-100 text-green-700 rounded-lg font-medium">
            Password updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2D1B4E] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="w-4 h-4" data-lucide={showPasswords.current ? 'eye-off' : 'eye'}></i>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2D1B4E] pr-12 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="w-4 h-4" data-lucide={showPasswords.new ? 'eye-off' : 'eye'}></i>
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="mt-2 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-medium">Password Strength</span>
                  <span className={`font-bold ${passwordStrength === 100 ? 'text-green-600' : 'text-gray-600'}`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2D1B4E] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="w-4 h-4" data-lucide={showPasswords.confirm ? 'eye-off' : 'eye'}></i>
              </button>
            </div>
          </div>

          {/* Password Requirements List */}
            <div className="pt-1">
              <p className="text-xs font-bold text-gray-800 mb-1">Password Requirements:</p>
              <ul className="space-y-0.5 text-xs">
                <li className={`flex items-center gap-2 px-2 py-0.5 transition-all ${isMinLength ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                  {renderStatusIcon(isMinLength)}
                  <span>Minimum 8 characters</span>
                </li>
                <li className={`flex items-center gap-2 px-2 py-0.5 transition-all ${hasUppercase ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                  {renderStatusIcon(hasUppercase)}
                  <span>One uppercase letter</span>
                </li>
                <li className={`flex items-center gap-2 px-2 py-0.5 transition-all ${hasLowercase ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                  {renderStatusIcon(hasLowercase)}
                  <span>One lowercase letter</span>
                </li>
                <li className={`flex items-center gap-2 px-2 py-0.5 transition-all ${hasNumber ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                  {renderStatusIcon(hasNumber)}
                  <span>One number</span>
                </li>
                <li className={`flex items-center gap-2 px-2 py-0.5 transition-all ${hasSpecialChar ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                  {renderStatusIcon(hasSpecialChar)}
                  <span>One special character</span>
                </li>
              </ul>
            </div>

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2.5 bg-[#2D1B4E] text-white text-[15px] font-semibold rounded-lg hover:bg-opacity-95 shadow-sm active:scale-[0.99] transition-all"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Right Column - Active Sessions Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-[#5e4db2] font-semibold text-gray-900 tracking-tight">Active Sessions</h2>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2D1B4E] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="w-4 h-4 text-white" data-lucide="monitor"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-xs">{session.device}</p>
                  <p className="text-xs text-gray-500">{session.location}</p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">IP: {session.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                {session.isCurrent && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold rounded-full text-[10px] uppercase tracking-wider">Current</span>
                )}
                <span className="text-gray-500 font-medium">{session.status}</span>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-all"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2 text-xs font-semibold">
          <button
            onClick={handleLogoutCurrent}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-[13px] rounded-lg hover:bg-red-700 transition-all shadow-sm"
          >
            Logout Current Device
          </button>
          <button
            onClick={handleLogoutAll}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 text-[13px] rounded-lg hover:bg-gray-300 transition-all"
          >
            Logout All Sessions
          </button>
        </div>
      </div>
    </div>
  );
}