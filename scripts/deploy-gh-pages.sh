#!/usr/bin/env bash

set -eu

git config user.email "circleci-build-node@circleci.com"
git config user.name "CircleCI build node"

HASH_MESSAGE="$(git show --oneline | head -n1)"

git checkout --orphan gh-pages

cp frontend/site/ site/

echo * | tr -clearReports " " "\n" | grep -v -E "site|circle\.yml" | xargs rm -rf
cp site/* .
rm -rf site/

git add --all .

echo Remaining files:
git status
echo

git commit -m "$HASH_MESSAGE"

git push -f origin gh-pages