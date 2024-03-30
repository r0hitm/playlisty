import "./PlaylistItem.css";

interface PlaylistItemProps {
    title: string;
    playlistId: string;
    addBtn: boolean;
    isOwner: boolean;
    handleClick: (playlistId: string) => Promise<void>;
    loading: boolean;
}

export default function PlaylistItem({
    title,
    playlistId,
    addBtn = true,
    isOwner,
    handleClick,
    loading,
}: PlaylistItemProps) {
    return (
        <div className="playlist-item">
            <div className="playlist-title">{title}</div>
            <div className="playlist-btn-wrapper">
                {addBtn ? (
                    <button
                        type="button"
                        title="Add to playlist"
                        disabled={!isOwner || loading}
                        onClick={() => {
                            void handleClick(playlistId);
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
                        disabled={!isOwner || loading}
                        onClick={() => {
                            void handleClick(playlistId);
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
