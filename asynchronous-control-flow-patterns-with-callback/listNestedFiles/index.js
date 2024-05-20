import fs from "fs";
import path from "path";

function readDirAsync(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      return callback(err);
    }
    callback(
      null,
      files.map((file) => path.join(dir, file))
    );
  });
}

function isDirectoryAsync(filePath, callback) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      return callback(err);
    }
    callback(null, stats.isDirectory());
  });
}

function listNestedFiles(dir, cb) {
  const result = [];

  function exploreDirectory(currentDir, done) {
    readDirAsync(currentDir, (err, files) => {
      if (err) {
        return done(err);
      }

      let pending = files.length;

      if (!pending) {
        return done(null);
      }

      files.forEach((file) => {
        isDirectoryAsync(file, (err, isDir) => {
          if (err) {
            return done(err);
          }

          if (isDir) {
            exploreDirectory(file, (err) => {
              if (err) {
                return done(err);
              }
              if (!--pending) {
                return done(null);
              }
            });
          } else {
            result.push(file);
            if (!--pending) {
              return done(null);
            }
          }
        });
      });
    });
  }

  exploreDirectory(dir, (err) => {
    if (err) {
      return cb(err);
    }
    cb(null, result);
  });
}

listNestedFiles("./target", (err, files) => {
  if (err) {
    console.error(err);
  } else {
    console.log(files);
  }
});
