function task1(cb) {
  setTimeout(() => {
    console.log("task 1");
    cb();
  }, 1000);
}
function task2(cb) {
  setTimeout(() => {
    console.log("task 2");
    cb();
  }, 700);
}
function task3(cb) {
  setTimeout(() => {
    console.log("task 3");
    cb();
  }, 100);
}
function task4(cb) {
  setTimeout(() => {
    console.log("task 4");
    cb();
  }, 5000);
}
function task5(cb) {
  setTimeout(() => {
    console.log("task 5");
    cb();
  }, 1000);
}

const tasks = [task1, task2, task3, task4, task5];

const concurrency = 2;
let running = 0;
let completed = 0;
let index = 0;

function next() {
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++];

    task(() => {
      if (++completed === tasks.length) {
        return finish();
      }
      running -= 1;
      next();
    });

    running += 1;
  }
}

next();

function finish() {
  console.log("All tasks completed");
}
