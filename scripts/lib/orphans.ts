export type StoredBlob = { url: string; pathname: string; size: number; uploadedAt: Date };

export const MIN_ORPHAN_AGE_MS = 24 * 60 * 60 * 1000;

/** Unreferenced blobs old enough that they can't belong to an upload the dashboard hasn't saved yet. */
export function findOrphans(blobs: StoredBlob[], referenced: Set<string>, now = Date.now(), minAgeMs = MIN_ORPHAN_AGE_MS) {
  const orphans: StoredBlob[] = [];
  let tooRecent = 0;
  for (const blob of blobs) {
    if (referenced.has(blob.url)) continue;
    if (now - blob.uploadedAt.getTime() < minAgeMs) tooRecent += 1;
    else orphans.push(blob);
  }
  return { orphans, tooRecent };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
