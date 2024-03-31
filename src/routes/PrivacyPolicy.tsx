import "../article-ishStyles.css";

export default function PrivacyPolicy() {
    return (
        <article>
            <h1>Privacy Policy</h1>
            <p>
                This app does not collect any personal information. It neither
                stores nor accesses any data about you or your Spotify account.
                The Official Spotify Web API TypeScript SDK is solely used for
                interaction with the Spotify API.
            </p>
            <p>
                Minimal information required for maintaining login sessions is
                temporarily stored in your browser&apos;s local storage. This
                data is promptly deleted upon logout and is never shared with
                third parties.
            </p>
            <p>
                While using the app, your playlists and tracks are mainted in
                memory for session continuity. This data is not retained and is
                automatically cleared upon closing the browser tab or refreshing
                the page.
            </p>
            <p>
                The app requests the following permissions from users to execute
                specific actions:
                <ul>
                    <li>
                        <strong>User Details</strong>: To retrieve user IDs for
                        playlist filtering purposes.
                    </li>
                    <li>
                        <strong>User Library Read</strong>: To access the
                        user&apos;s &quot;Liked Songs.&quot;
                    </li>
                    <li>
                        <strong>User Library Modify</strong>: To add or remove
                        tracks from playlists.
                    </li>
                    <li>
                        <strong>Playlist Read</strong>: To retrieve the list of
                        playlists the user follows/created.
                    </li>
                    <li>
                        <strong>Playlist Modify</strong>: To add or remove
                        tracks from these playlists.
                    </li>
                </ul>
            </p>
            <p>
                Should you have any concerns or queries, please contact me at:{" "}
                <code>rohitm09 [at] proton [dot] me</code>
            </p>
        </article>
    );
}
