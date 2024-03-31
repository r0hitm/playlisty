import { Track } from "@spotify/web-api-ts-sdk";
import "./Tracks.css";
import { PlaylistTracks } from "../customInterfaces";
import Loading from "./Loading";
import { useEffect, useRef } from "react";

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
    const imgRefs = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    img.src = img.dataset.src ?? "";
                }
            });
        });

        imgRefs.current.forEach(img => img && observer.observe(img));

        return () => {
            imgRefs.current.forEach(img => img && observer.unobserve(img));
        };
    }, [activePlaylist]);

    return (
        <div className="tracks-component">
            <h2>Songs in this playlist</h2>
            <p style={
                {
                    fontSize: "small",
                    fontStyle: "italic",
                }
            }>
                Tip: Click on a song & press up/down arrow keys to navigate
            </p>
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
                            ref={img => imgRefs.current.push(img!)}
                            data-src={
                                track.track?.album?.images?.[2]?.url ?? ""
                            }
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
