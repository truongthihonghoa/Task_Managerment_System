import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function PreferencesTab() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'gmt7'
  });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', action: null });

  // Tự động kích hoạt Lucide Icons/Material Symbols nếu cần
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [preferences]);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' }
  ];
// Đặt đoạn này ở ngoài component chính PreferencesTab
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Lớp nền tối */}
      <div className="absolute inset-0 bg-[#091E42]/50 backdrop-blur-[3px]" onClick={onCancel}></div>

      {/* Hộp thoại */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <i className="material-symbols-outlined text-red-600">warning</i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Confirm</button>
          </div>
        </div>
      </div>
    </div>,
    document.body // Dòng quan trọng nhất: đẩy Modal ra body
  );
};
    const handleDeleteAccount = () => {
        setModalConfig({
          isOpen: true,
          title: "Delete Account",
          message: "Are you sure you want to permanently delete your account? This action cannot be undone.",
          action: () => {
            // Thực hiện logic xóa tài khoản ở đây
            console.log("Account deleted");
          }
        });
      };
  const timezones = [
    { value: 'gmt7', label: 'GMT+7 (Vietnam)' },
    { value: 'utc', label: 'UTC (Universal Time)' }
  ];

  const handleLanguageChange = (e) => {
    setPreferences({
      ...preferences,
      language: e.target.value
    });
  };

  const handleTimezoneChange = (e) => {
    setPreferences({
      ...preferences,
      timezone: e.target.value
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  return (
    <div className="tab-content space-y-8" id="preferences">
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Cột Trái: Chỉ còn Localization Settings */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Localization Settings */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 soft-shadow overflow-hidden">
            <div className="pb-4 border-b border-outline-variant flex items-center gap-2 mb-6">
              <h3 className="font-title-md text-title-md font-semibold text-on-surface">Localization Settings</h3>
            </div>

            <div className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Language</label>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Select the language you want to use throughout the application. The interface text, menu labels, and system messages will be displayed based on your selected language.
                </p>
                <div className="relative max-w-full">
                  <select
                    id="pref-language"
                    value={preferences.language}
                    onChange={handleLanguageChange}
                    className="w-full bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4C2B74] focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">expand_more</span>
                </div>
                <p className="text-[11px] text-on-surface-variant italic">You can change the application language at any time.</p>
              </div>

              <hr className="border-outline-variant" />

              {/* Time Zone Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Time Zone</label>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Choose your local time zone to ensure task deadlines, activity timestamps, and system records are displayed accurately according to your region.
                </p>
                <div className="relative max-w-full">
                  <select
                    id="pref-timezone"
                    value={preferences.timezone}
                    onChange={handleTimezoneChange}
                    className="w-full bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4C2B74] focus:border-transparent outline-none appearance-none cursor-pointer transition-all"                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">schedule</span>
                </div>
                <p className="text-[11px] text-on-surface-variant italic">Your selected time zone will be applied to task schedules and date-related information.</p>
              </div>
            </div>

            <div className="border-t border-outline-variant flex justify-end">
              <button
                id="btn-save-preferences"
                onClick={handleSavePreferences}
                className="bg-[#4C2B74] mt-4 text-white font-semibold text-[15px] px-5 py-2 rounded-lg hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>

        </div>

        {/* Cột Phải: Gồm Quick Summary và Delete Account thế chỗ cho hình ảnh cũ */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Quick Summary Card */}
          <div className="bg-surface-container-high/40 p-5 rounded-xl border border-outline-variant backdrop-blur-sm">
            <h4 className="font-title-md text-title-md font-bold text-on-surface mb-4">Quick Summary</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Account Status</p>
                  <p className="text-xs text-on-surface-variant">Active • Enterprise</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">update</span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Last Activity</p>
                  <p className="text-xs text-on-surface-variant">2 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">devices</span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">Signed-in Devices</p>
                  <p className="text-xs text-on-surface-variant">3 current sessions</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Delete Account (Được dời từ cột trái sang vị trí của hình ảnh cũ bên cột phải) */}
          <div className="bg-[#fdf2f2] rounded-xl border border-error/20 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-error/10 bg-error/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-xl">warning</span>
              <h3 className="font-title-md text-title-md font-semibold text-error">Delete Account</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Deleting your account will permanently remove your personal information, account settings, and access to the Task Management System. This action cannot be undone.
              </p>
              <p className="text-xs text-error font-bold">
                Please make sure you have completed any required tasks before deleting your account.
              </p>
              <div className="flex justify-end">
                {/* Nút Delete Account trong phần JSX bên phải */}
                  <button
                    id="btn-delete-account"
                    onClick={handleDeleteAccount}
                    className="bg-error text-white font-semibold text-xs px-5 py-2 rounded-lg hover:bg-[#93000a] active:scale-[0.98] transition-colors shadow-sm"
                  >
                    Delete Account
                  </button>
              </div>
            </div>
          </div>

        </div>

      </div>
      <ConfirmationModal
        {...modalConfig}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={() => {
          modalConfig.action();
          setModalConfig({ ...modalConfig, isOpen: false });
        }}
      />
    </div>
  );
}