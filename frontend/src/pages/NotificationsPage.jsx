import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BellOff } from 'lucide-react'; 
import NotificationItem from '../components/notifications/NotificationItem';

// ==========================================
// 1. ĐƯA MẢNG MOCK DATA RA NGOÀI COMPONENT ĐỂ HEADER CÓ THỂ IMPORT
// ==========================================
export let globalNotifications = [
  {
    NOTI_id: 1,
    type: 'task_assigned',
    task_name: 'Design Dashboard',
    triggered_by_name: 'Hoa',
    triggered_by_avatar: true,
    triggered_by_initials: 'H',
    is_read: false,
    created_at: '2 min ago',
    group: 'Today',
    role: 'USER',
    task_status: 'To Do',
    space_id: 'spaces'
  },
  {
    NOTI_id: 2,
    type: 'status_changed',
    task_name: 'Design System',
    new_status: 'In Review',
    triggered_by_name: 'Phạm Thị Cẩm Tiên',
    triggered_by_avatar: true,
    triggered_by_initials: 'PT',
    is_read: false,
    created_at: '33 sec ago',
    group: 'Today',
    role: 'USER',
    task_status: 'In Progress',
    space_id: 'spaces'
  },
  {
    NOTI_id: 3,
    type: 'comment_added',
    task_name: 'Audit Logs Screen',
    triggered_by_name: 'Trung',
    triggered_by_avatar: true,
    triggered_by_initials: 'T',
    is_read: true,
    created_at: 'Yesterday',
    group: 'Yesterday',
    role: 'USER',
    task_status: 'In Progress',
    space_id: 'spaces'
  },
  {
    NOTI_id: 4,
    type: 'due_today',
    task_name: 'Database Migration',
    is_read: false,
    created_at: '3 hours ago',
    group: 'Today',
    role: 'USER',
    task_status: 'Pending',
    space_id: 'spaces'
  },
  // ADMIN
  {
    NOTI_id: 10,
    type: 'user_registered',
    target_user: 'Nguyen Van A',
    is_read: false,
    created_at: '5 min ago',
    group: 'Today',
    role: 'ADMIN'
  },
  {
    NOTI_id: 11,
    type: 'account_locked',
    target_user: 'User123',
    is_read: false,
    created_at: '10 min ago',
    group: 'Today',
    role: 'ADMIN'
  },
  {
    NOTI_id: 12,
    type: 'user_verified',
    target_user: 'Alex Morgan',
    is_read: true,
    created_at: '2 days ago',
    group: 'Earlier',
    role: 'ADMIN'
  }
];

// Hàm phát tín hiệu đồng bộ giữa 2 bên
export const updateGlobalNotifications = (newData) => {
  globalNotifications = newData;
  window.dispatchEvent(new Event('sync_global_notifications'));
};

const NotificationsPage = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const roleParam = searchParams.get('role')?.toUpperCase();
  const currentRole = roleParam === "USER" ? "USER" : "ADMIN";

  // Đồng bộ state UI với biến global
  const [allNotifications, setAllNotifications] = useState(globalNotifications);

  // Lắng nghe thay đổi từ Header (Ví dụ bấm Đọc tất cả trên header)
  useEffect(() => {
    const handleSync = () => setAllNotifications([...globalNotifications]);
    window.addEventListener('sync_global_notifications', handleSync);
    return () => window.removeEventListener('sync_global_notifications', handleSync);
  }, []);

  const roleFiltered = allNotifications.filter(n => n.role === currentRole);

  const filteredNotifications = roleFiltered.filter(n => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Unread' && !n.is_read) ||
      (filter === 'Read' && n.is_read);

    const taskName = n.task_name || '';
    const triggeredBy = n.triggered_by_name || '';
    const targetUser = n.target_user || '';

    const matchesSearch =
      taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      triggeredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetUser.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const markAllAsRead = () => {
    const updated = globalNotifications.map(n =>
      n.role === currentRole ? { ...n, is_read: true } : n
    );
    updateGlobalNotifications(updated);
  };

  return (
    <div className="p-8 w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-[#4C2B74]">Notifications</h1>
          </div>
          <p className="text-sm text-gray-500">
            {currentRole.toLowerCase() === "admin"
              ? "View and manage important system notifications."
              : "View and manage your notifications."}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-gray-200 text-[#4C2B74] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 flex-shrink-0">
          <div className="flex bg-gray-100/50 p-1 rounded-xl">
            {['All', 'Unread', 'Read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f
                  ? 'bg-white text-[#4C2B74] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                currentRole === "ADMIN"
                  ? "Search system notifications..."
                  : "Search your notifications..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4C2B74]/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-50 font-['Inter'] flex-1 overflow-y-auto custom-scrollbar">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.NOTI_id}
                notification={notification}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BellOff className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-700">No {currentRole.toLowerCase()} notifications</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">
                {currentRole === 'USER'
                  ? "You'll only see updates here from other users on your tasks."
                  : "Only important system management events will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E4E7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4D4D8;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;