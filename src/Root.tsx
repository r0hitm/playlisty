import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { useSpotify } from "./hooks/useSpotify";
import { FloatingFooter } from "./components/FloatingFooter";
import "./article-ishStyles.css";

export default function Root() {
    const { sdk, logIn, logOut } = useSpotify();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("code")) {
            void logIn();
        }
    }, []);

    return (
        <>
            <Header
                logInStatus={sdk !== null}
                login={() => {
                    void logIn(); 
                }}
                logout={logOut}
            />
            <Outlet context={sdk} />
            <FloatingFooter />
            {sdk ? <Navigate to="/app" replace /> : null}
            {!sdk && location.pathname === "/" ? (
                <article>
                    <p>
                        Track your songs across playlists in a single view! 🎶
                    </p>
                    <p>
                        Hard to keep track of which songs are in which playlist?
                        This app will help you with that! 📝
                    </p>
                    <p>Get started by logging in with your Spotify! 🎵</p>
                </article>
            ) : null}
        </>
    );
}
