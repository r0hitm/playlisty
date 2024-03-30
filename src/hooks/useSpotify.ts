import { useState } from "react";
import {
    SpotifyApi,
    AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";
import { appScopes, opts } from "../config";

export interface useSpotifyInterface {
    sdk: SpotifyApi | null;
    logIn: () => Promise<void>;
    logOut: () => void;
    ownerId: string;
}

export function useSpotify(): useSpotifyInterface {
    const [sdk, setSdk] = useState<SpotifyApi | null>(null);
    const [ownerId, setOwnerId] = useState<string>("");

    async function logIn() {
        const auth = new AuthorizationCodeWithPKCEStrategy(
            import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
            import.meta.env.VITE_REDIRECT_TARGET as string,
            appScopes
        );
        const internalSdk = new SpotifyApi(auth, opts);

        try {
            const { authenticated } = await internalSdk.authenticate();

            if (authenticated) {
                setSdk(() => internalSdk);
                const user = await internalSdk.currentUser.profile();
                setOwnerId(user.id);
            }
        } catch (e: unknown) {
            const error = e as Error;
            if (error?.message?.includes("No verifier found in cache")) {
                console.error(
                    "JUST IN CASE DEB: Probably this is being run twice in dev mode",
                    error
                );
            } else {
                console.error(e);
            }
        }
    }

    function logOut() {
        if (sdk) {
            sdk.logOut();
            setSdk(null);
        }
    }

    return { sdk, logIn, logOut, ownerId };
}
