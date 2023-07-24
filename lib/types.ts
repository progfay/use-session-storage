import type { ChangeSessionStorageItemEvent } from "./events";

export type SessionStorageKey = Parameters<Storage["getItem"]>[0];
export type SessionStorageValue = ReturnType<Storage["getItem"]>;
export type StorageEventListener = (ev: StorageEvent) => void;
export type ChangeSessionStorageItemEventListener = (
  ev: ChangeSessionStorageItemEvent
) => void;
