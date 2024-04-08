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
import { useCallback, useEffect, useState } from "react";
import { ExtendedPlaylistPage, PlaylistTracks } from "../customInterfaces";
import useAppProps from "../hooks/useAppProps";

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sdk = useSdk();
    const {
        playlists,
        setPlaylists,
        likedPlaylistId,
        playlistTracks,
        setPlaylistTracks,
        selectedPlaylist,
        setSelectedPlaylist,
        selectedTrack,
        setSelectedTrack,
    } = useAppProps();

    // A useeffect to set cursor key up/down to change the selected track
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!playlistTracks || !selectedTrack) {
                return;
            }
            const activePlaylist = playlistTracks.find(
                playlist => playlist.playlist_id === selectedPlaylist
            );
            if (!activePlaylist) {
                return;
            }
            const selectedTrackIndex = activePlaylist.tracks.allItems.findIndex(
                playlistTrack => playlistTrack.track.id === selectedTrack.id
            );
            // In current implementation, if the selected track is not found in the playlist, we do nothing
            // User MUST select a track from the playlist first
            if (selectedTrackIndex === -1) {
                return;
            }
            const parentElement = document.querySelector(".tracks-component")!;
            const scrollAmount = 5 * 16;
            if (event.key === "ArrowUp") {
                if (selectedTrackIndex > 0) {
                    event.preventDefault();
                    parentElement.scrollTo({
                        top: parentElement.scrollTop - scrollAmount,
                        behavior: "smooth",
                    });
                    handleTrackSelect(
                        activePlaylist.tracks.allItems[selectedTrackIndex - 1]
                            .track
                    );
                }
            } else if (event.key === "ArrowDown") {
                if (
                    selectedTrackIndex <
                    activePlaylist.tracks.allItems.length - 1
                ) {
                    event.preventDefault();
                    parentElement.scrollTo({
                        top: parentElement.scrollTop + scrollAmount,
                        behavior: "smooth",
                    });
                    handleTrackSelect(
                        activePlaylist.tracks.allItems[selectedTrackIndex + 1]
                            .track
                    );
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [playlistTracks, selectedTrack, selectedPlaylist]);

    useEffect(() => {
        console.log("from the effect. currrent state:", playlists);
    }, [playlists]);

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
                // console.log(
                //     "Fetched next page of playlists",
                //     nextPlaylistsPage
                // );
                allPlaylists = {
                    ...allPlaylists,
                    allItems: [
                        ...allPlaylists.allItems,
                        ...nextPlaylistsPage.items,
                    ],
                };
                next = nextPlaylistsPage.next;
            }
            console.log(allPlaylists);
            setPlaylists(allPlaylists);
            if (!playlists) {
                // console.log("Initial fetch for playlists complete.");
                handlePlaylistSelect(fetchPlaylists.items[0]);
            }
            // console.log("Fetched current user's playlists", fetchPlaylists);

            console.log("allPlaylists.allItems: ", allPlaylists.allItems);
            // const promises = fetchPlaylists.items.map(playlist =>
            const promises = allPlaylists.allItems.map(playlist =>
                sdk!.playlists.getPlaylistItems(playlist.id)
            );

            const profilePromise = await sdk!.currentUser.profile();
            const ownerId = profilePromise.id;
            const results = await Promise.all(promises);

            const playlistTracks: PlaylistTracks[] = results.map(
                (playlistTrack, index) => {
                    const playlist_id = allPlaylists.allItems[index].id;
                    const name = allPlaylists.allItems[index].name;
                    // const is_collaborative =
                    // fetchPlaylists.items[index].collaborative;
                    const is_owner =
                        allPlaylists.allItems[index].owner.id === ownerId;
                    // console.log(`Owner of ${name} is ${is_owner}`, {
                    //     fetchedOwnerId: fetchPlaylists.items[index].owner.id,
                    //     ownerId,
                    // });

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

            const likedPlaylistTracks =
                await sdk!.currentUser.tracks.savedTracks();
            playlistTracks.push({
                playlist_id: "liked",
                name: "Liked Songs",
                is_owner: true,
                tracks: {
                    allItems: likedPlaylistTracks.items.map(item => ({
                        track: item.track,
                    })),
                    next: likedPlaylistTracks.next,

                    // The following lines make the type checker happy
                    // I do not use them in the app + this is a hack for now
                    // as I do not want to refactor my custom interfaces yet!
                    items: [],
                    href: likedPlaylistTracks.href,
                    limit: likedPlaylistTracks.limit,
                    offset: likedPlaylistTracks.offset,
                    total: likedPlaylistTracks.total,
                    previous: likedPlaylistTracks.previous,
                },
            });
            // console.log("Liked songs", likedPlaylistTracks);

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

                // console.log("Next tracks wanted", nextUrls);
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

    const handlePlaylistSelect = (
        playlist: SimplifiedPlaylist | { id: string }
    ) => {
        if (playlist.id === selectedPlaylist) {
            return;
        }

        if (playlist.id === "liked") {
            // console.log("Liked songs selected");
            setSelectedPlaylist(likedPlaylistId.current);
            return;
        }

        setSelectedPlaylist(playlist.id);
    };

    const handleTrackSelect = (track: Track | null) => {
        setSelectedTrack(track);
    };

    const updatePlaylistsTracks = (
        newPlaylistTracks: PlaylistTracks[] | null
    ) => {
        // console.log("Updating playlist tracks", newPlaylistTracks);
        setPlaylistTracks(newPlaylistTracks);
    };

    return (
        <div className="app-layout">
            <DropDown
                playlists={playlists}
                fetchPlaylists={() => {
                    fetchPlaylistsAndTracks()
                        // .then(() => {
                        // console.log("Everything should be fetched now.");
                        // })
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
                selectedTrack={selectedTrack?.id ?? ""}
                handleTrackSelect={handleTrackSelect}
                loading={isLoading}
            />
            <InThese
                playlistTracks={playlistTracks}
                activeTrack={selectedTrack}
                activePlaylist={selectedPlaylist} // To prevent showing up the selected playlist
                updatePlaylistTracks={updatePlaylistsTracks}
            />
            <NotInThese
                playlistTracks={playlistTracks}
                activeTrack={selectedTrack}
                updatePlaylistTracks={updatePlaylistsTracks}
            />
        </div>
    );
}

export default App;
