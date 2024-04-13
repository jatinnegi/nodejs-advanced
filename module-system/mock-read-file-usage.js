import fs from "fs";
import { mockEnable, mockDisable } from "./mock-read-file.js";

mockEnable(Buffer.from("Hello, world!"));

fs.readFile("fake-path", (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data.toString());
});

mockDisable();
