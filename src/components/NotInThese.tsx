import { useEffect, useState } from "react";
import { PlaylistTracks } from "../customInterfaces";
import PlaylistItem from "./PlaylistItem";
import useSdk from "../hooks/useSdk";
import { Track } from "@spotify/web-api-ts-sdk";

interface NotInTheseProps {
    playlistTracks: PlaylistTracks[] | null;
    activeTrack: Track | null;
    updatePlaylistTracks: (newPlaylistTracks: PlaylistTracks[] | null) => void;
}

export default function NotInThese({
    playlistTracks,
    activeTrack,
    updatePlaylistTracks,
}: NotInTheseProps) {
    const sdk = useSdk();
    const [notInThese, setNotInThese] = useState<PlaylistTracks[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!playlistTracks || !activeTrack) {
            return;
        }

        const notInThese: PlaylistTracks[] = [];
        playlistTracks.forEach(playlist => {
            if (
                !playlist.tracks.allItems.some(
                    track => track.track.id === activeTrack.id
                )
            ) {
                notInThese.push(playlist);
            }
        });

        setNotInThese(notInThese);

        return () => {
            setNotInThese([]);
        };
    }, [activeTrack, playlistTracks]);

    async function handleAddTo(playlistId: string) {
        try {
            setIsLoading(true);
            console.log(
                "Adding track to playlist...",
                playlistId,
                activeTrack!.uri
            );

            if (playlistId === "liked") {
                await sdk?.currentUser.tracks.saveTracks([activeTrack!.id]);
            } else {
                await sdk?.playlists.addItemsToPlaylist(playlistId, [
                    activeTrack!.uri,
                ]);
            }

            // Make the type checkers happy :) (read the comment below)

            // Now also update the playlistTracks state instead  of refetching
            // LIMITATION: I am not keeping track of other metadata like date_added etc
            // that spotify adds while adding a track to a playlist. I don't think I need it,
            // So I'll just update the tracks array of the playlist that shows the user that
            // the track has been added to the playlist.
            const newPlaylistTracks = playlistTracks?.map(playlist => {
                if (playlist.playlist_id === playlistId) {
                    return {
                        ...playlist,
                        tracks: {
                            ...playlist.tracks,
                            allItems: [
                                ...playlist.tracks.allItems,
                                {
                                    // This is all the metadata that spotify adds
                                    // that I don't care about so in the local state
                                    // I'm just adding garbage data
                                    added_at: new Date().toISOString(),
                                    added_by: {
                                        id: "",
                                        external_urls: { spotify: "" },
                                        href: "",
                                        type: "",
                                        uri: "",
                                    },
                                    is_local: false,
                                    primary_color: "",
                                    track: activeTrack!,
                                },
                            ],
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
