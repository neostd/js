import { kill } from "../../src/kill.ts";

if (!kill(process.pid, 0)) {
  process.exit(1);
}
