import { Scopes } from "@spotify/web-api-ts-sdk";

export const appScopes = [
    ...Scopes.userDetails,
    ...Scopes.userLibraryRead,
    ...Scopes.userLibraryModify,
    ...Scopes.playlistRead,
    ...Scopes.playlistModify,
];
