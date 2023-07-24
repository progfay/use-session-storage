import { useCallback, useSyncExternalStore } from "react";
import { SessionStorageKey } from "./types";
import { getSessionStorageItem } from "./session-storage";
import {
  addChangeSessionStorageItemEventListener,
  removeChangeSessionStorageItemEventListener,
} from "./events";

export const useSessionStorage = (key: SessionStorageKey) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => () => {
      addChangeSessionStorageItemEventListener(key, onStoreChange);
      return removeChangeSessionStorageItemEventListener(onStoreChange);
    },
    []
  );
  const getSnapshot = useCallback(() => getSessionStorageItem(key), [key]);

  const sessionStorageValue = useSyncExternalStore(subscribe, getSnapshot);

  return sessionStorageValue;
};
