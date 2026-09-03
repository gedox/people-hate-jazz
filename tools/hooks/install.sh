#!/bin/sh
# Install this repo's git hooks. Run once per clone:  sh tools/hooks/install.sh
set -e
root="$(git rev-parse --show-toplevel)"
cp "$root/tools/hooks/pre-push" "$root/.git/hooks/pre-push"
chmod +x "$root/.git/hooks/pre-push"
echo "Installed pre-push hook: direct pushes to main are now blocked."
