export const onTransitionend = (el: HTMLElement, cb: () => void) => {
  el.addEventListener(
    "transitionend",
    (e) => {
      if (e.currentTarget !== e.target) return;
      cb();
    },
    { once: true }
  );
};
