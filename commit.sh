#!/usr/bin/env bash

git status
git add .
git commit -m "docs: $(date +%Y-%m-%d)"
git push origin main
