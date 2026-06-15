import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache keeps a single connection alive across Next.js hot reloads
 * in development and across requests in production.
 *
 * WHY THIS MATTERS FOR PERFORMANCE
 * ─────────────────────────────────
 * MongoDB Atlas cold-starts are slow (~25-30s) because the driver must:
 *  1. Open TCP sockets to each shard host
 *  2. Complete TLS handshakes
 *  3. Perform SCRAM-SHA-256 authentication
 *  4. Run replica-set discovery (hello/isMaster rounds)
 *
 * Caching the connection promise means all of this happens exactly once
 * per process lifetime. Subsequent requests reuse the warm connection
 * and return in <50ms.
 *
 * IMPORTANT: we do NOT reset cached.promise on failure here. Resetting it
 * would cause every concurrent in-flight request during the cold start to
 * each spawn a new connection attempt, flooding Atlas with auth requests
 * and amplifying the slow-start problem. Instead, we keep the same promise
 * and let callers receive the same error — a new attempt is only made on
 * the *next* incoming request after the previous attempt has settled.
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCached: GlobalMongoose | undefined;
}

let cached = global.mongooseCached;

if (!cached) {
  cached = global.mongooseCached = { conn: null, promise: null };
}

/**
 * Mongoose connection options tuned for Atlas + Next.js:
 *
 * serverSelectionTimeoutMS  — how long the driver waits to find an available
 *   server before throwing. Original default is 30 000ms (the cold-start
 *   latency you observed). 20 000ms is still generous while preventing
 *   indefinite hangs.
 *
 * connectTimeoutMS — TCP connect timeout per socket attempt. 15 000ms
 *   is enough for a reachable Atlas cluster on any network.
 *
 * socketTimeoutMS — how long an idle socket is kept open waiting for
 *   a response. 45s is safe for serverless/edge environments.
 *
 * heartbeatFrequencyMS — how often the driver pings the primary to detect
 *   topology changes. 10 000ms (default). Lowering to 5 000ms helps the
 *   driver recover faster after a failover event.
 *
 * minPoolSize: 1 — always keep at least one warm connection in the pool.
 *   Once the cold-start handshake completes, subsequent requests reuse
 *   this socket rather than paying the TLS+auth cost again.
 *
 * maxPoolSize: 10 — sensible upper bound for a Next.js app. Atlas M0
 *   (free tier) supports 100 concurrent connections.
 *
 * bufferCommands: false — never silently queue Mongoose operations while
 *   disconnected. Surface errors immediately so the page can redirect
 *   rather than hanging forever.
 *
 * family: 4 — force IPv4. On Windows, Node.js sometimes prefers IPv6 for
 *   DNS lookups and falls back to IPv4 only after a timeout, adding several
 *   seconds to the first connection. Pinning to IPv4 skips that fallback.
 */
const MONGOOSE_OPTS: mongoose.ConnectOptions = {
  bufferCommands:           false,
  serverSelectionTimeoutMS: 20_000,
  connectTimeoutMS:         15_000,
  socketTimeoutMS:          45_000,
  heartbeatFrequencyMS:     5_000,
  minPoolSize:              1,
  maxPoolSize:              10,
  family:                   4,
};

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Fast-path: already connected — return immediately
  if (cached && cached.conn) {
    return cached.conn;
  }

  // Initiate one connection attempt and share the same promise with all
  // concurrent callers. This prevents N parallel auth handshakes during
  // the cold-start window.
  if (cached && !cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, MONGOOSE_OPTS)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Clear the promise so the *next* request can retry — but only
        // after this attempt has fully settled. Concurrent requests that
        // are already awaiting this promise will still receive the error.
        if (cached) cached.promise = null;
        throw err;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
