import { setStore, store } from "../../store";
import ConfigPanel from "../ConfigPanel/ConfigPanel";
import TogglePanelButton from "./TogglePanelButton";

export const panelSize = "w-full md:w-35vw md:min-w-300px md:max-w-450px";

const SettingsPanel = () => {
  return (
    <div
      id="settings-panel"
      class={`${panelSize} min-h-0 md:min-h-auto md:h-[calc(100%-60px)] float-right md:mt-60px md:border-r-2 border-#CFCFCF dark:border-#555 overflow-clip`}
    >
      <div class="h-full grid grid-rows-[1fr] md:grid-rows-[min-content_1fr]">
        <div class="hidden md:block">
          <TogglePanelButton />
          <div id="editor-settings" class="px-4">
            <h2 class="opacity-50 font-bold">Editors</h2>
            <div class="py-3 dark:text-light text-13px lg:text-16px hover:bg-black/02 transition dark:hover:bg-white/02">
              <label class="flex items-center justify-between gap-2">
                <span>Line Wrap</span>
                <input
                  class="switch"
                  type="checkbox"
                  role="switch"
                  checked={store.lineWrap}
                  onChange={(e) =>
                    setStore("lineWrap", e.currentTarget.checked)
                  }
                />
              </label>
            </div>
          </div>
        </div>
        <div id="config-container" class="h-full overflow-auto">
          <ConfigPanel />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
