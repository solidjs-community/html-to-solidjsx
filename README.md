<p>
  <img width="100%" src="https://assets.solidjs.com/banner?background=tiles&project=html%20to%20solidjsx" alt="HTML to Solid JSX">
</p>

# HTML to SolidJSX

This is the source code of the [HTML to Solid JSX](https://solidjs-community.github.io/html-to-solidjsx) website.

## Purpose

Existing HTML to JSX online transformers aren't compatible for SolidJS, it transforms to JSX that is suited for React templates.

1. Replaces standard HTML attributes such as `class` and `for` to `className` and `htmlFor`.
2. Incorrectly changes css variables names in style attributes.

Solid attempts to stay as close to HTML standards as possible, allowing copy and paste from answers on Stack Overflow or from template builders from your designers. This [site](https://solidjs-community.github.io/html-to-solidjsx) brings that goal even closer while providing customizations such as the option to camelCase attributes or having style attribute value set as a CSS object or string.

## Credits / Technologies used

- [solid-start](https://start.solidjs.com/): The meta-framework
- [solid-js](https://github.com/solidjs/solid/): The view library
- [codemirror](https://codemirror.net/): The in-browser code editor
- [solid-codemirror](https://github.com/riccardoperra/solid-codemirror): The SolidJS bindings for codemirror
- [htmltojsx](https://github.com/reactjs/react-magic/blob/master/README-htmltojsx.md)(modified for Solid JSX compatiblity): The HTML to JSX converter
- [UnoCSS](https://uno.antfu.me/): The CSS framework
- [solid-primitives](https://github.com/solidjs-community/solid-primitives): The utilities/primitives
- [vite](https://vitejs.dev/): The module bundler
- [pnpm](https://pnpm.js.org/): The package manager
