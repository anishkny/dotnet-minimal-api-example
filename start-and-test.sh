#!/usr/bin/env bash
set -euxo pipefail

PORT=5000
TIMEOUT=60000   # in milliseconds

npm run build
npm start &
npx wait-on --timeout $TIMEOUT http://localhost:$PORT
npm test
npm run stop
npm run coverage-report
npm run check-coverage
