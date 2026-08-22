#!/usr/bin/env node
/** Stop a running Sandustry process. Used by VS Code preLaunchTask. */
import { sandustryStopRunning } from "../lib/sandustry-common.js";

sandustryStopRunning();
