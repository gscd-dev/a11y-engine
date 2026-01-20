export interface A11yState {
  contrastLevel: number;
  textSizeLevel: number;
  textSpacingLevel: number;
  lineHeightLevel: number;
  textAlign: "left" | "center" | "right";
  smartContrast: boolean;
  highlightLinks: boolean;
  cursorHighlight: boolean;
  screenReader: boolean;
}
