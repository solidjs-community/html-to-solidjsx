// Modified from htmltojsx, react-magic https://github.com/reactjs/react-magic/blob/master/src/htmltojsx.js

// https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8,
};
const isServer = typeof window === "undefined";

const ATTRIBUTE_MAPPING = {
  // for: "htmlFor",
  // class: "className",
  tabindex: "tabIndex",
  autofocus: "autoFocus",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  crossorigin: "crossOrigin",
  autocapitalize: "autoCapitalize",
  // autocomplete: 'autoComplete',
  inputmode: "inputMode",
  maxlength: "maxLength",
  minlength: "minLength",
};

const ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    // checked: "defaultChecked",
    // value: "defaultValue",
    // autofocus: "autoFocus",
  },
};

// Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element#SVG_elements
const ELEMENT_TAG_NAME_MAPPING = {
  a: "a",
  altglyph: "altGlyph",
  altglyphdef: "altGlyphDef",
  altglyphitem: "altGlyphItem",
  animate: "animate",
  animatecolor: "animateColor",
  animatemotion: "animateMotion",
  animatetransform: "animateTransform",
  audio: "audio",
  canvas: "canvas",
  circle: "circle",
  clippath: "clipPath",
  "color-profile": "colorProfile",
  cursor: "cursor",
  defs: "defs",
  desc: "desc",
  discard: "discard",
  ellipse: "ellipse",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  filter: "filter",
  font: "font",
  "font-face": "fontFace",
  "font-face-format": "fontFaceFormat",
  "font-face-name": "fontFaceName",
  "font-face-src": "fontFaceSrc",
  "font-face-uri": "fontFaceUri",
  foreignobject: "foreignObject",
  g: "g",
  glyph: "glyph",
  glyphref: "glyphRef",
  hatch: "hatch",
  hatchpath: "hatchpath",
  hkern: "hkern",
  iframe: "iframe",
  image: "image",
  line: "line",
  lineargradient: "linearGradient",
  marker: "marker",
  mask: "mask",
  mesh: "mesh",
  meshgradient: "meshgradient",
  meshpatch: "meshpatch",
  meshrow: "meshrow",
  metadata: "metadata",
  "missing-glyph": "missingGlyph",
  mpath: "mpath",
  path: "path",
  pattern: "pattern",
  polygon: "polygon",
  polyline: "polyline",
  radialgradient: "radialGradient",
  rect: "rect",
  script: "script",
  set: "set",
  solidcolor: "solidcolor",
  stop: "stop",
  style: "style",
  svg: "svg",
  switch: "switch",
  symbol: "symbol",
  text: "text",
  textpath: "textPath",
  title: "title",
  tref: "tref",
  tspan: "tspan",
  unknown: "unknown",
  use: "use",
  video: "video",
  view: "view",
  vkern: "vkern",
};

// const HTMLDOMPropertyConfig = require("react-dom/lib/HTMLDOMPropertyConfig");
// const SVGDOMPropertyConfig = require("react-dom/lib/SVGDOMPropertyConfig");

/**
 * Iterates over elements of object invokes iteratee for each element
 *
 * @param {object}   obj        Collection object
 * @param {function} iteratee   Callback function called in iterative processing
 * @param {any}      context    This arg (aka Context)
 */
function eachObj(
  obj: any,
  iteratee: (key: string, value: string) => void,
  context: any
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      iteratee.call(context || obj, key, obj[key]);
    }
  }
}

// mappingAttributesFromReactConfig(HTMLDOMPropertyConfig);
// mappingAttributesFromReactConfig(SVGDOMPropertyConfig);

/**
 * Convert tag name to tag name suitable for JSX.
 *
 * @param  {string} tagName  String of tag name
 * @return {string}
 */
function jsxTagName(tagName: string) {
  let name = tagName.toLowerCase();

  if (ELEMENT_TAG_NAME_MAPPING.hasOwnProperty(name)) {
    name = ELEMENT_TAG_NAME_MAPPING[name as "a"];
  }

  return name;
}

