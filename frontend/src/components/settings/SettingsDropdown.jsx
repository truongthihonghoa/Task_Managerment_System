import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, ChevronRight } from 'lucide-react';

const SettingsDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/dashboard/${path}${location.search}`);
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 py-0">

      {/* Menu Items */}
      <div>
        <button
          onClick={(e) => handleNavigate('settings/general', e)}
          className={`w-full px-4 py-3 flex items-center justify-between text-left text-sm transition-colors duration-200 ${location.pathname.includes('/dashboard/settings/general') ? 'bg-[#E0E8FF] text-[#2D1B4E]' : 'text-gray-700 hover:text-blue-700'}`}
        >
          <div className="flex items-center space-x-3">
            <i className={`w-4 h-4 ${location.pathname.includes('/dashboard/settings/general') ? 'text-[#2D1B4E]' : 'font-bold'}`} data-lucide="layout-grid" style={location.pathname.includes('/dashboard/settings/general') ? { strokeWidth: '2.5' } : {}}></i>
            <span className={`font-medium ${location.pathname.includes('/dashboard/settings/general') ? 'font-bold' : ''}`}>General</span>
          </div>
        </button>

        <button
          onClick={(e) => handleNavigate('notification-settings', e)}
          className={`w-full px-4 py-3 flex items-center justify-between text-left text-sm transition-colors duration-200 ${location.pathname.includes('/dashboard/notification-settings') ? 'bg-[#E0E8FF] text-[#2D1B4E]' : 'text-gray-700 hover:text-blue-700'}`}
        >
          <div className="flex items-center space-x-3">
            <i className={`w-4 h-4 ${location.pathname.includes('/dashboard/notification-settings') ? 'text-[#2D1B4E]' : 'font-bold'}`} data-lucide="bell" style={location.pathname.includes('/dashboard/notification-settings') ? { strokeWidth: '2.5' } : {}}></i>
            <span className={`font-medium ${location.pathname.includes('/dashboard/notification-settings') ? 'font-bold' : ''}`}>Notifications</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsDropdown;
