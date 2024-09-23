import fs from "fs";

import * as esbuild from "esbuild";

// ** Plugins
import postcssPlugin from "./plugins/postCss.mjs";
import combineJsonPlugin from "./plugins/combineJson.mjs";
import posthtmlPlugin from "./plugins/postHtml.mjs";
import citJsPlugin from "./plugins/compileJs.mjs";
import rmSmartFramePlugin from "./plugins/rmSmartFrame.mjs";

import "dotenv/config";

const directories = [
  ".build/components",
  ".build/css",
  ".build/html",
  ".build/js",
];

fs.rmSync("./.build", { recursive: true, force: true });

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

await Promise.all([
  esbuild
    .build({
      entryPoints: ["./view/assets/styles/**/*.css"],
      outdir: ".build/css",
      bundle: true,
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
        "./view/controllers/*.js",
        "./view/core/*.js",
        "./view/components/*.js",
      ],
      outdir: ".build/js",
      loader: {
        ".js": "js",
      },
      bundle: true,
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
    entryPoints: ["./view/assets/styles/**/*.json"],
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
    entryPoints: ["./view/**/*.html"],
    outdir: ".build/html",
    bundle: true,
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

await esbuild
  .build({
    entryPoints: [".build/html/forms/layout.html"],
    outdir: ".build/html",
    loader: {
      ".html": "text",
    },
    bundle: true,
    write: false,
    plugins: [rmSmartFramePlugin()],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
