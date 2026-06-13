import { stdin, stdout } from "../../src/streams.ts";

for await (const chunk of stdin) {
  await stdout.write(chunk);
}
