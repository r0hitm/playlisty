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
    // const [intialFetch, setInitialFetch] = useState<boolean>(true);
    const [tracks, setTracks] = useState<ExtendedPlaylistedTracks | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const [allTracksLoaded, setAllTracksLoaded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // DISCOVERED: First fetch is different from subsequent fetches
    // I cannot use getPlaylistItems(activePlaylist.id) for subsequent fetches
    // because it will return the same items as the first fetch.
    // Instead I need to use the tracks.next property to make the request
    // using sdk.makeRequest("GET", tracks.next) to get the next set of tracks

    async function fetchTracks(
        activePlaylistOrNextUrl: SimplifiedPlaylist | string | null
    ) {
        if (!sdk || !activePlaylistOrNextUrl) {
            return;
        }
        setIsLoading(true);

        let tracks;
        let extendedTracks: ExtendedPlaylistedTracks | null = null;

        if (typeof activePlaylistOrNextUrl === "string") {
            const resp = await sdk.makeRequest("GET", activePlaylistOrNextUrl);
            console.log("Next URL response", resp);
            // extendedTracks = {
            //     ...tracks,
            //     allItems: tracks.items,
            // };
        } else {
            tracks = await sdk.playlists.getPlaylistItems(
                activePlaylistOrNextUrl.id
            );
            extendedTracks = {
                ...tracks,
                allItems: [...tracks.items],
            };
        }

        // const tracks = await sdk.playlists.getPlaylistItems(activePlaylist.id);
        // const extendedTracks: ExtendedPlaylistedTracks = {
        //     ...tracks,
        //     allItems: intialFetch ? tracks.items : [...tracks.items],
        // };
        setTracks(extendedTracks);
        setIsLoading(false);
    }

    useEffect(() => {
        (async () => await fetchTracks(activePlaylist))();
        // setInitialFetch(false);
        setSelectedTrack(null);

        // return () => setInitialFetch(true);
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
                        void fetchTracks(tracks?.next ?? null);
                    }}
                >
                    Load more
                </button>
            )}
        </div>
    );
}
