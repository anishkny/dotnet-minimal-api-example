// Check code coverage meets threshold
const fs = require("fs");
const xpath = require("xpath");
const dom = require("@xmldom/xmldom").DOMParser;
const assert = require("node:assert").strict;

const COVERAGE_FILENAME = "coverage.xml";
const PACKAGE_NAME = "dotnet-minimal-api";
const MINIMUM_LINE_COVERAGE = 1;
const MINIMUM_BRANCH_COVERAGE = 1;

// Load Coverage XML file
const xml = fs.readFileSync(COVERAGE_FILENAME, "utf8");

// Search using XPath, and convert to object
// XML:
//    <package line-rate="0.9848484848484849" branch-rate="0.9444444444444444" complexity="40" name="dotnet-minimal-api">
const doc = new dom().parseFromString(xml);
const nodes = xpath.select(`//package[@name="${PACKAGE_NAME}"]/@*`, doc);
const hash = {};
for (const node of nodes) {
  hash[node.nodeName] = node.nodeValue;
}
console.log(hash);
const packageName = hash["name"];
assert.equal(packageName, PACKAGE_NAME);

// Check coverage
const lineCoverage = parseFloat(hash["line-rate"]);
const branchCoverage = parseFloat(hash["branch-rate"]);
assert.ok(
  lineCoverage >= MINIMUM_LINE_COVERAGE,
  `Line coverage ${lineCoverage} is less than ${MINIMUM_LINE_COVERAGE}`
);
assert.ok(
  branchCoverage >= MINIMUM_BRANCH_COVERAGE,
  `Branch coverage ${branchCoverage} is less than ${MINIMUM_BRANCH_COVERAGE}`
);
console.log("OK");
