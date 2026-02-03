export class ScreenReader {
  // Indicates whether the screen reader is active
  private active: boolean = false;

  // Language for speech synthesis
  private lang: string;

  // Initializes the ScreenReader with an optional language parameter
  constructor(lang: string = "en-US") {
    this.handleFocus = this.handleFocus.bind(this);
    this.lang = lang;
  }

  changeLanguage(lang: string) {
    this.lang = lang;
  }

  // Enables the screen reader functionality
  enable() {
    this.active = true;
    window.addEventListener("focusin", this.handleFocus);
  }

  // Disables the screen reader functionality
  disable() {
    this.active = false;
    window.removeEventListener("focusin", this.handleFocus);
    window.speechSynthesis.cancel();
  }

  // Handles focus events and reads out the focused element's text
  private handleFocus(e: FocusEvent) {
    if (!this.active) return;
    const target = e.target as HTMLElement;
    const text =
      target.getAttribute("aria-label") || target.innerText || target.getAttribute("alt");
    if (text) this.speak(text);
  }

  // Uses the Web Speech API to read out the provided text
  private speak(text: string) {
    // Check if the Speech Synthesis API is supported
    if (!("speechSynthesis" in window)) return;

    // Cancel any ongoing speech and speak the new text
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    window.speechSynthesis.speak(utterance);
  }
}
