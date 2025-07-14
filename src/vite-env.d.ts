/// <reference types="vite/client" />

/**
 * Declares the shape of CSS module imports to TypeScript.
 * When you import a .module.css file, TypeScript will now understand
 * that it's a module whose default export is an object that maps
 * class names (string keys) to their generated, unique class names (string values).
 */
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
