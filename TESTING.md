# Testing D-Clutter

If you only have the project on GitHub, use one of these options.

## Option A: Test from GitHub (no development setup)

1. Open the repository on GitHub.
2. Click **Code** → **Download ZIP**.
3. Unzip it.
4. Open `chrome://extensions` (or `edge://extensions`).
5. Enable **Developer mode**.
6. Click **Load unpacked** and select the unzipped folder.

## Option B: Verify checks on GitHub Actions

A workflow validates the extension on every push and pull request:

- `node --check src/content.js`
- `node --check popup/popup.js`
- `python -m json.tool manifest.json`

See **Actions** tab → **Validate Extension**.

## Manual behavior checklist

Open a long-form article page and verify:

- Reader layout appears (centered, readable typography).
- Common clutter (header/sidebar/popup/ad containers) is reduced.
- Theme toggle in popup works (Auto/Light/Dark) after reload.
- Autoplay videos are paused/hidden and listed in the bottom-right drawer.
- "Show and play video" restores the selected video.

## Notes

- This extension is heuristic-based and may over-hide content on some websites.
- If that happens, disable D-Clutter from the popup for that page.
