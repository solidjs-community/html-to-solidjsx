import { writeClipboard } from "@solid-primitives/clipboard";
import { debounce } from "@solid-primitives/scheduled";
import { createSignal } from "solid-js";
import { store } from "../store";
import CopyIcon from "./Icons/CopyIcon";

const CopyJSXButton = () => {
  const [hasCopied, setHasCopied] = createSignal(false);

  const setHasCopiedDebounced = debounce(() => setHasCopied(false), 1500);

  const copyToClipboard = async () => {
    try {
      await writeClipboard(store.jsxText.trim());
      setHasCopied(true);
      setHasCopiedDebounced();
    } catch (err) {}
  };

  const onCopyClick = () => {
    copyToClipboard();
  };
  return (
    <button
      class="block mx-auto w-full max-w-300px rounded-12px bg-image-[linear-gradient(180deg,#4e88c6,#446b9e)]"
      onClick={onCopyClick}
    >
      <div class="flex justify-between items-center gap-2 px-16px py-4px md:(px-20px py-6px) rounded-9px m-3px bg-solid-light text-#fff hover:(bg-#446b9e) transition">
        <span class="whitespace-nowrap">{hasCopied() ? "Copied!" : "Copy JSX"}</span> <CopyIcon />
      </div>
    </button>
  );
};

export default CopyJSXButton;
