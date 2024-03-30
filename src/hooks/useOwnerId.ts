import { createContext, useContext } from "react";

export const ownerIdContext = createContext<string>("");

export function useOwnerId(): string {
    return useContext(ownerIdContext);
}
