import {
  NDKEvent,
  NDKZapInvoice,
  zapInvoiceFromEvent,
} from "@nostr-dev-kit/ndk";
import { kinds } from "nostr-tools";
import { useCallback, useEffect, useMemo, useState } from "react";
import useNDK from "./useNDK";

const useActionList = ({ note }: { note: NDKEvent }) => {
  const { ndk } = useNDK();
  const [reactions, setReactions] = useState<NDKEvent[]>();
  const [reposts, setReposts] = useState<NDKEvent[]>();
  const [comments, setComments] = useState<NDKEvent[]>();
  const [zapsAmountTotal, setZapsAmountTotal] = useState<number>();
  const filter = useMemo(
    () => ({
      kinds: [
        kinds.ShortTextNote,
        kinds.Reaction,
        kinds.Zap,
        kinds.Repost,
        kinds.GenericRepost,
      ],
      "#e": [note.id],
    }),
    [note.id]
  );

  const dispatchData = useCallback(async (events: NDKEvent[]) => {
    setReactions(events.filter(({ kind }) => kind === kinds.Reaction));
    setReposts(
      events.filter(
        ({ kind }) => kind && [kinds.Repost, kinds.GenericRepost].includes(kind)
      )
    );
    setComments(
      events.filter(({ kind }) =>
        [kinds.ShortTextNote].includes(kind as number)
      )
    );

    const validZapInvoices = events
      .map(zapInvoiceFromEvent)
      .filter((zi) => zi !== null) as NDKZapInvoice[];
    const getZapsAmountTotal = () => {
      return validZapInvoices.reduce((acc, { amount: amountInMillistas }) => {
        const amount = amountInMillistas ? amountInMillistas / 1000 : 0;

        return acc + amount;
      }, 0);
    };
    setZapsAmountTotal(getZapsAmountTotal());
  }, []);

  useEffect(() => {
    if (!ndk) {
      return;
    }

    ndk
      .fetchEvents(filter, {})
      .then((events) => Array.from(events))
      .then(dispatchData)
      .catch(console.error);
  }, [ndk, filter, dispatchData]);

  return { reactions, reposts, comments, zapsAmountTotal };
};

export default useActionList;
