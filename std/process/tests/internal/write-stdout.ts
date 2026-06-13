import { stdout } from "../../src/streams.ts";

stdout.writeSync(new TextEncoder().encode("writeSync\n"));
await stdout.write(new TextEncoder().encode("write\n"));
