import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ExtendedPlaylistPage, PlaylistTracks } from "./customInterfaces";
import { Track } from "@spotify/web-api-ts-sdk";
import { Header } from "./components/Header";
import { useSpotify } from "./hooks/useSpotify";
import { FloatingFooter } from "./components/FloatingFooter";
import "./article-ishStyles.css";

export default function Root() {
    const { sdk, logIn, logOut } = useSpotify();
    const location = useLocation();

    // Moved these from <App /> to here to prevent refetching
    // when navigating between pages, and to keep the state and not make the
    // user wait for the data to load again and also give the api a break
    const [playlists, setPlaylists] = useState<ExtendedPlaylistPage | null>(
        null
    );
    // This is workaround for the Liked Songs playlist, because
    // I do not want to refactor my custom interfaces for ExtendedPlaylistPage now
    // Dropdown accounts for this as well, by extending the playlist items and
    // using the id as a string
    // WTF?? Spotify treat this a different way than other playlists
    const likedPlaylistId = useRef("liked");

    const [playlistTracks, setPlaylistTracks] = useState<
        PlaylistTracks[] | null
    >(null);

    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

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
            <Outlet
                context={{
                    sdk,
                    playlists,
                    setPlaylists,
                    likedPlaylistId,
                    playlistTracks,
                    setPlaylistTracks,
                    selectedPlaylist,
                    setSelectedPlaylist,
                    selectedTrack,
                    setSelectedTrack,
                }}
            />
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
                    <p>
                        🔴 Though, techincally complete, the App is in
                        <i>&quot;development mode&quot;</i>, and I have
                        requested the Spotify team for{" "}
                        <i>&quot;Extended Quota Mode&qouot;</i> which can take
                        upto 6 weeks. As such, anyone whose email account I do
                        not add manually, will not be able to use the app.
                        Let&apos;s wait patiently and hope for the best. 🤞
                    </p>
                    <p>
                        ⚠ If you want to try the app nonetheless, contact me and
                        I will add your email to the list. <strong>Note</strong>
                        : There is a limit of 25 users, so I might not be able
                        to add everyone.
                    </p>
                    <p>
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/9ssFiGuGMhg?si=xyABhyHZUwkqFXcO"
                            title="Playlisty for Spotify | A Demo Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </p>
                </article>
            ) : null}
        </>
    );
}
