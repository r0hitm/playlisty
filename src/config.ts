import { SdkOptions, Scopes } from "@spotify/web-api-ts-sdk";

export const opts: SdkOptions = {
    // These were not helpful at all during development
    // beforeRequest: (url: string, init: RequestInit) => {
    // console.log("Before request", url, init);
    // },
    // afterRequest: (url: string, init: RequestInit, res: Response) => {
    // console.log("After request", url, init, res);
    // },
};

export const appScopes = [
    ...Scopes.userDetails,
    ...Scopes.userLibraryRead,
    ...Scopes.userLibraryModify,
    ...Scopes.playlistRead,
    ...Scopes.playlistModify,
];
