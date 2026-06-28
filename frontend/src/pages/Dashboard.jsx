import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';


const userActivities = [
  {
    user: "You",
    initials: "Y",
    avatarColor: "#4C2B74",
    textColor: "white",
    action: "updated status to",
    status: "in_progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-100",
    target: "SCRUM-13: Design Base Layout",
    time: "2026-06-25 10:45:00",
    entityType: "Task",
    ipAddress: "192.168.1.45",
    group: "Today"
  },
  {
    user: "Trang Nguyễn",
    initials: "TN",
    avatarColor: "#10b981",
    textColor: "white",
    action: "created",
    status: "new",
    statusColor: "bg-gray-100 text-gray-700 border-gray-200",
    target: "SCRUM-12: Design Attachment Section",
    time: "2 hours ago",
    entityType: "Task",
    ipAddress: "192.168.1.15",
    group: "Today"
  },
  {
    user: "Hoa Phan",
    initials: "HP",
    avatarColor: "#3b82f6",
    textColor: "white",
    action: "commented on",
    status: "pending_review",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
    target: "SCRUM-5: Product Detail Page",
    time: "5 hours ago",
    entityType: "Task",
    ipAddress: "192.168.1.22",
    group: "Today"
  },
  {
    user: "You",
    initials: "Y",
    avatarColor: "#4C2B74",
    textColor: "white",
    action: "completed",
    status: "done",
    statusColor: "bg-green-50 text-green-700 border-green-100",
    target: "SCRUM-1: Design Login Page",
    time: "1 day ago",
    entityType: "Task",
    ipAddress: "192.168.1.45",
    group: "Yesterday"
  },
  {
    user: "Trang Nguyễn",
    initials: "TN",
    avatarColor: "#10b981",
    textColor: "white",
    action: "updated field \"Priority\" on",
    status: "need_revision",
    statusColor: "bg-red-50 text-red-700 border-red-100",
    target: "SCRUM-7: Task Detail Screen",
    time: "1 day ago",
    entityType: "Task",
    ipAddress: "192.168.1.15",
    group: "Yesterday"
  }
];

const adminActivities = [
  {
    user: "System Admin",
    initials: "SA",
    avatarColor: "#170338",
    textColor: "white",
    action: "created new user",
    status: "Authentication",
    statusColor: "bg-purple-50 text-purple-700 border-purple-100",
    target: "Lê Văn Tám",
    time: "2026-06-25 09:15:00",
    entityType: "User",
    ipAddress: "10.0.0.12",
    group: "Today"
  },
  {
    user: "Phạm Thị Cẩm Tiên",
    initials: "PT",
    avatarColor: "#ff4d4d",
    textColor: "white",
    action: "updated status to",
    status: "in_progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-100",
    target: "SCRUM-44: API Documentation",
    time: "2026-06-25 07:30:00",
    entityType: "Task",
    ipAddress: "192.168.1.102",
    group: "Today"
  },
  {
    user: "Trang Nguyễn",
    initials: "TN",
    avatarColor: "#10b981",
    textColor: "white",
    action: "deleted task",
    status: "cancelled",
    statusColor: "bg-red-50 text-red-700 border-red-100",
    target: "SCRUM-99: Dummy Task",
    time: "2026-06-25 05:20:00",
    entityType: "Task",
    ipAddress: "192.168.1.15",
    group: "Today"
  },
  {
    user: "System",
    initials: "SYS",
    avatarColor: "#d1d5db",
    textColor: "#374151",
    action: "archived task",
    status: "done",
    statusColor: "bg-gray-100 text-gray-700 border-gray-200",
    target: "Security Audit 2025",
    time: "2026-06-24 14:00:00",
    entityType: "Task",
    ipAddress: "127.0.0.1",
    group: "Yesterday"
  },
  {
    user: "Admin",
    initials: "AD",
    avatarColor: "#4C2B74",
    textColor: "white",
    action: "changed role on",
    status: "Verification",
    statusColor: "bg-orange-50 text-orange-700 border-orange-100",
    target: "Nguyễn Văn A (to Manager)",
    time: "2026-06-24 10:10:00",
    entityType: "User",
    ipAddress: "10.0.0.1",
    group: "Yesterday"
  }
];

const userStats = [
  { icon: 'assignment', label: 'Total Tasks', value: 47, colorClass: 'text-[#2d1b4e]', gradientClass: 'gradient-purple', delay: '0.1s' },
  { icon: 'check_circle', label: 'Completed Tasks', value: 28, colorClass: 'text-green-600', gradientClass: 'gradient-green', delay: '0.2s' },
  { icon: 'sync', label: 'In Progress', value: 10, colorClass: 'text-blue-600', gradientClass: 'gradient-blue', delay: '0.3s' },
  { icon: 'warning', label: 'Overdue Tasks', value: 4, colorClass: 'text-red-600', gradientClass: 'gradient-red', delay: '0.4s' }
];

const adminStats = [
  { icon: 'group', label: 'Total Users', value: 156, colorClass: 'text-indigo-600', gradientClass: 'gradient-indigo', delay: '0.05s' },
  { icon: 'assignment', label: 'Total Tasks', value: 882, colorClass: 'text-[#2d1b4e]', gradientClass: 'gradient-purple', delay: '0.1s' },
  { icon: 'check_circle', label: 'Completed Tasks', value: 612, colorClass: 'text-green-600', gradientClass: 'gradient-green', delay: '0.2s' },
  { icon: 'sync', label: 'In Progress', value: 184, colorClass: 'text-blue-600', gradientClass: 'gradient-blue', delay: '0.3s' },
  { icon: 'warning', label: 'Overdue Tasks', value: 46, colorClass: 'text-red-600', gradientClass: 'gradient-red', delay: '0.4s' }
];

const userViewedTasks = [
  { title: "Design Task List Screen", subtitle: "SCRUM-7", icon: "check_box", type: "task", group: "Today" },
  { title: "SCRUM board", subtitle: "Board", icon: "dashboard", type: "board", group: "Today" },
  { title: "Design Base Layout", subtitle: "SCRUM-13", icon: "check_box", type: "task", group: "Today" },
  { title: "Design Task Assignment History Screen", subtitle: "SCRUM-17", icon: "check_box", type: "task", group: "Yesterday" }
];

