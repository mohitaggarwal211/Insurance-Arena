// ══════════════════════════════════════
// INSURANCE ARENA — APP LOGIC
// ══════════════════════════════════════

// ── STATE ──
let currentFilter  = "all";
let currentSearch  = "";
let currentSort    = "default";
let currentView    = "card"; // "card" | "table"
let filteredPlans  = [...PLANS];

// ── DOM REFS ──
const cardsGrid    = document.getElementById("cardsGrid");
const tableWrap    = document.getElementById("tableWrap");
const tableBody    = document.getElementById("compareTableBody");
const noResults    = document.getElementById("noResults");
const resultsMeta  = document.getElementById("resultsCount");
const searchInput  = document.getElementById("searchInput");
const sortSelect   = document.getElementById("sortSelect");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const modalClose   = document.getElementById("modalClose");
const cardViewBtn  = document.getElementById("cardViewBtn");
const tableViewBtn = document.getElementById("tableViewBtn");

// ── HELPERS ──
function csrClass(csr) {
  if (csr >= 99)   return "high";
  if (csr >= 98)   return "mid";
  return "low";
}

function csrBarWidth(csr) {
  // Scale: 97% = 0%, 100% = 100%
  const min = 97, max = 100;
  return Math.max(0, Math.min(100, ((csr - min) / (max - min)) * 100));
}

function sanitize(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ── FILTER + SORT ──
function applyFiltersAndSort() {
  let result = [...PLANS];

  // Search
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    result = result.filter(p =>
      p.company.toLowerCase().includes(q) ||
      p.companyShort.toLowerCase().includes(q) ||
      p.plan.toLowerCase().includes(q) ||
      p.salesPitch.toLowerCase().includes(q) ||
      p.keyFeatures.some(f => f.toLowerCase().includes(q)) ||
      p.tags.some(t => t.label.toLowerCase().includes(q))
    );
  }

  // Feature filter
  if (currentFilter !== "all") {
    const field = FILTER_MAP[currentFilter];
    if (field) result = result.filter(p => p[field] === true);
  }

  // Sort
  if (currentSort === "csr-high") result.sort((a, b) => b.csr - a.csr);
  else if (currentSort === "csr-low") result.sort((a, b) => a.csr - b.csr);
  else if (currentSort === "name") result.sort((a, b) => a.company.localeCompare(b.company));
  else result.sort((a, b) => a.id - b.id);

  filteredPlans = result;
  render();
}

// ── RENDER ──
function render() {
  const count = filteredPlans.length;
  resultsMeta.textContent = `Showing ${count} plan${count !== 1 ? "s" : ""}`;

  if (count === 0) {
    cardsGrid.innerHTML = "";
    tableBody.innerHTML = "";
    noResults.classList.remove("hidden");
    cardsGrid.classList.add("hidden");
    tableWrap.classList.add("hidden");
    return;
  }

  noResults.classList.add("hidden");

  if (currentView === "card") {
    cardsGrid.classList.remove("hidden");
    tableWrap.classList.add("hidden");
    renderCards();
  } else {
    cardsGrid.classList.add("hidden");
    tableWrap.classList.remove("hidden");
    renderTable();
  }
}

