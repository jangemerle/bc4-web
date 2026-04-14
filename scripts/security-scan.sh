#!/bin/bash
# Security scan script — run before commits or on-demand
# Checks for: leaked secrets, dependency vulnerabilities, security lint issues

set -e

BOLD="\033[1m"
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

echo -e "${BOLD}🔒 Kvalt Security Scan${RESET}\n"

# 1. Secret scanning with gitleaks
echo -e "${BOLD}[1/3] Scanning for leaked secrets...${RESET}"
if command -v gitleaks &> /dev/null; then
  if gitleaks detect --source . --no-git -c .gitleaks.toml --redact 2>&1; then
    echo -e "${GREEN}  ✓ No secrets found${RESET}"
  else
    echo -e "${RED}  ✗ Secrets detected! Fix before committing.${RESET}"
    exit 1
  fi
else
  echo -e "${YELLOW}  ⚠ gitleaks not installed — skipping secret scan${RESET}"
  echo "  Install: https://github.com/gitleaks/gitleaks#installing"
fi

# 2. Dependency audit
echo -e "\n${BOLD}[2/3] Auditing npm dependencies...${RESET}"
AUDIT_RESULT=$(npm audit 2>&1) || true
if echo "$AUDIT_RESULT" | grep -q "found 0 vulnerabilities"; then
  echo -e "${GREEN}  ✓ No known vulnerabilities${RESET}"
else
  echo -e "${YELLOW}  ⚠ Vulnerabilities found:${RESET}"
  echo "$AUDIT_RESULT"
fi

# 3. ESLint security rules
echo -e "\n${BOLD}[3/3] Running security lint rules...${RESET}"
if npx eslint --no-warn-ignored "src/**/*.{ts,tsx}" 2>&1; then
  echo -e "${GREEN}  ✓ No security lint issues${RESET}"
else
  echo -e "${YELLOW}  ⚠ Lint issues found (see above)${RESET}"
fi

echo -e "\n${GREEN}${BOLD}Security scan complete.${RESET}"
