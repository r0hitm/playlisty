import { createContext } from "react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useSdk } from "./hooks/useSdk";

interface SdkProviderProps {
    children: React.ReactNode;
}

export const SdkContext = createContext<SpotifyApi | null>(null);

export function SdkProvider({ children }: SdkProviderProps) {
    const sdk = useSdk();

    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
}
