import fs from "fs";
import * as esbuild from "esbuild";
import postcssNested from "postcss-nested";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";

await esbuild
  .build({
    entryPoints: ["./view/assets/styles/**/*.css"],
    outdir: ".build/css",
    bundle: true,
    plugins: [
      {
        name: "postcss",
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const source = fs.readFileSync(args.path, "utf8");

            const { css } = await postcss([
              postcssNested,
              tailwindcss,
              postcssPresetEnv({
                autoprefixer: {},
              }),
            ]).process(source, { from: args.path });

            return {
              contents: css,
              loader: "css",
            };
          });
        },
      },
    ],
  })
  .catch(() => process.exit(1));
