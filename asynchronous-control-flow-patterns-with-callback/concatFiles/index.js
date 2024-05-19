import fs from "fs";

function concatFiles(...args) {
  const dest = args[args.length - 2];
  const cb = args[args.length - 1];
  const srcFiles = args.slice(0, -2);

  let content = "";

  function readFile(index) {
    if (index === srcFiles.length) {
      fs.writeFile(dest, content, (err) => {
        if (err) {
          return cb(err);
        }
        cb(null);
      });
      return;
    }
    fs.readFile(srcFiles[index], "utf-8", (err, data) => {
      if (err) {
        return cb(err);
      }

      content += data;
      readFile(index + 1);
    });
  }

  readFile(0);
}

concatFiles(
  "./src-1.txt",
  "./src-2.txt",
  "./src-3.txt",
  "./dest.txt",
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File concatenation complete!");
    }
  }
);
