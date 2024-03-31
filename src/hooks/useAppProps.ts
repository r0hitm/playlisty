// I know this is a bad filename
// This will just return the App props that are passed to the Outlet
import { useOutletContext } from "react-router-dom";
import { ExtendedPlaylistPage, PlaylistTracks } from "../customInterfaces";
import { Track } from "@spotify/web-api-ts-sdk";

interface AppProps {
    playlists: ExtendedPlaylistPage | null;
    setPlaylists: (playlists: ExtendedPlaylistPage | null) => void;
    likedPlaylistId: React.MutableRefObject<string>;
    playlistTracks: PlaylistTracks[] | null;
    setPlaylistTracks: (playlistTracks: PlaylistTracks[] | null) => void;
    selectedPlaylist: string | null;
    setSelectedPlaylist: (playlist: string | null) => void;
    selectedTrack: Track | null;
    setSelectedTrack: (track: Track | null) => void;
}

export default function useAppProps() {
    const appProps = useOutletContext<AppProps>();
    return appProps;
}
