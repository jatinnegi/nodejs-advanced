import { readFile } from "fs";
import { EventEmitter } from "events";

function findRegex(files, regex) {
  const emitter = new EventEmitter();

  for (const file of files) {
    readFile(file, "utf-8", (err, content) => {
      if (err) {
        return emitter.emit("err", err);
      }

      emitter.emit("fileread", file);

      const match = content.match(regex);

      if (match) {
        match.forEach((elem) => emitter.emit("found", file, elem));
      }
    });
  }

  return emitter;
}

findRegex(["data.sample.txt", "data-2.sample.txt"], /hello \w+/g)
  .on("fileread", (file) => console.log(`${file} was read`))
  .on("found", (file, match) => console.log(`Matched ${match} in ${file}`))
  .on("err", (err) => console.error(`Error emitted ${err.message}`));
