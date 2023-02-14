import { EditorView } from "@codemirror/view";
import { styledAutocomplete } from "./plugins/autocomplete-style";
import { styledCursor } from "./plugins/cursor-style";
import { styledHighlight } from "./plugins/highlight-style";
import { styledLineNumbers } from "./plugins/line-numbers-style";
import { styledSelection } from "./plugins/selection-style";

export const defineEditorTheme = (theme: any) => {
  const { darkMode, highlight, selection, autocomplete, cursor, lineNumbers } =
    theme;

  const base = EditorView.theme({
    "&": {
      color: highlight.base,
    },
  });

  return [
    base,
    styledCursor({
      color: cursor?.color ?? (darkMode ? "#FFF" : "#000"),
    }),
    lineNumbers?.color
      ? styledLineNumbers({
          color: lineNumbers?.color ?? (darkMode ? "#FFF" : "#000"),
        })
      : [],
    styledSelection({
      backgroundColor: selection?.backgroundColor ?? `${highlight.keywords}50`,
      color: selection?.color ?? "inherit",
    }),
    styledAutocomplete(autocomplete),
    styledHighlight(highlight),
  ];
};
