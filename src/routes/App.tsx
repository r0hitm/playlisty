import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";
import DropDown from "../components/DropDown";
import Tracks from "../components/Tracks";
import InThese from "../components/InThese";
import NotInThese from "../components/NotInThese";
import { SimplifiedPlaylist, Track } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import { ExtendedPlaylistPage } from "../customInterfaces";

function App() {
    const sdk = useSdk();
    const [playlists, setPlaylists] = useState<ExtendedPlaylistPage | null>(
        null
    );
    const [selectedPlaylist, setSelectedPlaylist] =
        useState<SimplifiedPlaylist | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    const handlePlaylists = (playlists: ExtendedPlaylistPage) => {
        setPlaylists(prev => {
            if (prev) {
                return {
                    ...prev,
                    allItems: [...prev.allItems, ...playlists.items],
                };
            }
            return playlists;
        });
    };

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
                handlePlaylists={handlePlaylists}
                selectedPlaylist={selectedPlaylist}
                handleSelect={handlePlaylistSelect}
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
