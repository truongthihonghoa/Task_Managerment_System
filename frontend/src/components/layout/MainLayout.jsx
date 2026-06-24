import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tự động kích hoạt Lucide Icons từ CDN khi component mount
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden font-['Inter'] bg-[#F5F7FA]">
      
      {/* Cấu trúc Style nội bộ để giữ nguyên các hiệu ứng CSS cũ */}
      <style>{`
        .sidebar-active-indicator {
          width: 4px;
          height: 38px;
          background-color: #4C2B74;
          border-radius: 0 4px 4px 0;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>

      {/* BEGIN: LeftSidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#F6F7FF] border-r border-gray-200 flex flex-col h-full z-20 transition-all duration-300 overflow-hidden`} data-purpose="main-navigation">
        
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#4C2B74] rounded-lg flex items-center justify-center">
            <i className="text-white w-6 h-6" data-lucide="check-square"></i>
          </div>
          <div>
            <h1 className="text-[#4C2B74] font-bold text-sm leading-tight">TaskFlow</h1>
            <p className="text-[#6B7280] text-[10px]">Productivity Pro</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl group transition-colors" href="#">
            <i className="w-5 h-5 mr-3" data-lucide="layout-grid"></i>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          
          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl group transition-colors justify-between" href="#">
            <div className="flex items-center">
              <i className="w-5 h-5 mr-3" data-lucide="clipboard-list"></i>
              <span className="text-sm font-medium">Tasks</span>
            </div>
            <span className="bg-[#EADFF9] text-[#2D1B4E] text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
          </a>

          {/* Active Item: Users (Sửa đổi chuẩn góc bo rounded-xl và màu nền gốc) */}
          <div className="relative flex items-center">
            <div className="sidebar-active-indicator"></div>
            <a className="flex items-center flex-1 px-4 py-3 bg-[#E0E8FF] text-[#4C2B74] rounded-xl transition-colors ml-2" href="#">
              <i className="w-5 h-5 mr-3 text-[#4C2B74]" data-lucide="users"></i>
              <span className="text-sm font-bold">Users</span>
            </a>
          </div>

          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" href="#">
            <i className="w-5 h-5 mr-3" data-lucide="user-circle"></i>
            <span className="text-sm font-medium">Profile</span>
          </a>

          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors justify-between" href="#">
            <div className="flex items-center">
              <i className="w-5 h-5 mr-3" data-lucide="bell"></i>
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <div className="w-2 h-2 bg-[#EF4444] rounded-full mr-1"></div>
          </a>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-6 border-t border-gray-100 space-y-1">
          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" href="#">
            <i className="w-5 h-5 mr-3" data-lucide="help-circle"></i>
            <span className="text-sm font-medium">Help</span>
          </a>
          <a className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" href="#">
            <i className="w-5 h-5 mr-3" data-lucide="settings"></i>
            <span className="text-sm font-medium">Settings</span>
          </a>
        </div>
      </aside>
      {/* END: LeftSidebar */}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* BEGIN: MainHeader */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10" data-purpose="top-header">
          <div className="flex items-center flex-1 max-w-xl">
            <button 
              className="p-2 mr-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="w-6 h-6" data-lucide="menu"></i>
            </button>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="h-4 w-4 text-gray-400" data-lucide="search"></i>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2D1B4E] focus:border-[#2D1B4E]" 
                placeholder="Search" 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Create Button */}
            <button className="bg-[#4C2B74] text-white px-4 py-2 rounded-lg flex items-center text-sm font-semibold hover:bg-opacity-90 transition-all">
              <i className="w-4 h-4 mr-2" data-lucide="plus"></i>
              Create
            </button>
            
            {/* Notification Bell */}
            <button className="relative text-gray-500 hover:text-gray-700">
              <i className="w-6 h-6" data-lucide="bell"></i>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="w-10 h-10 rounded-full bg-purple-100 border border-[#2D1B4E] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center">
                  <span className="text-[#2D1B4E] text-xs font-bold">AM</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800">Alex Morgan</span>
            </div>
          </div>
        </header>
        {/* END: MainHeader */}

        {/* BEGIN: MainContentArea */}
        <main className="flex-1 flex flex-col" data-purpose="main-display">
        {/* Render nested route components */}
        <Outlet />
        {/* Centered Illustration Placeholder */}
        <div className="flex flex-col items-center justify-center opacity-20">
          <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg fill="none" height="240" viewBox="0 0 240 240" width="240" xmlns="http://www.w3.org/2000/svg">
                  <path d="M120 40L40 85L120 130L200 85L120 40Z" fill="#2D1B4E" fillOpacity="0.2"></path>
                  <path d="M40 115L120 160L200 115M40 145L120 190L200 145" stroke="#2D1B4E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
                  <path d="M120 40L40 85L120 130L200 85L120 40Z" stroke="#2D1B4E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
                </svg>
              </div>
            </div>
          </div>
        </main>
        {/* END: MainContentArea */}

      </div>
    </div>
  );
}