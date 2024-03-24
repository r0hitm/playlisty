import { Navigate } from "react-router-dom";
import useSdk from "../hooks/useSdk";
import "./App.css";
import DropDown from "../components/DropDown";
import Tracks from "../components/Tracks";
import InThese from "../components/InThese";
import NotInThese from "../components/NotInThese";

function App() {
    const sdk = useSdk();

    if (!sdk) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="app-layout">
            <DropDown />
            <Tracks />
            <InThese />
            <NotInThese />
        </div>
    );
}

export default App;