/**
 * Repeats a string a certain number of times.
 * Also: the future is bright and consists of native string repetition:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 *
 * @param {string} string  String to repeat
 * @param {number} times   Number of times to repeat string. Integer.
 * @see http://jsperf.com/string-repeater/2
 */
function repeatString(string: string, times: number) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  let repeated = "";
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if ((times >>= 1)) {
      string += string;
    }
  }
  return repeated;
}

/**
 * Determine if the string ends with the specified substring.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {boolean}
 */
function endsWith(haystack: string, needle: string) {
  return haystack.slice(-needle.length) === needle;
}

/**
 * Trim the specified substring off the string. If the string does not end
 * with the specified substring, this is a no-op.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {string}
 */
function trimEnd(haystack: string, needle: string) {
  return endsWith(haystack, needle)
    ? haystack.slice(0, -needle.length)
    : haystack;
}

/**
 * Convert a hyphenated string to camelCase.
 */
function hyphenToCamelCase(string: string) {
  return string.replace(/-(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

/**
 * Determines if the specified string consists entirely of whitespace.
 */
function isEmpty(string: string) {
  return !/[^\s]/.test(string);
}

/**
 * Determines if the CSS value can be converted from a
 * 'px' suffixed string to a numeric value
 *
 * @param {string} value CSS property value
 * @return {boolean}
 */
function isConvertiblePixelValue(value: string) {
  return /^\d+px$/.test(value);
}

/**
 * Determines if the specified string consists entirely of numeric characters.
 */
function isNumeric(input: string | number) {
  return (
    input !== undefined &&
    input !== null &&
    (typeof input === "number" || parseFloat(input) == (input as any))
  );
}

function hasLeadingDecimal(input: string | number) {
  if (typeof input !== "string") return;

  return input.split(".")[0] === "";
}

let createElement!: (tag: string) => HTMLElement;

if (!isServer) {
  // Browser environment, use document.createElement directly.
  createElement = (tag: string) => {
    return document.createElement(tag);
  };
} else {
  createElement = (tag: string) => {
    return null as any;
  };
  // Node.js-like environment, use jsdom.
  // let jsdom = require("jsdom-no-contextify").jsdom;
  // let window = jsdom().defaultView;
  // createElement = function (tag) {
  //   return window.document.createElement(tag);
  // };
}

const tempEl = createElement("div");
/**
 * Escapes special characters by converting them to their escaped equivalent
 * (eg. "<" to "&lt;"). Only escapes characters that absolutely must be escaped.
 *
 * @param {string} value
 * @return {string}
 */
function escapeSpecialChars(value: string) {
  // Uses this One Weird Trick to escape text - Raw text inserted as textContent
  // will have its escaped version in innerHTML.
  tempEl.textContent = value;
  return tempEl.innerHTML;
}

export type HTMLtoJSXConfig = {
  /**
   * @defaultValue two spaces `"  "`
   */
  indent?: string;
  /**
   * @defaultValue `true`
   */
  camelCaseAttributes?: boolean;
  /**
   * @defaultValue `true`
   */
  attributeValueString?: boolean;
  /**
   * @defaultValue `"css-object"`
   */
  styleAttribute?: "css-object" | "css-string";
  /**
   * @defaultValue `"fragment"`
   */
  wrapperNode?: "none" | "fragment" | "div";
  /**
   * @defaultValue `"none"`
   */
  component?: "function" | "arrow-function" | "none";
  /**
   * @defaultValue `false`
   */
  styleTagAttributeInnerHTML?: boolean;
  /**
   * @defaultValue `false`
   */
  stripStyleTag?: boolean;
  /**
   * @defaultValue `true`
   */
  stripScriptTag?: boolean;
  /**
   * @defaultValue `false`
   */
  stripComment?: boolean;
  /**
   * @defaultValue `false`
   */
  preTagWrapTemplateLiterals?: boolean;
  /**
   * @defaultValue `"JSXComponent"`
   */
  componentName?: string;
  /**
   * @defaultValue `true`
   */
  exportComponent?: boolean;
  /**
   * @defaultValue `false`
   */
  classNameAttribute?: string;
};

class HTMLtoJSX {
  config: HTMLtoJSXConfig;
  output: string;
  level: number;
  #inPreTag: boolean;
  constructor(config: HTMLtoJSXConfig = {}) {
    config.indent ??= "  ";
    config.styleAttribute ??= "css-object";
    config.attributeValueString ??= true;
    config.camelCaseAttributes ??= true;
    config.wrapperNode ??= "fragment";
    config.component ??= "none";
    config.componentName ??= "JSXComponent";
    config.stripScriptTag ??= true;
    config.exportComponent ??= true;

    this.config = config;
    this.output = "";
    this.level = 0;
    this.#inPreTag = false;
  }
  /**
   * Reset the internal state of the converter
   */
  reset() {
    this.output = "";
    this.level = 0;
    this.#inPreTag = false;
  }
  /**
   * Main entry point to the converter. Given the specified HTML, returns a
   * JSX object representing it.
   * @param {string} html HTML to convert
   * @return {string} JSX
   */
  convert(html: string) {
    this.reset();

    const containerEl = document.createElement("div");
    containerEl.innerHTML = "\n" + this.#cleanInput(html) + "\n";

    // TODO:
    if (this.config.component !== "none") {
      if (this.config.componentName) {
        if (this.config.component === "arrow-function") {
          this.output = `const ${this.config.componentName} = () => (\n`;
        } else {
          this.output = `function ${this.config.componentName} () {\n`;
          this.output += `${this.config.indent!.repeat(2)}return (\n`;
        }
      }
      // this.output += this.config.indent + "render: function() {" + "\n";
      // this.output += this.config.indent! + this.config.indent + "return (\n";
    }

    if (this.#onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this.#traverse(containerEl);
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output += this.config.indent!.repeat(3);
      // TODO:
      if (
        // this.config.component !== "none" &&
        this.config.wrapperNode !== "none"
      ) {
        this.level++;
        // if (this.config.component === "none") {
        // }
      } else {
        if (this.config.component !== "none") {
          this.level++;
        }
      }

      this.#visit(containerEl);
      if (
        this.config.wrapperNode === "none" &&
        this.config.component === "none"
      ) {
        this.output = this.output
          .replace(/^\s*<div>/, "")
          .replace(/\s*<\/div>\s*$/, "");
      }
      if (
        this.config.wrapperNode === "fragment" ||
        (this.config.wrapperNode === "none" && this.config.component !== "none")
      ) {
        this.output = this.output
          .replace(/<div>/, "<>")
          .replace(/<\/div>\s*$/, "</>");
      }
    }
    this.output = this.output.trim() + "\n";

    // TODO
    if (this.config.component !== "none") {
      // this.output += this.config.indent! + this.config.indent + ");\n";
      // this.output += this.config.indent + "}\n";
      if (this.config.component === "arrow-function") {
        this.output += ");";
        this.output = this.#removeJSXClassIndention(
          this.output,
          this.config.indent!
        );
      } else {
        this.output += ")};";
      }
      if (this.config.exportComponent) {
        this.output += `\n\nexport default ${this.config.componentName};`;
      }
    } else {
      this.output = this.#removeJSXClassIndention(
        this.output,
        this.config.indent!
      );
    }

    return this.output;
  }

  /**
   * Cleans up the specified HTML so it's in a format acceptable for
   * converting.
   *
   * @param {string} html HTML to clean
   * @return {string} Cleaned HTML
   */
  #cleanInput(html: string) {
    // Remove unnecessary whitespace
    html = html.trim();
    // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
    // so let's not even put them in the DOM.
    html = html.replace(/<script([\s\S]*?)<\/script>/g, "");
    if (this.config.stripStyleTag) {
      html = html.replace(/<style([\s\S]*?)<\/style>/g, "");
    }
    if (this.config.stripComment) {
      html = html.replace(/<!--([\s\S]*?)-->/g, "");
    }

    return html;
  }

  /**
   * Determines if there's only one top-level node in the DOM tree. That is,
   * all the HTML is wrapped by a single HTML tag.
   *
   * @param {DOMElement} containerEl Container element
   * @return {boolean}
   */
  #onlyOneTopLevel(containerEl: Element) {
    // Only a single child element
    if (
      containerEl.childNodes.length === 1 &&
      containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT
    ) {
      return true;
    }
    // Only one element, and all other children are whitespace
    let foundElement = false;
    for (let i = 0, count = containerEl.childNodes.length; i < count; i++) {
      const child = containerEl.childNodes[i];
      if (child.nodeType === NODE_TYPE.ELEMENT) {
        if (foundElement) {
          // Encountered an element after already encountering another one
          // Therefore, more than one element at root level
          return false;
        } else {
          foundElement = true;
        }
      } else if (
        child.nodeType === NODE_TYPE.TEXT &&
        !isEmpty(child.textContent!)
      ) {
        // Contains text content
        return false;
      }
    }
    return true;
  }

  /**
   * Gets a newline followed by the correct indentation for the current
   * nesting level
   *
   * @return {string}
   */
  #getIndentedNewline() {
    return "\n" + repeatString(this.config.indent!, this.level + 2);
  }

  /**
   * Handles processing the specified node
   *
   * @param {Node} node
   */
  #visit(node: Element) {
    this.#beginVisit(node);
    this.#traverse(node);
    this.#endVisit(node);
  }

  /**
   * Traverses all the children of the specified node
   *
   * @param {Node} node
   */
  #traverse(node: Element) {
    this.level++;
    for (let i = 0, count = node.childNodes.length; i < count; i++) {
      this.#visit(node.childNodes[i] as Element);
    }
    this.level--;
  }

  /**
   * Handle pre-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  #beginVisit(node: Element) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this.#beginVisitElement(node);
        break;

      case NODE_TYPE.TEXT:
        this.#visitText(node);
        break;

      case NODE_TYPE.COMMENT:
        this.#visitComment(node);
        break;

      default:
        console.warn("Unrecognised node type: " + node.nodeType);
    }
  }

  /**
   * Handles post-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  #endVisit(node: Element) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this.#endVisitElement(node);
        break;
      // No ending tags required for these types
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
        break;
    }
  }

  /**
   * Handles pre-visit behaviour for the specified element node
   *
   * @param {DOMElement} node
   */
  #beginVisitElement(node: Element) {
    const tagName = jsxTagName(node.tagName);
    const attributes = [];
    for (let i = 0, count = node.attributes.length; i < count; i++) {
      attributes.push(this.#getElementAttribute(node, node.attributes[i]));
    }

    if (tagName === "textarea") {
      // Hax: textareas need their inner text moved to a "defaultValue" attribute.
      attributes.push(
        `value="${JSON.stringify((node as HTMLTextAreaElement).value)}"`
      );
    }
    if (tagName === "style" && this.config.styleTagAttributeInnerHTML) {
      // Hax: style tag contents need to be dangerously set due to liberal curly brace usage
      attributes.push(`innerHTML={\`${JSON.stringify(node.textContent)}\`}`);
    }
    if (tagName === "pre") {
      this.#inPreTag = true;
      if (this.config.preTagWrapTemplateLiterals) {
        this.output += `<${tagName}>`;
        return;
      }
    }

    this.output += `<${tagName}`;
    if (attributes.length > 0) {
      this.output += " " + attributes.join(" ");
    }
    if (!this.#isSelfClosing(node)) {
      this.output += ">";
    }
  }

  /**
   * Handles post-visit behaviour for the specified element node
   *
   * @param {Node} node
   */
  #endVisitElement(node: Element) {
    const tagName = jsxTagName(node.tagName);
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent!);
    if (this.#isSelfClosing(node)) {
      if (tagName === "style" && !this.config.styleTagAttributeInnerHTML) {
        const { indent } = this.config;
        let textContent = node.textContent!.trimEnd();
        textContent = textContent.replace(
          /\n/g,
          `\n${indent?.repeat(this.level + 1 || 0)}`
        );
        /** outputs
         * <style>{`
         * div {}
         * `}<style>
         */
        // this.output += `>{\`${textContent}\n${indent?.repeat(
        //   this.level + 1
        // )}\`}</${tagName}>`;

        /** outputs
         * <style>
         * {`
         * div {}
         * `}
         * <style>
         */
        const newIndent = indent?.repeat(this.level + 2);
        this.output += `>\n${newIndent}{\`${textContent}\n${newIndent}\`}\n${newIndent}</${tagName}>`;
        return;
      }
      this.output += " />";
    } else {
      if (tagName === "pre" && this.config.preTagWrapTemplateLiterals) {
        const textContent = node
          .textContent!.trimEnd()
          // const textContent = JSON.stringify(node.textContent!)
          //   .trimEnd()
          // .replace(/\\n/g, "\n")
          // fixes parsing error in Vite
          .replace(/\$\{/g, "$\\\\{")
          .replace(/\`/g, "\\`");
        this.output += `{\`\n${textContent}\`}</${tagName}>`;
      } else {
        this.output += `</${tagName}>`;
      }
    }

    if (tagName === "pre") {
      this.#inPreTag = false;
    }
  }

  /**
   * Determines if this element node should be rendered as a self-closing
   * tag.
   *
   * @param {Node} node
   * @return {boolean}
   */
  #isSelfClosing(node: Element) {
    const tagName = jsxTagName(node.tagName);
    // If it has children, it's not self-closing
    // Exception: All children of a textarea are moved to a "defaultValue" attribute, style attributes are dangerously set.
    return !node.firstChild || tagName === "textarea" || tagName === "style";
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {TextNode} node
   */
  #visitText(node: Element) {
    const parentTag =
      node.parentNode && jsxTagName((node.parentNode as Element).tagName);
    if (parentTag === "textarea" || parentTag === "style") {
      // Ignore text content of textareas and styles, as it will have already been moved
      // to a "defaultValue" attribute and "dangerouslySetInnerHTML" attribute respectively.
      return;
    }

    let text = escapeSpecialChars(node.textContent!);

    if (this.#inPreTag) {
      if (this.config.preTagWrapTemplateLiterals) return;
      // If this text is contained within a <pre>, we need to ensure the JSX
      // whitespace coalescing rules don't eat the whitespace. This means
      // wrapping newlines and sequences of two or more spaces in letiables.
      text = text
        .replace(/\r/g, "")
        .replace(/( {2,}|\n|\t|\{|\}|\$)/g, function (whitespace) {
          if (whitespace === "$") {
            // fixes parsing error in Vite
            whitespace = "\\$";
          }
          return "{" + JSON.stringify(whitespace) + "}";
        });
    } else {
      // Handle any curly braces.
      text = text.replace(/(\{|\})/g, function (brace) {
        return "{'" + brace + "'}";
      });
      // If there's a newline in the text, adjust the indent level
      if (text.indexOf("\n") > -1) {
        text = text.replace(/\n\s*/g, this.#getIndentedNewline());
      }
    }
    this.output += text;
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {Text} node
   */
  #visitComment(node: Node) {
    this.output += "{/*" + node.textContent!.replace("*/", "* /") + "*/}";
  }

  /**
   * Gets a JSX formatted version of the specified attribute from the node
   *
   * @param {DOMElement} node
   * @param {object}     attribute
   * @return {string}
   */
  #getElementAttribute(node: Element, attribute: Attr) {
    switch (attribute.name) {
      case "style":
        return this.#getStyleAttribute(attribute.value);
      default:
        const tagName = jsxTagName(node.tagName);
        const name = attribute.name;
        let result = this.config.camelCaseAttributes
          ? // (ELEMENT_ATTRIBUTE_MAPPING[tagName] &&
            //   ELEMENT_ATTRIBUTE_MAPPING[tagName][attribute.name as any]) ||
            ATTRIBUTE_MAPPING[attribute.name as "tabindex"] || name
          : name;

        if (result === "class" && this.config.classNameAttribute) {
          result = "className";
        }

        // Numeric values should be output as {123} not "123"
        if (!this.config.attributeValueString && isNumeric(attribute.value)) {
          const leadingZero = hasLeadingDecimal(attribute.value) ? "0" : "";

          result += `={${leadingZero}${attribute.value}}`;
        } else if (attribute.value.length > 0) {
          result += `="${attribute.value.replace(/"/gm, "&quot;")}"`;
        } else if (attribute.value.length === 0 && attribute.name === "alt") {
          result += '=""';
        }
        return result;
    }
  }

  /**
   * Gets a JSX formatted version of the specified element styles
   *
   * @param {string} styles
   * @return {string}
   */
  #getStyleAttribute(styles: string) {
    const jsxStyles = new StyleParser(styles, this.config).toJSXString();
    if (this.config.styleAttribute === "css-string") {
      return `style="${jsxStyles}"`;
    }
    return `style={{${jsxStyles}}}`;
  }

  /**
   * Removes class-level indention in the JSX output. To be used when the JSX
   * output is configured to not contain a class deifinition.
   *
   * @param {string} output JSX output with class-level indention
   * @param {string} indent Configured indention
   * @return {string} JSX output wihtout class-level indention
   */
  #removeJSXClassIndention(output: string, indent: string) {
    const classIndention = new RegExp("\\n" + indent + indent + indent, "g");
    return output.replace(classIndention, "\n");
  }
}

