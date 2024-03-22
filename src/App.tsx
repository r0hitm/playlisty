import { useSpotify } from "./hooks/useSpotify";
import {
    Scopes /*SearchResults, SpotifyApi*/,
} from "@spotify/web-api-ts-sdk";
import "./App.css";

function App() {
    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
        import.meta.env.VITE_REDIRECT_TARGET as string,
        Scopes.userDetails
    );

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
                            console.log("TODO: Log out");
                        }}
                    >
                        Log out
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            console.log("TODO: Log in");
                        }}
                    >
                        Log in
                    </button>
                )}
            </header>
        </>
    );
}

export default App;
