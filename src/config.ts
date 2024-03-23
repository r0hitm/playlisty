/* eslint-disable @typescript-eslint/require-await */

/// 🔴^--- Remove the above line after implementing customRedirectionStrategy properly

import { IRedirectionStrategy, SdkOptions } from "@spotify/web-api-ts-sdk";
// const defaultConfig: SdkConfiguration = {
//     fetch: (req: RequestInfo | URL, init: RequestInit | undefined) => fetch(req, init),
//     beforeRequest: (_: string, __: RequestInit) => { },
//     afterRequest: (_: string, __: RequestInit, ___: Response) => { },
//     deserializer: new DefaultResponseDeserializer(),
//     responseValidator: new DefaultResponseValidator(),
//     errorHandler: new NoOpErrorHandler(),
//     redirectionStrategy: new DocumentLocationRedirectionStrategy(),
//     cachingStrategy: isBrowser
//         ? new LocalStorageCachingStrategy()
//         : new InMemoryCachingStrategy()
// };

export default class customRedirectionStrategy implements IRedirectionStrategy {
    public async redirect(targetUrl: string | URL): Promise<void> {
        document.location = targetUrl.toString();
    }

    public async onReturnFromRedirect(): Promise<void> {
        console.log("Returned from redirect");
        // Figure out how to successfully log in the user
        // rn after redirect the state is lost
    }
}

export const opts: SdkOptions = {
    beforeRequest: (url: string, init: RequestInit) => {
        console.log("Before request", url, init);
    },
    afterRequest: (url: string, init: RequestInit, res: Response) => {
        console.log("After request", url, init, res);
    },
    redirectionStrategy: new customRedirectionStrategy(),
};