class StyleParser {
  config: HTMLtoJSXConfig;
  styles: any;
  /**
   * Handles parsing of inline styles
   *
   * @param {string} rawStyle Raw style attribute
   * @constructor
   */
  constructor(rawStyle: string, config: HTMLtoJSXConfig) {
    this.config = config;
    this.parse(rawStyle);
  }
  /**
   * Parse the specified inline style attribute value
   * @param {string} rawStyle Raw style attribute
   */
  parse(rawStyle: string) {
    this.styles = {};
    rawStyle.split(";").forEach((style) => {
      style = style.trim();
      const firstColon = style.indexOf(":");
      let key = style.slice(0, firstColon);
      const value = style.slice(firstColon + 1).trim();
      if (key !== "") {
        // Style key should be case insensitive
        key = key.toLowerCase();
        this.styles[key] = value;
      }
    });
  }

  /**
   * Convert the style information represented by this parser into a JSX
   * string
   *
   * @return {string}
   */
  toJSXString() {
    const output: string[] = [];
    const styleAttribute = this.config.styleAttribute;
    eachObj(
      this.styles,
      (key: string, value: string) => {
        // "CSS string", "object camelCase properties", "object kebab-case properties"
        switch (styleAttribute) {
          // case "CSS object camelCase properties":
          //   return output.push(
          //     this.toJSXKey(key) + ": " + this.toJSXValue(value)
          //   );
          case "css-object":
            // case "CSS object kebab-case properties":
            return output.push(`"${key}": ${this.toJSXValue(value)}`);
          case "css-string":
          default:
            return output.push(`${key}: ${value};`);
        }
      },
      this
    );
    if (styleAttribute === "css-string") return output.join(" ");
    return output.join(", ");
  }
  /**
   * Convert the CSS style key to a JSX style key
   *
   * @param {string} key CSS style key
   * @return {string} JSX style key
   */
  toJSXKey(key: string) {
    // Don't capitalize -ms- prefix
    if (/^-ms-/.test(key)) {
      key = key.substr(1);
    }
    if (/^--/.test(key)) {
      key = `"${key}"`;
    }
    return hyphenToCamelCase(key);
  }

  /**
   * Convert the CSS style value to a JSX style value
   *
   * @param {string} value CSS style value
   * @return {string} JSX style value
   */
  toJSXValue(value: string) {
    if (isNumeric(value)) {
      // If numeric, no quotes
      return value;
    } else {
      // Probably a string, wrap it in quotes
      return `"${value.replace(/"/g, "'")}"`;
    }
  }
}

export default HTMLtoJSX;
