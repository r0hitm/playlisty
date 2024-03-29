import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";

export default function NotInThese({
    playlistTracks,
    activeTrack,
}: {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: string | null;
}) {
    const [notInThese, setNotInThese] = useState<string[]>([]);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const notInThese: string[] = [];
        playlistTracks.forEach(playlist => {
            if (
                !playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack
                )
            ) {
                notInThese.push(playlist.name);
            }
        });

        setNotInThese(notInThese);

        return () => {
            setNotInThese([]);
        };
    }, [activeTrack]);

    return (
        <div className="not-in-these-component">
            <h2>NOT In Playlists</h2>
            <ul>
                {notInThese.map(playlistName => (
                    <li key={playlistName}>{playlistName}</li>
                ))}
            </ul>
        </div>
    );
}
