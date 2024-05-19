import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils.js";

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(filename, contents, cb);
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`);
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

export function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }
  const links = getPageLinks(currentUrl, body);

  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return cb(err);
    }

    if (++completed === links.length && !hasErrors) {
      return cb();
    }
  }

  links.forEach((link) => spider(link, nesting - 1, done));
}

const spidering = new Set();

export default function spider(url, nesting, cb) {
  // Prevent any race condition
  if (spidering.has(url)) {
    return process.nextTick(cb);
  }

  spidering.add(url);

  const filename = urlToFilename(url);

  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }
        spiderLinks(filename, requestContent, nesting, cb);
      });
    }
    spiderLinks(filename, fileContent, nesting, cb);
  });
}
