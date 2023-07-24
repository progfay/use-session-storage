import {
  addStorageEventListener,
  removeStorageEventListener,
} from "./session-storage";
import type {
  ChangeSessionStorageItemEventListener,
  SessionStorageKey,
  SessionStorageValue,
} from "./types";

export const CHANGE_SESSION_STORAGE_ITEM_EVENT_TYPE =
  "changeSessionStorageItemEventType";

export class ChangeSessionStorageItemEvent extends Event {
  key: SessionStorageKey;
  value: SessionStorageValue;

  constructor(key: SessionStorageKey, value: SessionStorageValue) {
    super(CHANGE_SESSION_STORAGE_ITEM_EVENT_TYPE);
    this.key = key;
    this.value = value;
  }
}

const ChangeSessionStorageItemEventTarget = new EventTarget();

export const dispatchChangeSessionStorageItemEvent = (
  ev: ChangeSessionStorageItemEvent
) => {
  ChangeSessionStorageItemEventTarget.dispatchEvent(ev);
};

const generateEventListener =
  (
    key: SessionStorageKey,
    changeSessionStorageItemEventListener: ChangeSessionStorageItemEventListener
  ): EventListener =>
  (ev) => {
    if (!(ev instanceof ChangeSessionStorageItemEvent)) return;
    if (ev.key !== key) return;
    changeSessionStorageItemEventListener(ev);
  };

const CHANGE_SESSION_STORAGE_ITEM_EVENT_LISTENER_MAP = new Map<
  ChangeSessionStorageItemEventListener,
  EventListener
>();

export const addChangeSessionStorageItemEventListener = (
  key: SessionStorageKey,
  listener: ChangeSessionStorageItemEventListener
) => {
  addStorageEventListener(key, listener);

  const eventListener = generateEventListener(key, listener);
  CHANGE_SESSION_STORAGE_ITEM_EVENT_LISTENER_MAP.set(listener, eventListener);
  ChangeSessionStorageItemEventTarget.addEventListener(
    CHANGE_SESSION_STORAGE_ITEM_EVENT_TYPE,
    eventListener
  );
};

export const removeChangeSessionStorageItemEventListener = (
  listener: ChangeSessionStorageItemEventListener
) => {
  removeStorageEventListener(listener);

  const eventListener =
    CHANGE_SESSION_STORAGE_ITEM_EVENT_LISTENER_MAP.get(listener);
  if (eventListener === undefined) return;

  CHANGE_SESSION_STORAGE_ITEM_EVENT_LISTENER_MAP.delete(listener);
  ChangeSessionStorageItemEventTarget.removeEventListener(
    CHANGE_SESSION_STORAGE_ITEM_EVENT_TYPE,
    eventListener
  );
};
