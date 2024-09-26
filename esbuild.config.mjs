import fs from "fs";

import * as esbuild from "esbuild";

// ** Plugins
import postcssPlugin from "./plugins/postCss.mjs";
import combineJsonPlugin from "./plugins/combineJson.mjs";
import posthtmlPlugin from "./plugins/postHtml.mjs";
import citJsPlugin from "./plugins/compileJs.mjs";
import publishHtmlPlugin from "./plugins/publishHtmlPlugin.mjs";

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
      entryPoints: ["./view/components/*.ts"],
      outdir: ".build/components",
      bundle: true,
      platform: "browser",
      target: ["esnext"],
      tsconfig: "tsconfig.json",
    })
    .catch(() => process.exit(1)),
  esbuild
    .build({
      entryPoints: ["./view/controllers/*.ts", "./view/core/*.ts"],
      outdir: ".build/js",
      bundle: true,
      platform: "browser",
      target: ["esnext"],
      tsconfig: "tsconfig.json",
    })
    .catch(() => process.exit(1)),
]);

await Promise.all([
  esbuild
    .build({
      entryPoints: ["./view/assets/styles/**/*.css"],
      outdir: ".build/css",
      bundle: true,
      write: false,
      plugins: [postcssPlugin()],
    })
    .catch(() => {
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
      minifySyntax: true,
      write: false,
      plugins: [citJsPlugin()],
    })
    .catch(() => {
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
  .catch(() => {
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
  .catch(() => {
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
    plugins: [publishHtmlPlugin()],
  })
  .catch(() => {
    process.exit(1);
  });
