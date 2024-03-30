// import { Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { PlaylistTracks, filteredPlaylistsState } from "../customInterfaces";
import "./InTheseNotInThese.css";
import PlaylistItem from "./PlaylistItem";

export default function InThese({
    playlistTracks,
    activeTrack,
    activePlaylist,
}: {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: string | null;
    activePlaylist: string | null;
}) {
    const [inThese, setInThese] = useState<filteredPlaylistsState[]>([]);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const inThese: filteredPlaylistsState[] = [];
        playlistTracks.forEach(playlist => {
            if (
                playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack
                ) &&
                playlist.playlist_id !== activePlaylist
            ) {
                inThese.push({
                    id: playlist.playlist_id,
                    name: playlist.name,
                    isOwner: playlist.is_owner,
                });
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
                {inThese.map((playlist, i) => (
                    // <li key={playlistName} className="playlist-item-wrapper">
                    //     <span>{i + 1}. </span>
                    //     <PlaylistItem title={playlistName} addBtn={false} />
                    // </li>
                    <li key={playlist.id} className="playlist-item-wrapper">
                        <span>{i + 1}. </span>
                        <PlaylistItem
                            title={playlist.name}
                            addBtn={false}
                            isOwner={playlist.isOwner}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
