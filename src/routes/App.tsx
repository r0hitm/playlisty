import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";
import DropDown from "../components/DropDown";
import Tracks from "../components/Tracks";
import InThese from "../components/InThese";
import NotInThese from "../components/NotInThese";
import {
    Page,
    PlaylistedTrack,
    SimplifiedPlaylist,
    Track,
} from "@spotify/web-api-ts-sdk";
import { useCallback, useState } from "react";
import { ExtendedPlaylistPage, PlaylistTracks } from "../customInterfaces";

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sdk = useSdk();

    const [playlists, setPlaylists] = useState<ExtendedPlaylistPage | null>(
        null
    );
    const [playlistTracks, setPlaylistTracks] = useState<
        PlaylistTracks[] | null
    >(null);

    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    const fetchPlaylistsAndTracks = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchPlaylists = await sdk?.currentUser.playlists.playlists();
            if (!fetchPlaylists) {
                throw new Error(
                    "Failed to fetch playlists. Either the SDK is not initialized or the request failed."
                );
            }
            setPlaylists(prev => {
                if (prev) {
                    return {
                        ...prev,
                        allItems: [...prev.allItems, ...fetchPlaylists.items],
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

            const promises = fetchPlaylists.items.map(playlist =>
                sdk?.playlists.getPlaylistItems(playlist.id)
            );

            const results = (await Promise.all(promises)) as Page<
                PlaylistedTrack<Track>
            >[];
            const playlistTracks = results.map((playlistTrack, index) => {
                return {
                    playlist_id: fetchPlaylists.items[index].id,
                    tracks: {
                        ...playlistTrack,
                        allItems: playlistTrack?.items ?? [],
                    },
                };
            });
            setPlaylistTracks(playlistTracks);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    const handlePlaylistSelect = (playlist: SimplifiedPlaylist) => {
        setSelectedPlaylist(playlist.id);
    };

    const handleTrackSelect = (track: Track | null) => {
        setSelectedTrack(track?.id ?? null);
    };

    return (
        <div className="app-layout">
            <DropDown
                playlists={playlists}
                fetchPlaylists={() => {
                    fetchPlaylistsAndTracks()
                        .then(() => {
                            console.log("Everything should be fetched now.");
                        })
                        .catch((e: unknown) => {
                            const error = e as Error;
                            console.error("Everything is NOT fetched", error);
                        });
                }}
                selectedPlaylist={selectedPlaylist}
                handleSelect={handlePlaylistSelect}
                loading={isLoading}
            />
            <Tracks
                activePlaylist={
                    playlistTracks?.find(
                        playlist => playlist.playlist_id === selectedPlaylist
                    ) ?? null
                }
                selectedTrack={selectedTrack}
                handleTrackSelect={handleTrackSelect}
                loading={isLoading}
            />
            <InThese playlists={playlists} activeTrack={selectedTrack} />
            <NotInThese playlists={playlists} activeTrack={selectedTrack} />
        </div>
    );
}

export default App;
