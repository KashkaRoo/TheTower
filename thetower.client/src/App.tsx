import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import TowerHeader from "./components/TowerHeader";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
    return (
        <div className="app-body">
            <TowerHeader />
            <NavBar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
