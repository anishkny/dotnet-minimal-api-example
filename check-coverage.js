#!/usr/bin/env node

// Check code coverage meets threshold
const fs = require("fs");
const xpath = require("xpath");
const dom = require("@xmldom/xmldom").DOMParser;
const assert = require("node:assert").strict;

const COVERAGE_FILENAME = "coverage.xml";
const FILENAME_FILTER = `${process.cwd()}/src/`;
const MINIMUM_LINE_COVERAGE = 1;
const MINIMUM_BRANCH_COVERAGE = 1;

console.log(
  `Checking coverage meets ${MINIMUM_LINE_COVERAGE} line and ${MINIMUM_BRANCH_COVERAGE} branch coverage for files in ${FILENAME_FILTER}`
);

// Load Coverage XML file
const xml = fs.readFileSync(COVERAGE_FILENAME, "utf8");

// Search using XPath, and convert to object
// XML:
//    <class line-rate="1" branch-rate="1" complexity="16" name="Program" filename="/work/dotnet-minimal-api-example/src/Program.cs">
const doc = new dom().parseFromString(xml);
const nodes = xpath.select(
  `//class[contains(@filename, "${FILENAME_FILTER}")]`,
  doc
);

// Assert that at least one node was found
console.log(`Found ${nodes.length} nodes`);
assert.ok(nodes.length > 0, `No nodes found for ${FILENAME_FILTER}`);

// For each node, assert that line-rate and branch-rate are 1
for (const node of nodes) {
  const filename = node.getAttribute("filename").replace(FILENAME_FILTER, "");
  const lineRate = parseFloat(node.getAttribute("line-rate"));
  const branchRate = parseFloat(node.getAttribute("branch-rate"));
  assert.ok(
    lineRate >= MINIMUM_LINE_COVERAGE,
    `Line coverage ${lineRate} is less than ${MINIMUM_LINE_COVERAGE} for filename: ${filename}`
  );
  assert.ok(
    branchRate >= MINIMUM_BRANCH_COVERAGE,
    `Branch coverage ${branchRate} is less than ${MINIMUM_BRANCH_COVERAGE}, for filename: ${filename}`
  );
}
console.log("OK");
