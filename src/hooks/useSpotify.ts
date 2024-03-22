import { useEffect, useRef, useState } from "react";
import {
    SpotifyApi,
    SdkOptions,
    AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

export function useSpotify(
    clientId: string,
    redirectUrl: string,
    scopes: string[],
    config?: SdkOptions
) {
    const [sdk, setSdk] = useState<SpotifyApi | null>(null);
    const { current: activeScopes } = useRef(scopes);

    useEffect(() => {
        (async () => {
            const auth = new AuthorizationCodeWithPKCEStrategy(
                clientId,
                redirectUrl,
                activeScopes
            );
            const internalSdk = new SpotifyApi(auth, config);

            try {
                const { authenticated } = await internalSdk.authenticate();

                if (authenticated) {
                    setSdk(() => internalSdk);
                }
            } catch (e: unknown) {
                const error = e as Error;
                if (error?.message?.includes("No verifier found in cache")) {
                    console.error(
                        "This error results from React runing useEffect twice in dev mode. Nothing to worry about.",
                        error
                    );
                } else {
                    console.error(e);
                }
            }
        })();
    }, [clientId, redirectUrl, config, activeScopes]);

    return sdk;
}
