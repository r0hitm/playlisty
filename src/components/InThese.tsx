// import { Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";
import "./InTheseNotInThese.css";
import PlaylistItem from "./PlaylistItem";
import useSdk from "../hooks/useSdk";
import { Track } from "@spotify/web-api-ts-sdk";

interface InTheseProps {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: Track | null;
    activePlaylist: string | null;
    updatePlaylistTracks: (newPlaylistTracks: PlaylistTracks[] | null) => void;
}

export default function InThese({
    playlistTracks,
    activeTrack,
    activePlaylist,
    updatePlaylistTracks,
}: InTheseProps) {
    const sdk = useSdk();
    const [inThese, setInThese] = useState<PlaylistTracks[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const inThese: PlaylistTracks[] = [];
        playlistTracks.forEach(playlist => {
            if (
                playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack.id
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
    }, [activeTrack, playlistTracks]);

    async function handleRemoveFrom(playlistId: string) {
        try {
            setIsLoading(true);
            console.log(
                "Removing track from playlist...",
                playlistId,
                activeTrack!.uri
            );

            if (playlistId === "liked") {
                await sdk?.currentUser.tracks.removeSavedTracks([
                    activeTrack!.id,
                ]);
            } else {
                await sdk?.playlists.removeItemsFromPlaylist(playlistId, {
                    tracks: [{ uri: activeTrack!.uri }],
                });
            }

            const newPlaylistTracks = playlistTracks?.map(playlist => {
                if (playlist.playlist_id === playlistId) {
                    return {
                        ...playlist,
                        tracks: {
                            ...playlist.tracks,
                            allItems: playlist.tracks.allItems.filter(
                                track => track.track.id !== activeTrack!.id
                            ),
                        },
                    };
                }
                return playlist;
            });
            updatePlaylistTracks(newPlaylistTracks ?? null);
        } catch (error) {
            console.error("Error adding track to playlist:", error);
        } finally {
            setIsLoading(false);
        }
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
