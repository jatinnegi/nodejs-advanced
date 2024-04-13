import { mockEnable, mockDisable } from "./mock-read-file.js";

mockEnable(Buffer.from("Hello, there!"));
mockDisable();
