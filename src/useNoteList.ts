import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useCallback, useEffect, useState } from "react";
import { kinds } from "nostr-tools";
import useNDK from "./useNDK";

const useNoteList = ({ pk }: { pk?: string }) => {
  const { ndk } = useNDK();
  const [noteList, setNoteList] = useState<Set<NDKEvent>>();

  const fetchNoteList = useCallback(async () => {
    if (!ndk || !pk) return;

    const noteListEvent = await ndk.fetchEvents({
      kinds: [kinds.ShortTextNote],
      authors: [pk],
    });

    if (noteListEvent?.size) {
      setNoteList(noteListEvent);
    } else {
      const emptyNoteList = new Set<NDKEvent>();
      setNoteList(emptyNoteList);
    }
  }, [pk, ndk, setNoteList]);

  useEffect(() => {
    fetchNoteList();
  }, [pk, ndk, fetchNoteList]);

  return { noteList, setNoteList };
};

export default useNoteList;
