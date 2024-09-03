import fs from "fs";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import postcssModules from "postcss-modules";
import postcssPresetEnv from "postcss-preset-env";

const postcssPlugin = () => ({
  name: "postcss",
  setup(build) {
    build.onStart(() => console.log("🟠 Compilando arquivos CSS..."));

    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const source = fs.readFileSync(args.path, "utf8");
      const filename = args.path.split("\\").slice(-1)[0];

      if (filename.startsWith("tw-")) return;

      const { css } = await postcss([
        postcssNested,
        tailwindcss,
        postcssPresetEnv({
          autoprefixer: {},
        }),
        postcssModules({
          globalModulePaths: [/globals\.css/],
        }),
      ]).process(source, { from: args.path });

      return {
        contents: css,
        loader: "css",
      };
    });

    build.onEnd((result) => {
      for (const file of result.outputFiles) {
        const filename = file.path.split("\\").slice(-1)[0];

        if (filename.startsWith("tw-")) return;
        else {
          fs.writeFileSync(`.build/css/${filename}`, file.contents);
        }
      }

      console.log(
        `${result.errors.length ? "⚠️" : "✅"} Arquivos CSS compilados com ${
          result.errors.length
        } erros.`
      );
    });
  },
});

export default postcssPlugin;
