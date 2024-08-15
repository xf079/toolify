/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.png?base64' {
  export default string;
}