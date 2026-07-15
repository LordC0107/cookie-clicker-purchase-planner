# Cookie Clicker Purchase Planner

Purchase Planner is a small third-party Cookie Clicker mod that ranks buildings and store upgrades by estimated purchase efficiency.

It answers one practical question: if you buy one available item, how long will it take to wait for it and earn the cost back through the CPS increase?

## Features

- Compares buildings and upgrades currently visible in the store.
- Simulates the CPS gain from buying one item.
- Calculates wait time, payback time, and combined effective time.
- Sorts purchases from shortest to longest effective time.
- Adds an in-game panel and also prints the same plan with `console.table`.
- Exposes `window.PurchasePlanner.getPlan()` for manual inspection.

## Install

1. Download `purchase-planner.js`.
2. Load it as a Cookie Clicker mod through your preferred mod loader or browser userscript setup.
3. Open Cookie Clicker.
4. Click the `Purchase Planner` button near the top-right of the game window.

For quick testing, you can also paste the contents of `purchase-planner.js` into the browser console while Cookie Clicker is open.

If the file is hosted on GitHub, you can load it through a CDN URL such as:

```javascript
Game.LoadMod('https://cdn.jsdelivr.net/gh/YOUR_GITHUB_NAME/cookie-clicker-purchase-planner@main/purchase-planner.js');
```

Replace `YOUR_GITHUB_NAME` with your GitHub username.

## How It Works

For each building, the mod temporarily increases the building amount by one, asks Cookie Clicker to recalculate gains, records the CPS difference, and restores the original amount.

For each upgrade in the store, the mod temporarily marks the upgrade as bought, recalculates gains, records the CPS difference, and restores the original bought state.

The ranking uses:

```text
effective time = wait time + payback time
wait time      = max(cost - current cookies, 0) / current CPS
payback time   = cost / CPS gain
```

## Notes

- This mod only estimates direct CPS changes. Purchases with indirect, strategic, achievement, combo, minigame, or golden-cookie value may be underrated.
- Save your game before testing any mod.
- This is an unofficial fan-made helper and is not affiliated with Cookie Clicker or Orteil.

## Repository Name

Recommended GitHub repository name:

```text
cookie-clicker-purchase-planner
```

## Publish To GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial Purchase Planner mod"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_NAME/cookie-clicker-purchase-planner.git
git push -u origin main
```

This repository is safe to publish because it contains only the mod code and documentation. It does not include Cookie Clicker source code or game assets.

## License

MIT
