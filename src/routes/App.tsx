import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";

function App() {
    const sdk = useSdk();

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    return <>{sdk ? <p>Logged In 👌</p> : <p>❌ Not logged in</p>}</>;
}

export default App;
