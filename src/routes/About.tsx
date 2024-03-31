import "../article-ishStyles.css";

export default function About() {
    return (
        <article>
            <h1>Playlisty</h1>
            <p>
                Track your songs across playlists and organize with a
                bird&apos;s eye view.
            </p>

            <h2>Disclaimer</h2>
            <p>
                This is a personal project and I am not affiliated with Spotify
                in any way. I saw a need for this tool and built it for my
                personal use. I am sharing it with the community in the hope
                that it will be useful to others as well.
            </p>

            <h2>Motivation</h2>
            <p>
                I have numerous playlists on Spotify, including Liked Songs and
                some Spotify-curated ones. As someone who values curated,
                organized, and well-structured music, managing tracks across
                multiple playlists has been cumbersome. Often, a single track is
                present in several playlists, complicating tasks like moving,
                deleting, or updating tracks. Additionally, it&rsquo;s
                challenging to keep track of where each track resides. For
                instance, a track in the &quot;Liked&quot; section might also
                appear in other playlists, further complicating matters. With
                this project, I aim to streamline this process, offering users a
                single view to manage their tracks effortlessly.
            </p>

            <h2>Features</h2>
            <ul>
                <li>View all playlists and their tracks</li>
                <li>
                    <strong>
                        View the playlists in which the given track is present
                        or not present at a glance
                    </strong>
                </li>
                <li>Move tracks between playlists</li>
                <li>Filter tracks by playlist</li>
            </ul>

            <h2>Not Supported at the moment</h2>
            <ul>
                <li>Creating new playlists</li>
                <li>Editing playlist details</li>
                <li>Deleting playlists</li>
                <li>
                    Adding new tracks to playlists (only moving tracks from one
                    playlist to another)
                </li>
                <li>Mobile Optimized UI</li>
            </ul>

            <h2>License</h2>
            <p>
                This project is licensed under the Apache License 2.0 - see the{" "}
                <a href="LICENSE">LICENSE</a> for details.
            </p>

            <h2>Contributing</h2>
            <p>
                Issues and pull requests are welcome. However, before doing so,
                contact me first to discuss the changes you wish to make.
            </p>
        </article>
    );
}
