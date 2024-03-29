// import { Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";

export default function InThese({
    playlistTracks,
    activeTrack,
    activePlaylist,
}: {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: string | null;
    activePlaylist: string | null;
}) {
    const [inThese, setInThese] = useState<string[]>([]);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const inThese: string[] = [];
        playlistTracks.forEach(playlist => {
            if (
                playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack
                ) &&
                playlist.playlist_id !== activePlaylist
            ) {
                inThese.push(playlist.name);
            }
        });

        setInThese(inThese);

        return () => {
            setInThese([]);
        };
    }, [activeTrack]);

    return (
        <div className="in-these-component">
            <h2>Also In Playlists</h2>
            <ul>
                {inThese.map(playlistName => (
                    <li key={playlistName}>{playlistName}</li>
                ))}
            </ul>
        </div>
    );
}
