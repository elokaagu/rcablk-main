/** Shared inline styles for fixed corner chrome (logotype + menu). */
export const PAGE_CHROME_TOP_PADDING =
  "max(3.5rem, calc(env(safe-area-inset-top) + 2.75rem))" as const;

export const PAGE_CHROME_TOP_PADDING_COMPACT =
  "max(3rem, calc(env(safe-area-inset-top) + 2.25rem))" as const;

export const SAFE_AREA_PADDING_X = {
  paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
  paddingRight: "max(1.25rem, env(safe-area-inset-right))",
} as const;
