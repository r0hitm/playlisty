import { NavLink } from "react-router-dom";
import "./Header.css";

export function Header({
    logInStatus,
    login,
    logout,
}: {
    logInStatus: boolean;
    login: () => void;
    logout: () => void;
}) {
    return (
        <header>
            <img src="./Logo.webp" alt="Logo" className="logo" />
            <nav>
                <ul>
                    <li>
                        <NavLink to="/app" end replace>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" end replace>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/privacy-policy" end replace>
                            Privacy Policy
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {logInStatus ? (
                <button
                    onClick={() => {
                        logout();
                    }}
                >
                    Log out
                </button>
            ) : (
                <button
                    onClick={() => {
                        login();
                    }}
                >
                    Log in with Spotify
                </button>
            )}
        </header>
    );
}
