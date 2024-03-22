import { useSpotify } from "./useSpotify";
import { appScopes } from "../appScopes";

export function useSdk() {
    return useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
        import.meta.env.VITE_REDIRECT_TARGET as string,
        appScopes
    );
}
