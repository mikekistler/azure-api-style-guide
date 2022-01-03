const { Spectral } = require('@stoplight/spectral-core');
const { migrateRuleset } = require('@stoplight/spectral-ruleset-migrator');
const fs = require('fs');
const path = require('path');

const { fetch } = require('@stoplight/spectral-runtime');
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/dist/loader/node');
const { resolve } = require('path');

const rulesetFile = resolve('./spectral.yaml');

async function linterForRule(rule) {
  const linter = new Spectral();

  const ruleset = await bundleAndLoadRuleset(rulesetFile, { fs, fetch });
  delete ruleset.extends;
  Object.keys(ruleset.rules).forEach((key) => {
    if (key !== rule) {
      delete ruleset.rules[key];
    }
  });
  linter.setRuleset(ruleset);
  return linter;
}

module.exports.linterForRule = linterForRule;
