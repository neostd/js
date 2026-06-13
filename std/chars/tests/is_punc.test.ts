import { test } from "node:test";
import assert from "node:assert/strict";
import { isPunc, isPuncAt } from "../src/is-punc.ts";

test("chars::isPunc", (): void => {
  assert.ok(isPunc(33)); // !
  assert.ok(isPunc(34)); // "
  assert.ok(isPunc(35)); // #
  assert.ok(!isPunc(36)); // $
  assert.ok(isPunc(37)); // %
  assert.ok(isPunc(38)); // &
  assert.ok(isPunc(39)); // '
  assert.ok(isPunc(40)); // (
  assert.ok(isPunc(41)); // )
  assert.ok(isPunc(42)); // *
  assert.ok(!isPunc(43)); // +
  assert.ok(isPunc(44)); // ,
  assert.ok(isPunc(45)); // -
  assert.ok(isPunc(46)); // .
  assert.ok(isPunc(47)); // /
  assert.ok(isPunc(58)); // :
  assert.ok(isPunc(59)); // ;
  assert.ok(!isPunc(60)); // <
  assert.ok(!isPunc(61)); // =
  assert.ok(!isPunc(62)); // >
  assert.ok(isPunc(63)); // ?
  assert.ok(isPunc(64)); // @
  assert.ok(isPunc(91)); // [
  assert.ok(isPunc(92)); // \
  assert.ok(isPunc(93)); // ]
  assert.ok(!isPunc(94)); // ^
  assert.ok(isPunc(95)); // _
  assert.ok(!isPunc(96)); // `
  assert.ok(isPunc(123)); // {
  assert.ok(!isPunc(124)); // |
  assert.ok(isPunc(125)); // }
  assert.ok(!isPunc(126)); // ~
  assert.ok(!isPunc(0));
  assert.ok(!isPunc(127));
  assert.ok(!isPunc(128));
  assert.ok(!isPunc(255));
  assert.ok(!isPunc(256));
  assert.ok(!isPunc(-1));
  assert.ok(!isPunc(-128));
  assert.ok(!isPunc(-255));
  assert.ok(!isPunc(-256));
  assert.ok(!isPunc(Infinity));
  assert.ok(!isPunc(-Infinity));
  assert.ok(!isPunc(NaN));
  assert.ok(!isPunc(0.1));
  assert.ok(!isPunc(-0.1));
  assert.ok(!isPunc(0.9));
  assert.ok(!isPunc(-0.9));
  assert.ok(!isPunc(1.1));
  assert.ok(!isPunc(-1.1));
});

test("chars::isPuncAt", (): void => {
  const str = "Holy 💩!?";
  assert.ok(!isPuncAt(str, 0));
  assert.ok(!isPuncAt(str, 1));
  assert.ok(!isPuncAt(str, 2));
  assert.ok(!isPuncAt(str, 3));
  assert.ok(!isPuncAt(str, 4));
  assert.ok(!isPuncAt(str, 5));
  assert.ok(!isPuncAt(str, 6));
  assert.ok(isPuncAt(str, 7));
  assert.ok(isPuncAt(str, 8));
});
