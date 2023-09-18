#!/usr/bin/env node
const assert = require("node:assert").strict;

const COVERAGE_FILE = "./coveragereport/Summary.json";
const MINIMUM_LINE_COVERAGE_PERCENT = 100;
const MINIMUM_BRANCH_COVERAGE_PERCENT = 100;
const MINIMUM_METHOD_COVERAGE_PERCENT = 100;

console.log(`Checking coverage from ${COVERAGE_FILE}...`);

const coverage = require("./coveragereport/Summary.json");

assert.ok(
  coverage.summary.linecoverage >= MINIMUM_LINE_COVERAGE_PERCENT,
  `Line coverage ${coverage.summary.linecoverage} is less than ${MINIMUM_LINE_COVERAGE_PERCENT}`
);
assert.ok(
  coverage.summary.branchcoverage >= MINIMUM_BRANCH_COVERAGE_PERCENT,
  `Branch coverage ${coverage.summary.branchcoverage} is less than ${MINIMUM_BRANCH_COVERAGE_PERCENT}`
);
assert.ok(
  coverage.summary.methodcoverage >= MINIMUM_METHOD_COVERAGE_PERCENT,
  `Method coverage ${coverage.summary.methodcoverage} is less than ${MINIMUM_METHOD_COVERAGE_PERCENT}`
);

console.log("OK!");
