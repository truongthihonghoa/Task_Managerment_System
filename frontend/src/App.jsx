import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import TaskManagement from "./pages/TaskManagement";
import SpaceManagement from "./pages/SpaceManagement";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Mở web là vào Login */}
                <Route 
                    path="/" 
                    element={<LoginPage />}
                />


                {/* Main Layout */}
                <Route path="/mainlayout" element={<MainLayout />}>
                    <Route index element={<SpaceManagement />} />
                    <Route path="tasks" element={<SpaceManagement />} />
                    <Route path="tasks/:spaceId" element={<TaskManagement />} />
                </Route>


                {/* Không tìm thấy route */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />


            </Routes>

        </BrowserRouter>

    );

}