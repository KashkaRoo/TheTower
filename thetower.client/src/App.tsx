import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BottomNav from "./components/BottomNav.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import HomePage from "./pages/HomePage.tsx";

function App() {
    return (
        <div className="app-shell">
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <BottomNav />
        </div>
    );
}

export default App;