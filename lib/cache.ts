/** Tiny in-memory LRU for server utilities if needed (MVP). */
type Key = string;
type Val = unknown;

export function createLRU(capacity = 200) {
  const map = new Map<Key, Val>();
  function get(k: Key) {
    const v = map.get(k);
    if (v !== undefined) {
      map.delete(k); map.set(k, v);
    }
    return v;
  }
  function set(k: Key, v: Val) {
    if (map.has(k)) map.delete(k);
    map.set(k, v);
    if (map.size > capacity) {
      const first = map.keys().next().value;
      map.delete(first);
    }
  }
  function has(k: Key) { return map.has(k); }
  return { get, set, has };
}
