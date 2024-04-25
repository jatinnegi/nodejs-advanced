function additionAsync(a, b, callback) {
  setTimeout(() => callback(a + b), 100);
}

console.log("before");
additionAsync(4, 10, (result) => console.log(`Result: ${result}`));
console.log("after");
