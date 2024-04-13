import fs, { readFileSync } from "fs";
import { syncBuiltinESMExports } from "module";

fs.readFileSync = () => Buffer.from("Hello, world!");
syncBuiltinESMExports();

console.log(fs.readFileSync === readFileSync); // true
