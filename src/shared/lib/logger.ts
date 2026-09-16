/**
 * The one place the app writes to the console.
 *
 * Deliberately a pass-through: the arguments reach `console` exactly as they
 * were given, so existing log lines read identically. The point is not to
 * reformat anything, it is to have a single sink — so adding error reporting,
 * sampling, or a production silence rule later is one edit here rather than a
 * grep across the codebase.
 *
 * This is for diagnostics only. Anything a visitor should see goes through the
 * i18n bundles and the component's own error state, never through here.
 */

type LogArgs = readonly unknown[];

export const logger = {
  /** Something failed that the user may or may not notice. Always reported. */
  error(...args: LogArgs): void {
    console.error(...args);
  },

  /** Something recoverable, or a developer-facing hint. Always reported. */
  warn(...args: LogArgs): void {
    console.warn(...args);
  },

  /**
   * Developer-facing only; silent in production builds.
   *
   * Used for things like missing translation keys, which are worth surfacing
   * while working but would be noise in a visitor's console.
   */
  debug(...args: LogArgs): void {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
};
