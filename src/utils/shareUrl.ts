import type { Snapshot } from '../types';

export function encodeState(state: Snapshot): string {
  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json));
}

export function decodeState(hash: string): Snapshot | null {
  try {
    const raw = hash.replace(/^#/, '');
    if (!raw) return null;
    const json = decodeURIComponent(atob(raw));
    const state = JSON.parse(json);
    if (!state.dimensions || !state.series) return null;
    return state as Snapshot;
  } catch {
    return null;
  }
}
