import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { HTMLtoJSXConfig } from "./lib/html-to-jsx";
export type TJSXConfig = HTMLtoJSXConfig & { prefixSVGIds?: string };
type TStore = {
  config: TJSXConfig;
  htmlText: string;
  jsxText: string;
  layout: "columns" | "rows" | "jsx" | "html";
  lineWrap: boolean;
};
export const defaultConfig: TJSXConfig = {
  attributeValueString: true,
  camelCaseAttributes: false,
  component: "none",
  wrapperNode: "none",
  componentName: "SolidComponent",
  indent: "  ",
  preTagWrapTemplateLiterals: false,
  styleAttribute: "css-object",
  styleTagAttributeInnerHTML: false,
  stripStyleTag: false,
  stripComment: false,
  prefixSVGIds: "",
  exportComponent: false,
};

export type ConfigKey = keyof HTMLtoJSXConfig;
export const [store, setStore] = createStore<TStore>({
  config: { ...defaultConfig },
  htmlText: getHTMLText().trimStart(),
  jsxText: getJSXText().trimStart(),
  layout: "rows",
  lineWrap: true,
});

function getHTMLText() {
  return `
<!-- Solid is solid -->
<h1 class="heading" style="--solid-primary: #2c4f7c; color: #000;">SolidJSX</h1>
<div contenteditable tabindex="0" id="name"></div>
<svg width="50" height="50"  viewBox="0 0 13.2 13.2">
  <defs>
    <linearGradient id="a">
      <stop offset="0" stop-color="#446b9e"></stop>
    </linearGradient>
  </defs>
  <circle cx="6.6" cy="6.6" r="6.6" fill="url(#a)"></circle>
</svg>
<style>
  .heading {
    font-size: 18px;
  }
</style>
`;
}

function getJSXText() {
  return `
{/* Solid is solid */}
<h1 class="heading" style={{"--solid-primary": "#2c4f7c", "color": "#000"}}>SolidJSX</h1>
<div contenteditable tabindex="0" id="name" />
<svg width="50" height="50" viewBox="0 0 13.2 13.2">
  <defs>
    <linearGradient id="hi-a">
      <stop offset="0" stop-color="#446b9e" />
    </linearGradient>
  </defs>
  <circle cx="6.6" cy="6.6" r="6.6" fill="url(#hi-a)" />
</svg>
<style>
{\`
.heading {
  font-size: 18px;
}
\`}
</style>
`;
}
