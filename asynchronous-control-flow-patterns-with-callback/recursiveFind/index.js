import fs from "fs";
import path from "path";

function recursiveFind(dir, keyword, cb) {
  let results = [];
  let pending = 0;

  function searchInDirectory(directory) {
    pending += 1;

    fs.readdir(directory, (err, items) => {
      if (err) {
        if (--pending === 0) {
          cb(results);
        }
        return;
      }

      items.forEach((item) => {
        const fullPath = path.join(directory, item);
        pending += 1;

        fs.stat(fullPath, (err, stat) => {
          if (err) {
            if (--pending === 0) {
              cb(results);
            }
            return;
          }

          if (stat.isFile() && path.extname(fullPath) === ".txt") {
            pending += 1;
            fs.readFile(fullPath, "utf-8", (err, content) => {
              if (err) {
                if (--pending === 0) {
                  cb(results);
                }
                return;
              }

              if (content.includes(keyword)) {
                results.push(fullPath);
              }

              if (--pending === 0) {
                cb(results);
              }
            });
          } else if (stat.isDirectory()) {
            searchInDirectory(fullPath);
          }

          if (--pending === 0) {
            cb(results);
          }
        });
      });

      if (--pending === 0) {
        cb(results);
      }
    });
  }

  searchInDirectory(dir);
}

recursiveFind("./target", "pattern", console.log);
