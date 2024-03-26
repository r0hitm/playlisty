import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
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
    const [intialFetch, setInitialFetch] = useState<boolean>(true);
    const [tracks, setTracks] = useState<ExtendedPlaylistedTracks | null>(null);

    async function fetchTracks(activePlaylist: SimplifiedPlaylist | null) {
        if (!sdk || !activePlaylist) {
            return;
        }

        const tracks = await sdk.playlists.getPlaylistItems(activePlaylist.id);
        const extendedTracks: ExtendedPlaylistedTracks = {
            ...tracks,
            allItems: intialFetch ? tracks.items : [...tracks.items],
        };
        setTracks(extendedTracks);
    }

    useEffect(() => {
        (async () => await fetchTracks(activePlaylist))();
        setInitialFetch(false);

        return () => setInitialFetch(true);
    }, [activePlaylist]);

    return (
        <div className="tracks-component">
            <h2>Tracks</h2>
            <ul>
                {tracks?.allItems.map((track, index) => (
                    <li key={index}>
                        <span>{track.track.name}</span>
                        <span>{track.track.artists[0].name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
