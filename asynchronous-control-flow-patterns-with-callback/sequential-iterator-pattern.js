// Sequential Iterator Pattern

function task1(cb) {
  setTimeout(() => {
    console.log("task 1");
    cb();
  }, 3000);
}

function task2(cb) {
  setTimeout(() => {
    console.log("task 2");
    cb();
  }, 2000);
}

function task3(cb) {
  setTimeout(() => {
    console.log("task 3");
    cb();
  }, 1000);
}

function finish() {
  console.log("All tasks are finished");
}

const tasks = [task1, task2, task3];

function executeTasks(tasks) {
  function iterate(index) {
    if (index === tasks.length) {
      return finish();
    }

    const task = tasks[index];

    task(() => iterate(index + 1));
  }

  return iterate(0);
}

executeTasks(tasks);
