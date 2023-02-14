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
