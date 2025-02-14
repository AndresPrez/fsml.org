import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import helperFn from "../src/helperFn.ts";

Deno.test("url test", () => {
  const res = helperFn("world");
  assertEquals(res, "hello world");
  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");
});
