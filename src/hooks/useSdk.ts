import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useOutletContext } from "react-router-dom";

export default function useSdk(): SpotifyApi | null {
    const { sdk } = useOutletContext<{
        sdk: SpotifyApi; // Make the type check happy
    }>();
    return sdk;
}
