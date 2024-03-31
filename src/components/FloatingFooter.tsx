import "./FloatingFooter.css";

export function FloatingFooter() {
    return (
        <div className="footer">
            <p>Made with ❤️ by Rohit Mehta</p>

            <div className="socials">
                <a
                    href="https://devavatar.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Blog
                </a>
                <a
                    href="https://github.com/r0hitm"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>
                <a
                    href="https://www.linkedin.com/in/r0hitm/"
                    target="_blank"
                    rel="noreferrer"
                >
                    LinkedIn
                </a>
            </div>
            <a
                href="https://www.buymeacoffee.com/r0hitm"
                target="_blank"
                rel="noreferrer"
            >
                Buy me a coffee
            </a>
            <a
                href="https://github.com/r0hitm/Playlisty"
                target="_blank"
                rel="noreferrer"
            >
                View on GitHub
            </a>
        </div>
    );
}
