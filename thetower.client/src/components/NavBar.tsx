import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="tower-nav" aria-label="Main navigation">
            <NavLink
                to="/"
                end
                className={({ isActive }) => `tower-nav-link${isActive ? " active" : ""}`}
            >
                Home
            </NavLink>
            <NavLink
                to="/admin"
                className={({ isActive }) => `tower-nav-link${isActive ? " active" : ""}`}
            >
                Admin
            </NavLink>
        </nav>
    );
}
