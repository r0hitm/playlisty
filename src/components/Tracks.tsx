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
import Loading from "./Loading";

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

    const loadMoreTracks = async () => {
        if (!sdk || !tracks?.next) {
            return;
        }

        try {
            setIsLoading(true);
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
            {isLoading && <Loading />}
            {allTracksLoaded ? (
                <p>Loaded everything</p>
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
