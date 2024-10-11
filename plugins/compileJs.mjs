import fs from "fs";
import { resolve } from "path";

const citJsPlugin = () => ({
  name: "cit-js",
  setup(build) {
    build.onStart(() => console.log("🟠 Compilando arquivos JS..."));

    build.onEnd((result) => {
      for (const { path, contents } of result.outputFiles) {
        const filename = path.split("\\").slice(-1)[0];
        const folder = path.split("\\").slice(-2)[0];

        if (["cit-smart-frame.js"].includes(filename)) continue;
        else if (!path.includes("components"))
          fs.writeFileSync(`.build/js/${filename}`, contents);
        else {
          fs.mkdirSync(resolve(".build", "components"), { recursive: true });
          fs.writeFileSync(
            resolve(
              ".build",
              "components",
              folder === "components" ? "" : folder,
              filename
            ),
            contents
          );
        }
      }
    });
  },
});

export default citJsPlugin;
