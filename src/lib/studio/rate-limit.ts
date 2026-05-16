type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Max login attempts per key within the sliding window. */
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) {
      buckets.delete(key);
    }
  }
}

/** Returns true when the key has exceeded the allowed attempt rate. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();

  if (buckets.size > 5000) {
    pruneExpired(now);
  }

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_ATTEMPTS;
}