// ── RENDER CARDS ──
function renderCards() {
  cardsGrid.innerHTML = filteredPlans.map((p, i) => {
    const cls  = csrClass(p.csr);
    const barW = csrBarWidth(p.csr);
    const csrDisplay = p.csrPending
      ? `<span class="csr-value mid">Pending</span>`
      : `<span class="csr-value ${cls}">${p.csr}%</span>`;

    const tagsHtml = p.tags.map(t =>
      `<span class="feat-tag ${t.type}">${sanitize(t.label)}</span>`
    ).join("");

    const statsHtml = p.keyStats.map(s =>
      `<div class="card-stat">
        <span class="card-stat-val">${sanitize(s.val)}</span>
        <span class="card-stat-lbl">${sanitize(s.lbl)}</span>
      </div>`
    ).join("");

    return `
    <div class="plan-card" data-id="${p.id}" role="article" tabindex="0" aria-label="${p.company} ${p.plan}">
      <div class="card-header">
        <div class="card-company-info">
          <div class="card-company">${sanitize(p.companyShort)}</div>
          <div class="card-plan">${sanitize(p.plan)}</div>
        </div>
        <div class="card-rank">${i + 1}</div>
      </div>

      <div class="csr-section">
        <div class="csr-header">
          <span class="csr-label">Claim Settlement Ratio FY 2024–25</span>
          ${csrDisplay}
        </div>
        <div class="csr-bar-track">
          <div class="csr-bar-fill ${p.csrPending ? "mid" : cls}" style="width:${p.csrPending ? 60 : barW}%"></div>
        </div>
        <div class="csr-sub">${p.csrPending ? "⚠️ Fetch from IRDAI Annual Report 2024-25" : "Source: IRDAI Annual Report FY 2024–25"}</div>
      </div>

      <div class="card-features">${tagsHtml}</div>

      <div class="card-stats">${statsHtml}</div>

      <div class="card-pitch">
        <div class="card-pitch-label">Why this plan?</div>
        <div class="card-pitch-text">${sanitize(p.salesPitch)}</div>
      </div>

      <div class="card-footer">
        <a href="${p.calcUrl}" target="_blank" rel="noopener" class="btn-calc" onclick="event.stopPropagation()">
          🧮 Calculate Premium
        </a>
        <button class="btn-details" onclick="event.stopPropagation(); openModal(${p.id})">
          Full Details
        </button>
      </div>
    </div>`;
  }).join("");

  // Attach card click → modal
  cardsGrid.querySelectorAll(".plan-card").forEach(card => {
    card.addEventListener("click", () => openModal(+card.dataset.id));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openModal(+card.dataset.id);
    });
  });

  // Animate CSR bars after render
  requestAnimationFrame(() => {
    document.querySelectorAll(".csr-bar-fill").forEach(bar => {
      const w = bar.style.width;
      bar.style.width = "0%";
      requestAnimationFrame(() => { bar.style.width = w; });
    });
  });
}

// ── RENDER TABLE ──
function renderTable() {
  tableBody.innerHTML = filteredPlans.map(p => {
    const cls = csrClass(p.csr);
    const yn = (v) => v
      ? `<span class="tbl-yes">✓</span>`
      : `<span class="tbl-no">–</span>`;

    return `
    <tr>
      <td>
        <div class="table-company">${sanitize(p.companyShort)}</div>
        <div class="table-plan">${sanitize(p.plan)}</div>
      </td>
      <td>${sanitize(p.uin)}</td>
      <td class="tbl-csr ${cls}">${p.csrPending ? "⚠️ Pending" : p.csr + "%"}</td>
      <td>${yn(p.wholeLife)}</td>
      <td>${yn(p.terminalIllness)}</td>
      <td>${yn(p.criticalIllness)}</td>
      <td>${yn(p.returnOfPremium)}</td>
      <td>${yn(p.jointLife)}</td>
      <td>${yn(p.wopDisability)}</td>
      <td>${sanitize(p.maxMaturity)}</td>
      <td>${yn(!!p.womenDiscount && !p.womenDiscount.includes("No"))}</td>
      <td>
        <a href="${p.calcUrl}" target="_blank" rel="noopener" class="tbl-calc-link">Calculate →</a>
      </td>
    </tr>`;
  }).join("");
}

