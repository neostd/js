# @neostd/ansi

## Overview

ANSI color detection, styles, and terminal settings.

## Usage

```ts
import { apply, blue, bold, green } from "@neostd/ansi";

console.log(blue("test"));
console.log(green("success"));
console.log(apply("This is a test", bold, blue));
```
