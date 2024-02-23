import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useCallback, useEffect, useState } from "react";
import { kinds } from "nostr-tools";
import useNDK from "./useNDK";

const useFollowingList = ({ pk }: { pk?: string }) => {
  const { ndk } = useNDK();
  const [followingList, setFollowingList] = useState<NDKEvent>();

  const fetchFollowingList = useCallback(async (): Promise<void> => {
    if (!ndk || !pk) return;

    const followingListEvent = await ndk.fetchEvents({
      kinds: [kinds.Contacts],
      authors: [pk],
    });

    if (followingListEvent?.size) {
      const newestEvent = Array.from(followingListEvent).reduce(
        (prevEvent, currentEvent) => {
          if (!prevEvent || currentEvent.created_at! > prevEvent.created_at!) {
            return currentEvent;
          }
          return prevEvent;
        }
      );
      setFollowingList(newestEvent);
    } else {
      const emptyFollowingList = new NDKEvent();
      emptyFollowingList.kind = kinds.Contacts;
      emptyFollowingList.pubkey = pk;
      setFollowingList(emptyFollowingList);
    }
  }, [pk, ndk, setFollowingList]);

  useEffect(() => {
    fetchFollowingList();
  }, [pk, ndk, fetchFollowingList]);

  return { followingList, setFollowingList };
};

export default useFollowingList;
