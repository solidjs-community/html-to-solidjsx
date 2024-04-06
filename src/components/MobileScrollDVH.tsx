import { isFirefox, isIOS } from "@solid-primitives/platform";
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

  // Scroll, caused by overscroll (already reached the boundary of sub element scrolling area), sliding direction to toggle toolbar, but slide delta isn't more than toolbar height (or some value) and haven't let pointer up:
  //  - Chrome: Only translates viewport.
  //  - Safari: Scrolls page, will close toolbar when scrolled all the way down.
  //  - Firefox: Scrolls page, never closes toolbar must let go pointer then scroll down again to close toolbar.

  let dvhEl!: HTMLDivElement;
  let lvhEl!: HTMLDivElement;
  let svhEl!: HTMLDivElement;

  onMount(() => {
    // must round due to iOS subpixel inconsistencies
    const getDocumentScrollHeight = () => Math.round(document.documentElement.scrollHeight);
    const getlvhHeight = () => ({ height: Math.round(lvhEl.getBoundingClientRect().height) });
    let documentScrollHeight = 0;
    let lvhElBCR = { height: 0 };
    let scrollStart = false;

    calculateRootHeightElements();

    const { debounced: debouncedScrollToTopAwayFromOnePixel } = debounce(() => {
      scrollToTopAwayFromOnePixel();
    }, 250);
    const { debounced: debouncedCalculateRootHeightElements } = debounce(() => {
      calculateRootHeightElements();
    }, 250);
    const { debounced: debouncedScrollToTop2s, cancel: cancelDebouncedScrollToTop3s } = debounce(
      (data) => {
        const documentScrollHeight = getDocumentScrollHeight();
        // what if document changed height where it can be scrolled
        if (data.documentScrollHeight !== documentScrollHeight) return;
        window.scrollTo({ top: 0 });
      },
      2000,
    );

    // no toolbars present, exit
    if (Math.round(svhEl.getBoundingClientRect().height) === lvhElBCR.height) return;

    requestAnimationFrame(() => {
      // 100lvh allows page to be scrolled in all browsers, but overscroll inside scrollable containers that allows page to be scrolled doesn't happen in Firefox.
      let extendHeight = 0;

      if (isFirefox) {
        extendHeight = 0.2;
      }

      if (isIOS) {
        // Toolbar only collapses if document scroll height is greater than 100lvh.
        // The minimum extended height is 5px. Otherwise, after toolbar collapses, and dvh applies, toolbar reverts back to expanded size.
        extendHeight = 5;
      }
      lvhEl.style.height = `calc(100lvh + ${extendHeight}px)`;
    });

    // fixes "scroll creeping" on Chromium devices, where if you scroll a tiny bit down to slide the toolbars but not beyond the threshold to activate hidding them, the toolbars don't hide and scroll amount commits to actual page scroll.
    const onScroll = (e: Event) => {
      if (scrollStart) {
        calculateRootHeightElements();
      }
      scrollStart = false;

      // if other elements extend the document height and is intended to be scrolled, don't scroll to top
      if (documentScrollHeight > lvhElBCR.height) return;

      if (isFirefox) {
        // Firefox, the 1st gestured overscroll won't close toolbar, instead scrolls page, in this case 0.2px down, subsequent scrolls will close toolbar
        debouncedScrollToTop2s({ documentScrollHeight });
        return;
      }
      if (!isIOS) {
        // on iOS, scroll event does fire upon sliding, causing a janky effect due to page scrolling to top and good change you don't scroll to bottom to collapse toolbar
        // one solution is to debounce the scrollTo top page, but the issue is that in iOS, visually the page doesn't scroll to the top so the top part is cut off.
        window.scrollTo({ top: 0 });
        return;
      }

      // another issue is that if user taps toolbar to expand, from then on, the toolbar can never be collapsed unless user scrolls at top of page (1 pixel away) then scrolls back down.
      debouncedScrollToTopAwayFromOnePixel();
    };

    function scrollToTopAwayFromOnePixel() {
      requestAnimationFrame(() => {
        if (window.scrollY <= 1) {
          return;
        }
        window.scrollBy({ top: -(window.scrollY - 1) });
        setTimeout(() => {
          window.scrollTo({ top: 0 });
          setTimeout(() => {
            scrollStart = false;
          });
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
        if (!isIOS) {
          calculateRootHeightElements();
          return;
        }

        // resize fires on every height change during iOS toolbar toggle animation, so debounce it
        debouncedCalculateRootHeightElements();
      },
      { passive: true },
    );

    function calculateRootHeightElements() {
      documentScrollHeight = getDocumentScrollHeight();
      lvhElBCR = getlvhHeight();
    }

    setTimeout(() => {
      scrollStart = true;
    });
  });

  return (
    <div style="height: 100dvh;" ref={dvhEl}>
      {children}
      <div style="position: absolute; inset: 0; visibility: hidden; height: 100svh;" ref={svhEl} />
      <div style="position: absolute; inset: 0; visibility: hidden; height: 100lvh;" ref={lvhEl} />
    </div>
  );
};

function debounce(cb: (data: any) => void, timeout: number) {
  let timeId = null as any as number;
  return {
    debounced: (data?: any) => {
      window.clearTimeout(timeId);
      timeId = window.setTimeout(() => cb(data), timeout);
    },
    cancel: () => {
      window.clearTimeout(timeId);
    },
  };
}

export default MobileScrollDVH;
