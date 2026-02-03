import { useState, useEffect } from "react";
import { a11yEngine } from "@/core/A11yEngine";
import { type A11yState } from "@/core/constants";

export const useA11y = (lang?: string): { state: A11yState; actions: typeof a11yEngine } => {
  const [state, setState] = useState<A11yState>(a11yEngine.getState());

  useEffect(() => {
    a11yEngine.setScreenReaderLanguage(lang || "en-US");
    return a11yEngine.subscribe(setState);
  }, []);

  return { state, actions: a11yEngine };
};
