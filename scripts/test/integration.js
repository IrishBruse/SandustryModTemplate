#!/usr/bin/env node
import { buildModsForIntegration } from "./build-mods.js";
import { runNodeTests } from "./run.js";

buildModsForIntegration();
process.exit(await runNodeTests({ integration: true }));
