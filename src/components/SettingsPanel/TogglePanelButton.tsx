import { createMediaQuery } from "@solid-primitives/media";
import { createEffect, createSignal, on } from "solid-js";
import { hasNonOverlayScrollbarY } from "../../utils/hasNonOverlayScrollbarY";
import { onTransitionend } from "../../utils/onTransitionend";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";
import SettingsIcon from "../Icons/SettingsIcon";

const TogglePanelButton = () => {
  const vwMax850px = createMediaQuery("(max-width:850px)");
  const [close, setClose] = createSignal(false);
  let toggleBtnEl!: HTMLButtonElement;
  let toggleBtnTextEl!: HTMLDivElement;
  let toggleBtnTextSpanEl!: HTMLDivElement;
  let toggleBtnArrowIconEl!: SVGSVGElement;
  let toggleBtnSettingsIconEl!: HTMLDivElement;

  const textLeftPadding = 8;
  const navPadding = 12;

  const queryEls = () => {
    const headerFakeBgEl = document.getElementById("header-fake-bg")!;
    const splitEditorEl = document.getElementById("split-editor")!;
    const settingsPanelEl = document.getElementById("settings-panel")!;
    const editorSettingsEl = document.getElementById("editor-settings")!;
    const configContainerEl = document.getElementById("config-container")!;
    const mainEl = document.getElementById("main")!;
    const header = document.getElementById("header")!;
    const headerNavEl = document.getElementById("header-nav")!;
    const copyJSXContainerEl = document.getElementById("copy-jsx-container")!;
    const htmlEditorContainer = document.getElementById("html-editor-container")!;
    const jsxEditorContainer = document.getElementById("jsx-editor-container")!;

    return {
      headerFakeBgEl,
      splitEditorEl,
      settingsPanelEl,
      editorSettingsEl,
      configContainerEl,
      mainEl,
      header,
      headerNavEl,
      copyJSXContainerEl,
      htmlEditorContainer,
      jsxEditorContainer,
    };
  };

  const closePanel = () => {
    const {
      settingsPanelEl,
      editorSettingsEl,
      configContainerEl,
      header,
      headerFakeBgEl,
      headerNavEl,
      mainEl,
      splitEditorEl,
      copyJSXContainerEl,
    } = queryEls();
    const headerFakeBgWidth = headerFakeBgEl.getBoundingClientRect().width;
    const headerNavRight = headerNavEl.getBoundingClientRect().right;
    const configPanelWidth = settingsPanelEl.getBoundingClientRect().width;
    const toggleBtnWidth = toggleBtnEl.getBoundingClientRect().width;
    const toggleBtnTextSpanWidth = toggleBtnTextSpanEl.getBoundingClientRect().width;
    const windowInnerWidth = window.innerWidth;
    const headerFakeStartingPosition = headerFakeBgWidth - windowInnerWidth;
    const headerNavEndPosition = windowInnerWidth - headerNavRight - navPadding;
    const configPanelHasScrollbar = hasNonOverlayScrollbarY(configContainerEl);

    mainEl.style.gridTemplateColumns = `${configPanelWidth}px 1fr`;
    splitEditorEl.style.transform = "translateY(60px)";
    splitEditorEl.style.transition = "transform 150ms";
    copyJSXContainerEl.style.transform = "translateY(-60px)";
    copyJSXContainerEl.style.transition = "transform 150ms";
    headerFakeBgEl.style.width = `${windowInnerWidth}px`;
    headerFakeBgEl.style.transform = `translateX(${headerFakeStartingPosition}px)`;
    headerFakeBgEl.style.willChange = "transform";
    headerNavEl.style.willChange = "transform";
    mainEl.style.willChange = "transform";
    // prevent unwanted layout shifts caused by potential scrollbars
    if (configPanelHasScrollbar) {
      configContainerEl.style.scrollbarGutter = "stable";
    }
    // to remove potential scrollbar
    configContainerEl.style.overflow = "hidden";

    onTransitionend(splitEditorEl, () => {
      mainEl.style.gridTemplateColumns = "45px 1fr";
      mainEl.style.transition = "grid-template-columns 250ms";
      headerFakeBgEl.style.transform = `translateX(0px)`;
      headerFakeBgEl.style.transition = "transform 350ms";
      headerNavEl.style.transform = `translateX(${headerNavEndPosition}px)`;
      headerNavEl.style.transition = "transform 350ms";
      splitEditorEl.style.transform = "";
      splitEditorEl.style.transition = "";
      splitEditorEl.style.paddingTop = "60px";
      splitEditorEl.style.transition = "";
      copyJSXContainerEl.style.transform = "";
      copyJSXContainerEl.style.transition = "";
      configContainerEl.style.transform = "translateX(-60px)";
      configContainerEl.style.transition = "transform 250ms";
      editorSettingsEl.style.transform = "translateX(-60px)";
      editorSettingsEl.style.transition = "transform 250ms";
      toggleBtnEl.style.transform = `translate(${toggleBtnWidth / 2}px, ${
        toggleBtnWidth / 2
      }px) rotate(90deg)`;
      toggleBtnEl.style.transformOrigin = "top";
      toggleBtnTextEl.style.transform = `translateX(${-(
        toggleBtnTextSpanWidth + textLeftPadding
      )}px)`;
      toggleBtnTextEl.style.transition = "transform 350ms";
      toggleBtnArrowIconEl.style.transform = "scale(0)";
      toggleBtnArrowIconEl.style.transition = "transform 350ms";
      toggleBtnSettingsIconEl.style.opacity = "1";
      toggleBtnSettingsIconEl.style.transform = "scale(0)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toggleBtnSettingsIconEl.style.transform = "scale(1)";
          toggleBtnSettingsIconEl.style.transition = "transform 350ms";
        });
      });

      onTransitionend(headerFakeBgEl, () => {
        mainEl.style.transition = "";
        headerFakeBgEl.style.transition = "";
        mainEl.style.willChange = "";
        headerFakeBgEl.style.willChange = "";
        headerFakeBgEl.style.width = "";
        headerFakeBgEl.style.transform = "";
        headerNavEl.style.transform = "";
        headerNavEl.style.willChange = "";
        headerNavEl.style.transition = "";
        header.style.maxWidth = "none";
        header.style.width = "100%";
        configContainerEl.style.visibility = "hidden";
        editorSettingsEl.style.visibility = "hidden";
        toggleBtnTextSpanEl.style.visibility = "hidden";
      });
    });
  };

  const openPanel = () => {
    const {
      settingsPanelEl,
      editorSettingsEl,
      configContainerEl,
      header,
      headerFakeBgEl,
      headerNavEl,
      mainEl,
      splitEditorEl,
      copyJSXContainerEl,
    } = queryEls();
    const configPanelWidth = settingsPanelEl.getBoundingClientRect().width;
    const windowInnerWidth = window.innerWidth;
    const headerFakeStartingPosition = configPanelWidth - windowInnerWidth;
    const headerNavEndPosition = configPanelWidth - windowInnerWidth;
    const configPanelHasScrollbar = hasNonOverlayScrollbarY(configContainerEl);

    mainEl.style.gridTemplateColumns = `${configPanelWidth}px 1fr`;
    mainEl.style.transition = "grid-template-columns 250ms";
    mainEl.style.willChange = "transform";
    if (!configPanelHasScrollbar) {
      configContainerEl.style.scrollbarGutter = "";
    }
    configContainerEl.style.transform = "translateX(0px)";
    configContainerEl.style.transition = "transform 250ms";
    configContainerEl.style.visibility = "";
    editorSettingsEl.style.transform = "translateX(0px)";
    editorSettingsEl.style.transition = "transform 250ms";
    editorSettingsEl.style.visibility = "";

    headerFakeBgEl.style.transform = `translateX(${headerFakeStartingPosition}px)`;
    headerFakeBgEl.style.willChange = "transform";
    headerFakeBgEl.style.transition = "transform 350ms";
    headerNavEl.style.transform = `translateX(${headerNavEndPosition}px)`;
    headerNavEl.style.transition = "transform 350ms";
    headerNavEl.style.willChange = "transform";

    toggleBtnTextSpanEl.style.visibility = "";
    toggleBtnEl.style.transform = "translate(0px, 0px) rotate(0deg)";
    toggleBtnEl.style.transformOrigin = "top";
    toggleBtnTextEl.style.transform = `translateX(0px)`;
    toggleBtnTextEl.style.transition = "transform 350ms";
    toggleBtnArrowIconEl.style.transform = "scale(1)";
    toggleBtnArrowIconEl.style.transition = "transform 350ms";
    toggleBtnSettingsIconEl.style.transform = "scale(0)";
    toggleBtnSettingsIconEl.style.transition = "transform 350ms";

    onTransitionend(headerFakeBgEl, () => {
      headerFakeBgEl.style.willChange = "";
      headerFakeBgEl.style.width = "";
      headerFakeBgEl.style.transform = "";
      headerFakeBgEl.style.transition = "";
      headerNavEl.style.transform = "";
      headerNavEl.style.willChange = "";
      headerNavEl.style.transition = "";
      header.style.maxWidth = "";
      header.style.width = "";
      splitEditorEl.style.transform = "translateY(60px)";
      splitEditorEl.style.paddingTop = "";
      copyJSXContainerEl.style.transform = "translateY(-60px)";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          splitEditorEl.style.transform = "translateY(0px)";
          splitEditorEl.style.transition = "transform 150ms";
          copyJSXContainerEl.style.transform = "translateY(0px)";
          copyJSXContainerEl.style.transition = "transform 150ms";
        });
      });

      onTransitionend(splitEditorEl, () => {
        mainEl.style.gridTemplateColumns = "";
        mainEl.style.transition = "";
        mainEl.style.willChange = "";
        splitEditorEl.style.transform = "";
        splitEditorEl.style.transition = "";
        toggleBtnEl.style.transform = "";
        toggleBtnEl.style.transformOrigin = "";
        toggleBtnTextEl.style.transform = "";
        toggleBtnTextEl.style.transition = "";
        toggleBtnArrowIconEl.style.transform = "";
        toggleBtnArrowIconEl.style.transition = "";
        copyJSXContainerEl.style.transform = "";
        copyJSXContainerEl.style.transition = "";
        configContainerEl.style.overflow = "";
      });
    });
  };

  createEffect(
    on(
      close,
      (close) => {
        if (close) {
          closePanel();
          return;
        }
        openPanel();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      vwMax850px,
      (vwMax850px) => {
        const { configContainerEl, splitEditorEl, htmlEditorContainer, jsxEditorContainer } =
          queryEls();
        const configPanelHasScrollbar = hasNonOverlayScrollbarY(configContainerEl);

        if (!vwMax850px) {
          jsxEditorContainer.style.display = "block";
          htmlEditorContainer.style.display = "block";
        } else {
          jsxEditorContainer.style.display = "";
          htmlEditorContainer.style.display = "";
        }

        if (!close()) {
          return;
        }

        if (vwMax850px) {
          configContainerEl.style.transform = "";
          configContainerEl.style.visibility = "";
          configContainerEl.style.overflow = "";
          configContainerEl.style.scrollbarGutter = "";
          splitEditorEl.style.paddingTop = "";
        } else {
          configContainerEl.style.transform = "translateX(-60px)";
          configContainerEl.style.visibility = "hidden";
          if (configPanelHasScrollbar) {
            configContainerEl.style.scrollbarGutter = "stable";
          }
          configContainerEl.style.overflow = "hidden";
          splitEditorEl.style.paddingTop = "60px";
        }
      },
      { defer: true },
    ),
  );

  return (
    <div class="mb-2 TEMP">
      <button
        class="relative flex items-center ml-auto dark:text-solid-mediumgray text-solid-gray/80 rounded-bl-8px hover:(text-black bg-#F2F2F2) dark:hover:(text-white bg-#333) transition-prop-[transform_250ms,color_150ms,background-color_150ms]"
        onClick={() => setClose(!close())}
        ref={toggleBtnEl}
      >
        <div class="relative p-2">
          <ArrowLeftIcon size={26} ref={toggleBtnArrowIconEl} />
          <div
            class="absolute inset-0px flex justify-center items-center opacity-0 origin-center"
            ref={toggleBtnSettingsIconEl}
          >
            <SettingsIcon size={26} />
          </div>
        </div>
        <div class="p-2 pr-4 overflow-clip">
          <div ref={toggleBtnTextEl}>
            <span class="inline-block TEMP" ref={toggleBtnTextSpanEl}>
              Hide
            </span>{" "}
            Settings
          </div>
        </div>
      </button>
    </div>
  );
};

export default TogglePanelButton;
