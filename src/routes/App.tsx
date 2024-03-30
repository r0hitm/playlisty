import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";
import DropDown from "../components/DropDown";
import Tracks from "../components/Tracks";
import InThese from "../components/InThese";
import NotInThese from "../components/NotInThese";
import {
    Page,
    PlaylistedTrack,
    SimplifiedPlaylist,
    Track,
} from "@spotify/web-api-ts-sdk";
import { useCallback, useState } from "react";
import { ExtendedPlaylistPage, PlaylistTracks } from "../customInterfaces";

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sdk = useSdk();

    const [playlists, setPlaylists] = useState<ExtendedPlaylistPage | null>(
        null
    );
    const [playlistTracks, setPlaylistTracks] = useState<
        PlaylistTracks[] | null
    >(null);

    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
        null
    );
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    const fetchPlaylistsAndTracks = useCallback(async () => {
        setIsLoading(true);
        try {
            // Run the playlist fetch until .next is null
            const fetchPlaylists = await sdk!.currentUser.playlists.playlists();
            if (!fetchPlaylists) {
                throw new Error(
                    "Failed to fetch playlists. Either the SDK is not initialized or the request failed."
                );
            }
            let allPlaylists: ExtendedPlaylistPage = {
                ...fetchPlaylists,
                allItems: fetchPlaylists.items,
            };
            let next = fetchPlaylists.next;
            while (next) {
                const accessToken = await sdk!.getAccessToken();
                if (!accessToken) {
                    throw new Error("Failed to get access token.");
                }
                const nextPlaylistsPageResp = await fetch(next, {
                    headers: {
                        Authorization: `Bearer ${accessToken.access_token}`,
                    },
                });
                if (!nextPlaylistsPageResp.ok) {
                    throw new Error(
                        `Failed to fetch next page of playlists: ${nextPlaylistsPageResp.statusText}`
                    );
                }
                const nextPlaylistsPage =
                    (await nextPlaylistsPageResp.json()) as Page<SimplifiedPlaylist>;
                console.log(
                    "Fetched next page of playlists",
                    nextPlaylistsPage
                );
                allPlaylists = {
                    ...allPlaylists,
                    allItems: [
                        ...allPlaylists.allItems,
                        ...nextPlaylistsPage.items,
                    ],
                };
                next = nextPlaylistsPage.next;
            }
            setPlaylists(allPlaylists);
            if (!playlists) {
                console.log("Initial fetch for playlists complete.");
                handlePlaylistSelect(fetchPlaylists.items[0]);
            }
            // console.log("Fetched current user's playlists", fetchPlaylists);

            const promises = fetchPlaylists.items.map(playlist =>
                sdk!.playlists.getPlaylistItems(playlist.id)
            );

            const profilePromise = await sdk!.currentUser.profile();
            const ownerId = profilePromise.id;
            const results = await Promise.all(promises);

            const playlistTracks: PlaylistTracks[] = results.map(
                (playlistTrack, index) => {
                    const playlist_id = fetchPlaylists.items[index].id;
                    const name = fetchPlaylists.items[index].name;
                    // const is_collaborative =
                    // fetchPlaylists.items[index].collaborative;
                    const is_owner =
                        fetchPlaylists.items[index].owner.id === ownerId;
                    console.log(`Owner of ${name} is ${is_owner}`, {
                        fetchedOwnerId: fetchPlaylists.items[index].owner.id,
                        ownerId,
                    });

                    return {
                        playlist_id,
                        name,
                        // is_collaborative,
                        is_owner,
                        tracks: {
                            ...playlistTrack,
                            allItems: playlistTrack?.items ?? [],
                        },
                    };
                }
            );

            let nextUrls = playlistTracks
                .filter(playlistTrack => playlistTrack.tracks.next)
                .map(playlistTrack => ({
                    playlist_id: playlistTrack.playlist_id,
                    next: playlistTrack.tracks.next!,
                }));

            // alert(
            //     `Out of ${playlistTracks.length} playlists, ${nextUrls.length} have more tracks to fetch.`
            // );

            while (nextUrls.length > 0) {
                const accessToken = await sdk!.getAccessToken();
                if (!accessToken) {
                    throw new Error("Failed to get access token.");
                }
                const nextTracksPromises = nextUrls.map(playlistTrack =>
                    fetch(playlistTrack.next, {
                        headers: {
                            Authorization: `Bearer ${accessToken.access_token}`,
                        },
                    })
                );
                const nextTracksPages = await Promise.all(nextTracksPromises);

                const nextTracks = await Promise.all(
                    nextTracksPages.map(async (nextTracksPage, index) => {
                        if (!nextTracksPage.ok) {
                            throw new Error(
                                `Failed to fetch next page of tracks for playlist ${nextUrls[index].playlist_id}: ${nextTracksPage.statusText}`
                            );
                        }
                        return {
                            playlist_id: nextUrls[index].playlist_id,
                            tracks: (await nextTracksPage.json()) as Page<
                                PlaylistedTrack<Track>
                            >,
                        };
                    })
                );

                playlistTracks.forEach(playlistTrack => {
                    const nextTrack = nextTracks.find(
                        nextTrack =>
                            nextTrack.playlist_id === playlistTrack.playlist_id
                    );
                    if (nextTrack) {
                        playlistTrack.tracks.allItems.push(
                            ...nextTrack.tracks.items
                        );
                        playlistTrack.tracks.next = nextTrack.tracks.next;
                    }
                });

                nextUrls = nextTracks
                    .filter(playlistTrack => playlistTrack.tracks.next)
                    .map(playlistTrack => ({
                        playlist_id: playlistTrack.playlist_id,
                        next: playlistTrack.tracks.next!,
                    }));

                console.log("Next tracks wanted", nextUrls);
                // alert(
                //     `Again: Out of ${playlistTracks.length} playlists, ${nextUrls.length} have more tracks to fetch.`
                // );
            }

            setPlaylistTracks(playlistTracks);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    const handlePlaylistSelect = (playlist: SimplifiedPlaylist) => {
        setSelectedPlaylist(playlist.id);
    };

    const handleTrackSelect = (track: Track | null) => {
        setSelectedTrack(track?.id ?? null);
    };

    return (
        <div className="app-layout">
            <DropDown
                playlists={playlists}
                fetchPlaylists={() => {
                    fetchPlaylistsAndTracks()
                        .then(() => {
                            console.log("Everything should be fetched now.");
                        })
                        .catch((e: unknown) => {
                            const error = e as Error;
                            console.error("Everything is NOT fetched", error);
                        });
                }}
                selectedPlaylist={selectedPlaylist}
                handleSelect={handlePlaylistSelect}
                clearTrackSelection={() => {
                    handleTrackSelect(null);
                }}
                loading={isLoading}
            />
            <Tracks
                activePlaylist={
                    playlistTracks?.find(
                        playlist => playlist.playlist_id === selectedPlaylist
                    ) ?? null
                }
                selectedTrack={selectedTrack}
                handleTrackSelect={handleTrackSelect}
                loading={isLoading}
            />
            <InThese
                playlistTracks={playlistTracks}
                activeTrack={selectedTrack}
                activePlaylist={selectedPlaylist}
            />
            <NotInThese
                playlistTracks={playlistTracks}
                activeTrack={selectedTrack}
            />
        </div>
    );
}

export default App;
