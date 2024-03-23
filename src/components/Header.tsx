import { useSpotifySdk } from "../useSpotifySdk";
import "./Header.css";

export function Header({
    login,
    logout,
}: {
    login: () => void;
    logout: () => void;
}) {
    const sdk = useSpotifySdk();

    return (
        <header>
            <img src="/Logo.webp" alt="Logo" className="logo" />
            <ul>
                <li>
                    <a href="#">About</a>
                </li>
                <li>
                    <a href="#">Privacy Policy</a>
                </li>
            </ul>
            {sdk ? (
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
