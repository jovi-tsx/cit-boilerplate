const path = require("path");
const bs = require("browser-sync").create();
const build = require("./build");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const src = path.join(__dirname, "src");
const cit = path.join(__dirname, ".cit");

build(["css", "js", "html", "static"]).then(() => {
  // .init starts the server
  bs.init({
    server: {
      baseDir: cit,
      index: "_document.html",
    },
  });

  bs.watch(path.join(src, "**", "*.{js,css,html}"), async (event, file) => {
    if (event === "change") {
      if (file.endsWith(".css")) await build(["css"]);
      else if (file.endsWith(".js")) await build(["js"]);
      else if (file.endsWith(".html")) await build(["html"]);

      bs.reload();
    }
  });

  bs.watch(path.join(src, "assets", "**", "*.*"), async (event, file) => {
    if (event === "change")
      if (file.endsWith(".css")) return;
      else await build["static"];
  });
});
