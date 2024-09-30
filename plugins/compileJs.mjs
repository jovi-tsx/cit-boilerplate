import fs from "fs";

const citJsPlugin = () => ({
  name: "cit-js",
  setup(build) {
    build.onStart(() => console.log("🟠 Compilando arquivos JS..."));

    build.onEnd((result) => {
      for (const file of result.outputFiles) {
        const filename = file.path.split("\\").slice(-1)[0];

        if (!["cit-smart-frame.js"].includes(filename))
          fs.writeFileSync(`.build/js/${filename}`, file.contents);
        else if (file.path.includes("components"))
          fs.writeFileSync(`.build/components/${filename}`, file.contents);

        console.log(`✅ ${filename}`);
      }
    });
  },
});

export default citJsPlugin;
