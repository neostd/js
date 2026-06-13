import { stderr } from "../../src/streams.ts";

stderr.writeSync(new TextEncoder().encode("writeSync\n"));
await stderr.write(new TextEncoder().encode("write\n"));
