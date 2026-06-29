import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import taskflowLogo from '../../assets/taskflow-logo.png';
import CreateTaskModal from '../tasks/CreateTaskModal';
 
export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tasksForModal, setTasksForModal] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const roleParam = searchParams.get('role')?.toUpperCase();
  const currentRole = roleParam === 'USER' ? 'USER' : 'ADMIN';

  // Tự động kích hoạt Lucide Icons từ CDN khi component mount
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [location.pathname]); // Re-create icons when path changes
 
  const isDashboardActive = location.pathname === '/dashboard';
  const isTasksActive = location.pathname === '/dashboard/spaces' || location.pathname.includes('/dashboard/tasks');
  const isUsersActive = location.pathname === '/dashboard/users';
 
  return (
    <div className="h-screen flex overflow-hidden font-['Inter'] bg-[#F5F7FA]">
 
      {/* Cấu trúc Style nội bộ để giữ nguyên các hiệu ứng CSS cũ */}
      <style>{`
        .sidebar-active-indicator {
          width: 4px;
          height: 38px;
          background-color: #2D1B4E;
          border-radius: 0 4px 4px 0;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
 
      {/* BEGIN: LeftSidebar */}
      <aside className={`bg-[#F6F7FF] border-r border-gray-200 flex flex-col h-full z-20 transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0 border-r-0'}`} data-purpose="main-navigation">
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2D1B4E] rounded-lg flex items-center justify-center border-[3px] border-[#2D1B4E] overflow-hidden">
            <img alt="TaskFlow Logo" className="w-[50px] h-[50px] max-w-none object-contain scale-[1.35]" src={taskflowLogo} />
          </div>
          <div>
            <h1 className="text-[#2D1B4E] font-bold text-sm leading-tight">TaskFlow</h1>
            <p className="text-[#6B7280] text-[10px]">Productivity Pro</p>
          </div>
        </div>
 
        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {/* Dashboard Item */}
          {isDashboardActive ? (
            <div className="relative flex items-center">
              <div className="sidebar-active-indicator"></div>
              <Link className="flex items-center flex-1 px-4 py-3 bg-[#E0E8FF] text-[#2D1B4E] rounded-xl transition-colors ml-2" to="/dashboard">
                <i className="w-5 h-5 mr-3 text-[#2D1B4E]" data-lucide="layout-grid"></i>
                <span className="text-sm font-bold">Dashboard</span>
              </Link>
            </div>
          ) : (
            <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl group transition-colors" to="/dashboard">
              <i className="w-5 h-5 mr-3" data-lucide="layout-grid"></i>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          )}
 
          {/* Tasks Item */}
          {isTasksActive ? (
            <div className="relative flex items-center">
              <div className="sidebar-active-indicator"></div>
              <Link className="flex items-center flex-1 px-4 py-3 bg-[#E0E8FF] text-[#2D1B4E] rounded-xl transition-colors ml-2 justify-between" to="/dashboard/spaces">
                <div className="flex items-center">
                  <i className="w-5 h-5 mr-3 text-[#2D1B4E]" data-lucide="clipboard-list"></i>
                  <span className="text-sm font-bold">Tasks</span>
                </div>
                <span className="bg-[#EADFF9] text-[#2D1B4E] text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
              </Link>
            </div>
          ) : (
            <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl group transition-colors justify-between" to="/dashboard/spaces">
              <div className="flex items-center">
                <i className="w-5 h-5 mr-3" data-lucide="clipboard-list"></i>
                <span className="text-sm font-medium">Tasks</span>
              </div>
              <span className="bg-[#EADFF9] text-[#2D1B4E] text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
            </Link>
          )}
 
          {/* Users Item */}
          {isUsersActive ? (
            <div className="relative flex items-center">
              <div className="sidebar-active-indicator"></div>
              <Link className="flex items-center flex-1 px-4 py-3 bg-[#E0E8FF] text-[#2D1B4E] rounded-xl transition-colors ml-2" to="/dashboard/users">
                <i className="w-5 h-5 mr-3 text-[#2D1B4E]" data-lucide="users"></i>
                <span className="text-sm font-bold">Users</span>
              </Link>
            </div>
          ) : (
            <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" to="/dashboard/users">
              <i className="w-5 h-5 mr-3" data-lucide="users"></i>
              <span className="text-sm font-medium">Users</span>
            </Link>
          )}
 
          <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" to="#">
            <i className="w-5 h-5 mr-3" data-lucide="user-circle"></i>
            <span className="text-sm font-medium">Profile</span>
          </Link>
 
          <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors justify-between" to="/dashboard/notifications">
            <div className="flex items-center">
              <i className="w-5 h-5 mr-3" data-lucide="bell"></i>
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <div className="w-2 h-2 bg-[#EF4444] rounded-full mr-1"></div>
          </Link>
        </nav>
 
        {/* Bottom Navigation */}
        <div className="px-3 py-6 border-t border-gray-100 space-y-1">
          <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" to="#">
            <i className="w-5 h-5 mr-3" data-lucide="help-circle"></i>
            <span className="text-sm font-medium">Help</span>
          </Link>
          <Link className="flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-50 rounded-xl transition-colors" to="/dashboard/notification-settings">
            <i className="w-5 h-5 mr-3" data-lucide="settings"></i>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </aside>
      {/* END: LeftSidebar */}
 
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
 
        {/* BEGIN: MainHeader */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10" data-purpose="top-header">
 
          {/* Cụm Tìm kiếm & Menu 3 gạch mở rộng */}
          <div className="flex items-center flex-1 mr-8">
            {/* Nút 3 gạch thu gọn/mở rộng Sidebar */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title={isSidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
            >
              <i className="w-5 h-5" data-lucide="menu"></i>
            </button>
           
            {/* Thanh Tìm kiếm chiếm toàn bộ diện tích trống còn lại */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="h-4 w-4 text-gray-400" data-lucide="search"></i>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2D1B4E] focus:border-[#2D1B4E]"
                placeholder="Search tasks, spaces, users..."
                type="text"
              />
            </div>
          </div>
 
          <div className="flex items-center space-x-6 flex-shrink-0">
            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#2D1B4E] text-white px-4 py-2 rounded-lg flex items-center text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              <i className="w-4 h-4 mr-2" data-lucide="plus"></i>
              Create
            </button>
 
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/dashboard/notifications')}
              className="relative text-gray-500 hover:text-gray-700"
            >
              <i className="w-6 h-6" data-lucide="bell"></i>
            </button>
 
            {/* User Profile */}
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200 font-['Inter']">
              <div className="w-10 h-10 rounded-full bg-purple-100 border border-[#2D1B4E] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center">
                  <span className="text-[#2D1B4E] text-xs font-bold">{currentRole === 'ADMIN' ? 'AM' : 'TN'}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800">{currentRole === 'ADMIN' ? 'Alex Morgan' : 'Trang Nguyễn'}</span>
            </div>
          </div>
        </header>
        {/* END: MainHeader */}
 
        {/* BEGIN: MainContentArea */}
        <main className="flex-1 bg-[#F5F7FA] overflow-y-auto relative" data-purpose="main-display">
          <Outlet context={{ setShowCreateModal, setTasksForModal }} />
        </main>
        {/* END: MainContentArea */}
 
      </div>
 
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        tasks={tasksForModal}
      />
    </div>
  );
}
 
