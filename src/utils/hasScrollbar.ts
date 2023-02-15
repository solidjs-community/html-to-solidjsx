export const hasScrollbarY = (el: HTMLElement) => {
  const { offsetWidth, clientWidth } = el;
  if (clientWidth === 0) return false;

  return clientWidth !== offsetWidth;
};
