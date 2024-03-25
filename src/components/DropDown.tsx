// import Select from "react-select";
import { useEffect, useState } from "react";
import useSdk from "../hooks/useSdk";
import "./DropDown.css";
import { Page, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

/*
 * TODOs:
 * 1. If the user has more than 50 playlists, then I need to implement infinite
 *  scrolling in the <select> dropdown, below.
 * 2. cache the playlists in a state variable, which will be initially updated
 *  when user clicks the "Fetch Playlist" button.
 * 3. The "Fetch Playlist" button should be disabled when the playlists are
 *  being fetched for the first time.
 * 4. as the user scrolls down the dropdown, the next 50 playlists should
 *  be fetched and appended to the existing list of playlists in the state
 *  variable which should update the UI as well.
 * 5. How and what to capture the selected playlist (info) from the dropdown?
 *      - whatever it is, it should be able to accessible by sibling components
 *        in order to fetch the tracks of the selected playlist. How?
 * 6. Style the dropdown
 */

export default function DropDown() {
    const sdk = useSdk();
    const [playlists, setPlaylists] =
        useState<Page<SimplifiedPlaylist> | null>();
    const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

    useEffect(() => {
        if (!triggerFetch) return;
        (async () => {
            try {
                const fetchPlaylists =
                    await sdk?.currentUser.playlists.playlists();
                setPlaylists(() => fetchPlaylists);
                console.log("Fetched current user's playlists", fetchPlaylists);
            } catch (e: unknown) {
                const error = e as Error;
                console.log("Could not fetch current user's playlists", error);
            }
        })();
    }, [triggerFetch, sdk]);

    return (
        <div className="dropdown-component">
            <h2>Select Playlist</h2>

            {playlists ? (
                <select className="playlist-selector">
                    {playlists.items.map(playlist => (
                        <option
                            className="selected-playlist"
                            key={playlist.id}
                            value={playlist.id}
                        >
                            {playlist.name}
                        </option>
                    ))}
                </select>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        setTriggerFetch(t => !t);
                    }}
                >
                    Fetch Playlist
                </button>
            )}
        </div>
    );
}
