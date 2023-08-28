#!/usr/bin/env bash
set -euxo pipefail

PORT=5000

# Start the server
npm start &
sleep 2

# Wait for the server to start
npx wait-on http://localhost:$PORT

# Run the tests
npm test

# Stop the server
npm run stop

# Generate code coverage report
npm run coverage-report
