#!/usr/bin/env node
import { buildModsForIntegration } from "./build-mods.js";
import { runNodeTests } from "./run.js";

const argv = process.argv.slice(2);
const visible = argv.includes("--view");
const buildArgv = argv.filter((arg) => arg !== "--view");
const { gameIds } = await buildModsForIntegration(buildArgv);
process.exit(await runNodeTests({ integration: true, modIds: gameIds, visible }));
