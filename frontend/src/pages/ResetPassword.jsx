import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [strength, setStrength] = useState({
    label: 'Strength: None',
    width: '0%',
    colorClass: 'bg-slate-200',
  });

  useEffect(() => {
    const password = newPassword;

    const currentChecks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setChecks(currentChecks);

    const score = Object.values(currentChecks).filter(Boolean).length;

    if (password.length === 0) {
      setStrength({ label: 'Strength: None', width: '0%', colorClass: 'bg-slate-200' });
    } else if (score < 3) {
      setStrength({ label: 'Strength: Weak', width: '33%', colorClass: 'bg-red-500' });
    } else if (score < 5) {
      setStrength({ label: 'Strength: Medium', width: '66%', colorClass: 'bg-amber-400' });
    } else {
      setStrength({ label: 'Strength: Strong', width: '100%', colorClass: 'bg-emerald-500' });
    }
  }, [newPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password does not meet requirements.');
      return;
    }
    alert('Password reset successfully! Redirecting to login...');
    navigate('/');
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col font-sans antialiased">

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-[440px]">

          {/* Icon + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-4">
              <svg className="h-6 w-6 text-[#4B3277]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Password</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your new password must be different from your previous password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  className="block w-full px-4 py-3 bg-[#fdfcff] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4B3277] focus:border-[#4B3277] text-sm placeholder-slate-400 transition-all outline-none pr-11"
                  id="new-password"
                  placeholder="Enter new password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  type="button"
                  aria-label="Toggle password visibility"
                >
                  {showNewPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {strength.label}
                </span>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ease-in-out ${strength.colorClass}`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="block w-full px-4 py-3 bg-[#fdfcff] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4B3277] focus:border-[#4B3277] text-sm placeholder-slate-400 transition-all outline-none pr-11"
                  id="confirm-password"
                  placeholder="Repeat new password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password Requirements
              </p>
              <ul className="space-y-1.5">
                {[
                  { key: 'length', label: 'Minimum 8 characters' },
                  { key: 'upper',  label: 'One uppercase letter' },
                  { key: 'lower',  label: 'One lowercase letter' },
                  { key: 'number', label: 'One number' },
                  { key: 'special',label: 'One special character' },
                ].map(({ key, label }) => (
                  <li key={key} className={`flex items-center gap-2 text-xs transition-colors ${checks[key] ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {checks[key] ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      )}
                    </svg>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3.5 px-4 bg-[#4B2C7F] hover:bg-[#3d2368] text-white font-semibold rounded-lg transition-colors duration-200 shadow-md active:scale-[0.98]"
              type="submit"
            >
              Reset Password
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              to="/"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 tracking-widest font-semibold bg-white">
        <div>© 2026 TaskFlow Enterprise. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-slate-600 transition-colors" href="/privacy">Privacy Policy</a>
          <a className="hover:text-slate-600 transition-colors" href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}