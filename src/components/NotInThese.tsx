import { ExtendedPlaylistPage } from "../customInterfaces";

export default function NotInThese({
    playlists,
    activeTrack,
}: {
    playlists: ExtendedPlaylistPage | null;
    activeTrack: string | null;
}) {
    return (
        <div className="not-in-these-component">
            <h2>Not In These</h2>
            <p>
                Track: <strong>{activeTrack ?? "None"}</strong>
            </p>
            <ul>
                {playlists?.allItems.map(playlist => (
                    <li key={playlist.id}>
                        <a href={playlist.external_urls.spotify}>
                            {playlist.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
