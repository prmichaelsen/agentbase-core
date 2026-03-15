#!/bin/bash
# Post-test success banner — reads from coverage output

CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
MAGENTA='\033[35m'
WHITE='\033[37m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

VERSION=$(node -p "require('./package.json').version")
OPS=$(grep -c 'operationId:' openapi.yaml 2>/dev/null || echo "0")

# Parse coverage summary if available
COV_FILE="coverage/coverage-summary.json"
if [ -f "$COV_FILE" ]; then
  STMTS=$(node -p "JSON.parse(require('fs').readFileSync('$COV_FILE','utf8')).total.statements.pct")
  BRANCHES=$(node -p "JSON.parse(require('fs').readFileSync('$COV_FILE','utf8')).total.branches.pct")
  FUNCS=$(node -p "JSON.parse(require('fs').readFileSync('$COV_FILE','utf8')).total.functions.pct")
  COV_LINE="${STMTS}% stmts ${DIM}|${NC} ${YELLOW}${BRANCHES}% branch ${DIM}|${NC} ${YELLOW}${FUNCS}% funcs${NC}"
else
  COV_LINE="run ${DIM}npm run test:coverage${NC} for metrics"
fi

# Count test files
TEST_COUNT=$(find src -name '*.test.ts' 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo -e "${CYAN}${BOLD}     ___   ___  ___ _ __ | |_| |__   __ _ ___  ___        ___ ___  _ __ ___${NC}"
echo -e "${CYAN}${BOLD}    / _ \\ / _ \\/ _ \\ '_ \\| __| '_ \\ / _\` / __|/ _ \\_____ / __/ _ \\| '__/ _ \\${NC}"
echo -e "${CYAN}${BOLD}   / ___ \\ (_) \\___/ | | | |_| |_) | (_| \\__ \\  __/_____| (_| (_) | | |  __/${NC}"
echo -e "${CYAN}${BOLD}  /_/   \\_\\__, |\\___|_| |_|\\__|_.__/ \\__,_|___/\\___|      \\___\\___/|_|  \\___|${NC}"
echo -e "${CYAN}${BOLD}          |___/${NC}"
echo ""
echo -e "  ${GREEN}${BOLD}ALL GREEN${NC}  ${DIM}v${VERSION}${NC}  ${DIM}|${NC}  ${YELLOW}${TEST_COUNT} test suites${NC}  ${DIM}|${NC}  ${MAGENTA}${OPS} API ops${NC}"
echo -e "  ${DIM}coverage:${NC}  ${YELLOW}${COV_LINE}"
echo ""
