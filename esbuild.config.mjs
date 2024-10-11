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
  ".build/components/layout",
  ".build/css",
  ".build/html/forms",
  ".build/js",
];

fs.rmSync("./.build", { recursive: true, force: true });

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

await Promise.all([
  esbuild
    .build({
      entryPoints: ["./web/src/components/*.ts"],
      outdir: ".build/components",
      bundle: true,
      platform: "browser",
      target: ["esnext"],
      tsconfig: "tsconfig.json",
    })
    .catch(() => process.exit(1)),
  esbuild
    .build({
      entryPoints: ["./web/src/controllers/*.ts", "./web/src/core/*.ts"],
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
      entryPoints: ["./web/src/assets/styles/**/*.css"],
      outdir: ".build/css",
      bundle: false,
      write: false,
      plugins: [postcssPlugin()],
    })
    .catch(() => {
      process.exit(1);
    }),
  esbuild
    .build({
      entryPoints: [
        "./web/src/controllers/*.js",
        "./web/src/core/*.js",
        "./web/src/components/**/*.js",
      ],
      outdir: ".build/js",
      loader: {
        ".js": "js",
      },
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
    entryPoints: ["./web/src/assets/styles/**/*.json"],
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
    entryPoints: ["./web/src/**/*.html"],
    outdir: ".build/html",
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
    entryPoints: [".build/components/layout/template.html"],
    outdir: ".build/html",
    loader: {
      ".html": "text",
    },
    write: false,
    plugins: [publishHtmlPlugin()],
  })
  .catch(() => {
    process.exit(1);
  });