const userWorkedOnTasks = [
  { title: "Design Dashboard Screen - Admin Dashboard and Design Global Search on Header (Main Layout)", subtitle: "SCRUM-14 · Task Management System", status: "in_progress", group: "TODAY", time: "2H AGO" },
  { title: "Design Base Layout (Header & Navigation Menu) and User Dashboard", subtitle: "SCRUM-13 · Task Management System", status: "in_progress", group: "YESTERDAY", time: "1D AGO" },
  { title: "Design Notifications Screen", subtitle: "SCRUM-16 · Task Management System", status: "new", group: "IN THE LAST WEEK", time: "3D AGO" },
  { title: "Design Task Assignment History Screen and Audit Logs Screen", subtitle: "SCRUM-17 · Task Management System", status: "done", group: "IN THE LAST WEEK", time: "5D AGO" },
  { title: "Design Task Assignees Screen", subtitle: "SCRUM-15 · Task Management System", status: "in_testing", group: "IN THE LAST WEEK", time: "6D AGO" }
];

const adminViewedTasks = [
  { title: "User Management Module", subtitle: "ADM-5", icon: "group", type: "task", group: "Today" },
  { title: "Audit Logs Dashboard", subtitle: "ADM-10", icon: "security", type: "task", group: "Today" },
  { title: "Role Permission Settings", subtitle: "ADM-12", icon: "lock", type: "task", group: "Yesterday" },
  { title: "Security Settings", subtitle: "ADM-15", icon: "shield", type: "task", group: "Yesterday" }
];

const userAssignedTasks = [
  { title: "Design Dashboard Screen - Admin Dashboard and Design Global Search on Header (Main Layout)", subtitle: "SCRUM-14 · Task Management System", status: "In Progress", group: "IN PROGRESS" },
  { title: "Design Base Layout (Header & Navigation Menu) and User Dashboard", subtitle: "SCRUM-13 · Task Management System", status: "In Review", group: "IN REVIEW" },
  { title: "Design Task Assignment History Screen and Audit Logs Screen", subtitle: "SCRUM-17 · Task Management System", status: "To Do", group: "TO DO" },
  { title: "Design Notifications Screen", subtitle: "SCRUM-16 · Task Management System", status: "To Do", group: "TO DO" },
  { title: "Design Task Assignees Screen", subtitle: "SCRUM-15 · Task Management System", status: "To Do", group: "TO DO" }
];

const adminWorkedOnTasks = [
  {
    title: "Review Security Audit Report",
    subtitle: "ADM-101 · Security Module",
    status: "in_testing",
    group: "TODAY",
    operation: "Security Logs",
    time: "15M AGO",
    assignees: [
      { name: "Hoa Phan", initials: "HP", color: "#4C2B74" },
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" },
      { name: "Admin", initials: "AD", color: "#4f46e5" }
    ]
  },
  {
    title: "Configure Permission Matrix",
    subtitle: "ADM-102 · Permissions",
    status: "in_progress",
    group: "YESTERDAY",
    operation: "Permissions",
    time: "1D AGO",
    assignees: [
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" },
      { name: "Hoa Phan", initials: "HP", color: "#4C2B74" }
    ]
  },
  {
    title: "Onboard New Engineering Team",
    subtitle: "ADM-103 · User Management",
    status: "done",
    group: "TODAY",
    operation: "User Management",
    time: "4H AGO",
    assignees: [
      { name: "Admin", initials: "AD", color: "#4f46e5" },
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" }
    ]
  },
  {
    title: "Audit DB Access Tokens",
    subtitle: "ADM-104 · Security Logs",
    status: "in_review",
    group: "TODAY",
    operation: "Security Logs",
    time: "6H AGO",
    assignees: [
      { name: "Hoa Phan", initials: "HP", color: "#4C2B74" }
    ]
  },
  {
    title: "Update Global Policy",
    subtitle: "ADM-105 · Permissions",
    status: "new",
    group: "YESTERDAY",
    operation: "Permissions",
    time: "1D AGO",
    assignees: [
      { name: "Admin", initials: "AD", color: "#4f46e5" }
    ]
  },
  {
    title: "Batch User Deletion - Inactive",
    subtitle: "ADM-106 · User Management",
    status: "done",
    group: "IN THE LAST WEEK",
    operation: "User Management",
    time: "3D AGO",
    assignees: [
      { name: "Hoa Phan", initials: "HP", color: "#4C2B74" },
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" }
    ]
  },
  {
    title: "Review Security Audit Report",
    subtitle: "ADM-107 · User Management",
    status: "in_progress",
    group: "TODAY",
    operation: "User Management",
    time: "2H AGO",
    assignees: [
      { name: "Admin", initials: "AD", color: "#4f46e5" },
      { name: "Hoa Phan", initials: "HP", color: "#4C2B74" },
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" }
    ]
  },
  {
    title: "Update User Access Level",
    subtitle: "ADM-108 · User Management",
    status: "in_review",
    group: "YESTERDAY",
    operation: "User Management",
    time: "1D AGO",
    assignees: [
      { name: "Trang Nguyen", initials: "TN", color: "#10b981" },
      { name: "Alice Blue", initials: "AB", color: "#3b82f6" },
      { name: "Bob Red", initials: "BR", color: "#ef4444" },
      { name: "Charlie Green", initials: "CG", color: "#10b981" }
    ]
  }
];




const adminAssignedTasks = [
  { title: "User Assignment - Alice to SCRUM-13", subtitle: "HIST-001", status: "done", group: "Assignment" },
  { title: "Role Change - Bob to Developer", subtitle: "HIST-002", status: "done", group: "Role" },
  { title: "New Task - SCRUM-14 Created", subtitle: "HIST-003", status: "done", group: "System" }
];

