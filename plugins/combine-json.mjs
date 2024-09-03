import fs from "fs";

const combineJsonPlugin = (outputFileName) => ({
  name: "combine-json",
  setup(build) {
    let combinedJson = {};

    build.onLoad({ filter: /\.json$/ }, async (args) => {
      const jsonContent = fs.readFileSync(args.path, "utf8");
      const jsonData = JSON.parse(jsonContent);
      combinedJson = { ...combinedJson, ...jsonData };

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
