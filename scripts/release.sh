#!/bin/bash

set -e

[ -z "$VERSION" ] && echo "You have to set a VERSION to run this script." && exit 1;

# bump version to $VERSION
sed -e "s/\"version\":\s\".*\"/\"version\": \"$VERSION\"/" -i package.json
sed -e "s/\"version\":\s\".*\"/\"version\": \"$VERSION\"/" -i src-tauri/tauri.conf.json
sed -e "s/\"version\":\s\".*\"/\"version\": \"$VERSION\"/" -i browser_extension/chrome/manifest.json
sed -e "s/\"version\":\s\".*\"/\"version\": \"$VERSION\"/" -i browser_extension/edge/manifest.json
sed -e "s/\"version\":\s\".*\"/\"version\": \"$VERSION\"/" -i browser_extension/firefox/manifest.json

# commit new version
git add package.json
git add src-tauri/tauri.conf.json
git add -f browser_extension/chrome/manifest.json
git add -f browser_extension/edge/manifest.json
git add -f browser_extension/firefox/manifest.json
git commit -am "bumps version to $VERSION"

git push

git checkout master
git merge develop -m "automatic merge to finish v$VERSION"

git push

git tag -a "v$VERSION"
git push --tags

git checkout develop
