// import Select from "react-select";
import { useState } from "react";
import useSdk from "../hooks/useSdk";
import "./DropDown.css";
import { ExtendedPlaylistPage } from "../customInterfaces";
import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

export interface DropDownProps {
    playlists: ExtendedPlaylistPage | null;
    selectedPlaylist: SimplifiedPlaylist | null;
    handlePlaylists: (playlists: ExtendedPlaylistPage) => void;
    handleSelect: (playlist: SimplifiedPlaylist) => void;
}

/**
 * This component is concerned with having all the user's playlists
 * available for selection in a dropdown. The siblings of this component
 * only care about the playlist object itself, which this component sends
 * back to the parent component.
 */
export default function DropDown({
    playlists,
    selectedPlaylist,
    handlePlaylists,
    handleSelect,
}: DropDownProps) {
    const sdk = useSdk();
    // const [playlists, setPlaylists] =
    //     useState<Page<SimplifiedPlaylist> | null>();
    const [initialFetch, setInitialFetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function fetchPlaylists() {
        setIsLoading(true);
        (async () => {
            try {
                const fetchPlaylists =
                    await sdk?.currentUser.playlists.playlists();
                if (!fetchPlaylists) {
                    throw new Error(
                        "Failed to fetch playlists. Either the SDK is not initialized or the request failed."
                    );
                }
                handlePlaylists({
                    ...fetchPlaylists,
                    allItems: fetchPlaylists.items,
                });
                if (initialFetch) {
                    setInitialFetch(true);
                    handleSelect(fetchPlaylists.items[0]);
                }
                console.log("Fetched current user's playlists", fetchPlaylists);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        console.log("option event triggered:", event.target.value);
        const newSelection = playlists?.items.find(
            playlist => playlist.id === event.target.value // TODO: Don't know if this is correct
        );
        if (newSelection) {
            handleSelect(newSelection);
        }
    }

    return (
        <div className="dropdown-component">
            <h2>Select Playlist</h2>
            {playlists ? (
                <select
                    className="playlist-selector"
                    onChange={handleChange}
                    disabled={isLoading}
                    defaultValue={selectedPlaylist?.id}
                >
                    {playlists.items.map(playlist => (
                        <option
                            className="select-playlist-item"
                            key={playlist.id}
                            value={playlist.id}
                        >
                            {playlist.name}
                        </option>
                    ))}
                </select>
            ) : (
                <button onClick={fetchPlaylists} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Fetch Playlists"}
                </button>
            )}
        </div>
    );
}
