import { readFile } from "fs";

const cache = new Map();

function consistentReadAsync(filename, callback) {
  if (cache.get(filename)) {
    process.nextTick(() => callback(cache.get(filename)));
  } else {
    readFile(filename, "utf8", (err, data) => {
      cache.set(filename, data);
      callback(data);
    });
  }
}

function createFileReader(filename) {
  const listeners = [];

  consistentReadAsync(filename, (result) => {
    listeners.forEach((listener) => listener(result));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

const reader1 = createFileReader("data.sample.txt");
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  const reader2 = createFileReader("data.sample.txt");
  reader2.onDataReady((data) => {
    console.log(`Second call data: ${data}`);
  });
});
