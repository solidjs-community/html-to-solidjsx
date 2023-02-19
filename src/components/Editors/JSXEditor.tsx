import { javascript } from "@codemirror/lang-javascript";
import { Extension } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import {
  createCodeMirror,
  createEditorControlledValue,
  createEditorReadonly,
} from "solid-codemirror";
import { $TRACK, createEffect, createSignal, on, onMount } from "solid-js";
import { editorBaseTheme } from "../../editor/editorBaseTheme";
import { vsCodeDark } from "../../editor/theme/dark";
import { githubLight } from "../../editor/theme/light";
import HTMLtoJSX from "../../lib/html-to-jsx";
import { ConfigKey, setStore, store } from "../../store";
import CopyJSXButton from "../CopyJSXButton";
import { isDarkTheme } from "../Header/ThemeBtn";

const JSXEditor = () => {
  // the initial jsx demo code has siblings that are not wrapped, wraps with fragments that will be hidden to preserve syntax highlighting
  const [code, setCode] = createSignal(`<>\n${store.jsxText.trimEnd()}\n</>`);
  const [hiddenFragments, setHiddenFragments] = createSignal(true);
  const { editorView, ref: setEditorRef, createExtension } = createCodeMirror();
  createEditorControlledValue(editorView, code);
  createEditorReadonly(editorView, () => true);
  let htmlToJSXConverter!: HTMLtoJSX;

  const extensions = (): Extension => {
    return [
      editorBaseTheme({ backgroundColor: "transparent" }),
      isDarkTheme() ? vsCodeDark : githubLight,
      lineNumbers(),
      store.lineWrap ? EditorView.lineWrapping : [],
      hiddenFragments()
        ? // hides first and last lines that contain dumb fragments, to prevent syntax highlight breaking, and reset and move counter increment by 1
          EditorView.theme({
            ".cm-line:first-child": {
              display: "none",
            },
            ".cm-gutterElement:nth-child(n+1)": {
              position: "relative",
              visibility: "hidden",
            },
            ".cm-gutters": {
              counterReset: "gutter-mask",
            },
            ".cm-gutterElement:first-child:after": {
              counterReset: "gutter-mask",
              content: '"" !important',
              visibility: "hidden !important",
            },
            ".cm-gutterElement:nth-child(2):after": {
              counterReset: "gutter-mask",
              content: '"" !important',
              visibility: "hidden !important",
            },
            ".cm-gutterElement:after": {
              position: "absolute",
              counterIncrement: "gutter-mask",
              top: "0",
              left: "0",
              bottom: "0",
              right: "0",
              display: "flex",
              visibility: "visible",
              justifyContent: "center",
              content: "counter(gutter-mask)",
            },
            ".cm-line:nth-last-child(1)": {
              display: "none",
            },
          })
        : [],
      EditorView.contentAttributes.of({
        "aria-label": "JSX code output",
        "aria-readonly": "true",
      }),
      javascript({
        jsx: true,
        typescript: true,
      }),
    ];
  };

  const reconfigure = createExtension(extensions());

  const insertHiddenFragments = (convertedJsx: string) => {
    // insert hidden fragments to keep jsx synthax highlighter to work properly
    const hasWrapperNode =
      store.config.wrapperNode === "none" && store.config.component === "none";
    requestAnimationFrame(() => {
      setHiddenFragments(hasWrapperNode);
    });
    if (hasWrapperNode) {
      convertedJsx = `<>\n${convertedJsx.trimEnd()}\n</>`;
    }
    return convertedJsx;
  };

  const prefixSVGIds = (convertedJsx: string) => {
    if (!store.config.prefixSVGIds) return convertedJsx;
    return namespaceSVGId(convertedJsx, store.config.prefixSVGIds);
  };

  onMount(() => {
    htmlToJSXConverter = new HTMLtoJSX(store.config);
  });

  const updateEditorText = () => {
    let converted = htmlToJSXConverter.convert(store.htmlText);

    if (!converted || converted === "\n") {
      const code = "\n";
      setCode(code);
      setStore("jsxText", code);
      return;
    }

    converted = prefixSVGIds(converted);
    const jsxText = converted;
    converted = insertHiddenFragments(converted);

    setStore("jsxText", jsxText);
    setCode(converted);
  };

  createEffect(on(extensions, (extensions) => reconfigure(extensions)));

  createEffect(
    on(
      () => store.config[$TRACK as any as ConfigKey],
      () => {
        htmlToJSXConverter.config = { ...store.config };
        updateEditorText();
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      () => store.htmlText,
      () => {
        updateEditorText();
      },
      { defer: true }
    )
  );

  return (
    <div class="grid grid-rows-[min-content_1fr_min-content] h-full">
      <div class="py-2px dark:bg-dark bg-white border-b-2 border-#f1f1f1 dark:border-#2E2E2E">
        <div class="text-#747474 dark:text-#8C8C8C font-sans text-12px md:text-16px font-500 ml-20px">
          JSX
        </div>
      </div>
      <div class="relative overflow-auto">
        <div
          class="absolute inset-0"
          ref={(el) => {
            onMount(() => {
              setEditorRef(el);
            });
          }}
        />
      </div>
      <div
        id="copy-jsx-container"
        class="hidden md:block relative mt-auto p-10px pb-12px bg-white border-t-2 border-#CFCFCF dark:(border-#555 bg-dark) z-1"
      >
        <CopyJSXButton />
      </div>
    </div>
  );
};

function namespaceSVGId(svg: string, namespace: string) {
  svg = svg.replace(
    /(<svg[^>]*>)([\s\S]*?)(<\/svg>)/g,
    (_, startSvg, svgBody, endSvg) => {
      if (!svgBody) return _;

      svgBody = svgBody.replace(/id="(.*?)"/g, (_: string, p1: string) => {
        return `id="${namespace}${p1}"`;
      });

      svgBody = svgBody.replace(
        /xlink:href="#(.*?)"/g,
        (_: string, p1: string) => {
          return `xlink:href="#${namespace}${p1}"`;
        }
      );
      svgBody = svgBody.replace(
        /mask="url\(#(.*?)\)"/g,
        (_: string, p1: string) => {
          return `mask="url(#${namespace}${p1})"`;
        }
      );
      svgBody = svgBody.replace(
        /fill="url\(#(.*?)\)"/g,
        (_: string, p1: string) => {
          return `fill="url(#${namespace}${p1})"`;
        }
      );
      svgBody = svgBody.replace(
        /filter="url\(#(.*?)\)"/g,
        (_: string, p1: string) => {
          return `filter="url(#${namespace}${p1})"`;
        }
      );

      return `${startSvg}${svgBody}${endSvg}`;
    }
  )!;

  return svg;
}

export default JSXEditor;
