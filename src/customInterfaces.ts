import { Page, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

export interface ExtendedPlaylistPage extends Page<SimplifiedPlaylist> {
    allItems: SimplifiedPlaylist[];
}
