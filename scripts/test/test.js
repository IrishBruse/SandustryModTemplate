#!/usr/bin/env node
import { runNodeTests } from "./run.js";

process.exit(await runNodeTests({ integration: false }));
