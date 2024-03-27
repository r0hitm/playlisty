import {
    PlaylistedTrack,
    SimplifiedPlaylist,
    Track,
    Page,
} from "@spotify/web-api-ts-sdk";
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
            try {
                setIsLoading(true);
                setAllTracksLoaded(false);
                const playlistTracks = await sdk.playlists.getPlaylistItems(
                    activePlaylist.id
                );
                const allItems = playlistTracks.items;
                setTracks({
                    ...playlistTracks,
                    allItems,
                });
                if (!playlistTracks.next) {
                    setAllTracksLoaded(true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            setTracks(null);
            setSelectedTrack(null);
        };
    }, [activePlaylist]);

    // function for loading more tracks, next set of tracks
    const loadMoreTracks = async () => {
        if (!sdk || !tracks?.next) {
            return;
        }

        try {
            setIsLoading(true);
            // DEBUGGIN: Trying to make the request w/o the sdk.makeRequest method
            // if I can get the next set of tracks, then sdk.makeRequest is broken
            const accessToken = await sdk.getAccessToken();
            if (!accessToken) {
                throw new Error("No access token");
            }
            console.log("next", tracks.next);
            console.log("accessToken", accessToken);
            const response = await fetch(tracks.next, {
                headers: {
                    Authorization: `Bearer ${accessToken.access_token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch");
            }
            console.log("response", response);
            const nextTracks = (await response.json()) as Page<
                PlaylistedTrack<Track>
            >;
            console.log("nextTracks", nextTracks);
            const allItems = [...tracks.allItems, ...nextTracks.items];
            setTracks({
                ...nextTracks,
                allItems,
            });

            if (!nextTracks.next) {
                setAllTracksLoaded(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        void loadMoreTracks();
                        console.log("Should be loaded");
                    }}
                >
                    Load more
                </button>
            )}
        </div>
    );
}