// ── MODAL ──
function openModal(id) {
  const p = PLANS.find(x => x.id === id);
  if (!p) return;

  const cls = csrClass(p.csr);
  const barW = csrBarWidth(p.csr);

  const featRows = [
    ["Whole Life Option",       p.wholeLife],
    ["Terminal Illness",        p.terminalIllness],
    ["Accidental Death Benefit",p.accidentalDeath],
    ["Critical Illness Cover",  p.criticalIllness],
    ["WOP on Disability",       p.wopDisability],
    ["Return of Premium",       p.returnOfPremium],
    ["Joint Life Cover",        p.jointLife],
    ["Premium Break",           p.premiumBreak],
    ["Smart Exit / SEV",        p.smartExit],
    ["Spouse Cover",            p.spouseCover],
    ["Life Stage SA Increase",  p.lifeStage],
  ].map(([label, val]) =>
    `<span class="modal-feat ${val ? "yes" : "no"}">${val ? "✓" : "✗"} ${label}</span>`
  ).join("");

  const featuresList = p.keyFeatures.map(f =>
    `<li>${sanitize(f)}</li>`
  ).join("");

  modalContent.innerHTML = `
    <div class="modal-company">${sanitize(p.company)}</div>
    <div class="modal-plan">${sanitize(p.plan)}</div>
    <div class="modal-uin">UIN: ${sanitize(p.uin)} · Updated: ${sanitize(p.lastUpdated)}</div>

    <!-- CSR -->
    <div class="modal-csr-section">
      <div class="csr-header">
        <span class="csr-label">Claim Settlement Ratio FY 2024–25</span>
        <span class="csr-value ${p.csrPending ? "mid" : cls}">
          ${p.csrPending ? "⚠️ Pending" : p.csr + "%"}
        </span>
      </div>
      <div class="csr-bar-track">
        <div class="csr-bar-fill ${p.csrPending ? "mid" : cls}" style="width:${p.csrPending ? 60 : barW}%"></div>
      </div>
      <div class="csr-sub">${p.csrPending ? "Fetch from IRDAI Annual Report 2024-25" : "Source: IRDAI Annual Report FY 2024-25"}</div>
    </div>

    <!-- Plan Details -->
    <div class="modal-section">
      <div class="modal-section-title">Plan Details</div>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Entry Age</div>
          <div class="modal-field-val">${sanitize(p.entryAge)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Max Maturity Age</div>
          <div class="modal-field-val">${sanitize(p.maxMaturity)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Sum Assured</div>
          <div class="modal-field-val">${sanitize(p.minSA)} – ${sanitize(p.maxSA)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Premium Pay Options</div>
          <div class="modal-field-val">${sanitize(p.premiumPay)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Limited Pay Terms</div>
          <div class="modal-field-val">${sanitize(p.limitedPayTerms)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Premium Modes</div>
          <div class="modal-field-val">${sanitize(p.premiumModes)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Death Benefit Payout</div>
          <div class="modal-field-val">${sanitize(p.deathBenefit)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Discounts</div>
          <div class="modal-field-val">Women: ${sanitize(p.womenDiscount)}<br/>Salaried: ${sanitize(p.salariedDiscount)}</div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="modal-section">
      <div class="modal-section-title">Features at a Glance</div>
      <div class="modal-features-list">${featRows}</div>
    </div>

    <!-- Key Features -->
    <div class="modal-section">
      <div class="modal-section-title">Key Features & Highlights</div>
      <ul class="modal-bullets">${featuresList}</ul>
    </div>

    <!-- Sales Pitch -->
    <div class="modal-section">
      <div class="modal-section-title">Why Recommend This Plan?</div>
      <div class="modal-pitch-box">${sanitize(p.salesPitch)}</div>
    </div>

    <!-- Actions -->
    <div class="modal-actions">
      <a href="${p.calcUrl}" target="_blank" rel="noopener" class="modal-btn-primary">
        🧮 Calculate My Premium →
      </a>
      <a href="${p.brochureUrl}" target="_blank" rel="noopener" class="modal-btn-secondary">
        📄 View Brochure
      </a>
    </div>
  `;

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // Animate CSR bar
  requestAnimationFrame(() => {
    const bar = modalContent.querySelector(".csr-bar-fill");
    if (bar) {
      const w = bar.style.width;
      bar.style.width = "0%";
      requestAnimationFrame(() => { bar.style.width = w; });
    }
  });
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ── EVENT LISTENERS ──

// Search
searchInput.addEventListener("input", e => {
  currentSearch = e.target.value;
  applyFiltersAndSort();
});

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFiltersAndSort();
  });
});

// Sort
sortSelect.addEventListener("change", e => {
  currentSort = e.target.value;
  applyFiltersAndSort();
});

// View toggle
cardViewBtn.addEventListener("click", () => {
  currentView = "card";
  cardViewBtn.classList.add("active");
  tableViewBtn.classList.remove("active");
  render();
});
tableViewBtn.addEventListener("click", () => {
  currentView = "table";
  tableViewBtn.classList.add("active");
  cardViewBtn.classList.remove("active");
  render();
});

// Modal close
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// Sticky controls shadow on scroll
window.addEventListener("scroll", () => {
  const bar = document.getElementById("controlsBar");
  if (window.scrollY > 80) {
    bar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
  } else {
    bar.style.boxShadow = "none";
  }
});

// ── GLOBAL RESET ──
function resetFilters() {
  currentFilter = "all";
  currentSearch = "";
  currentSort   = "default";
  searchInput.value = "";
  sortSelect.value  = "default";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-filter="all"]').classList.add("active");
  applyFiltersAndSort();
}

// ── INIT ──
applyFiltersAndSort();
