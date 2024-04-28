import fs from "fs";
import path from "path";
import superagent from "superagent";
import { mkdirp } from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils.js";

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    // The file already exists
    spiderLinks(url, fileContent, nesting, cb);
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
      cb(null, res.text);
    });
  });
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);

  if (links.length === 0) {
    return process.nextTick(cb);
  }

  function iterate(index) {
    if (index === links.length) {
      return cb();
    }

    spider(links[index], nesting - 1, function (err) {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }

  iterate(0);
}
