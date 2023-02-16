import { createMediaQuery } from "@solid-primitives/media";
import { FiSettings, FiX } from "solid-icons/fi";
import { createEffect, createRenderEffect, createSignal, on } from "solid-js";
import { onTransitionend } from "../../utils/onTransitionend";

const TogglePanelButton = () => {
  const vwMax850px = createMediaQuery("(max-width:850px)");
  const [close, setClose] = createSignal(false);
  let toggleBtnXIconEl!: SVGSVGElement;
  let toggleBtnSettingsIconEl!: HTMLDivElement;

  const queryEls = () => {
    const actionsPanelEl = document.getElementById("actions-panel")!;
    const settingsPanelContainerEl = document.getElementById(
      "settings-panel-container"
    )!;
    const configContainerEl = document.getElementById("config-container")!;

    return {
      actionsPanelEl,
      settingsPanelContainerEl,
      configContainerEl,
    };
  };

  const openPanel = () => {
    const { settingsPanelContainerEl, configContainerEl } = queryEls();
    configContainerEl.style.display = "";
    settingsPanelContainerEl.style.height = "";
    settingsPanelContainerEl.style.transition = "height 150ms";
    toggleBtnXIconEl.style.transform = "scale(1)";
    toggleBtnXIconEl.style.transition = "transform 350ms";
    toggleBtnSettingsIconEl.style.transform = "scale(0)";
    toggleBtnSettingsIconEl.style.transition = "transform 350ms";

    onTransitionend(settingsPanelContainerEl, () => {
      settingsPanelContainerEl.style.minHeight = "";
      settingsPanelContainerEl.style.transition = "";
    });
  };

  const closePanel = () => {
    const { actionsPanelEl, settingsPanelContainerEl, configContainerEl } =
      queryEls();
    const actionsPanelHeight = actionsPanelEl.getBoundingClientRect().height;
    settingsPanelContainerEl.style.height = `${actionsPanelHeight}px`;
    settingsPanelContainerEl.style.minHeight = "auto";
    settingsPanelContainerEl.style.transition = "height 150ms";
    toggleBtnXIconEl.style.transform = "scale(0)";
    toggleBtnXIconEl.style.transition = "transform 350ms";
    toggleBtnSettingsIconEl.style.opacity = "1";
    toggleBtnSettingsIconEl.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toggleBtnSettingsIconEl.style.transform = "scale(1)";
        toggleBtnSettingsIconEl.style.transition = "transform 350ms";
      });
    });

    onTransitionend(settingsPanelContainerEl, () => {
      settingsPanelContainerEl.style.transition = "";
      configContainerEl.style.display = "none";
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
      { defer: true }
    )
  );

  createEffect(
    on(
      vwMax850px,
      (vwMax850px) => {
        if (!close()) {
          return;
        }

        const run = () => {
          const {
            actionsPanelEl,
            settingsPanelContainerEl,
            configContainerEl,
          } = queryEls();

          const actionsPanelHeight =
            actionsPanelEl.getBoundingClientRect().height;

          if (vwMax850px) {
            settingsPanelContainerEl.style.height = `${actionsPanelHeight}px`;
            settingsPanelContainerEl.style.minHeight = "auto";
            configContainerEl.style.display = "none";
          } else {
            settingsPanelContainerEl.style.height = "";
            settingsPanelContainerEl.style.minHeight = "";
            configContainerEl.style.display = "";
          }
        };

        setTimeout(run, vwMax850px ? 100 : 0);
      },
      { defer: true }
    )
  );

  return (
    <button
      class="flex justify-center items-center h-[40px] text-#999 dark:(text-#555) hover:text-#000 dark:hover:text-#999 transition"
      onClick={() => setClose(!close())}
      aria-label={`${!close() ? "close" : "open"} configeration panel`}
      aria-expanded={!close()}
    >
      <div class="relative">
        <FiX size={28} ref={toggleBtnXIconEl} />
        <div
          class="absolute inset-0 opacity-0 origin-center"
          ref={toggleBtnSettingsIconEl}
        >
          <FiSettings size={28} />
        </div>
      </div>
    </button>
  );
};

export default TogglePanelButton;
