import "./DropDown.css";
import { ExtendedPlaylistPage } from "../customInterfaces";
import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

export interface DropDownProps {
    playlists: ExtendedPlaylistPage | null;
    selectedPlaylist: string | null;
    fetchPlaylists: () => void;
    handleSelect: (playlist: SimplifiedPlaylist) => void;
    loading: boolean;
    clearTrackSelection: () => void;
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
    fetchPlaylists,
    handleSelect,
    clearTrackSelection,
    loading,
}: DropDownProps) {
    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        console.log("option event triggered:", event.target.value);
        const newSelection = playlists?.items.find(
            playlist => playlist.id === event.target.value
        );
        if (newSelection) {
            console.log("new selection:", newSelection);
            handleSelect(newSelection);
            clearTrackSelection();
        }
    }

    return (
        <div className="dropdown-component">
            <h2>Select Playlist</h2>
            {playlists ? (
                <select
                    className="playlist-selector"
                    onChange={handleChange}
                    disabled={loading}
                    defaultValue={selectedPlaylist ?? undefined}
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
                <button onClick={fetchPlaylists} disabled={loading}>
                    {loading ? "Loading..." : "Fetch Playlists"}
                </button>
            )}
        </div>
    );
}
