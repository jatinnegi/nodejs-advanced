function addCps(a, b, cb) {
  cb(a + b);
}

console.log("before");
addCps(4, 10, (result) => {
  console.log(`Result => ${result}`);
});
console.log("after");
