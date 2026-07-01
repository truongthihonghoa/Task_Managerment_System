import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  UserPlus,
  RefreshCw,
  MessageSquare,
  Clock,
  AlertCircle,
  Mail,
  Bell,
  ShieldCheck,
  Lock,
  UserCheck,
} from "lucide-react";

const NotificationSettingsPage = () => {
  const [searchParams] = useSearchParams();

  // Default ADMIN nếu không truyền role
  const roleParam = searchParams.get("role")?.toUpperCase();
  const currentRole = roleParam === "USER" ? "USER" : "ADMIN";

  // ==========================
  // USER SETTINGS
  // ==========================
  const userSettings = [
    {
      key: "task_assigned",
      label: "Task assigned",
      emailDescription: "When a new task is assigned to you",
      appDescription: "Desktop and mobile alerts for new assignments",
      icon: UserPlus,
    },
    {
      key: "status_changed",
      label: "Status changed",
      emailDescription: "When a task you are involved in changes status",
      appDescription: "Real-time updates on task status changes",
      icon: RefreshCw,
    },
    {
      key: "comment_added",
      label: "New comments",
      emailDescription: "When someone comments on your task",
      appDescription: "Alerts for new comments on your tasks",
      icon: MessageSquare,
    },
    {
      key: "due_today",
      label: "Due today",
      emailDescription: "Reminder for tasks due today",
      appDescription: "Push notifications for today's deadlines",
      icon: Clock,
    },
    {
      key: "task_overdue",
      label: "Task overdue",
      emailDescription: "Alert when a task becomes overdue",
      appDescription: "Notify when a task misses its deadline",
      icon: AlertCircle,
    },
  ];

  // ==========================
  // ADMIN SETTINGS
  // ==========================
  const adminSettings = [
    {
      key: "user_registered",
      label: "New user registered",
      emailDescription: "Notify when a new user registers",
      appDescription: "Receive alerts for new user registrations",
      icon: UserPlus,
    },
    {
      key: "account_locked",
      label: "Account locked",
      emailDescription: "Notify when an account is locked",
      appDescription: "Receive alerts for locked user accounts",
      icon: Lock,
    },
    {
      key: "user_verified",
      label: "User verified",
      emailDescription: "Notify when a user account is verified",
      appDescription: "Receive alerts when users are verified",
      icon: UserCheck,
    },
    {
      key: "system_alert",
      label: "System alerts",
      emailDescription: "Critical system events and warnings",
      appDescription: "Real-time critical system notifications",
      icon: ShieldCheck,
    },
  ];

  const settings =
    currentRole === "ADMIN" ? adminSettings : userSettings;

  const initialState = settings.reduce((acc, item) => {
    acc[item.key] = true;
    return acc;
  }, {});

  const [emailSettings, setEmailSettings] = useState(initialState);
  const [appSettings, setAppSettings] = useState(initialState);

  const toggleEmail = (key) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleApp = (key) => {
    setAppSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingRow = ({
    label,
    description,
    checked,
    onChange,
    IconComponent,
  }) => (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-gray-50 rounded-lg shrink-0">
          <IconComponent className="w-5 h-5 text-gray-500" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-800">{label}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>

      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-[#4C2B74]" : "bg-gray-200"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );

  const handleSave = () => {
    console.log({
      role: currentRole,
      emailSettings,
      appSettings,
    });

    alert("Preferences saved successfully!");
  };

  return (
    <div className="p-8 w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden">

      <div className="mb-8 flex-shrink-0">
        <h1 className="text-2xl font-bold text-[#4C2B74]">
          Notification Settings
        </h1>

        <p className="text-sm text-gray-500">
          {currentRole === "ADMIN"
            ? "Manage how you receive important system notifications."
            : "Choose how and when you want to be notified."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">

        {/* Email */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">

          <div className="flex items-center space-x-3 mb-6">
            <Mail className="w-6 h-6 text-[#4C2B74]" />
            <h2 className="text-lg font-bold">
              Email Notifications
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {settings.map((item) => (
              <SettingRow
                key={item.key}
                label={item.label}
                description={item.emailDescription}
                IconComponent={item.icon}
                checked={emailSettings[item.key]}
                onChange={() => toggleEmail(item.key)}
              />
            ))}
          </div>

        </section>
        {/* In-App Notifications */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">

          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-[#4C2B74]" />
            <h2 className="text-lg font-bold">
              In-App Notifications
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {settings.map((item) => (
              <SettingRow
                key={item.key}
                label={item.label}
                description={item.appDescription}
                IconComponent={item.icon}
                checked={appSettings[item.key]}
                onChange={() => toggleApp(item.key)}
              />
            ))}
          </div>

        </section>

      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end flex-shrink-0">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#2D1B4E] text-white font-bold rounded-xl hover:bg-[#3E225F] transition-all shadow-lg shadow-[#4C2B74]/20"
        >
          Save Change
        </button>
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

export default NotificationSettingsPage;