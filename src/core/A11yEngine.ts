import { A11Y_CONFIG, A11Y_STORAGE_KEY, defaultState } from "./constants";
import type { A11yState } from "@/types";
import { ScreenReader } from "./ScreenReader";

// Accessibility Engine to manage and apply accessibility settings
class A11yEngine {
  // Current state of accessibility settings
  private state: A11yState;
  private listeners: Set<(state: A11yState) => void> = new Set();
  // Screen reader engine instance
  private screenReaderEngine = new ScreenReader();

  constructor() {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    this.state = saved ? JSON.parse(saved) : defaultState;
    this.apply();
  }

  private apply() {
    // Apply the current accessibility settings to the document
    const root = document.documentElement;

    // Clear existing accessibility-related classes
    const prefixes = ["a11y-", "dark"];

    root.classList.forEach((cls) => {
      if (prefixes.some((p) => cls.startsWith(p))) root.classList.remove(cls);
    });

    const {
      contrastLevel,
      textSizeLevel,
      textSpacingLevel,
      lineHeightLevel,
      textAlign,
      smartContrast,
      highlightLinks,
      cursorHighlight,
      screenReader,
    } = this.state;

    // Apply contrast settings
    if (contrastLevel === 1) root.classList.add("dark");
    else if (contrastLevel > 1) root.classList.add(`a11y-contrast-${contrastLevel}`);

    // Settings with multiple levels
    if (textSizeLevel > 0) root.classList.add(`a11y-text-size-${textSizeLevel}`);
    if (textSpacingLevel > 0) root.classList.add(`a11y-spacing-${textSpacingLevel}`);
    if (lineHeightLevel > 0) root.classList.add(`a11y-leading-${lineHeightLevel}`);

    // Settings like toggles or specific values
    if (textAlign !== "left") root.classList.add(`a11y-align-${textAlign}`);
    if (smartContrast) root.classList.add("a11y-smart-contrast");
    if (highlightLinks) root.classList.add("a11y-link-highlight");
    if (cursorHighlight) root.classList.add("a11y-cursor-highlight");

    // Enable or disable screen reader based on state
    screenReader ? this.screenReaderEngine.enable() : this.screenReaderEngine.disable();

    // Store the current state in localStorage
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(this.state));
  }

  private notify() {
    this.listeners.forEach((callback) => callback({ ...this.state }));
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(this.state));
  }

  private update() {
    this.apply();
    this.notify();
  }

  subscribe(listener: (state: A11yState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  applySettings(data?: Partial<A11yState>) {
    // Initialize state with saved settings or default initial state
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    this.state = saved ? JSON.parse(saved) : defaultState;

    if (data) this.state = { ...this.state, ...data };
    this.apply();
  }

  // Exposed methods to modify accessibility settings
  cycleContrast() {
    this.state.contrastLevel = (this.state.contrastLevel + 1) % A11Y_CONFIG.CONTRAST.levels;
    this.update();
  }

  cycleTextSize() {
    this.state.textSizeLevel = (this.state.textSizeLevel + 1) % A11Y_CONFIG.TEXT_SIZE.levels;
    this.update();
  }

  cycleTextSpacing() {
    this.state.textSpacingLevel = (this.state.textSpacingLevel + 1) % A11Y_CONFIG.SPACING.levels;
    this.update();
  }

  toggleScreenReader() {
    this.state.screenReader = !this.state.screenReader;
    this.update();
  }

  resetAll() {
    this.state = { ...defaultState };
    this.update();
  }

  getState() {
    return { ...this.state };
  }
}

export const a11yEngine = new A11yEngine();
