import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useOutletContext } from "react-router-dom";

export default function useSdk(): SpotifyApi | null {
    return useOutletContext();
}