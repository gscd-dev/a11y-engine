export class ScreenReader {
  private active: boolean = false;
  private lang: string;

  constructor(lang: string = "en-US") {
    this.handleFocus = this.handleFocus.bind(this);
    this.lang = lang;
  }

  enable() {
    this.active = true;
    window.addEventListener("focusin", this.handleFocus);
  }

  disable() {
    this.active = false;
    window.removeEventListener("focusin", this.handleFocus);
    window.speechSynthesis.cancel();
  }

  private handleFocus(e: FocusEvent) {
    if (!this.active) return;
    const target = e.target as HTMLElement;
    const text =
      target.getAttribute("aria-label") || target.innerText || target.getAttribute("alt");
    if (text) this.speak(text);
  }

  private speak(text: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    window.speechSynthesis.speak(utterance);
  }
}
