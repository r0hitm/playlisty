// import useSdk from "../hooks/useSdk";
import "./PlaylistItem.css"

interface PlaylistItemProps {
    title: string;
    addBtn: boolean; // controls icon; true = add, false = remove
}


/// Need to know if the the user has edit permissions on the playlist
/// do not show the add/remove button if the user does not have edit permissions

export default function PlaylistItem({
    title,
    addBtn = true,
}: PlaylistItemProps) {
    // const sdk = useSdk();

    return (
        <div className="playlist-item">
            <div className="playlist-title">{title}</div>
            <div className="playlist-btn-wrapper">
                {addBtn ? (
                    <button
                        type="button"
                        title="Add to playlist"
                        onClick={() => {
                            console.log("TODO: Adding track to playlist...");
                            // sdk.addTrackToPlaylist();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        title="Remove from playlist"
                        onClick={() => {
                            console.log(
                                "TODO: Removing track from playlist..."
                            );
                            // sdk.removeTrackFromPlaylist();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l14 0" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
