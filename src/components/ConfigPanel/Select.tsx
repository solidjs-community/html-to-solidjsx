import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import Dismiss from "solid-dismiss";
import { useFloating } from "solid-floating-ui";
import { Component, createSignal, For } from "solid-js";
import ChevronDownIcon from "../Icons/ChevronDownIcon";

const Select: Component<{
  name: string;
  id?: string;
  options: string[];
  selected: string;
  disabled?: boolean;
  onOpen?: (open: boolean) => void;
  onChange: (props: { value: string; idx: number }) => void;
}> = (props) => {
  const [reference, setReference] = createSignal<HTMLButtonElement | null>();
  const [floating, setFloating] = createSignal<HTMLDivElement | null>();
  const [open, setOpen] = createSignal(false);
  let floatingUl!: HTMLUListElement;
  createResizeObserver(reference as any, ({ width, height }, el) => {
    if (!floating()) return;
    if (el !== reference()) return;
    setFloatingUlWidthSameSizeAsButton();
  });

  const setFloatingUlWidthSameSizeAsButton = () => {
    floatingUl.style.width = `${reference()!.clientWidth}px`;
  };
  const position = useFloating(reference, floating, {
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift()],
  });

  return (
    <div
      class="flex items-center gap-2"
      classList={{ "opacity-40 cursor-not-allowed": props.disabled }}
    >
      <div>{props.name}</div>
      <button
        class="flex flex-shrink-0 items-center bg-#fafafa border-black border-1 rounded-8px px-10px py-3px gap-2 w-175px lg:w-200px ml-auto dark:(bg-#2a2a2a border-#888)"
        ref={setReference}
      >
        <div>{props.selected}</div>
        <div class="ml-auto TEMP">
          <ChevronDownIcon />
        </div>
      </button>
      <Dismiss
        open={open}
        setOpen={setOpen}
        menuButton={reference}
        onOpen={(open) => {
          if (open) {
            setFloatingUlWidthSameSizeAsButton();
          }
          props.onOpen && props.onOpen(open);
        }}
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
            left: `${position.x ?? 0}px`,
          }}
        >
          <ul ref={floatingUl}>
            <For each={props.options}>
              {(item, idx) => (
                <li
                  class="text-18px px-10px py-3px  text-#333 cursor-pointer hover:(bg-black/05 transition) focus:(bg-black/20 text-black) hover:focus:(bg-black/25) dark:(text-#eee hover:(bg-black/20) focus:(text-white bg-black/50)) dark:hover:focus:(bg-black/75)"
                  tabindex={0}
                  data-selected={props.selected === item}
                  onClick={() => {
                    setOpen(false);
                    props.onChange({ value: item, idx: idx() });
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    setOpen(false);
                    props.onChange({ value: item, idx: idx() });
                  }}
                >
                  <span
                    class="inline-block"
                    classList={{
                      "bg-black/60 text-light dark:(bg-white/80 text-#000) rounded-8px px-4px -ml-4px":
                        props.selected === item,
                    }}
                  >
                    {item}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Dismiss>
    </div>
  );
};

export default Select;
