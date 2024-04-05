import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import Dismiss from "solid-dismiss";
import { useFloating } from "solid-floating-ui";
import { createMemo, createSignal, For, JSX, ParentComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { setStore, store } from "../../store";
import CopyJSXButton from "../CopyJSXButton";
import SplitPanelColumns from "../Icons/SplitPanelColumns";
import SplitPanelRows from "../Icons/SplitPanelRows";
import TogglePanelButton from "./TogglePanelButton";

const ActionsPanel = () => {
  const list: {
    id: string;
    text: string;
    Icon?: () => JSX.Element;
  }[] = [
    {
      id: "rows",
      text: "HTML and JSX rows",
      Icon: SplitPanelRows,
    },
    {
      id: "columns",
      text: "HTML and JSX columns",
      Icon: SplitPanelColumns,
    },
    {
      id: "html",
      text: "HTML only",
      Icon: () => <IconText>HTML</IconText>,
    },
    {
      id: "jsx",
      text: "JSX only",
      Icon: () => <IconText>JSX</IconText>,
    },
  ];

  const [reference, setReference] = createSignal<HTMLButtonElement | null>();
  const [floating, setFloating] = createSignal<HTMLDivElement | null>();
  const [open, setOpen] = createSignal(false);
  let floatingUl!: HTMLUListElement;
  const position = useFloating(reference, floating, {
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
  });

  const selectedItemFromList = createMemo(() => {
    const item = list.find(({ id }) => id === store.layout);
    return item;
  });

  return (
    <div
      id="actions-panel"
      class="flex gap-[clamp(20px,6vw,24px)] items-center text-#666 px-12px py-4px bg-white border-y-2 border-#CFCFCF dark:(border-#555 bg-dark) md:hidden"
    >
      <TogglePanelButton />
      <div class="flex items-center gap-[clamp(20px,6vw,24px)] flex-grow justify-end">
        <button
          /* TODO */
          /* arbitrary-variant class [&_[data-icon-text]]:text-white fails to compile in unocss, so hardcoded the class in main.css */
          class="flex justify-center items-center h-[42px] w-[42px] p-4px text-8px rounded-8px border-1 hover:text-#000 dark:hover:text-#999 transition [&_[data-icon-text]]:text-white dark:[&_[data-icon-text]]:text-white"
          classList={{
            "border-black bg-#eee dark:(bg-black border-#888)": open(),
            "border-transparent": !open(),
          }}
          aria-label={selectedItemFromList()!.text}
          ref={setReference}
        >
          <Dynamic component={selectedItemFromList()!.Icon} />
        </button>
        <Dismiss
          open={open}
          setOpen={setOpen}
          menuButton={reference}
          focusElementOnOpen={`[data-selected="true"]`}
          mount="body"
          cursorKeys
          animation={{
            enterClass: "opacity-0",
            enterToClass: "opacity-100 transition",
            exitClass: "opacity-100",
            exitToClass: "opacity-0 transition-200",
          }}
        >
          <div
            class="bg-white rounded-8px border-1 border-#444 shadow-lg shadow-black/70 z-50 dark:(bg-#444 border-#888) overflow-clip"
            ref={setFloating}
            style={{
              position: position.strategy,
              top: `${position.y ?? 0}px`,
              left: `${(position.x ?? 0) - 8}px`,
            }}
          >
            <ul ref={floatingUl}>
              <For each={list}>
                {({ id, text, Icon }) => (
                  <li
                    class="text-18px px-10px py-3px  text-#333 cursor-pointer hover:(bg-black/05 transition) focus:(bg-black/20 text-black) hover:focus:(bg-black/25) dark:(text-#eee hover:(bg-black/20) focus:(text-white bg-black/50)) dark:hover:focus:(bg-black/75)"
                    tabindex={0}
                    data-selected={id === store.layout}
                    onClick={() => {
                      setOpen(false);
                      setStore("layout", id as "jsx");
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      setOpen(false);
                      setStore("layout", id as "jsx");
                    }}
                  >
                    <div
                      class="flex items-center gap-2 py-6px"
                      classList={{
                        "bg-black/60 text-light [&_[data-icon-text]]:text-#000 dark:(bg-white/80 text-#000 [&_[data-icon-text]]:text-white) rounded-8px pl-6px -ml-6px !py-5px my-1px !py-5px my-1px":
                          id === store.layout,
                      }}
                    >
                      <div class="h-35px w-35px text-10px">{Icon && <Icon />}</div>
                      <span class="text-16px TEMP">{text}</span>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Dismiss>
        <div>
          <label class="flex flex-col items-center text-10.5px font-bold text-#666 dark:(text-#888) cursor-pointer rounded-8px hover:text-#000 dark:hover:text-light transition">
            <span>Line Wrap</span>
            <input
              class="switch cursor-pointer"
              type="checkbox"
              role="switch"
              checked={store.lineWrap}
              onChange={(e) => setStore("lineWrap", e.currentTarget.checked)}
            />
          </label>
        </div>
        <div class="flex items-center justify-center flex-grow max-w-300px">
          <CopyJSXButton />
        </div>
      </div>
    </div>
  );
};

const IconText: ParentComponent = (props) => {
  return (
    <div class="h-full w-full flex justify-center items-center bg-current-color rounded-5.67px ">
      <span data-icon-text class="text-white dark:text-#000 font-bold text-1em">
        {props.children}
      </span>
    </div>
  );
};

export default ActionsPanel;
