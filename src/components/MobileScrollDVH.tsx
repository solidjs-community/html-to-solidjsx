import { isIOS } from "@solid-primitives/platform";
import { ParentComponent, onMount } from "solid-js";

/**
 * MobileScrollDVH (Dynamic Viewport Height)
 * Makes element's height use dynamic viewport height, `100dvh`, so initially fits small viewport, but allows user to scroll to collapse/hide browser toolbars and then dynamically updates height to long viewport. https://web.dev/blog/viewport-units
 *
 * By default certain types of websites that fit inside viewport ( such as simple texteditors, transformers, tooling ect ), layout-wise are not reading document and therefore won't have page scroll. However this causes the mobile browser navigation toolbar to be forever visible and takes up valuable space. This wrapper allows the user to reclaim additional space back to the site by scrolling down to trigger toolbar to hide.
 *
 */
const MobileScrollDVH: ParentComponent = ({ children }) => {
  // Browser allows scroll to hide toolbars when:
  //  - Chrome: 2.5 seconds after page loads.
  //  - Firefox and Safari: Immediatly after page loads.

  // Scroll sliding direction to toggle toolbar, but slide delta isn't more than toolbar height (or some value) and haven't let pointer up:
  //  - Chrome: Only translates viewport.
  //  - Safari: Scrolls page.
  //  - Firefox: Most of the time follows Chrome behavior but sometimes scrolls a little bit.

  // Scroll sliding but letting go before passing threshold to toggle toolbar which cancels it, does:
  //  - Chrome: Amount that was slid, is the same that applies to page scroll.
  //  - Safari: Nothing, no additional scroll is applied to page.
  //  - Firefox: Most of time follows Safari behavior but sometimes additional scroll is added causing tiny scroll jump.

  let dvhEl!: HTMLDivElement;
  let lvhEl!: HTMLDivElement;
  let svhEl!: HTMLDivElement;

  onMount(() => {
    // must round due to iOS subpixel inconsistencies
    const getDocumentScrollHeight = () => Math.round(document.documentElement.scrollHeight);
    const getlvhHeight = () => ({ height: Math.round(lvhEl.getBoundingClientRect().height) });
    let documentScrollHeight = getDocumentScrollHeight();
    let lvhElBCR = getlvhHeight();
    let scrollStart = false;
    let debounce = 0;

    // no toolbars present, exit
    if (Math.round(svhEl.getBoundingClientRect().height) === lvhElBCR.height) return;

    // fixes "scroll creeping" on Chromium devices, where if you scroll a tiny bit down to slide the toolbars but not beyond the threshold to activate hidding them, the toolbars don't hide and scroll amount commits to actual page scroll.
    const onScroll = () => {
      documentScrollHeight = scrollStart ? getDocumentScrollHeight() : documentScrollHeight;
      scrollStart = false;

      // if other elements extend the document height and is intended to be scrolled, don't scroll to top
      if (documentScrollHeight > lvhElBCR.height) return;
      if (!isIOS) {
        // on iOS, scroll event does fire upon sliding, causing a janky effect due to page scrolling to top and good change you don't scroll to bottom to collapse toolbar
        // one solution is to debounce the scrollTo top page, but the issue is that in iOS, visually the page doesn't scroll to the top so the top part is cut off.
        window.scrollTo({ top: 0 });
        return;
      }

      // another issue is that if user taps toolbar to expand, from then on, the toolbar can never be collapsed unless user scrolls at top of page (1 pixel away) then scrolls back down.
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        scrollToTopAwayFromOnePixel();
      }, 250);
    };

    function scrollToTopAwayFromOnePixel() {
      requestAnimationFrame(() => {
        if (window.scrollY <= 1) {
          return;
        }
        window.scrollBy({ top: -(window.scrollY - 1) });
        setTimeout(() => {
          window.scrollTo({ top: 0 });
        });
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", () => {
      scrollStart = true;
    });

    // sliding toolbar triggers window resize
    window.addEventListener(
      "resize",
      () => {
        documentScrollHeight = getDocumentScrollHeight();
        lvhElBCR = getlvhHeight();
      },
      { passive: true },
    );
    if (isIOS) {
      const padding = 5;
      // Toolbar only collapses if document scroll height is greater than 100lvh.
      // The minimum extended height is 5px. Otherwise, after toolbar collapses, and dvh applies, toolbar reverts back to expanded size.
      lvhEl.style.height = `calc(100lvh + ${padding}px`;
    }
  });

  return (
    <div style="height: 100dvh;" ref={dvhEl}>
      {children}
      <div style="position: absolute; inset: 0; visibility: hidden; height: 100svh;" ref={svhEl} />
      <div style="position: absolute; inset: 0; visibility: hidden; height: 100lvh;" ref={lvhEl} />
    </div>
  );
};

export default MobileScrollDVH;
