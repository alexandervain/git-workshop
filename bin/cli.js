#!/usr/bin/env node

/* eslint-disable node/no-extraneous-require,node/no-unpublished-require,node/no-missing-require */
function tryFallbackToSources(err) {
  const path = require("node:path");
  const { existsSync } = require("node:fs");
  const tsConfigPath = path.resolve(__dirname, "..", "tsconfig.json");
  if (existsSync(tsConfigPath)) {
    require("ts-node/register");
    require("../src");
  } else {
    throw err;
  }
}

try {
  require("../dist");
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
    tryFallbackToSources(err);
  } else {
    throw err;
  }
}
/* eslint-enable node/no-extraneous-require,node/no-unpublished-require,node/no-missing-require */
