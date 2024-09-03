import fs from "fs";

import * as esbuild from "esbuild";

// ** Plugins
import postcssPlugin from "./plugins/postcss.mjs";
import combineJsonPlugin from "./plugins/combine-json.mjs";
import posthtmlPlugin from "./plugins/posthtml.mjs";
import citJsPlugin from "./plugins/cit-js.mjs";

import "dotenv/config";

const directories = [
  ".build/components",
  ".build/css",
  ".build/html",
  ".build/js",
];

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

await esbuild
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
  });

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
  });
