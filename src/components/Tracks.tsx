import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

export default function Tracks({
    activePlaylist,
}: {
    activePlaylist: SimplifiedPlaylist | null;
}) {
    return (
        <div className="tracks-component">
            {activePlaylist ? (
                <>
                    <h2>{activePlaylist.name}</h2>
                    <p>{activePlaylist.description}</p>
                </>
            ) : (
                <h2>No playlist selected</h2>
            )}
        </div>
    );
}
