// import { Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";
import "./InTheseNotInThese.css";
import PlaylistItem from "./PlaylistItem";

interface InTheseProps {
    playlistTracks: PlaylistTracks[] | null;
    activeTrackId: string | null;
    activeTrackUri: string | null;
    activePlaylist: string | null;
    updatePlaylistTracks: (newPlaylistTracks: PlaylistTracks[]) => void;
}

export default function InThese({
    playlistTracks,
    activeTrackId,
    activeTrackUri,
    activePlaylist,
    updatePlaylistTracks,
}: InTheseProps) {
    const [inThese, setInThese] = useState<PlaylistTracks[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!playlistTracks || !activeTrackId) {
            return;
        }

        const inThese: PlaylistTracks[] = [];
        playlistTracks.forEach(playlist => {
            if (
                playlist.tracks.allItems.some(
                    track => track.track.id === activeTrackId
                ) &&
                playlist.playlist_id !== activePlaylist
            ) {
                inThese.push(playlist);
            }
        });

        setInThese(inThese);

        return () => {
            setInThese([]);
        };
    }, [activeTrackId]);

    async function handleRemoveFrom(playlistId: string) {
        setIsLoading(true);
        console.log(
            "TODO: Removing track from playlist...",
            playlistId,
            activeTrackUri
        );

        //sdk?.playlists.removeItemsFromPlaylist(playlistId, [activeTrackUri])
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatePlaylistTracks(playlistTracks!);

        setIsLoading(false);
    }

    return (
        <div className="in-these-component">
            <h2>Also In Playlists</h2>
            <ul>
                {inThese.map((playlist, i) => (
                    <li
                        key={playlist.playlist_id}
                        className="playlist-item-wrapper"
                    >
                        <span>{i + 1}. </span>
                        <PlaylistItem
                            title={playlist.name}
                            playlistId={playlist.playlist_id}
                            addBtn={false}
                            isOwner={playlist.is_owner}
                            handleClick={handleRemoveFrom}
                            loading={isLoading}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
