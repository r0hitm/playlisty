import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";
import PlaylistItem from "./PlaylistItem";

interface NotInTheseProps {
    playlistTracks: PlaylistTracks[] | null;
    activeTrackId: string | null;
    activeTrackUri: string | null;
    updatePlaylistTracks: (newPlaylistTracks: PlaylistTracks[]) => void;
}

export default function NotInThese({
    playlistTracks,
    activeTrackId,
    activeTrackUri,
    updatePlaylistTracks,
}: NotInTheseProps) {
    // const sdk = useSdk();
    const [notInThese, setNotInThese] = useState<PlaylistTracks[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!playlistTracks || !activeTrackId) {
            return;
        }

        const notInThese: PlaylistTracks[] = [];
        playlistTracks.forEach(playlist => {
            if (
                !playlist.tracks.allItems.some(
                    track => track.track.id === activeTrackId
                )
            ) {
                notInThese.push(playlist);
            }
        });

        setNotInThese(notInThese);

        return () => {
            setNotInThese([]);
        };
    }, [activeTrackId]);

    async function handleAddTo(playlistId: string) {
        setIsLoading(true);
        console.log(
            "TODO: Adding track to playlist...",
            playlistId,
            activeTrackUri
        );
        //sdk?.playlists.removeItemsFromPlaylist(playlistId, [activeTrackUri])
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatePlaylistTracks(playlistTracks!);

        setIsLoading(false);
    }

    return (
        <div className="not-in-these-component">
            <h2>NOT In Playlists</h2>
            <ul>
                {notInThese.map((playlist, i) => (
                    <li
                        key={playlist.playlist_id}
                        className="playlist-item-wrapper"
                    >
                        <span>{i + 1}. </span>
                        <PlaylistItem
                            title={playlist.name}
                            playlistId={playlist.playlist_id}
                            addBtn={true}
                            isOwner={playlist.is_owner}
                            handleClick={handleAddTo}
                            loading={isLoading}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
