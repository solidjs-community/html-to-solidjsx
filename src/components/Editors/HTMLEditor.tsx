import { Extension } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import {
  EditorView,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  createCodeMirror,
  createEditorControlledValue,
} from "solid-codemirror";
import { createEffect, on, onMount } from "solid-js";
import { setStore, store } from "../../store";
import { vsCodeDark } from "../../editor/theme/dark";
import { isDarkTheme } from "../Header/ThemeBtn";
import { githubLight } from "../../editor/theme/light";
import { editorBaseTheme } from "../../editor/editorBaseTheme";
import { FiTrash2 } from "solid-icons/fi";
import { isFirefox, isMobile } from "@solid-primitives/platform";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { createMediaQuery } from "@solid-primitives/media";

const HTMLEditor = () => {
  const {
    editorView,
    ref: setEditorRef,
    createExtension,
  } = createCodeMirror({
    onValueChange,
  });
  createEditorControlledValue(editorView, () => store.htmlText);
  const isPortrait = createMediaQuery("(orientation: portrait)");
  const size = useWindowSize();
  let vhHeight = 0;

  function onValueChange(value: string) {
    setStore("htmlText", value);
  }

  const onClear = () => {
    setStore("htmlText", "");
    editorView().focus();
  };

  const extensions = (): Extension => {
    return [
      editorBaseTheme(),
      isDarkTheme() ? vsCodeDark : githubLight,
      lineNumbers(),
      highlightActiveLineGutter(),
      store.lineWrap ? EditorView.lineWrapping : [],
      EditorView.contentAttributes.of({
        "aria-label": "HTML code input textbox",
      }),
      html(),
    ];
  };

  const reconfigure = createExtension(extensions());

  createEffect(on(extensions, (extensions) => reconfigure(extensions)));

  // prevent resizing viewport height on firefox mobile when virtual keyboard opened
  if (isFirefox && isMobile) {
    createEffect(
      on(isPortrait, () => {
        const editor = editorView();
        if (editor && document.activeElement === editor.contentDOM) return;

        vhHeight = document.documentElement.clientHeight;
      })
    );

    createEffect(
      on(
        () => size.height,
        (height) => {
          if (height !== vhHeight) {
            document.documentElement.style.height = `${vhHeight}px`;
          } else {
            document.documentElement.style.height = "";
          }
        },
        { defer: true }
      )
    );
  }

  return (
    <div class="grid grid-rows-[min-content_1fr] h-full">
      <div class="flex justify-between py-2px text-#747474 bg-white border-b-2 border-#f1f1f1 dark:(text-#8C8C8C bg-dark border-#2E2E2E)">
        <div class=" font-sans text-12px md:text-16px font-500 ml-20px">
          HTML
        </div>
        <button
          class="flex justify-center items-center h-full w-45px md:mr-0 hover:(text-#000 dark:text-light) transition"
          classList={{
            "mr-12px": store.layout === "rows" || store.layout === "html",
          }}
          onClick={onClear}
          aria-label="Clear HTML textbox"
        >
          <FiTrash2 size={15} class="md:scale-125" />
        </button>
      </div>
      <div class="relative w-full overflow-auto">
        <div
          class="absolute inset-0"
          ref={(el) => {
            onMount(() => {
              setEditorRef(el);
            });
          }}
        />
      </div>
    </div>
  );
};

export default HTMLEditor;
