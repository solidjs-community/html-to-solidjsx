import { EditorView } from "@codemirror/view";

export const editorBaseTheme = (props: { backgroundColor?: string } = {}) =>
  EditorView.theme({
    "&": {
      textAlign: "left",
      // fontSize: "13px",
      background: "transparent",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
    },
    ".cm-gutters": {
      backgroundColor: props.backgroundColor ?? "",
      border: "none",
    },
    ".cm-line": {
      padding: "0 2px 6px 16px",
    },
    ".cm-content *": {
      fontFamily: `monospace`,
      fontWeight: 400,
      fontVariantLigatures: "normal",
    },
  });
