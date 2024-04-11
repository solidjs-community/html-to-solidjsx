import { arrow, autoUpdate, computePosition, flip, offset } from "@floating-ui/dom";
import Dismiss from "solid-dismiss";
import { useFloating } from "solid-floating-ui";
import { Component, createSignal, Show } from "solid-js";

const Input: Component<{
  name: string;
  value: string;
  maskType: "character-count";
  disabled?: boolean;
  filter?: RegExp;
  placeholder?: string;
  tooltip?: boolean;
  onInput: (value: string) => void;
}> = (props) => {
  const [reference, setReference] = createSignal<HTMLDivElement | null>();
  const [floating, setFloating] = createSignal<HTMLDivElement | null>();
  const [open, setOpen] = createSignal(false);
  // todo fix dismiss
  const [clickedClose, setClickedClose] = createSignal(false);
  const [show, setShow] = createSignal(true);
  let arrowEl!: HTMLDivElement;

  const countWhiteSpace = () => {
    const value = props.value;
    const group: { char: string; count: number }[] = [];
    if (value[0] != null) {
      group.push({ char: value[0], count: 0 });
    }
    value.split("").forEach((item) => {
      const groupItem = group.at(-1)!;
      if (groupItem.char === item) {
        groupItem.count = groupItem.count + 1;
      } else {
        group.push({ char: item, count: 1 });
      }
    });

    setShow(true);

    return group
      .map(({ count, char }) => {
        if (char === "\t") char = "\\t";
        if (char.match(/\s/)) char = "\\s";

        return `${char}${count > 1 ? `(x${count})` : ""}`;
      })
      .reduce((a, c) => a + " " + c, "");
  };

  const onClickReplaceTab = () => {
    const value = props.value;
    setClickedClose(true);
    setOpen(false);
    props.onInput("\t");
  };

  useFloating(reference, floating, {
    whileElementsMounted: (reference, floating) =>
      autoUpdate(reference, floating, () => {
        const arrowLen = arrowEl.offsetWidth;
        const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
        computePosition(reference, floating, {
          placement: "bottom",
          middleware: [offset(floatingOffset), flip(), arrow({ element: arrowEl })],
        }).then(({ middlewareData, placement, x, y }) => {
          const side = placement.split("-")[0];

          Object.assign(floating.style, {
            left: `${x}px`,
            top: `${y}px`,
          });

          const staticSide = {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right",
          }[side];

          if (middlewareData.arrow) {
            const { x, y } = middlewareData.arrow;
            const isTop = placement === "top";
            const maskImage = `linear-gradient(${isTop ? "315" : "135"}deg, #000 calc(50% - ${
              isTop ? "1" : "0.5"
            }px),transparent calc(50% - ${isTop ? "1" : "0.5"}px))`;

            Object.assign(arrowEl!.style, {
              left: x != null ? `${x}px` : "",
              top: y != null ? `${y}px` : "",
              // Ensure the static side gets unset when
              // flipping to other placements' axes.
              right: "",
              bottom: "",
              [staticSide!]: `${-arrowLen / 2 + 2}px`,
              transform: `rotate(45deg)`,
              WebkitMaskImage: maskImage,
            });
          }
        });
      }),
  });

  return (
    <label
      class="flex items-start justify-between gap-2"
      classList={{ "opacity-40 cursor-not-allowed": props.disabled }}
    >
      <span>{props.name}</span>
      <div class="flex-shrink-0 relative border-black dark:border-#888 border-1 rounded-8px w-175px lg:w-200px">
        <input
          class="px-2 py-3px rounded-8px w-full placeholder:text-black/50 dark:(bg-#3B3B3B placeholder:text-light/50)"
          classList={{ "!cursor-not-allowed": props.disabled }}
          type="text"
          value={props.value as string}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onFocus={() => {
            if (!props.value.match(/\t/)) {
              if (!clickedClose()) {
                // another dismiss bug
                setTimeout(() => {
                  setOpen(true);
                });
              }
              setClickedClose(false);
            }
            setShow(false);
          }}
          onBlur={() => {
            setShow(true);
          }}
          onInput={(e) => {
            let value = e.currentTarget.value;
            if (props.filter) {
              value = value.replace(props.filter, "");
              e.currentTarget.value = value;
            }

            value = value.replace(/\\s/g, " ");

            const result = value.replace(/\\t/g, "\t");
            if (result !== value) {
              value = result.replace(/[^\t]/g, "");
              e.currentTarget.value = value;
            }

            props.onInput(value);
          }}
          ref={setReference}
        />
        <Show when={props.maskType && show()}>
          <div class="absolute inset-0px rounded-8px px-2 py-3px bg-#fff dark:bg-#3B3B3B pointer-events-none">
            <span class="opacity-50">{countWhiteSpace()}</span>
          </div>
        </Show>
      </div>
      <Show when={props.tooltip}>
        <Dismiss
          open={open}
          setOpen={setOpen}
          menuButton={reference}
          deadMenuButton
          mount="body"
          cursorKeys
          animation={{
            enterClass: "opacity-0",
            enterToClass: "opacity-100 transition",
            exitClass: "opacity-100",
            exitToClass: "opacity-0 transition-200",
          }}
        >
          <div class="absolute z-50 text-14px md:text-16px" ref={setFloating}>
            <div class="relative bg-white rounded-8px border-1 border-#444 shadow-black/70 shadow-lg dark:(bg-#444 border-#888) p-4 z-2">
              <p>
                To use TABs, type{" "}
                <code class="font-mono p-2px rounded-4px bg-black/10 dark:bg-black/50">\\t</code>
                <br />
              </p>
              <div class="flex gap-2 items-center">
                <div class="border-b-1 border-#ccc dark:(border-#666) flex-grow" />
                <div class="opacity-70 TEMP">Or</div>
                <div class="border-b-1 border-#ccc dark:(border-#666) flex-grow" />
              </div>
              <button
                class="mt-2 px-10px py-6px rounded-8px border-1 border-black/50 hover:bg-black/10 text-#555 dark:(text-light border-white/50 bg-black/20 hover:(bg-white/50 text-#000)) transition"
                onClick={onClickReplaceTab}
              >
                Replace with TAB
              </button>
            </div>
            <div
              class="absolute w-20px h-20px z-4 pointer-events-none rounded-tl-3px border-1 bg-white border-#444 dark:(bg-#444 border-#888)"
              ref={arrowEl}
            ></div>
          </div>
        </Dismiss>
      </Show>
    </label>
  );
};

export default Input;
