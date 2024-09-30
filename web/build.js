const fs = require("fs");
const { resolve } = require("path");
const esbuild = require("esbuild");
const glob = require("glob");
const tailwindcss = require("tailwindcss");
const postcss = require("postcss");
const postcssNested = require("postcss-nested");
const postcssModules = require("postcss-modules");
const postcssPresetEnv = require("postcss-preset-env");
const cssnanoPlugin = require("cssnano");
const posthtml = require("posthtml");
const posthtmlCssModules = require("posthtml-css-modules");
const beautify = require("posthtml-beautify");

const src = resolve(__dirname, "src");
const cit = resolve(__dirname, ".cit");

async function buildJs() {
  const entryPoints = glob.sync(
    resolve(src, "**", "*.{js,ts}").replaceAll("\\", "/"),
    {
      ignore: [resolve(src, "vendor", "**").replaceAll("\\", "/")],
    }
  );

  await Promise.all([
    esbuild
      .build({
        entryPoints,
        minifyIdentifiers: false,
        minifySyntax: true,
        minifyWhitespace: true,
        outdir: cit,
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
          resolve(src, "vendor", "**", "*.js"),
          resolve(src, "vendor", "**", "*.ts"),
        ],
        minifyIdentifiers: false,
        minifySyntax: true,
        minifyWhitespace: true,
        bundle: false,
        outdir: resolve(cit, "vendor", "js"),
        platform: "browser",
        target: ["esnext"],
        tsconfig: "tsconfig.json",
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      }),
  ]);
}

async function buildCss() {
  await Promise.all([
    esbuild
      .build({
        entryPoints: [resolve(src, "assets", "styles", "**", "*.css")],
        write: false,
        outdir: resolve(src, ".cit"),
        plugins: [
          {
            name: "postcss",
            setup(build) {
              let minified = "";

              build.onLoad({ filter: /\.css$/ }, async (args) => {
                const source = fs.readFileSync(args.path, "utf8");

                const { css } = await postcss([
                  postcssNested,
                  tailwindcss,
                  postcssPresetEnv({
                    autoprefixer: {},
                  }),
                  postcssModules({
                    globalModulePaths: [/globals\.css/],
                  }),
                  cssnanoPlugin({
                    preset: [
                      "default",
                      {
                        discardComments: {
                          removeAll: true, // Remove todos os comentários, incluindo os com `/*!`
                        },
                      },
                    ],
                  }),
                ]).process(source, { from: args.path });

                minified += css;
              });

              build.onEnd(() => {
                const filePath = resolve(cit, "bundle.min.css");

                fs.writeFileSync(filePath, minified);
              });
            },
          },
        ],
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      }),
    esbuild
      .build({
        entryPoints: [resolve(src, "vendor", "**", "*.css")],
        outdir: resolve(cit, "vendor", "css"),
        loader: {
          ".css": "css",
        },
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      }),
  ]);
}

async function compileJson() {
  await esbuild
    .build({
      entryPoints: [resolve(src, "assets", "styles", "**", "*.json")],
      write: false,
      outdir: resolve(src, ".cit"),
      plugins: [
        {
          name: "combine-json",
          setup(build) {
            let combinedJson = {};
            let filesToDelete = [];

            build.onLoad({ filter: /\.json$/ }, (args) => {
              const jsonContent = fs.readFileSync(args.path, "utf8");
              const jsonData = JSON.parse(jsonContent);
              combinedJson = { ...combinedJson, ...jsonData };

              filesToDelete.push(args.path);
            });

            build.onEnd(() => {
              filesToDelete.forEach((filepath) => {
                try {
                  fs.unlinkSync(filepath);
                } catch (err) {
                  console.log(`❗ Erro ao deletar o arquivo ${file}:`, err);
                }
              });

              fs.writeFileSync(
                resolve(cit, "cssModules.json"),
                JSON.stringify(combinedJson, null, 2)
              );
            });
          },
        },
      ],
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
}

async function buildHtml() {
  await esbuild.build({
    entryPoints: [resolve(src, "**", "*.html")],
    outdir: ".build/html",
    write: false,
    loader: {
      ".html": "text",
    },
    plugins: [
      {
        name: "posthtml",
        setup(build) {
          build.onLoad({ filter: /\.html$/ }, async (args) => {
            const filename = args.path.split("\\").slice(-1)[0];
            const folder = args.path.split("\\").slice(-2)[0];
            const source = fs.readFileSync(args.path, "utf8");

            const { html } = await posthtml([
              posthtmlCssModules(resolve(cit, "cssModules.json")),
            ])
              .use(beautify({ rules: { indent: 4, blankLines: false } }))
              .process(source, { from: args.path });

            if (args.path.includes("components")) {
              return fs.writeFileSync(
                resolve(cit, "components", folder, filename),
                html
              );
            }
            if (folder !== "src") {
              fs.mkdirSync(resolve(cit, "html", folder), {
                recursive: true,
              });

              return fs.writeFileSync(
                resolve(cit, "html", folder, filename),
                html
              );
            } else {
              return fs.writeFileSync(resolve(cit, filename), html);
            }
          });
        },
      },
    ],
  });
}

module.exports = async function build(type) {
  fs.mkdirSync(cit, { recursive: true });
  await Promise.all([
    type.includes("js") && buildJs(),
    (type.includes("css") || type.includes("html")) && buildCss(),
  ]);

  if (type.includes("css") || type.includes("html")) await compileJson();
  if (type.includes("html")) await buildHtml();
};
