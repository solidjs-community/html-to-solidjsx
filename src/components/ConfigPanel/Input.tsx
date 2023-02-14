import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import { useFloating } from "solid-floating-ui";
import { Component, createSignal, Show } from "solid-js";

const Input: Component<{
  name: string;
  value: string;
  maskType: "character-count";
  disabled?: boolean;
  filter?: RegExp;
  placeholder?: string;
  onInput: (value: string) => void;
}> = (props) => {
  const [reference, setReference] = createSignal<HTMLDivElement | null>();
  const [floating, setFloating] = createSignal<HTMLDivElement | null>();
  let arrowEl!: HTMLDivElement;
  const [show, setShow] = createSignal(true);

  let whiteSpaceOnly = true;

  const countWhiteSpace = () => {
    let count = 0;
    const value = props.value;
    value.split("").forEach((item) => {
      if (item === " " || item === "\t") {
        count++;
      }
    });
    if (count !== value.length) {
      whiteSpaceOnly = false;
      return;
    }
    whiteSpaceOnly = true;
    setShow(true);

    return `${value.match(/\t/g) ? "\\t" : '" "'}(x${count})`;
  };

  //   useFloating(reference, floating, {
  //     middleware: [offset(4), flip(), shift()],
  //     whileElementsMounted: (reference, floating) =>
  //       autoUpdate(reference, floating, () => {
  //         const arrowLen = arrowEl.offsetWidth;
  //         const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
  //         computePosition(reference, floating, {
  //           placement: "bottom",
  //           middleware: [offset(floatingOffset), arrow({ element: arrowEl })],
  //         }).then(({ x, y, middlewareData, placement }) => {
  //           Object.assign(floating.style, {
  //             left: `${x}px`,
  //             top: `${y}px`,
  //           });
  //
  //           const side = placement.split("-")[0];
  //
  //           const staticSide = {
  //             top: "bottom",
  //             right: "left",
  //             bottom: "top",
  //             left: "right",
  //           }[side];
  //
  //           if (middlewareData.arrow) {
  //             const { x, y } = middlewareData.arrow;
  //             Object.assign(arrowEl!.style, {
  //               left: x != null ? `${x}px` : "",
  //               top: y != null ? `${y}px` : "",
  //               // Ensure the static side gets unset when
  //               // flipping to other placements' axes.
  //               right: "",
  //               bottom: "",
  //               [staticSide!]: `${-arrowLen / 2}px`,
  //               transform: "rotate(45deg)",
  //             });
  //           }
  //         });
  //       }),
  //   });

  return (
    <label
      class="flex items-start justify-between gap-2"
      classList={{ "opacity-40 cursor-not-allowed": props.disabled }}
    >
      <span>{props.name}</span>
      <div
        class="flex-shrink-0 relative border-black dark:border-#888 border-1 rounded-8px w-175px lg:w-200px"
        ref={setReference}
      >
        <input
          class="px-2 py-3px rounded-8px w-full placeholder:text-black/50 dark:(bg-#3B3B3B placeholder:text-light/50)"
          classList={{ "!cursor-not-allowed": props.disabled }}
          type="text"
          value={props.value as string}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onFocus={() => {
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
            const result = value.replace(/\\t/g, "\t");
            if (result !== value) {
              value = result.replace(/[^\t]/g, "");
              e.currentTarget.value = value;
            }

            props.onInput(value);
          }}
        />
        <Show when={props.maskType && whiteSpaceOnly && show()}>
          <div class="absolute inset-0px rounded-8px px-2 py-3px opacity-50 pointer-events-none">
            {countWhiteSpace()}
          </div>
        </Show>
      </div>
      {/* <div class="absolute w-100px h-100px bg-white z-1" ref={setFloating}>
        <div class="absolute inset"></div>
        <div
          class="absolute w-20px h-20px -z-1 pointer-events-none bg-white"
          ref={arrowEl}
        ></div>
      </div> */}
    </label>
  );
};

export default Input;
