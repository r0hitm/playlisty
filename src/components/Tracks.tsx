import { Track } from "@spotify/web-api-ts-sdk";
import "./Tracks.css";
import { PlaylistTracks } from "../customInterfaces";
import Loading from "./Loading";

export default function Tracks({
    activePlaylist,
    selectedTrack,
    loading,
    handleTrackSelect,
}: {
    activePlaylist: PlaylistTracks | null;
    selectedTrack: string | null;
    loading: boolean;
    handleTrackSelect: (track: Track | null) => void;
}) {
    return (
        <div className="tracks-component">
            <h2>Songs in this playlist</h2>
            <ul>
                {activePlaylist?.tracks.allItems.map((track, index) => (
                    <li
                        key={index}
                        className={
                            selectedTrack === track.track.id ? "selected" : ""
                        }
                        onClick={() => handleTrackSelect(track.track)}
                    >
                        <span className="index">{index + 1}. </span>
                        <img
                            className="thumbnail"
                            src={track.track?.album?.images?.[2]?.url ?? ""}
                            alt={track.track?.name}
                        />
                        <div className="song-info">
                            <span className="title">{track.track.name}</span>
                            <span className="artist">
                                {track.track.artists[0].name}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            {loading && <Loading />}
        </div>
    );
}
