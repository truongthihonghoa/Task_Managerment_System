import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UserPlus, RefreshCw, MessageSquare, Clock,
    AlertCircle, Lock, ShieldCheck, UserX, Bell, Clipboard
} from 'lucide-react';

const NotificationItem = ({ notification, onClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getContent = () => {
        switch (notification.type) {
            case 'task_assigned':
                return {
                    title: 'Task Assigned',
                    message: `You have been assigned to the task "${notification.task_name}".`,
                    IconComponent: UserPlus,
                    iconColor: 'text-blue-500'
                };
            case 'status_changed':
                return {
                    title: 'Task Status Updated',
                    message: `The status of "${notification.task_name}" has been changed to ${notification.new_status}.`,
                    IconComponent: RefreshCw,
                    iconColor: 'text-purple-500'
                };
            case 'comment_added':
                return {
                    title: 'New Comment',
                    message: `A new comment has been added to "${notification.task_name}".`,
                    IconComponent: MessageSquare,
                    iconColor: 'text-green-500'
                };
            case 'due_today':
                return {
                    title: 'Task Due Today',
                    message: `"${notification.task_name}" is due today.`,
                    IconComponent: Clock,
                    iconColor: 'text-orange-500'
                };
            case 'task_overdue':
                return {
                    title: 'Task Overdue',
                    message: `"${notification.task_name}" is overdue.`,
                    IconComponent: AlertCircle,
                    iconColor: 'text-red-500'
                };
            case 'user_registered':
                return {
                    title: 'New User Registered',
                    message: `A new user ${notification.target_user} is waiting for verification.`,
                    IconComponent: UserPlus,
                    iconColor: 'text-indigo-500'
                };
            case 'account_locked':
                return {
                    title: 'Account Locked',
                    message: `User ${notification.target_user} account is locked after 5 failed login attempts.`,
                    IconComponent: Lock,
                    iconColor: 'text-red-600'
                };
            case 'user_verified':
                return {
                    title: 'Account Verified',
                    message: `User account for ${notification.target_user} has been successfully verified.`,
                    IconComponent: ShieldCheck,
                    iconColor: 'text-emerald-500'
                };
            case 'user_deactivated':
                return {
                    title: 'User Deactivated',
                    message: `User ${notification.target_user} has been deactivated.`,
                    IconComponent: UserX,
                    iconColor: 'text-gray-500'
                };
            default:
                return {
                    title: notification.title || 'System Notification',
                    message: notification.message || '',
                    IconComponent: Bell,
                    iconColor: 'text-gray-400'
                };
        }
    };

    const { title, message, IconComponent, iconColor } = getContent();

    const handleItemClick = () => {
        // Nối trực tiếp vào cấu trúc route con của /dashboard đã khai báo ở App.jsx
        if (notification.space_id) {
            // Vì route của bạn cấu hình dạng tasks/:spaceId, ta truyền space_id lên URL
            navigate(`/dashboard/tasks/${notification.space_id}${location.search}`);
        } else if (notification.task_id) {
            // Trường hợp dữ liệu backend của bạn trả về thẳng task_id thay vì space_id
            navigate(`/dashboard/tasks/${notification.task_id}${location.search}`);
        }

        if (onClick) onClick(notification);
    };

    return (
        <div
            className={`p-4 flex items-start space-x-4 cursor-pointer transition-all duration-200 border-b border-gray-100/70 ${
                notification.is_read ? 'bg-white hover:bg-gray-50/50' : 'bg-[#FAF8FF] hover:bg-[#F0EBF8]/60'
            }`}
            onClick={handleItemClick}
        >
            {/* Avatar / Icon */}
            <div className="shrink-0 relative">
                {notification.triggered_by_avatar ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-200 to-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <span className="text-[#4C2B74] text-xs font-bold">{notification.triggered_by_initials}</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100">
                        <IconComponent className={`w-5 h-5 ${iconColor}`} />
                    </div>
                )}
                {!notification.is_read && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4C2B74] border-2 border-white rounded-full"></div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`text-sm ${notification.is_read ? 'font-medium text-gray-700' : 'font-bold text-[#4C2B74]'}`}>
                        {title}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                        {notification.created_at}
                    </span>
                </div>

                {notification.triggered_by_name && (
                    <p className="text-[11px] font-semibold text-gray-600 mb-1">
                        {notification.triggered_by_name} <span className="font-normal text-gray-400">performed this action</span>
                    </p>
                )}

                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {message}
                </p>

                {(notification.task_name || notification.task_id) && (
                    <div className="mt-2 flex items-center text-[10px] text-gray-400 font-bold bg-gray-50/50 px-2 py-1 rounded-md w-fit border border-gray-100">
                        <Clipboard className="w-3 h-3 mr-1" />
                        {notification.task_id ? `${notification.task_id} • ` : ''} {notification.task_status || 'Task Update'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;