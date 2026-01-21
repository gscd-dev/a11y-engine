import type { A11yState } from "@/types";
import { useState, useEffect } from "react";
import { a11yEngine } from "../core/A11yEngine";

export const useA11y = (): { state: A11yState; actions: typeof a11yEngine } => {
  const [state, setState] = useState<A11yState>(a11yEngine.getState());

  useEffect(() => {
    return a11yEngine.subscribe(setState);
  }, []);

  return { state, actions: a11yEngine };
};
