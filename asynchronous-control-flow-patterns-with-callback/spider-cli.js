// import { spider } from "./spider.js";
import { spider } from "./spider-2.js";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3]) || 1;

spider(url, nesting, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Download complete");
});
