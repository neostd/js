import { stdin, stdout } from "../../src/streams.ts";

const buffer = new Uint8Array(1024);

while (true) {
  const bytesRead = stdin.readSync(buffer);
  if (bytesRead === null) {
    break;
  }

  if (bytesRead > 0) {
    stdout.writeSync(buffer.subarray(0, bytesRead));
  }
}
