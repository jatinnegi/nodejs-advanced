import { EventEmitter } from "events";

function ticker(milliseconds, callback) {
  const emitter = new EventEmitter();
  let ticks = 0;

  function tick() {
    ticks += 1;
    emitter.emit("tick");

    if (new Date().getTime() % 5 === 0) {
      const err = new Error("Invalid timestamp");
      callback(err);
      emitter.emit("err", err);
      return;
    }

    if (50 * ticks < milliseconds) {
      setTimeout(tick, 50);
    } else {
      callback(null, ticks);
    }
  }

  tick();
  process.nextTick(() => emitter.emit("tick", "[After] tick()"));

  return emitter;
}

ticker(1000, (err, ticks) => {
  if (err) {
    // console.error(err);
  } else {
    console.log(`Number of ticks = ${ticks}`);
  }
})
  .on("tick", (data) => {
    if (data) {
      console.log(data);
    } else {
      console.log("tick...");
    }
  })
  .on("err", (err) => console.error(err));
