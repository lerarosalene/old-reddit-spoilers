set -ex

npm ci
UPDATE_URL="https://github.com/lerarosalene/old-reddit-spoilers/releases/latest/download/old-reddit-spoilers.user.js" npm run build

VERSION=$(cat package.json | jq .version -r)
gh release create "v${VERSION}" dist/old-reddit-spoilers.user.js -F "changelogs/${VERSION}.md"
