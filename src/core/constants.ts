import type { A11yState } from "@/types";

export const A11Y_STORAGE_KEY = "a11y-settings";

export const A11Y_CONFIG = {
  CONTRAST: { levels: 5, prefix: "a11y-contrast" },
  TEXT_SIZE: { levels: 3, prefix: "a11y-text-size" },
  SPACING: { levels: 3, prefix: "a11y-spacing" },
  LINE_HEIGHT: { levels: 3, prefix: "a11y-leading" },
  ALIGN: ["left", "center", "right"],
} as const;

export const defaultState: A11yState = {
  contrastLevel: 0,
  textSizeLevel: 0,
  textSpacingLevel: 0,
  lineHeightLevel: 0,
  textAlign: "left",
  smartContrast: false,
  highlightLinks: false,
  cursorHighlight: false,
  screenReader: false,
};
