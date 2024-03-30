import { useEffect, useState } from "react";
import { PlaylistTracks, filteredPlaylistsState } from "../customInterfaces";
import PlaylistItem from "./PlaylistItem";

export default function NotInThese({
    playlistTracks,
    activeTrack,
}: {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: string | null;
}) {
    const [notInThese, setNotInThese] = useState<filteredPlaylistsState[]>([]);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const notInThese: filteredPlaylistsState[] = [];
        playlistTracks.forEach(playlist => {
            if (
                !playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack
                )
            ) {
                notInThese.push({
                    id: playlist.playlist_id,
                    name: playlist.name,
                    isOwner: playlist.is_owner,
                });
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
                {notInThese.map((playlist, i) => (
                    <li key={playlist.id} className="playlist-item-wrapper">
                        <span>{i + 1}. </span>
                        <PlaylistItem
                            title={playlist.name}
                            addBtn={true}
                            isOwner={playlist.isOwner}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