const userStatusData = [
  { label: 'Done', count: 28, color: '#4C2B74', dash: 59.6, offset: 0, tPos: { left: '95%', top: '35%' } },
  { label: 'In Progress', count: 10, color: '#3b82f6', dash: 21.3, offset: -59.6, tPos: { left: '10%', top: '25%' } },
  { label: 'New', count: 5, color: '#10b981', dash: 10.6, offset: -80.9, tPos: { left: '20%', top: '5%' } },
  { label: 'Overdue', count: 4, color: '#9d2a2aff', dash: 8.5, offset: -91.5, tPos: { left: '45%', top: '-2%' } }
];

const adminStatusData = [
  { label: 'Done', count: 612, color: '#4C2B74', dash: 69.4, offset: 0, tPos: { left: '95%', top: '35%' } },
  { label: 'In Progress', count: 184, color: '#3b82f6', dash: 20.9, offset: -69.4, tPos: { left: '10%', top: '25%' } },
  { label: 'New', count: 40, color: '#10b981', dash: 4.5, offset: -90.3, tPos: { left: '25%', top: '5%' } },
  { label: 'Overdue', count: 46, color: '#ff4d4d', dash: 5.2, offset: -94.8, tPos: { left: '50%', top: '10%' } }
];

const teamWorkloadData = [
  { name: "Phạm Thị Cẩm Tiên", initials: "PT", color: "#ef4444", percentage: 35, tasks: 6, total: 17, avatar: null },
  { name: "Hồng Hoa", initials: "HH", color: "#06b6d4", percentage: 29, tasks: 5, total: 17, avatar: null },
  { name: "Trang Nguyễn", initials: "TN", color: "#10b981", percentage: 29, tasks: 5, total: 17, avatar: null },
  { name: "Unassigned", initials: null, color: "#d1d5db", percentage: 7, tasks: 1, total: 17, avatar: "person" }
];

const userAccountData = [
  { label: "Active Users", count: 120, total: 156, percentage: 77, color: "#10b981", gradient: "linear-gradient(90deg, #10b981 0%, #34d399 100%)", glow: "rgba(16, 185, 129, 0.2)", icon: "check_circle" },
  { label: "Pending Verification", count: 11, total: 156, percentage: 7, color: "#f59e0b", gradient: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)", glow: "rgba(245, 158, 11, 0.2)", icon: "pending" },
  { label: "Locked Accounts", count: 5, total: 156, percentage: 3, color: "#ef4444", gradient: "linear-gradient(90deg, #ef4444 0%, #f87171 100%)", glow: "rgba(239, 68, 68, 0.2)", icon: "lock" },
  { label: "Inactive Users", count: 20, total: 156, percentage: 13, color: "#64748b", gradient: "linear-gradient(90deg, #64748b 0%, #94a3b8 100%)", glow: "rgba(100, 116, 139, 0.1)", icon: "person_off" }
];





