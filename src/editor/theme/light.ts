import { defineEditorTheme } from "../defineEditorTheme";

export const githubLight = [
  defineEditorTheme({
    darkMode: false,
    cursor: {
      color: "#24292f",
    },
    lineNumbers: {
      color: "#8493a1",
    },
    selection: {
      activeLine: "rgba(234,238,242,0.5)",
      backgroundColor: "rgba(84,174,255,0.4)",
      color: "#24292f",
    },
    autocomplete: {
      background: "#32383f",
      border: "#424a53",
      selectedBackground: "#424a53",
      selectedColor: "#f6f8fa",
    },
    highlight: {
      base: "#24292f",
      background: "#ffffff",
      tag: "#116329",
      delimiters: "#6e7781",
      numbers: "#0a3069",
      punctuation: "#bf8700",
      className: "#953800",
      brackets: "#bf8700",
      keywords: "#cf222e",
      strings: "#0a3069",
      propertyName: "#0a3069",
      variableName: "#953800",
      regexp: "#116329",
      comments: "#6e7781",
      attrName: "#0550ae",
      function: "#8250df",
      typeName: "#0550ae",
    },
  }),
];
