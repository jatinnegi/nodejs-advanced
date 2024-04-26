import { EventEmitter } from "events";
import { readFile } from "fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    for (const file of this.files) {
      process.nextTick(() => this.emit("start", file));
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("err", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);

        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }

    return this;
  }
}

const findRegexInstance = new FindRegex(/hello \w+/);
findRegexInstance
  .addFile("data.sample.txt")
  .addFile("data-2.sample.txt")
  .find()
  .on("start", (file) => console.log(`Reading from file "${file}"...`))
  .on("found", (file, match) =>
    console.log(`Matched "${match}" in file ${file}`)
  )
  .on("err", (err) => {
    console.error(err);
  });
