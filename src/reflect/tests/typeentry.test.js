import { test, describe } from "node:test";
import { strictEqual } from "node:assert";
import { StructInfo } from "../core/index.js";
import { MethodEntry, TypeEntry } from "../resources/index.js";

describe("Testing `TypeEntry` method registry", () => {
  test("`TypeEntry` can set and get methods", () => {
    /**
     * @param {number} a
     * @param {number} b
     */
    function add(a, b) {
      return a + b;
    }

    const entry = new TypeEntry(StructInfo.default());
    entry.setMethod(add);

    const method = entry.getMethod("add");
    strictEqual(method instanceof MethodEntry, true);
    strictEqual(method?.call([2, 3]), 5);
  });

  test("`TypeEntry` can call methods by name", () => {
    /**
     * @param {number} a
     * @param {number} b
     */
    function multiply(a, b) {
      return a * b;
    }

    const entry = new TypeEntry(StructInfo.default());
    entry.setMethod(multiply);

    strictEqual(entry.call("multiply", [4, 5]), 20);
  });

  test("`TypeEntry` returns undefined for missing methods", () => {
    const entry = new TypeEntry(StructInfo.default());

    strictEqual(entry.call("missing", [1]), undefined);
    strictEqual(entry.getMethod("missing"), undefined);
  });
});
