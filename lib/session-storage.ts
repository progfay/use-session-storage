import { NoWindowError } from "./errors";
import {
  ChangeSessionStorageItemEvent,
  dispatchChangeSessionStorageItemEvent,
} from "./events";
import {
  ChangeSessionStorageItemEventListener,
  SessionStorageKey,
  SessionStorageValue,
  StorageEventListener,
} from "./types";

export const getSessionStorageItem = (
  key: SessionStorageKey
): SessionStorageValue => {
  if (typeof window === "undefined") throw new NoWindowError();
  return window.sessionStorage.getItem(key);
};

export const setSessionStorageItem = (
  key: SessionStorageKey,
  value: NonNullable<SessionStorageValue>
) => {
  if (typeof window === "undefined") throw new NoWindowError();
  window.sessionStorage.setItem(key, value);

  dispatchChangeSessionStorageItemEvent(
    new ChangeSessionStorageItemEvent(key, value)
  );
};

export const clearSessionStorageItem = (key: SessionStorageKey) => {
  if (typeof window === "undefined") throw new NoWindowError();
  window.sessionStorage.removeItem(key);

  dispatchChangeSessionStorageItemEvent(
    new ChangeSessionStorageItemEvent(key, null)
  );
};

const generateStorageEventListener =
  (key: SessionStorageKey): StorageEventListener =>
  (ev) => {
    if (typeof window === "undefined") throw new NoWindowError();
    if (ev.storageArea !== window.sessionStorage) return;
    if (ev.key !== key) return;

    dispatchChangeSessionStorageItemEvent(
      new ChangeSessionStorageItemEvent(ev.key, ev.newValue)
    );
  };

const STORAGE_EVENT_LISTENER_MAP = new Map<
  ChangeSessionStorageItemEventListener,
  StorageEventListener
>();
export const addStorageEventListener = (
  key: SessionStorageKey,
  listener: ChangeSessionStorageItemEventListener
) => {
  if (typeof window === "undefined") throw new NoWindowError();
  const emitChange = generateStorageEventListener(key);
  STORAGE_EVENT_LISTENER_MAP.set(listener, emitChange);

  window.addEventListener("storage", emitChange);
};

export const removeStorageEventListener = (
  listener: ChangeSessionStorageItemEventListener
) => {
  if (typeof window === "undefined") throw new NoWindowError();

  const emitChange = STORAGE_EVENT_LISTENER_MAP.get(listener);
  if (emitChange === undefined) return;

  window.removeEventListener("storage", emitChange);
  STORAGE_EVENT_LISTENER_MAP.delete(listener);
};
