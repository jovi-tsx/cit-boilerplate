import fs from "fs";
import posthtml from "posthtml";
import beautify from "posthtml-beautify";

const rmSmartFramePlugin = () => ({
  name: "rm-smart-frame",
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      let layoutHtml = fs.readFileSync(args.path, "utf8");

      const { html } = await posthtml()
        .use((tree) => {
          // Remove tags <cit-smart-frame> e mantém o conteúdo interno
          tree.walk((node) => {
            if (node.tag === "cit-smart-frame") {
              return node.content; // Retorna o conteúdo da tag, removendo-a
            }
            return node; // Retorna o nó sem alteração
          });
        })
        .use(beautify({ rules: { indent: 4 } }))
        .process(layoutHtml);

      fs.writeFileSync(args.path, html);
    });
  },
});

export default rmSmartFramePlugin;
