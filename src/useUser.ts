"use client";

import { useEffect, useState } from "react";
import { NDKUser } from "@nostr-dev-kit/ndk";
import useNDK from "./useNDK";

const useUser = (pk?: string) => {
  const { ndk } = useNDK();
  const [user, setUser] = useState<NDKUser>();

  useEffect(() => {
    if (!ndk || !pk) {
      return;
    }
    const fetchUser = async () => {
      const newUser = ndk.getUser({ pubkey: pk });
      if (!newUser.profile) {
        await newUser.fetchProfile();
      }
      setUser(newUser);
    };
    fetchUser();
  }, [pk]);

  return user;
};

export default useUser;
