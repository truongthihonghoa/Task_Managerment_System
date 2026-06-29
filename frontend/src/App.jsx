import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

import MainLayout from "./components/layout/MainLayout";
import SpaceManagement from "./pages/SpaceManagement";
import TaskManagement from "./pages/TaskManagement";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="spaces" element={<SpaceManagement />} />
                    <Route path="tasks/:spaceId" element={<TaskManagement />} />
                    <Route path="users" element={<UserManagement />} />
                </Route>

                {/* Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}