import {
    Page,
    PlaylistedTrack,
    SimplifiedPlaylist,
    Track,
} from "@spotify/web-api-ts-sdk";

export interface ExtendedPlaylistPage extends Page<SimplifiedPlaylist> {
    allItems: SimplifiedPlaylist[];
}

export interface ExtendedPlaylistedTracks extends Page<PlaylistedTrack<Track>> {
    allItems: PlaylistedTrack<Track>[];
}

// Custom Interface that contains all the playlist
// info that I care about
// plus all the tracks of that playlist
// The interfaces defined are above are used through this one.
export interface PlaylistTracks {
    playlist_id: string;
    name: string;
    // is_collaborative: boolean;
    is_owner: boolean;
    tracks: ExtendedPlaylistedTracks;
}

// Used by InThese and NotInThese components for
// filtered playlists rendering state
export interface filteredPlaylistsState {
    id: string;
    name: string;
    isOwner: boolean;
    // isCollaborator: boolean;
}