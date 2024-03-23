import "./Header.css";

export function Header({
    logInStatus,
    login,
    logout,
}: {
    logInStatus: boolean
    login: () => void;
    logout: () => void;
}) {
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
