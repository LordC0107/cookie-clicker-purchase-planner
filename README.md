# Cookie Clicker Purchase Planner

Purchase Planner is a lightweight third-party Cookie Clicker mod for comparing the next building or upgrade to buy.

It ranks available purchases by estimated efficiency:

```text
efficient time = wait time + payback time
```

The shorter the efficient time, the sooner that purchase is expected to become worthwhile through its direct CPS gain.

## Features

- Compares buildings and upgrades currently available in the store.
- Estimates the CPS gain from buying one item.
- Calculates wait time, efficient time, payback time, and CPS gain.
- Sorts results from best to worst efficient time.
- Shows an in-game table from a centered `Purchase Planner` button near the news ticker.
- Also prints the same result to the browser console with `console.table`.

## Usage

Open Cookie Clicker, then load the mod with:

```javascript
Game.LoadMod('https://lordc0107.github.io/cookie-clicker-purchase-planner/purchase-planner.js');
```

After the mod loads, click the `Purchase Planner` button near the top center of the game screen.

Use the full `https://` URL. If the protocol is omitted, some Cookie Clicker mirror sites may treat the path as a local site path and try to load it from their own domain instead.

The table columns are:

- `Name`: building or upgrade name
- `Owned`: current building count, or `-` for upgrades
- `Wait`: time needed to afford the purchase
- `Efficient`: wait time plus payback time
- `Payback`: time needed for the CPS gain to earn back the purchase cost
- `CPS gain`: estimated direct CPS increase

## Console Commands

Refresh the planner and print the table:

```javascript
window.PurchasePlanner.refresh()
```

Get the raw sorted purchase list:

```javascript
window.PurchasePlanner.getPlan()
```

## Notes

- Purchase Planner estimates direct CPS value only.
- Purchases with achievement, minigame, combo, golden-cookie, or long-term strategic value may be underrated.
- Save your game before testing any third-party mod.
- This is an unofficial fan-made helper and is not affiliated with Cookie Clicker or Orteil.

## License

MIT
