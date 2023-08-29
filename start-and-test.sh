#!/usr/bin/env bash
set -euxo pipefail

PORT=5000
npm run build
npm start &
npx wait-on http://localhost:$PORT
npm test
npm run stop
npm run coverage-report
