import fs from "fs";
import { resolve } from "path";

const citJsPlugin = () => ({
  name: "cit-js",
  setup(build) {
    build.onStart(() => console.log("🟠 Compilando arquivos JS..."));

    build.onEnd((result) => {
      for (const file of result.outputFiles) {
        const filename = file.path.split("\\").slice(-1)[0];

        if (["cit-smart-frame.js"].includes(filename)) continue;
        else if (!file.path.includes("components"))
          fs.writeFileSync(`.build/js/${filename}`, file.contents);
        else {
          fs.mkdirSync(file.path.replace(filename, ""), { recursive: true });
          fs.writeFileSync(file.path, file.contents);
        }
      }
    });
  },
});

export default citJsPlugin;
