import { stdin, stdout } from "../../src/streams.ts";

const buffer = new Uint8Array(1024);

while (true) {
  const bytesRead = await stdin.read(buffer);
  if (bytesRead === null) {
    break;
  }

  if (bytesRead > 0) {
    await stdout.write(buffer.subarray(0, bytesRead));
  }
}
