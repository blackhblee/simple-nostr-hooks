import { createContext, useContext } from "react";
import NDK, { NDKRelaySet } from "@nostr-dev-kit/ndk";

type NDKContextProps = {
  ndk?: NDK;
  relaySet?: NDKRelaySet;
  canPublishEvents: boolean;
};

const NDKContext = createContext<NDKContextProps>({
  canPublishEvents: false,
});

const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error("useNDK must be used within a NDKProvider");
  }
  return context;
};

export default useNDK;
