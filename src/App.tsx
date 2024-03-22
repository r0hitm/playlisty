import { useSpotify } from "./hooks/useSpotify";
import {
    Scopes /*SearchResults, SpotifyApi*/,
    UserProfile,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
        import.meta.env.VITE_REDIRECT_TARGET as string,
        Scopes.userDetails
    );

    const [user, setUser] = useState<UserProfile | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const currentUser = await sdk?.currentUser.profile();
                currentUser && setUser(currentUser);
            } catch (err: unknown) {
                console.log(
                    "An error occured while fetching user profile",
                    err
                );
            }
        })();
    });

    return (
        <>
            <h1>こんにちは、頑張っている！</h1>
            <p>{user?.display_name}</p>
            <p>{user?.email}</p>
            <p>{user?.country}</p>
            {user?.images ? (
                <img src={user?.images[0].url} alt="profile" />
            ) : null}
        </>
    );
}

export default App;
