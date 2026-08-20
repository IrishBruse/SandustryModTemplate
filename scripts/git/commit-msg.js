#!/usr/bin/env node
/**
 * commit-msg — fail unless the subject uses a conventional type prefix.
 * Git passes the path to the message file as argv[2].
 */
import { readFileSync } from "node:fs";

const TYPES = [
  "feat",
  "fix",
  "docs",
  "chore",
  "refactor",
  "style",
  "test",
  "build",
  "ci",
  "perf",
  "revert",
];

const SUBJECT =
  /^(feat|fix|docs|chore|refactor|style|test|build|ci|perf|revert)(\([a-z0-9._/-]+\))?!?: .+/;

const file = process.argv[2];
if (!file) {
  console.error("commit-msg: missing message file path");
  process.exit(1);
}

const subject =
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((line) => line.trim() !== "" && !line.startsWith("#"))
    ?.trim() ?? "";

if (subject.startsWith("Merge ")) process.exit(0);

if (!SUBJECT.test(subject)) {
  console.error(`Commit subject must start with a conventional type:

  ${TYPES.map((type) => `${type}: description`).join("\n  ")}

Example: feat: add noise-test overlay

Got: ${subject === "" ? "(empty)" : JSON.stringify(subject)}
`);
  process.exit(1);
}
