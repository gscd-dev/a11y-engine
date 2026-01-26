import { ref, onUnmounted, Ref } from "vue";
import { a11yEngine } from "../core/A11yEngine";
import { A11yState } from "@/types";

export const useA11y = (): { state: Ref<A11yState>; actions: typeof a11yEngine } => {
  const state = ref(a11yEngine.getState());

  const unsubscribe = a11yEngine.subscribe((newState) => {
    state.value = newState;
  });

  onUnmounted(unsubscribe);

  return { state, actions: a11yEngine };
};
