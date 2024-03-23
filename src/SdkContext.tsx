import { createContext } from "react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const SpotifySdkContext = createContext<SpotifyApi | null>(null);

export const SpotifySdkProvider = SpotifySdkContext.Provider;
