import fs from "fs";
import posthtml from "posthtml";
import posthtmlCssModules from "posthtml-css-modules";

const posthtmlPlugin = () => ({
  name: "posthtml",
  setup(build) {
    build.onStart(() => console.log("🟠 Compilando páginas e formulários..."));

    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const filename = args.path.split("\\").slice(-1)[0];

      const source = fs.readFileSync(args.path, "utf8");

      const { html } = await posthtml([
        posthtmlCssModules(".build/cssModules.json"),
      ]).process(source, { from: args.path });

      if (["_document.html", "cit-smart-frame.html"].includes(filename)) return;
      else return fs.writeFileSync(`.build/html/${filename}`, html);
    });

    build.onEnd((result) =>
      console.log(
        `${result.errors.length ? "⚠️" : "✅"} Arquivos HTML compilados com ${
          result.errors.length
        } erros.`
      )
    );
  },
});

export default posthtmlPlugin;
