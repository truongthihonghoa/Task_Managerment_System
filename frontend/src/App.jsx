import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/layout/MainLayout";


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
                <Route 
                    path="/mainlayout" 
                    element={<MainLayout />}
                />


                {/* Không tìm thấy route */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />


            </Routes>

        </BrowserRouter>

    );

}