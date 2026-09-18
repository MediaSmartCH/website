/**
 * Recovers a page whose code chunk failed to load.
 *
 * Every route is `React.lazy`, so it is fetched as its own content-hashed file
 * when the visitor navigates. Those names change with every deployment, and a
 * browser tab left open still holds the previous deployment's HTML — so it asks
 * for a file that is no longer there and gets a 404. The import rejects, the
 * error boundary catches it, and the visitor is shown an error page for what is
 * really a stale tab.
 *
 * Retrying the same import cannot help: the URL is wrong, not flaky, and the
 * 404 is itself cached. Reloading is what fixes it — the HTML is served
 * `max-age=0, must-revalidate`, so the reload fetches the current document and
 * with it the current chunk names.
 *
 * The reload happens at most once per session. A module that throws while
 * *evaluating* also rejects here, and reloading would not fix that; the guard
 * makes the second attempt surface the real error to the boundary instead of
 * looping. The mark is cleared on the first successful load, so a later
 * deployment gets its own single attempt.
 *
 * What this does not fix: a CDN that has cached a 404 for a file that *does*
 * exist. The reload then fetches the same HTML, asks for the same file, and
 * gets the same cached 404 — one retry, then the error page. That failure lives
 * in the CDN and is dealt with there (see SECURITY.md, "Immutable assets and
 * cached 404s").
 */

const RELOAD_MARK = "mediasmart:chunk-recovery";

/**
 * Session storage, or null when it cannot be relied on.
 *
 * The object exists in a private window but throws on write, so it is probed
 * rather than merely checked. Without somewhere to record the attempt there is
 * no way to stop a reload loop, and a loop is far worse than an error page.
 */
function usableSessionStorage(): Storage | null {
  try {
    const storage = window.sessionStorage;
    const probe = `${RELOAD_MARK}:probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/** Records that a reload is being attempted. False means: do not reload. */
function claimReload(): boolean {
  const storage = usableSessionStorage();
  if (!storage || storage.getItem(RELOAD_MARK)) {
    return false;
  }

  storage.setItem(RELOAD_MARK, "1");
  return true;
}

function releaseReload(): void {
  usableSessionStorage()?.removeItem(RELOAD_MARK);
}

/**
 * Wraps a dynamic import so a failed chunk load reloads the page once.
 *
 * Kept separate from `React.lazy` so the behaviour can be tested without
 * rendering anything.
 */
export function withChunkRecovery<T>(load: () => Promise<T>): () => Promise<T> {
  return () =>
    load().then(
      (loaded) => {
        releaseReload();
        return loaded;
      },
      (error: unknown) => {
        if (!claimReload()) {
          throw error;
        }

        window.location.reload();

        // Never settles on purpose: the document is being replaced, and
        // resolving would briefly render a page that is about to disappear.
        // Suspense keeps showing the loader until the reload takes over.
        return new Promise<T>(() => {});
      },
    );
}
