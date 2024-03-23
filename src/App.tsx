import "./App.css";
import { useSpotifySdk } from "./useSpotifySdk";

function App({ login, logout }: { login: () => void; logout: () => void }) {
    const sdk = useSpotifySdk();

    return (
        <>
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
            {sdk ? <p>Logged In</p> : <p>Not Logged In</p>}
        </>
    );
}

export default App;
