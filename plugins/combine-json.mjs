import fs from "fs";

const combineJsonPlugin = (outputFileName) => ({
  name: "combine-json",
  setup(build) {
    let combinedJson = {};

    build.onLoad({ filter: /\.json$/ }, async (args) => {
      const jsonContent = fs.readFileSync(args.path, "utf8");
      const jsonData = JSON.parse(jsonContent);
      const filename = args.path.split("\\").slice(-1)[0];
      combinedJson = { ...combinedJson, ...jsonData };

      fs.unlink(args.path, (err) => {
        if (err)
          console.log(`❗ Não foi possível deletar o arquivo ${filename}`);
      });

      return {
        contents: jsonContent,
        loader: "json",
      };
    });

    build.onEnd(() => {
      fs.writeFileSync(outputFileName, JSON.stringify(combinedJson, null, 2));
    });
  },
});

export default combineJsonPlugin;
