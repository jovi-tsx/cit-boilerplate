// ** Modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ** Third-party Imports
import * as esbuild from "esbuild";

// ** Plugins
import postcssPlugin from "./plugins/postCss.mjs";
import combineJsonPlugin from "./plugins/combineJson.mjs";
import posthtmlPlugin from "./plugins/postHtml.mjs";
import citJsPlugin from "./plugins/compileJs.mjs";
import publishHtmlPlugin from "./plugins/publishHtmlPlugin.mjs";

import "dotenv/config";

// ** Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const src = path.resolve(__dirname, "web", "src");
const directories = [
  ".build/components",
  ".build/css",
  ".build/html",
  ".build/js",
];

// ** Folder Handling
fs.rmSync("./.build", { recursive: true, force: true });

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

// ** Scripts
await Promise.all([
  esbuild
    .build({
      entryPoints: [path.resolve(src, "components", "**", "*.ts")],
      outdir: ".build/components",
      bundle: true,
      platform: "browser",
      target: ["esnext"],
      tsconfig: "tsconfig.json",
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    }),
  esbuild
    .build({
      entryPoints: [
        path.resolve(src, "controllers", "**", "*.ts"),
        path.resolve(src, "core", "**", "*.ts"),
      ],
      outdir: ".build/js",
      bundle: true,
      platform: "browser",
      target: ["esnext"],
      tsconfig: "tsconfig.json",
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    }),
]);

await Promise.all([
  esbuild
    .build({
      entryPoints: [path.resolve(src, "assets", "styles", "**", "*.css")],
      outdir: ".build/css",
      bundle: false,
      write: false,
      plugins: [postcssPlugin()],
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    }),
  esbuild
    .build({
      entryPoints: [
        path.resolve(src, "controllers", "**", "*.js"),
        path.resolve(src, "core", "**", "*.js"),
        path.resolve(src, "components", "**", "*.js"),
      ],
      outdir: ".build",
      loader: {
        ".js": "js",
      },
      bundle: false,
      minifySyntax: true,
      write: false,
      plugins: [citJsPlugin()],
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    }),
]);

await esbuild
  .build({
    entryPoints: [path.resolve(src, "assets", "styles", "**", "*.json")],
    outdir: ".build",
    bundle: true,
    write: false,
    plugins: [combineJsonPlugin("./.build/cssModules.json")],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

await esbuild
  .build({
    entryPoints: [path.resolve(src, "**", "*.html")],
    outdir: ".build/html",
    write: false,
    loader: {
      ".html": "text",
    },
    plugins: [posthtmlPlugin()],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

/* await esbuild
  .build({
    entryPoints: [".build/html/forms/layout.html"],
    outdir: ".build/html",
    loader: {
      ".html": "text",
    },
    write: false,
    plugins: [publishHtmlPlugin()],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
 */
