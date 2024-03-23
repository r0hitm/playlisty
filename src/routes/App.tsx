import "./App.css";
import { useSpotifySdk } from "../useSpotifySdk";

function App() {
    const sdk = useSpotifySdk();

    return <>{sdk ? <p>Logged In 👌</p> : <p>❌ Not logged in</p>}</>;
}

export default App;
