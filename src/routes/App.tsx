import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";
import DropDown from "../components/DropDown";
import Tracks from "../components/Tracks";
import InThese from "../components/InThese";
import NotInThese from "../components/NotInThese";
import { SimplifiedPlaylist, Track } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import { ExtendedPlaylistPage /*PlaylistTracks*/ } from "../customInterfaces";

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sdk = useSdk();

    const [playlists, setPlaylists] = useState<ExtendedPlaylistPage | null>(
        null
    );
    // const [playlistTracks, setPlaylistTracks] = useState<PlaylistTracks | null>(
    //     null
    // );

    const [selectedPlaylist, setSelectedPlaylist] =
        useState<SimplifiedPlaylist | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    // const handlePlaylists = (playlists: ExtendedPlaylistPage) => {
    //     setPlaylists(prev => {
    //         if (prev) {
    //             return {
    //                 ...prev,
    //                 allItems: [...prev.allItems, ...playlists.items],
    //             };
    //         }
    //         return playlists;
    //     });
    // };

    function fetchPlaylists() {
        setIsLoading(true);
        (async () => {
            try {
                const fetchPlaylists =
                    await sdk?.currentUser.playlists.playlists();
                if (!fetchPlaylists) {
                    throw new Error(
                        "Failed to fetch playlists. Either the SDK is not initialized or the request failed."
                    );
                }
                // handlePlaylists({
                //     ...fetchPlaylists,
                //     allItems: fetchPlaylists.items,
                // });
                setPlaylists(prev => {
                    if (prev) {
                        return {
                            ...prev,
                            allItems: [
                                ...prev.allItems,
                                ...fetchPlaylists.items,
                            ],
                        };
                    }
                    return {
                        ...fetchPlaylists,
                        allItems: fetchPlaylists.items,
                    };
                });
                if (!playlists) {
                    console.log("Initial fetch for playlists complete.");
                    handlePlaylistSelect(fetchPlaylists.items[0]);
                }
                console.log("Fetched current user's playlists", fetchPlaylists);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }

    const handlePlaylistSelect = (playlist: SimplifiedPlaylist) => {
        setSelectedPlaylist(playlist);
    };

    const handleTrackSelect = (track: Track | null) => {
        setSelectedTrack(track);
    };

    return (
        <div className="app-layout">
            <DropDown
                playlists={playlists}
                fetchPlaylists={fetchPlaylists}
                selectedPlaylist={selectedPlaylist}
                handleSelect={handlePlaylistSelect}
                loading={isLoading}
            />
            <Tracks
                activePlaylist={selectedPlaylist}
                selectedTrack={selectedTrack}
                handleTrackSelect={handleTrackSelect}
            />
            <InThese playlists={playlists} activeTrack={selectedTrack} />
            <NotInThese playlists={playlists} activeTrack={selectedTrack} />
        </div>
    );
}

export default App;
