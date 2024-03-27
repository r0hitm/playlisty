import { SimplifiedPlaylist, Track } from "@spotify/web-api-ts-sdk";
import "./Tracks.css";
import { useEffect, useState } from "react";
import useSdk from "../hooks/useSdk";
import { ExtendedPlaylistedTracks } from "../customInterfaces";

export default function Tracks({
    activePlaylist,
}: {
    activePlaylist: SimplifiedPlaylist | null;
}) {
    const sdk = useSdk();
    const [tracks, setTracks] = useState<ExtendedPlaylistedTracks | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const [allTracksLoaded, setAllTracksLoaded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // DISCOVERED: First fetch is different from subsequent fetches
    // I cannot use getPlaylistItems(activePlaylist.id) for subsequent fetches
    // because it will return the same items as the first fetch.
    // Instead I need to use the tracks.next property to make the request
    // using sdk.makeRequest("GET", tracks.next) to get the next set of tracks

    // effect for the first fetch
    useEffect(() => {
        if (!sdk || !activePlaylist) {
            return;
        }

        (async () => {
            setIsLoading(true);
            const playlistTracks = await sdk.playlists.getPlaylistItems(
                activePlaylist.id
            );
            const allItems = playlistTracks.items;
            setTracks({
                ...playlistTracks,
                allItems,
            });
            setIsLoading(false);
        })();

        return () => {
            setTracks(null);
            setSelectedTrack(null);
        };
    }, [activePlaylist]);

    return (
        <div className="tracks-component">
            <h2>Songs in this playlist</h2>
            <ul>
                {tracks?.allItems.map((track, index) => (
                    <li
                        key={index}
                        className={
                            selectedTrack?.id === track.track.id
                                ? "selected"
                                : ""
                        }
                        onClick={() => setSelectedTrack(track.track)}
                    >
                        <span className="title">{track.track.name}</span>
                        <span className="artist">
                            {track.track.artists[0].name}
                        </span>
                    </li>
                ))}
            </ul>
            {isLoading && <p>Loading...</p>}
            {allTracksLoaded ? (
                <p>All tracks loaded</p>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        console.log("Loding more tracks...");
                        // A function call to load more tracks
                        console.log("Should be loaded");
                    }}
                >
                    Load more
                </button>
            )}
        </div>
    );
}
