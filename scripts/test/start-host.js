import { startSandustryTestHost, stopSandustryTestHost } from "../../modkit/test/host.ts";

const visible = process.argv.includes("visible");
const result = await startSandustryTestHost({ persist: true, visible });
if (!result.ok) {
  console.log(`Sandustry test host skipped: ${result.reason}`);
  process.exit(visible ? 1 : 0);
}
console.log(
  result.reused
    ? "Sandustry test host already running"
    : visible
      ? "Sandustry test host started (visible window, isolated user data, CDP :9223)"
      : "Sandustry test host started (no window, isolated user data, CDP :9223)",
);

await new Promise((resolve) => {
  process.once("SIGTERM", resolve);
  process.once("SIGINT", resolve);
});
await stopSandustryTestHost();
