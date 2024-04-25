import { readFileSync } from "fs";

const cache = new Map();

function consistentReadSync(filename) {
  if (cache.get(filename)) {
    return cache.get(filename);
  }

  const data = readFileSync(filename, "utf8");
  cache.set(filename, data);
  return data;
}
