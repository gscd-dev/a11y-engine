import { A11Y_CONFIG, A11Y_STORAGE_KEY, type A11yState, defaultState } from "./constants";
import { ScreenReader } from "./ScreenReader";

// Accessibility Engine to manage and apply accessibility settings
class A11yEngine {
  // Current state of accessibility settings
  private state: A11yState;
  private listeners: Set<(state: A11yState) => void> = new Set();
  // Screen reader engine instance
  private screenReaderEngine = new ScreenReader();

  constructor() {
    this.state = { ...defaultState };
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) {
      const parsedState: Partial<A11yState> = JSON.parse(saved);
      if (!this.checkValidation(parsedState)) {
        localStorage.removeItem(A11Y_STORAGE_KEY);
      }
      this.state = { ...this.state, ...parsedState };
    }
    this.apply();
  }

  private checkValidation(state: Partial<A11yState>): boolean {
    // Validate the provided state against A11Y_CONFIG
    if (state.contrastLevel !== undefined) {
      if (state.contrastLevel < 0 || state.contrastLevel >= A11Y_CONFIG.CONTRAST.levels)
        return false;
    }
    if (state.textSizeLevel !== undefined) {
      if (state.textSizeLevel < 0 || state.textSizeLevel >= A11Y_CONFIG.TEXT_SIZE.levels)
        return false;
    }
    if (state.textSpacingLevel !== undefined) {
      if (state.textSpacingLevel < 0 || state.textSpacingLevel >= A11Y_CONFIG.SPACING.levels)
        return false;
    }
    if (state.lineHeightLevel !== undefined) {
      if (state.lineHeightLevel < 0 || state.lineHeightLevel >= A11Y_CONFIG.LINE_HEIGHT.levels)
        return false;
    }
    if (state.textAlign !== undefined) {
      if (!A11Y_CONFIG.ALIGN.includes(state.textAlign)) return false;
    }
    if (state.smartContrast !== undefined) {
      if (typeof state.smartContrast !== "boolean") return false;
    }
    if (state.highlightLinks !== undefined) {
      if (typeof state.highlightLinks !== "boolean") return false;
    }
    if (state.cursorHighlight !== undefined) {
      if (typeof state.cursorHighlight !== "boolean") return false;
    }
    if (state.screenReader !== undefined) {
      if (typeof state.screenReader !== "boolean") return false;
    }
    return true;
  }

  private apply(): void {
    // Apply the current accessibility settings to the document
    const root = document.documentElement;

    // Clear existing accessibility-related classes
    const prefixes = [
      "a11y-contrast-",
      "a11y-text-size-",
      "a11y-spacing-",
      "a11y-leading-",
      "a11y-align-",
    ];

    const singleClass = ["a11y-smart-contrast", "a11y-link-highlight", "a11y-cursor-highlight"];

    root.classList.forEach((cls) => {
      if (prefixes.some((p) => cls.startsWith(p))) root.classList.remove(cls);
    });

    singleClass.forEach((cls) => {
      if (root.classList.contains(cls)) root.classList.remove(cls);
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
    if (contrastLevel > 0) root.classList.add(`a11y-contrast-${contrastLevel}`);

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

  private notify(): void {
    this.listeners.forEach((callback) => callback({ ...this.state }));
  }

  private update(): void {
    this.apply();
    this.notify();
  }

  subscribe(listener: (state: A11yState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  applySettings(data?: Partial<A11yState>): void {
    // Initialize state with saved settings or default initial state
    if (data) {
      if (!this.checkValidation(data)) {
        throw new Error("Invalid accessibility settings provided.");
      }
      this.state = { ...this.state, ...data };
    }
    this.update();
  }

  // Exposed methods to modify accessibility settings
  cycleContrast(): void {
    this.state.contrastLevel = (this.state.contrastLevel + 1) % A11Y_CONFIG.CONTRAST.levels;
    this.update();
  }

  cycleTextSize(): void {
    this.state.textSizeLevel = (this.state.textSizeLevel + 1) % A11Y_CONFIG.TEXT_SIZE.levels;
    this.update();
  }

  cycleTextSpacing(): void {
    this.state.textSpacingLevel = (this.state.textSpacingLevel + 1) % A11Y_CONFIG.SPACING.levels;
    this.update();
  }

  cycleLineHeight(): void {
    this.state.lineHeightLevel = (this.state.lineHeightLevel + 1) % A11Y_CONFIG.LINE_HEIGHT.levels;
    this.update();
  }

  cycleTextAlign(): void {
    const currentIndex = A11Y_CONFIG.ALIGN.indexOf(this.state.textAlign);
    const nextIndex = (currentIndex + 1) % A11Y_CONFIG.ALIGN.length;
    this.state.textAlign = A11Y_CONFIG.ALIGN[nextIndex];
    this.update();
  }

  toggleSmartContrast(): void {
    this.state.smartContrast = !this.state.smartContrast;
    this.update();
  }

  toggleHighlightLinks(): void {
    this.state.highlightLinks = !this.state.highlightLinks;
    this.update();
  }

  toggleCursorHighlight(): void {
    this.state.cursorHighlight = !this.state.cursorHighlight;
    this.update();
  }

  toggleScreenReader(): void {
    this.state.screenReader = !this.state.screenReader;
    this.update();
  }

  resetAll(): void {
    this.state = { ...defaultState };
    this.update();
  }

  getState(): A11yState {
    return Object.freeze({ ...this.state });
  }
}

export const a11yEngine =
  typeof window !== "undefined" && typeof document !== "undefined" ? new A11yEngine() : null;
