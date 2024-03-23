import useSdk from "../hooks/useSdk";
import "./App.css";

function App() {
    const sdk = useSdk();

    return <>{sdk ? <p>Logged In 👌</p> : <p>❌ Not logged in</p>}</>;
}

export default App;
