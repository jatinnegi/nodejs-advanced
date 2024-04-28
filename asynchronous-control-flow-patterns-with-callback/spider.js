import fs from "fs";
import path from "path";
import superagent from "superagent";
import { mkdirp } from "mkdirp";
import { urlToFilename } from "./utils.js";

export function spider(url, cb) {
  const filename = urlToFilename(url);

  fs.access(filename, (err) => {
    if (!err || err.code !== "ENOENT") {
      return cb(null, filename, false);
    }
    download(url, filename, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
}

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename))
    .then((_) => {
      fs.writeFile(filename, contents, cb);
    })
    .catch((err) => {
      return cb(err);
    });
}

function download(url, filename, cb) {
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }
    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.txt);
    });
  });
}