// Reusable Sub-components for cleaner structure
const StatCard = ({ icon, label, value, colorClass, gradientClass, delay }) => (
  <div className={`${gradientClass} p-6 rounded-2xl border border-white shadow-sm flex items-center gap-4 interactive-card animate-card`} style={{ animationDelay: delay }}>
    <div className={`w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center ${colorClass} shadow-sm`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] font-bold text-[#5e636e] uppercase tracking-widest">{label}</p>
      <h3 className={`text-2xl font-black ${label === 'Total Tasks' ? 'text-[#2d1b4e]' : 'text-[#170338]'}`}>{value}</h3>
    </div>
  </div>
);

const ActivityItem = ({ activity, isCompact = true }) => (
  <div className="flex gap-4 group">
    <div
      className={`rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border border-white shadow-sm ${isCompact ? 'w-10 h-10' : 'w-10 h-10 rounded-full'}`}
      style={{ backgroundColor: activity.avatarColor, color: activity.textColor }}
    >
      {activity.initials}
    </div>
    <div className="flex-1">
      <div className={`flex flex-wrap items-center gap-x-1 behavior-relaxed ${isCompact ? 'text-[13px]' : 'text-[13px]'}`}>
        <span className={`font-bold ${isCompact ? 'text-[#170338]' : 'text-[#4C2B74] hover:underline cursor-pointer'}`}>{activity.user}</span>
        {!isCompact && <span className="text-[#5e636e] mx-1.5">{activity.action}</span>}
        {isCompact && <span className="text-[#5e636e] mx-1">{activity.action}</span>}
        <span className={`status-pill px-2 py-0.5 rounded ${isCompact ? 'rounded-full text-[9px]' : 'text-[10px]'} ${activity.statusColor} font-bold uppercase border whitespace-nowrap`}>
          {activity.status}
        </span>
        <span className="text-[#5e636e] mx-1">{isCompact ? 'on' : 'on'}</span>
        {!isCompact ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">check_box</span> {activity.target}
          </span>
        ) : (
          <span className="font-semibold text-[#1a1c1e] cursor-pointer hover:text-[#4C2B74] underline decoration-gray-200">
            {activity.target}
          </span>
        )}
      </div>
      <p className="text-[11px] text-[#5e636e] mt-0.5">{activity.time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [hoveredPriority, setHoveredPriority] = useState(null);
  const [hoveredWorkload, setHoveredWorkload] = useState(null);
  const [hoveredAccount, setHoveredAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  const [activeFilter, setActiveFilter] = useState("All");

  // Modal specific filters
  const [modalSearch, setModalSearch] = useState("");
  const [modalEventType, setModalEventType] = useState("All Events");
  const [modalTimeRange, setModalTimeRange] = useState("Today");
  const [modalSortOrder, setModalSortOrder] = useState("Newest First");
  const [selectedOperation, setSelectedOperation] = useState("User Management");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("All Dates");


  // Define tabs based on role
  const roleParam = searchParams.get('role')?.toUpperCase();
  const isAdmin = roleParam !== "USER"; // Default to ADMIN unless role=user is specified
  const user = { role: isAdmin ? "ADMIN" : "USER" };

  const taskTabs = isAdmin
    ? ['Worked on', 'Viewed', 'Assign History']
    : ['Worked on', 'Viewed', 'Assigned to me'];

  const [activeTaskTab, setActiveTaskTab] = useState(taskTabs[0]);

  // Sync tab when role changes
  useEffect(() => {
    setActiveTaskTab(taskTabs[0]);
  }, [isAdmin]);

  const stats = isAdmin ? adminStats : userStats;
  const currentActivities = isAdmin ? adminActivities : userActivities;
  const currentWorkedOnTasks = isAdmin ? adminWorkedOnTasks : userWorkedOnTasks;
  const currentViewedTasks = isAdmin ? adminViewedTasks : userViewedTasks;
  const currentAssignedTasks = isAdmin ? adminAssignedTasks : userAssignedTasks;
  const statusData = isAdmin ? adminStatusData : userStatusData;
  const totalTasksCount = isAdmin ? 882 : 47;

  // Filtering logic for Admin section
  const getFilteredData = (data) => {
    if (!isAdmin) return data;
    return data.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(modalSearch.toLowerCase()));

      // Filter by operation card selection
      const matchOp = !item.operation || item.operation === selectedOperation;

      // Filter by Status dropdown
      const matchStatus = selectedStatus === "All Status" || item.status?.replace('_', ' ').toLowerCase() === selectedStatus.toLowerCase();

      // Filter by Date dropdown
      const matchDate = selectedDate === "All Dates" || item.group?.toLowerCase() === selectedDate.toLowerCase();

      return matchSearch && matchStatus && matchDate && matchOp;
    });
  };

  const filteredWorkedOn = getFilteredData(currentWorkedOnTasks);
  const filteredViewed = getFilteredData(currentViewedTasks);
  const filteredAssigned = getFilteredData(currentAssignedTasks);

  // Modal Filtering Logic
  const filteredModalActivities = (isAdmin ? adminActivities : userActivities).filter(log => {
    const matchSearch = log.user.toLowerCase().includes(modalSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(modalSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(modalSearch.toLowerCase());
    const matchType = modalEventType === "All Events" || log.entityType.toLowerCase() === modalEventType.toLowerCase();

    // Time range filtering (simplified for mock)
    const matchTime = modalTimeRange === "All Time" ||
      (modalTimeRange === "Today" && log.group === "Today") ||
      (modalTimeRange === "Yesterday" && log.group === "Yesterday");

    return matchSearch && matchType && matchTime;
  }).sort((a, b) => {
    return modalSortOrder === "Newest First" ? b.time.localeCompare(a.time) : a.time.localeCompare(b.time);
  });

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 md:px-8 md:pt-5 md:pb-8 space-y-6 custom-scrollbar bg-[#FAFBFF]">
      {/* CSS Styles extracted from the snippet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;900&display=swap');

        .dashboard-container {
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .interactive-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .interactive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
        }

        .interactive-card:active {
          transform: scale(0.96);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-card {
          animation: fadeInScale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .donut-segment {
          transition: stroke-width 0.3s ease, opacity 0.3s ease;
          cursor: pointer;
        }

        .donut-segment:hover {
          stroke-width: 6;
          opacity: 0.8;
        }

        .status-pill {
          transition: all 0.2s ease;
          cursor: pointer;
          letter-spacing: 0.02em;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        .gradient-purple { background: linear-gradient(135deg, #f3ebf7 0%, #ffffff 100%); }
        .gradient-blue { background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); }
        .gradient-green { background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%); }
        .gradient-red { background: linear-gradient(135deg, #ffebee 0%, #ffffff 100%); }
        .gradient-indigo { background: linear-gradient(135deg, #e8eaf6 0%, #ffffff 100%); }
        .gradient-amber { background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Activity Modal / Audit Log Table */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-[#170338]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-white w-full ${isAdmin ? 'max-w-6xl' : 'max-w-2xl'} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-[#170338] tracking-tight">Recent Activity</h3>
                <p className="text-sm text-[#5e636e] font-medium mt-1 opacity-90">
                  Stay up to date with what's happening across the space.
                </p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-[#5e636e] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6">
              {isAdmin && (
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg group-focus-within:text-[#4C2B74]">search</span>
                    <input
                      type="text"
                      placeholder="Search (User, Action, ID)..."
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#4C2B74] focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <select
                    value={modalEventType}
                    onChange={(e) => setModalEventType(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#4C2B74] outline-none transition-all text-sm font-medium"
                  >
                    <option>All Events</option>
                    <option>User</option>
                    <option>Task</option>
                    <option>Comment</option>
                    <option>Attachment</option>
                    <option>Notification</option>
                    <option>Authentication</option>
                    <option>Verification</option>
                  </select>
                  <select
                    value={modalTimeRange}
                    onChange={(e) => setModalTimeRange(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#4C2B74] outline-none transition-all text-sm font-medium"
                  >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>All Time</option>
                  </select>
                  <select
                    value={modalSortOrder}
                    onChange={(e) => setModalSortOrder(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#4C2B74] outline-none transition-all text-sm font-medium"
                  >
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </select>
                </div>
              )}

              {isAdmin ? (
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">Action</th>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">Entity Type</th>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">Target</th>
                        <th className="px-6 py-4 text-[11px] font-black text-[#5e636e] uppercase tracking-wider">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredModalActivities.map((log, i) => (
                        <tr key={i} className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                          <td className="px-6 py-4 text-xs font-semibold text-[#5e636e] whitespace-nowrap">{log.time}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: log.avatarColor }}>{log.initials}</div>
                              <span className="text-sm font-bold text-[#170338]">{log.user}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-[#4C2B74]">{log.action || "audit_logs.action"}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${log.entityType === 'User' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                              {log.entityType || "audit_logs.entity_type"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-[#170338]">{log.target}</td>
                          <td className="px-6 py-4 text-xs font-mono text-[#5e636e] font-medium">{log.ipAddress || "audit_logs.ip_address"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-6">
                  {["Today", "Yesterday"].map((group) => (
                    <div key={group} className="space-y-3">
                      <p className="text-[10px] font-black text-[#5e636e] uppercase tracking-widest bg-gray-100/50 px-3 py-1.5 rounded-lg inline-block">{group}</p>
                      <div className="flex flex-col gap-3">
                        {currentActivities.filter(a => a.group === group).map((activity, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl border border-gray-100 hover:border-[#4C2B74]/30 hover:shadow-md transition-all group cursor-pointer bg-white">
                            <ActivityItem activity={activity} isCompact={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAdmin && (
                <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-bold text-[#5e636e]">Showing 5 of 1,248 logs</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-xs font-bold text-[#5e636e] border border-gray-100 rounded-lg hover:bg-gray-50 transition-all">Previous</button>
                    <button className="px-4 py-2 text-xs font-bold text-white bg-[#4C2B74] rounded-lg shadow-md hover:shadow-lg transition-all">Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-container space-y-6">
        {/* Page Title & KPI Banner */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#170338] tracking-tight">Dashboard</h2>
            <p className="text-sm text-[#5e636e] font-medium">Track task progress, monitor task status, and stay updated with recent activities.</p>
          </div>

          {/* KPI Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
            {stats.map((kpi, idx) => (
              <StatCard key={idx} {...kpi} />
            ))}
          </div>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Overview (Top Left) */}
          <div className="glass-card p-8 rounded-2xl flex flex-col h-full">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[#170338]">Status Overview</h4>
                <Link to={`/dashboard/spaces${location.search}`} className="text-[#170338] text-xs font-bold hover:underline">View all</Link>
              </div>
              <p className="text-[#5e636e] text-sm mt-1">Snapshot of your work item statuses.</p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-around gap-6 py-4 flex-1">
              <div className="relative w-56 h-56 cursor-pointer">
                {/* Tooltip Overlay - Absolute to this container */}
                {hoveredSegment !== null && (
                  <div
                    className="absolute z-[100] bg-white border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-[4px] px-3 py-2 flex items-center gap-2.5 whitespace-nowrap pointer-events-none"
                    style={{
                      left: statusData[hoveredSegment].tPos.left,
                      top: statusData[hoveredSegment].tPos.top,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusData[hoveredSegment].color }}></div>
                    <span className="text-sm font-semibold text-[#42526E]">{statusData[hoveredSegment].label} &nbsp; {statusData[hoveredSegment].count}</span>
                  </div>
                )}

                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#F1F5F9" strokeWidth="4"></circle>
                  {statusData.map((item, index) => (
                    <circle
                      key={index}
                      className={`donut-segment cursor-pointer transition-all duration-300 ${hoveredSegment === index ? 'opacity-100 scale-[1.02]' : (hoveredSegment !== null ? 'opacity-30' : 'opacity-100')}`}
                      cx="18"
                      cy="18"
                      fill="transparent"
                      r="15.915"
                      stroke={item.color}
                      strokeDasharray={`${item.dash} 100`}
                      strokeDashoffset={item.offset}
                      strokeLinecap="butt"
                      strokeWidth="4.5"
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ transformOrigin: 'center' }}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl text-[#1a1c1e] font-bold tracking-tight">{totalTasksCount}</span>
                  <p className="text-[11px] text-[#5e636e] font-bold mt-1 text-center leading-tight">Total tasks</p>
                </div>
              </div>
              <div className="space-y-3">
                {statusData.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-lg transition-all ${hoveredSegment === index ? 'bg-gray-50 translate-x-1' : ''}`}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="w-3 h-3 rounded-full transition-transform shadow-sm" style={{ backgroundColor: item.color, transform: hoveredSegment === index ? 'scale(1.25)' : 'scale(1)' }}></div>
                    <span className={`text-xs font-bold transition-colors ${hoveredSegment === index ? 'text-[#4C2B74]' : 'text-[#5e636e]'}`}>
                      {item.label}: {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs (ADMIN) / Recent Activity (USER) */}
          <div className="glass-card p-8 rounded-2xl flex flex-col h-full">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-[#170338]">{isAdmin ? "Audit Logs" : "Recent Activity"}</h4>
                <p className="text-[#5e636e] text-sm mt-1">
                  {isAdmin ? "Track user actions, security events, and system changes." : "Stay up to date with what's happening across the space."}
                </p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-[#5e636e] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">open_in_full</span>
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
              {["Today", "Yesterday"].map((group) => {
                const groupActivities = currentActivities.filter(a => a.group === group);
                if (groupActivities.length === 0) return null;
                return (
                  <div key={group} className="space-y-4">
                    <p className="text-[10px] font-bold text-[#5e636e] uppercase tracking-widest">{group === "Today" ? "Today" : "Yesterday"}</p>
                    {groupActivities.map((activity, idx) => (
                      <ActivityItem key={idx} activity={activity} isCompact={true} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-card p-8 rounded-2xl flex flex-col w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-[#170338]">Priority breakdown</h4>
              <p className="text-[#5e636e] text-sm mt-1">Get a holistic view of how work is being prioritized.</p>
            </div>
          </div>

          <div className="relative flex-1 mt-6">
            <div className="flex h-64 relative">
              {/* Y-Axis */}
              <div className="flex flex-col justify-between text-[11px] font-bold text-[#5e636e]/60 pr-6 pb-8 border-r border-[#170338]/10 h-full">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span className="mb-[-2px]">0</span>
              </div>

              <div className="flex-1 relative ml-1 h-full">
                {/* 1. Vùng lưới và trục ngang (Plot Area) */}
                <div className="absolute inset-0 bottom-8 border-b border-[#170338]/40">
                  {/* Các đường kẻ ngang */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-full border-t border-[#170338]/5`}></div>
                    ))}
                  </div>

                  {/* 2. Container chứa các cột */}
                  <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-around px-2">
                    {[
                      { label: 'Highest', value: 0, color: '#ff4d4d' },
                      { label: 'High', value: 7, color: '#ff5c5c' },
                      { label: 'Medium', value: 9, color: '#888995' },
                      { label: 'Low', value: 0, color: '#3b82f6' },
                      { label: 'Lowest', value: 0, color: '#4466ff' },
                      { label: 'None', value: 1, color: '#d1d5db' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative flex flex-col items-center w-full h-full justify-end"
                        onMouseEnter={() => setHoveredPriority(item)}
                        onMouseLeave={() => setHoveredPriority(null)}
                      >
                        {/* Cột dữ liệu - Bây giờ chứa Tooltip để căn chỉnh chuẩn xác */}
                        <div
                          className={`w-10 sm:w-12 transition-all duration-300 rounded-t-sm shadow-sm cursor-pointer bg-[#888995] relative ${hoveredPriority?.label === item.label ? 'scale-x-105 bg-[#4C2B74]' : 'opacity-80 hover:opacity-100'
                            }`}
                          style={{
                            height: `${(item.value / 10) * 100}%`,
                          }}
                        >
                          {/* Popover khi hover - Gắn trực tiếp vào đầu cột */}
                          {hoveredPriority?.label === item.label && item.value > 0 && (
                            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in slide-in-from-bottom-1 duration-200 pointer-events-none">
                              <div className="bg-white border border-gray-100 rounded-xl shadow-2xl p-3 min-w-[90px] flex flex-col items-center gap-1 relative">
                                <span className="text-[9px] font-bold text-[#5e636e] uppercase tracking-wider">{item.label}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-lg font-black text-[#170338]">{item.value}</span>
                                </div>
                                <div className="absolute top-[99%] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white"></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Vạch nhỏ dưới chân cột */}
                        <div className="absolute top-full mt-2 w-0.5 h-3 bg-[#170338]/10"></div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>

            {/* Legend / X-Axis Labels */}
            <div className="flex justify-around pl-14 mt-6">
              {[
                { label: 'Highest', color: '#ff4d4d', icon: 'keyboard_double_arrow_up' },
                { label: 'High', color: '#ff5c5c', icon: 'keyboard_arrow_up' },
                { label: 'Medium', color: '#888995', icon: 'drag_handle' },
                { label: 'Low', color: '#3b82f6', icon: 'keyboard_arrow_down' },
                { label: 'Lowest', color: '#4466ff', icon: 'keyboard_double_arrow_down' },
                { label: 'None', color: '#9ca3af', icon: 'remove' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[#5e636e] group cursor-pointer hover:text-[#170338] transition-colors">
                  <span className="material-symbols-outlined text-[16px] font-bold" style={{ color: item.color }}>{item.icon}</span>
                  <span className="text-[11px] font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conditionally render Team Workload or User Account Overview */}
        <div className="glass-card p-8 rounded-2xl flex flex-col w-full">
          {isAdmin ? (
            <>
              {/* User Account Overview (ADMIN ONLY) */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-[#1a1c1e]">User Account Overview</h4>
                <p className="text-sm text-[#5e636e] mt-1 font-medium">
                  Monitor the current status and health of user accounts across the system.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-[1.5fr,2.5fr] gap-4 px-2">
                  <span className="text-[11px] font-black text-[#5e636e] uppercase tracking-widest">Account Status</span>
                  <span className="text-[11px] font-black text-[#5e636e] uppercase tracking-widest">User Distribution</span>
                </div>

                <div className="space-y-4">
                  {userAccountData.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1.5fr,2.5fr] gap-4 items-center group cursor-pointer relative"
                      onMouseEnter={() => setHoveredAccount(idx)}
                      onMouseLeave={() => setHoveredAccount(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 border-2 border-white ring-1 ring-gray-100 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: item.color }}
                        >
                          <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        </div>
                        <span className="text-sm font-bold text-[#1a1c1e] group-hover:text-[#4C2B74] transition-colors truncate">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 relative">
                        <div className="flex-1 h-9 bg-gray-50 rounded-lg overflow-hidden relative shadow-inner border border-gray-100/50">
                          <div
                            className="absolute h-full transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-lg"
                            style={{
                              width: `${item.percentage}%`,
                              background: item.gradient,
                              boxShadow: `4px 0 12px ${item.glow}`
                            }}
                          >
                            <span className="text-[11px] font-black text-white drop-shadow-sm">{item.count}</span>
                          </div>
                        </div>


                        {/* Account Tooltip */}
                        {hoveredAccount === idx && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[100] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 pointer-events-none">
                            <div className="bg-[#1a1c1e] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 border border-white/10">
                              <span className="text-white/70">{item.percentage}%</span>
                              <span className="w-1 h-1 rounded-full bg-white/30"></span>
                              <span>({item.count}/{item.total} users)</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1a1c1e]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Team Workload (USER ONLY) */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-[#1a1c1e]">Team workload</h4>
                <p className="text-sm text-[#5e636e] mt-1 font-medium">
                  Monitor the capacity of your team.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-[1.5fr,2.5fr] gap-4 px-2">
                  <span className="text-[11px] font-black text-[#5e636e] uppercase tracking-widest">Assignee</span>
                  <span className="text-[11px] font-black text-[#5e636e] uppercase tracking-widest">Work distribution</span>
                </div>

                <div className="space-y-4">
                  {teamWorkloadData.map((member, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1.5fr,2.5fr] gap-4 items-center group cursor-pointer relative"
                      onMouseEnter={() => setHoveredWorkload(idx)}
                      onMouseLeave={() => setHoveredWorkload(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 border-2 border-white ring-1 ring-gray-100 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar ? (
                            <span className="material-symbols-outlined text-[18px]">{member.avatar}</span>
                          ) : (
                            member.initials
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#1a1c1e] group-hover:text-[#4C2B74] transition-colors truncate">
                          {member.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 relative">
                        <div className="flex-1 h-8 bg-gray-100 rounded-md overflow-hidden relative shadow-inner">
                          <div
                            className="absolute h-full transition-all duration-1000 ease-out bg-[#888995] flex items-center px-3"
                            style={{ width: `${member.percentage}%` }}
                          >
                            {member.percentage > 5 && member.name !== "Unassigned" && (
                              <span className="text-[10px] font-black text-white/90">{member.percentage}%</span>
                            )}
                          </div>
                        </div>

                        {/* Workload Tooltip */}
                        {hoveredWorkload === idx && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[100] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 pointer-events-none">
                            <div className="bg-[#1a1c1e] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 border border-white/10">
                              <span className="text-white/70">{member.percentage}%</span>
                              <span className="w-1 h-1 rounded-full bg-white/30"></span>
                              <span>({member.tasks}/{member.total} work items)</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1a1c1e]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>



        <div className="glass-card rounded-2xl overflow-hidden flex flex-col w-full min-h-[600px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isAdmin ? (
              <div className="p-8 pb-4 border-b border-gray-100 bg-white sticky top-0 z-20">
                <div className="flex flex-col gap-8">
                  {/* Header: Title + Search/Filter */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#170338]">Recent Activities</h3>


                    <div className="flex items-center gap-3">
                      <div className="relative group w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg group-focus-within:text-[#4C2B74]">search</span>
                        <input
                          type="text"
                          placeholder="Search operations..."
                          value={modalSearch}
                          onChange={(e) => setModalSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#4C2B74] outline-none transition-all text-sm font-medium"
                        />
                      </div>

                      {/* Status Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            setShowStatusFilter(!showStatusFilter);
                            setShowDateFilter(false);
                          }}
                          className={`flex items-center justify-between gap-2 min-w-[140px] px-4 py-2.5 rounded-xl border transition-all text-sm font-bold ${selectedStatus !== "All Status" ? "border-[#4C2B74] text-[#4C2B74] bg-purple-50" : "border-gray-100 text-[#5e636e] hover:bg-gray-50"}`}
                        >
                          <span className="truncate">{selectedStatus}</span>
                          <span className={`material-symbols-outlined text-gray-400 transition-transform ${showStatusFilter ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        {showStatusFilter && (
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-[100] p-2 animate-in fade-in zoom-in-95 duration-200">
                            {['All Status', 'Done', 'In Progress', 'New'].map(st => (
                              <button
                                key={st}
                                onClick={() => { setSelectedStatus(st); setShowStatusFilter(false); }}
                                className="flex items-center gap-3 w-full p-2.5 hover:bg-gray-50 rounded-xl text-sm font-bold text-[#5e636e] transition-colors"
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Date Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            setShowDateFilter(!showDateFilter);
                            setShowStatusFilter(false);
                          }}
                          className={`flex items-center justify-between gap-2 min-w-[140px] px-4 py-2.5 rounded-xl border transition-all text-sm font-bold ${selectedDate !== "All Dates" ? "border-[#4C2B74] text-[#4C2B74] bg-purple-50" : "border-gray-100 text-[#5e636e] hover:bg-gray-50"}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                            {selectedDate}
                          </div>
                          <span className={`material-symbols-outlined text-gray-400 transition-transform ${showDateFilter ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        {showDateFilter && (
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-[100] p-2 animate-in fade-in zoom-in-95 duration-200">
                            {['All Dates', 'Today', 'Yesterday', 'In the last week'].map(d => (
                              <button
                                key={d}
                                onClick={() => { setSelectedDate(d); setShowDateFilter(false); }}
                                className="flex items-center gap-3 w-full p-2.5 hover:bg-gray-50 rounded-xl text-sm font-bold text-[#5e636e] transition-colors"
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Operation Cards */}
                  <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">

                    {[
                      { id: 'User Management', label: 'User Management', sub: '156 Active Members', color: 'bg-indigo-500' },
                      { id: 'Permissions', label: 'Permissions', sub: '8 Global Roles', color: 'bg-purple-500' },
                      { id: 'Security Logs', label: 'Security Logs', sub: 'Live Audit Channel', color: 'bg-amber-500' }
                    ].map(op => (
                      <button
                        key={op.id}
                        onClick={() => setSelectedOperation(op.id)}
                        className={`min-w-[180px] max-w-[180px] p-4 rounded-xl border transition-all text-left relative overflow-hidden group border-l-[4px] ${selectedOperation === op.id ? 'bg-white border-[#4C2B74] shadow-md ring-1 ring-purple-100' : 'bg-white/60 border-gray-100 opacity-80 hover:opacity-100 hover:shadow-sm'}`}
                        style={{ borderLeftColor: op.id === 'User Management' ? '#6366f1' : op.id === 'Permissions' ? '#a855f7' : '#f59e0b' }}
                      >
                        <div className="flex flex-col gap-1">
                          <h4 className="text-[13px] font-bold text-[#170338] truncate">{op.label}</h4>
                          <p className="text-[10px] text-[#5e636e] font-medium truncate">{op.sub}</p>
                        </div>
                      </button>

                    ))}
                  </div>


                </div>
              </div>
            ) : (
              <>
                <div className="px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-20">
                  <h3 className="text-lg font-bold text-[#170338]">Recent Tasks</h3>
                </div>

                <div className="p-8 bg-[#fafbfc]/50 flex gap-4 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
                  <>
                    <div className="min-w-[150px] max-w-[150px] bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer relative group border-l-[4px] border-l-[#fbc02d]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#fbc02d] rounded-lg flex items-center justify-center text-white shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-bold text-[#170338] truncate leading-tight">Task Management...</h5>
                            <p className="text-[9px] text-[#5e636e] truncate">Team-managed</p>
                          </div>
                        </div>
                        <div className="mt-1 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-[#5e636e] font-bold relative">
                          <div
                            className="flex items-center gap-1 hover:text-[#4C2B74] transition-colors cursor-pointer group/btn"
                            onClick={(e) => { e.stopPropagation(); setIsBoardDropdownOpen(!isBoardDropdownOpen); }}
                          >
                            <span className="material-symbols-outlined text-[12px]">dashboard</span>
                            1 board
                            <span className={`material-symbols-outlined text-[14px] transition-transform ${isBoardDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                          </div>
                          {isBoardDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl py-2 min-w-[120px] z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                              <div className="px-3 py-1.5 hover:bg-purple-50 hover:text-[#4C2B74] transition-colors cursor-pointer">SCRUM Board</div>
                              <div className="px-3 py-1.5 hover:bg-purple-50 hover:text-[#4C2B74] transition-colors cursor-pointer text-gray-400">Backlog</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="min-w-[150px] max-w-[150px] bg-white/60 border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group border-l-[4px] border-l-blue-400 opacity-80 hover:opacity-100">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">brush</span>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-bold text-[#170338] truncate leading-tight">Design System</h5>
                            <p className="text-[9px] text-[#5e636e] truncate">Company-managed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </>
            )}

            {/* Role-based Interactive Tabs */}
            <div className="px-8 border-b border-gray-100 flex gap-6 bg-white sticky top-[72px] z-10 overflow-x-auto no-scrollbar">
              {taskTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTaskTab(tab)}
                  className={`py-4 text-[13px] transition-all relative whitespace-nowrap ${activeTaskTab === tab
                    ? 'font-bold text-[#4C2B74]'
                    : 'font-medium text-[#5e636e] hover:text-[#2d1b4e]'
                    }`}
                >
                  {tab}
                  {(tab === 'Assigned to me' || tab === 'Assign History') && (
                    <span className="ml-1.5 bg-gray-100/80 text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                      3
                    </span>
                  )}
                  {activeTaskTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4C2B74] rounded-t-full shadow-[0_-2px_8px_rgba(76,43,116,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-300"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Body */}
            <div className="min-h-[500px]">
              {/* 1. Worked On Tab */}
              {activeTaskTab === 'Worked on' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {["TODAY", "YESTERDAY", "IN THE LAST WEEK"].map(group => {
                    const groupTasks = filteredWorkedOn.filter(t => t.group === group);
                    if (groupTasks.length === 0) return null;
                    return (
                      <div key={group}>
                        <div className="px-8 py-3 bg-gray-50/50 border-b border-gray-50/50">
                          <p className="text-[10px] font-black text-[#5e636e] uppercase tracking-widest">{group}</p>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {groupTasks.map((task, idx) => (
                            <div key={idx} className="px-8 py-6 flex items-center justify-between hover:bg-[#f9f1fc]/40 transition-all cursor-pointer group/item">
                              <div className="flex items-center gap-4">
                                <div className="w-7 h-7 rounded-lg bg-[#eef2ff] border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover/item:scale-110 transition-transform">
                                  <span className="material-symbols-outlined text-[18px] font-bold">check_box</span>
                                </div>
                                <div className="min-w-0 pr-4">
                                  <h5 className="font-bold text-[#170338] text-[14px] group-hover/item:text-[#4C2B74] transition-colors line-clamp-1">{task.title}</h5>
                                  <p className="text-[11px] text-[#5e636e] mt-1 font-medium">{task.subtitle}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8 shrink-0">
                                <div className="text-right whitespace-nowrap">
                                  <p className="text-[10px] text-[#5e636e] font-medium">Updated</p>
                                  <p className="text-[10px] font-black text-[#170338] uppercase tracking-tight">{task.time || "2H AGO"}</p>
                                </div>
                                <div className="flex items-center">
                                  {isAdmin && task.assignees ? (
                                    <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                                      {task.assignees.map((assignee, aIdx) => (
                                        <div
                                          key={aIdx}
                                          className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md transition-transform hover:scale-110 hover:z-10"
                                          style={{ backgroundColor: assignee.color }}
                                          title={assignee.name}
                                        >
                                          {assignee.initials}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 border-white ring-1 ring-gray-100">TN</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Viewed Tab */}
              {activeTaskTab === 'Viewed' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {["Today", "Yesterday"].map(group => {
                    const groupTasks = filteredViewed.filter(t => t.group === group);
                    if (groupTasks.length === 0) return null;
                    return (
                      <div key={group}>
                        <div className="px-8 py-3 bg-gray-50/50 border-b border-gray-50">
                          <p className="text-[10px] font-black text-[#5e636e] uppercase tracking-widest">{group}</p>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {groupTasks.map((task, idx) => (
                            <div key={idx} className="px-8 py-5 flex items-center gap-4 hover:bg-[#f9f1fc]/40 transition-all cursor-pointer group">
                              <div className="w-6 h-6 rounded-md bg-[#eef2ff] border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[16px] font-bold">{task.icon}</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-[#170338] text-[13.5px] group-hover:text-[#4C2B74] transition-colors">{task.title}</h5>
                                <p className="text-[11px] text-[#5e636e] mt-0.5 font-medium">{task.subtitle}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Assign History (Admin) / Assigned to me (User) */}
              {(activeTaskTab === 'Assigned to me' || activeTaskTab === 'Assign History') && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {isAdmin ? (
                    <div className="divide-y divide-gray-50">
                      <div className="px-8 py-3 bg-gray-50/50">
                        <p className="text-[10px] font-black text-[#8c8c8c] uppercase tracking-widest">TASK ASSIGNMENT HISTORY</p>
                      </div>

                      {filteredAssigned.map((task, idx) => (
                        <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-[#f9f1fc]/40 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm group-hover:scale-110 transition-transform bg-amber-50 text-amber-600 border-amber-100">
                              <span className="material-symbols-outlined text-[20px]">history</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-[#170338] text-[13.5px] group-hover:text-[#4C2B74] transition-colors">{task.title}</h5>
                              <p className="text-[11px] text-[#5e636e] mt-0.5 font-medium">{task.subtitle}</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded text-[9px] font-black bg-[#f4f5f7] text-[#5e636e] border border-[#dfe1e6] uppercase">DONE</span>
                        </div>

                      ))}
                    </div>
                  ) : (
                    ["IN PROGRESS", "IN REVIEW", "TO DO"].map(group => {
                      const groupTasks = filteredAssigned.filter(t => t.group === group);
                      if (groupTasks.length === 0) return null;
                      return (
                        <div key={group}>
                          <div className="px-8 py-3 bg-gray-50/50 border-b border-gray-50/50">
                            <p className="text-[10px] font-black text-[#5e636e] uppercase tracking-widest">{group}</p>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {groupTasks.map((task, idx) => (
                              <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-[#f9f1fc]/40 transition-all cursor-pointer group/item">
                                <div className="flex items-center gap-4">
                                  <div className="w-6 h-6 rounded-md bg-[#eef2ff] border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm group-hover/item:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[16px] font-bold">check_box</span>
                                  </div>
                                  <div className="min-w-0 pr-4">
                                    <h5 className="font-bold text-[#170338] text-[13.5px] group-hover/item:text-[#4C2B74] transition-colors line-clamp-1">{task.title}</h5>
                                    <p className="text-[11px] text-[#5e636e] mt-1 font-medium">{task.subtitle}</p>
                                  </div>
                                </div>
                                <span className="text-[12px] font-medium text-[#5e636e] shrink-0">{task.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div> </div>
  );
};
export default Dashboard;