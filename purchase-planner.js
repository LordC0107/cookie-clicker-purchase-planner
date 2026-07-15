(function () {
  'use strict';

  const MOD_ID = 'purchasePlanner';
  const MOD_NAME = 'Purchase Planner';
  const PANEL_ID = 'purchase-planner-panel';
  const BUTTON_ID = 'purchase-planner-button';
  const STYLE_ID = 'purchase-planner-style';

  function gameReady() {
    return typeof Game !== 'undefined' && Game.ObjectsById && Game.UpgradesInStore;
  }

  function localName(value) {
    if (typeof loc === 'function') return loc(value);
    return value;
  }

  function priceOf(item) {
    if (item && typeof item.getPrice === 'function') return item.getPrice();
    return item && typeof item.basePrice === 'number' ? item.basePrice : 0;
  }

  function beautify(value) {
    if (typeof Game !== 'undefined' && typeof Game.Beautify === 'function') {
      return Game.Beautify(value);
    }
    return Math.round(value).toLocaleString();
  }

  function formatMinutes(minutes) {
    if (!Number.isFinite(minutes)) return 'never';
    if (minutes < 60) return `${minutes.toFixed(2)} min`;
    const hours = minutes / 60;
    if (hours < 48) return `${hours.toFixed(2)} hr`;
    return `${(hours / 24).toFixed(2)} days`;
  }

  function simulateBuilding(building) {
    const oldAmount = building.amount;
    const oldCps = Game.cookiesPs;

    building.amount += 1;
    Game.CalculateGains();

    const delta = Game.cookiesPs - oldCps;

    building.amount = oldAmount;
    Game.CalculateGains();

    return delta;
  }

  function simulateUpgrade(upgrade) {
    const oldBought = upgrade.bought;
    const oldCps = Game.cookiesPs;

    upgrade.bought = 1;
    Game.CalculateGains();

    const delta = Game.cookiesPs - oldCps;

    upgrade.bought = oldBought;
    Game.CalculateGains();

    return delta;
  }

  function getPurchasePlan() {
    const rows = [];
    const currentCps = Math.max(Game.cookiesPs, 0);

    Game.ObjectsById.forEach((building) => {
      const delta = simulateBuilding(building);
      const cost = priceOf(building);

      if (delta > 0) {
        const wait = currentCps > 0 ? Math.max(cost - Game.cookies, 0) / currentCps / 60 : Infinity;
        const payback = cost / delta / 60;

        rows.push({
          type: 'Building',
          name: localName(building.name),
          owned: building.amount,
          cost,
          cpsGain: delta,
          effectiveMinutes: wait + payback,
          waitMinutes: wait,
          paybackMinutes: payback,
        });
      }
    });

    Game.UpgradesInStore.forEach((upgrade) => {
      const delta = simulateUpgrade(upgrade);
      const cost = priceOf(upgrade);

      if (delta > 0) {
        const wait = currentCps > 0 ? Math.max(cost - Game.cookies, 0) / currentCps / 60 : Infinity;
        const payback = cost / delta / 60;

        rows.push({
          type: 'Upgrade',
          name: localName(upgrade.dname || upgrade.name),
          owned: '-',
          cost,
          cpsGain: delta,
          effectiveMinutes: wait + payback,
          waitMinutes: wait,
          paybackMinutes: payback,
        });
      }
    });

    return rows.sort((a, b) => a.effectiveMinutes - b.effectiveMinutes);
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        position: fixed;
        left: 50%;
        top: 63px;
        transform: translateX(-50%);
        z-index: 1000000;
        border: 1px solid rgba(238, 204, 128, 0.78);
        background: rgba(31, 22, 14, 0.92);
        color: #f8df9f;
        font: 700 12px Georgia, "Times New Roman", serif;
        letter-spacing: 0;
        min-width: 168px;
        padding: 7px 14px;
        box-shadow: 0 2px 0 #000, inset 0 0 18px rgba(255, 205, 92, 0.12);
        cursor: pointer;
      }

      #${BUTTON_ID}:hover {
        background: rgba(58, 39, 21, 0.96);
        color: #fff3c9;
      }

      #${PANEL_ID} {
        position: fixed;
        left: 50%;
        top: 112px;
        transform: translateX(-50%);
        width: min(720px, calc(100vw - 48px));
        max-height: min(620px, calc(100vh - 136px));
        z-index: 1000000;
        display: none;
        overflow: hidden;
        border: 1px solid rgba(238, 204, 128, 0.8);
        background: rgba(24, 17, 12, 0.97);
        color: #f5e2bd;
        box-shadow: 0 12px 34px rgba(0, 0, 0, 0.55), inset 0 0 22px rgba(255, 204, 92, 0.08);
        font: 12px Verdana, Geneva, sans-serif;
      }

      .purchase-planner-open #${PANEL_ID} {
        display: block;
      }

      .purchase-planner-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(238, 204, 128, 0.28);
        background: rgba(64, 42, 21, 0.7);
      }

      .purchase-planner-title {
        margin: 0;
        color: #ffe7aa;
        font: 700 15px Georgia, "Times New Roman", serif;
      }

      .purchase-planner-actions {
        display: flex;
        gap: 6px;
      }

      .purchase-planner-action {
        border: 1px solid rgba(238, 204, 128, 0.58);
        background: rgba(33, 23, 15, 0.98);
        color: #f8df9f;
        padding: 5px 8px;
        cursor: pointer;
      }

      .purchase-planner-action:hover {
        color: #fff;
        background: rgba(83, 54, 25, 0.98);
      }

      .purchase-planner-body {
        max-height: calc(min(620px, 100vh - 136px) - 43px);
        overflow: auto;
      }

      .purchase-planner-table {
        width: 100%;
        border-collapse: collapse;
      }

      .purchase-planner-table th,
      .purchase-planner-table td {
        padding: 7px 8px;
        border-bottom: 1px solid rgba(238, 204, 128, 0.13);
        text-align: right;
        white-space: nowrap;
      }

      .purchase-planner-table th {
        position: sticky;
        top: 0;
        background: #2c1e12;
        color: #ffe7aa;
        font-weight: 700;
      }

      .purchase-planner-table th:nth-child(2),
      .purchase-planner-table td:nth-child(2) {
        text-align: right;
        white-space: nowrap;
      }

      .purchase-planner-table th:first-child,
      .purchase-planner-table td:first-child {
        text-align: left;
        white-space: normal;
      }

      .purchase-planner-table tr:first-child td {
        background: rgba(109, 72, 29, 0.35);
        color: #fff1c7;
      }

      .purchase-planner-empty {
        padding: 18px 12px;
        color: #dac39a;
      }
    `;
    document.head.appendChild(style);
  }

  function renderTable(rows) {
    const body = document.querySelector(`#${PANEL_ID} .purchase-planner-body`);
    if (!body) return;

    if (!rows.length) {
      body.innerHTML = '<div class="purchase-planner-empty">No positive CPS purchases are available right now.</div>';
      return;
    }

    body.innerHTML = `
      <table class="purchase-planner-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owned</th>
            <th>Wait</th>
            <th>Efficient</th>
            <th>Payback</th>
            <th>CPS gain</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${row.name}</td>
              <td>${row.owned}</td>
              <td>${formatMinutes(row.waitMinutes)}</td>
              <td>${formatMinutes(row.effectiveMinutes)}</td>
              <td>${formatMinutes(row.paybackMinutes)}</td>
              <td>${beautify(row.cpsGain)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function refreshPlanner() {
    if (!gameReady()) return;
    const rows = getPurchasePlan();

    console.table(rows.map((row) => ({
      name: row.name,
      owned: row.owned,
      wait: formatMinutes(row.waitMinutes),
      efficient: formatMinutes(row.effectiveMinutes),
      payback: formatMinutes(row.paybackMinutes),
      cpsGain: row.cpsGain,
    })));

    renderTable(rows);
  }

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="purchase-planner-header">
        <h3 class="purchase-planner-title">${MOD_NAME}</h3>
        <div class="purchase-planner-actions">
          <button class="purchase-planner-action" type="button" data-action="refresh">Refresh</button>
          <button class="purchase-planner-action" type="button" data-action="close">Close</button>
        </div>
      </div>
      <div class="purchase-planner-body"></div>
    `;
    document.body.appendChild(panel);

    panel.addEventListener('click', (event) => {
      const action = event.target && event.target.getAttribute('data-action');
      if (action === 'refresh') refreshPlanner();
      if (action === 'close') document.body.classList.remove('purchase-planner-open');
    });
  }

  function createButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.textContent = MOD_NAME;
    button.addEventListener('click', () => {
      document.body.classList.toggle('purchase-planner-open');
      refreshPlanner();
    });

    document.body.appendChild(button);
  }

  function init() {
    injectStyles();
    createPanel();
    createButton();
    refreshPlanner();

    window.PurchasePlanner = {
      refresh: refreshPlanner,
      getPlan: getPurchasePlan,
    };

    if (Game && typeof Game.Notify === 'function') {
      Game.Notify(MOD_NAME, 'Purchase efficiency planner is ready.', [10, 6]);
    }
  }

  const mod = {
    init,
    save() {
      return '';
    },
    load() {},
  };

  if (gameReady() && typeof Game.registerMod === 'function') {
    Game.registerMod(MOD_ID, mod);
  } else {
    const timer = setInterval(() => {
      if (!gameReady() || typeof Game.registerMod !== 'function') return;
      clearInterval(timer);
      Game.registerMod(MOD_ID, mod);
    }, 1000);
  }
}());
