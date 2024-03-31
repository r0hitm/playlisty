import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { useSpotify } from "./hooks/useSpotify";
import { FloatingFooter } from "./components/FloatingFooter";

export default function Root() {
    const { sdk, logIn, logOut } = useSpotify();

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
            {sdk ? (
                <Navigate to="/app" replace />
            ) : (
                <p>Get started with logging in with Spotify!</p>
            )}
        </>
    );
}
