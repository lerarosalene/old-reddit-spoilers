### Reddit Old Spoilers Fix

Replaces old reddit spoilers in new interface with modern-looking ones.

This userscript currently support spoilers of forms:
- `<a href="#spoiler_anchor_name" title="spoiler_content">spoiler_description</a>`
- `<a href="#spoiler_anchor_name spoiler_content">spoiler_description</a>`

Task is split in batches of 20 potential spoilers to prevent UI freezes.

### Installation

Follow this link: [old-reddit-spoilers.user.js](https://github.com/lerarosalene/old-reddit-spoilers/releases/latest/download/old-reddit-spoilers.user.js) for latest release.  
Your userscript manager should automatically pick up this link and offer installation. Didn't happen? Install one!
- Tampermonkey (Chrome): [link](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Tampermonkey (Firefox): [link](https://addons.mozilla.org/firefox/addon/tampermonkey/)

### Build it yourself

1. `npm ci`
2. `npm run build`
3. Grab your copy from `dist/old-reddit-spoilers.user.js`
