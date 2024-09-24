import fs from "fs";
import posthtml from "posthtml";
import beautify from "posthtml-beautify";

const publishHtmlPlugin = () => ({
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

            if (node.tag === "style" && node.content) {
              // Faz o replace em todo o conteúdo da tag <style>
              node.content = node.content.map((content) => {
                return content.replace(/tw-/g, "");
              });
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

export default publishHtmlPlugin;
