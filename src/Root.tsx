import { useState } from "react";
import { SpotifySdkProvider } from "./SdkContext";
import App from "./App";
import {
    AuthorizationCodeWithPKCEStrategy,
    SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { appScopes } from "./appScopes";
import { opts } from "./config";
import { Header } from "./components/Header";

export function Root() {
    const [sdk, setSdk] = useState<SpotifyApi | null>(null);

    // TODO: also run this function if we have /callback in the url
    async function login() {
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

    function logout() {
        if (sdk) {
            sdk.logOut();
            setSdk(null);
        }
    }

    return (
        <SpotifySdkProvider value={sdk}>
            <Header
                login={() => {
                    void login();
                }}
                logout={logout}
            />
            <App />
        </SpotifySdkProvider>
    );
}
