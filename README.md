# D-Clutter

D-Clutter is a Manifest V3 browser extension that turns noisy pages into a focused reading layout.

## What it does

- Removes common clutter blocks (ads, sidebars, popups, banners, cookie prompts).
- Re-centers main content into a clean long-form reading column.
- Detects autoplay videos, pauses and hides them, then exposes them through a dropdown drawer so you can open them only when you want.
- Supports **Auto**, **Light**, and **Dark** themes.

## Project structure

- `manifest.json` – extension configuration.
- `src/content.js` – clutter removal, reader mode layout, and autoplay video handling.
- `src/content.css` – reader typography, spacing, and theming styles.
- `popup/` – popup UI for enable/disable + theme selection.

## Install locally (Chrome / Edge)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder (`D-Clutter`).

## Use

1. Open any article page.
2. Click the D-Clutter extension icon.
3. Toggle clutter-free mode and theme.
4. Reload the tab to apply new settings.

## Notes

- Clutter removal is heuristic-based and may hide useful elements on some websites.
- You can disable D-Clutter from the popup on those pages.

## Test when you only have GitHub access

- Download the repo zip from **Code → Download ZIP**.
- Unzip it and load as unpacked extension from `chrome://extensions` (Developer mode on).
- You can also verify automated checks in the **Actions** tab (`Validate Extension` workflow).
- For a full checklist, see `TESTING.md`.

