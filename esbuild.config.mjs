import fs from "fs";
import * as esbuild from "esbuild";
import postcssNested from "postcss-nested";
import postcssModules from "postcss-modules";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";

import "dotenv/config";

await esbuild
  .build({
    entryPoints: ["./view/assets/styles/**/*.css"],
    outdir: ".build/css",
    bundle: true,
    plugins: [
      {
        name: "postcss",
        setup(build) {
          build.onStart(() => console.log("Compilando arquivos CSS..."));

          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const filename = args.path.split("\\").slice(-1)[0];

            if (filename.startsWith("tw-")) {
              return { contents: "", loader: "css" };
            }

            const source = fs.readFileSync(args.path, "utf8");

            const { css } = await postcss([
              postcssNested,
              tailwindcss,
              postcssPresetEnv({
                autoprefixer: {},
              }),
              postcssModules({
                getJSON: () => {},
                globalModulePaths: [/globals\.css/],
              }),
            ]).process(source, { from: args.path });

            return {
              contents: css,
              loader: "css",
            };
          });

          build.onEnd((result) =>
            console.log(
              `Arquivos CSS compilados com ${result.errors.length} erros.`
            )
          );
        },
      },
    ],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
