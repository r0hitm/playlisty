import { useContext } from "react";
import { SpotifySdkContext } from "./SdkContext";


export const useSpotifySdk = () => {
    return useContext(SpotifySdkContext);
};
