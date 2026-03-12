import { NavLink } from "react-router-dom";

function BottomNav() {
    return (
        <nav className="bottom-nav" aria-label="Main navigation">
            <NavLink
                to="/"
                className={({ isActive }) => `bottom-nav-link${isActive ? " active" : ""}`}
                end
            >
                Home
            </NavLink>
            <NavLink
                to="/admin"
                className={({ isActive }) => `bottom-nav-link${isActive ? " active" : ""}`}
            >
                Admin
            </NavLink>
        </nav>
    );
}

export default BottomNav;
