import { store } from "../../store";
import HTMLEditor from "./HTMLEditor";
import JSXEditor from "./JSXEditor";

const SplitEditor = () => {
  return (
    <div
      id="split-editor"
      class="flex-grow grid md:grid-cols-[1fr_1fr]  md:md:h-[100vh] dark:bg-dark"
      classList={{
        "grid-cols-[1fr_1fr]": store.layout === "columns",
        "grid-cols-[1fr]":
          store.layout === "rows" || store.layout === "html" || store.layout === "jsx",
      }}
    >
      <div
        id="html-editor-container"
        class="relative h-full md:border-r-2 border-#CFCFCF dark:border-#555"
        classList={{
          hidden: store.layout === "jsx",
          "border-r-2": store.layout === "columns",
        }}
      >
        <HTMLEditor />
      </div>
      <div
        id="jsx-editor-container"
        class="md:border-t-0 TEMP"
        classList={{
          hidden: store.layout === "html",
          "border-t-2 border-#CFCFCF dark:border-#555": store.layout === "rows",
        }}
      >
        <JSXEditor />
      </div>
    </div>
  );
};

export default SplitEditor;
