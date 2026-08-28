#!/usr/bin/env bash
# Cursor stop hook: run lint + test locally (not CI). Emit followup_message on failure.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

input="$(cat || true)"
status="$(
  node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{try{const j=JSON.parse(d||"{}");process.stdout.write(String(j.status||""))}catch{process.stdout.write("")}})' <<<"$input"
)"

if [[ "$status" == "aborted" || "$status" == "error" ]]; then
  printf '%s\n' '{}'
  exit 0
fi

if ! command -v npm >/dev/null 2>&1; then
  node -e 'process.stdout.write(JSON.stringify({followup_message:"Local lint/test hook: npm is not on PATH. Install Node 24 and retry."})+"\n")'
  exit 0
fi

mkdir -p "$ROOT/.tmp"
log="$ROOT/.tmp/lint-test-last.log"
: >"$log"

set +e
npm run lint >"$log" 2>&1
lint_status=$?
if [[ $lint_status -eq 0 ]]; then
  npm test >>"$log" 2>&1
  test_status=$?
else
  test_status=0
fi
set -e

if [[ $lint_status -eq 0 && $test_status -eq 0 ]]; then
  printf '%s\n' '{}'
  exit 0
fi

failed=()
[[ $lint_status -ne 0 ]] && failed+=("npm run lint (exit $lint_status)")
[[ $test_status -ne 0 ]] && failed+=("npm test (exit $test_status)")

FAILED_JSON="$(printf '%s\n' "${failed[@]}" | node -e 'const fs=require("node:fs"); const lines=fs.readFileSync(0,"utf8").split(/\n/).filter(Boolean); process.stdout.write(JSON.stringify(lines))')"
node -e '
const fs = require("node:fs");
const failed = JSON.parse(process.argv[1]);
const logPath = process.argv[2];
let out = "";
try { out = fs.readFileSync(logPath, "utf8"); } catch {}
const max = 6000;
if (out.length > max) out = out.slice(0, max) + "\n…(truncated)";
const msg = [
  "Local lint/test checks failed. Fix these, then continue:",
  ...failed.map((f) => `- ${f}`),
  "",
  "```",
  out.trimEnd() || "(no output)",
  "```",
].join("\n");
process.stdout.write(JSON.stringify({ followup_message: msg }) + "\n");
' "$FAILED_JSON" "$log"

exit 0
