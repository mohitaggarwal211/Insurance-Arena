// INSURANCE ARENA — Extra Calculators
// Lazy loaded when Financial Tools tab is opened
// IRR · TVM · EMI · ULIP

// ── IRR CALCULATOR ──
function _calcIRR() {
  const premium  = getVal('irr-premium');
  const ppt      = getVal('irr-ppt');
  const term     = getVal('irr-term');
  const maturity = getVal('irr-maturity');
  if (!premium || !ppt || !term || !maturity || ppt > term) {
    showCalcError('irr-result','Please fill all fields. Premium paying term must be ≤ policy term.');
    return;
  }
  // Cash flows: year 0 = first premium (negative), years 1..ppt = premium outflows, year term = maturity inflow
  const cf = [];
  for (let y = 0; y <= term; y++) {
    if (y < ppt) cf.push(-premium);
    else if (y === term) cf.push(maturity);
    else cf.push(0);
  }
  // Bisection method to find IRR
  function npv(r) { return cf.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0); }
  let lo = -0.99, hi = 5.0;
  const npvLo = npv(lo), npvHi = npv(hi);
  if (npvLo * npvHi > 0) { showCalcError('irr-result','No valid IRR found for these inputs. Check maturity value.'); return; }
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (Math.abs(hi - lo) < 0.000001) break;
    if (npv(lo) * npv(mid) < 0) hi = mid; else lo = mid;
  }
  const irr = ((lo + hi) / 2) * 100;
  const totalPremium = premium * ppt;
  const totalGain    = maturity - totalPremium;
  showCalcResult('irr-result',
    irr.toFixed(2) + '% p.a.',
    'Approximate Internal Rate of Return',
    [
      ['Total Premium Paid', fmtCr(totalPremium)],
      ['Maturity / Death Benefit', fmtCr(maturity)],
      ['Total Gain', fmtCr(totalGain)],
      ['Premium Paying Term', ppt + ' years'],
      ['Policy Term', term + ' years'],
      ['Approx IRR', irr.toFixed(2) + '% p.a. (indicative only)'],
    ]
  );
}

// ── TVM CALCULATOR ──
let tvmMode = 'fv';
function _setTvmMode(mode, btn) {
  tvmMode = mode;
  document.querySelectorAll('.tvm-mode').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const label = document.getElementById('tvm-amount-label');
  if (label) label.textContent = mode === 'fv' ? 'Present Value (₹)' : 'Future Value (₹)';
  document.getElementById('tvm-result').classList.add('hidden');
}

function _calcTVM() {
  const amount = getVal('tvm-amount');
  const rate   = getVal('tvm-rate') / 100;
  const years  = getVal('tvm-years');
  const n      = getVal('tvm-compound'); // compounding frequency
  if (!amount || !rate || !years) { showCalcError('tvm-result', 'Please fill all fields.'); return; }
  const effectiveRate = rate / n;
  const periods = years * n;
  if (tvmMode === 'fv') {
    const fv = amount * Math.pow(1 + effectiveRate, periods);
    const gain = fv - amount;
    const compoundLabel = n === 1 ? 'Annual' : n === 2 ? 'Half-Yearly' : n === 4 ? 'Quarterly' : 'Monthly';
    showCalcResult('tvm-result',
      fmtCr(Math.round(fv)),
      'Future Value of your money',
      [
        ['Present Value (Today)', fmtCr(amount)],
        ['Future Value', fmtCr(Math.round(fv))],
        ['Total Growth', fmtCr(Math.round(gain))],
        ['Growth Multiple', (fv/amount).toFixed(2) + '×'],
        ['Formula', `FV = PV × (1 + r/n)^(n×t)`],
        ['Compounding', `${compoundLabel} (${n}× per year)`],
      ]
    );
  } else {
    const pv = amount / Math.pow(1 + effectiveRate, periods);
    showCalcResult('tvm-result',
      fmtCr(Math.round(pv)),
      'Present Value (what future money is worth today)',
      [
        ['Future Value', fmtCr(amount)],
        ['Present Value (Today)', fmtCr(Math.round(pv))],
        ['Discount', fmtCr(Math.round(amount - pv))],
        ['Formula', `PV = FV / (1 + r/n)^(n×t)`],
        ['Time Period', years + ' years'],
        ['Discount Rate', (rate*100).toFixed(2) + '% p.a.'],
      ]
    );
  }
}

// ── EMI CALCULATOR ──
function _calcEMI() {
  const P = getVal('emi-loan');
  const r = getVal('emi-rate') / 100 / 12; // monthly rate
  const n = getVal('emi-tenure') * 12;      // total months
  if (!P || !r || !n) { showCalcError('emi-result', 'Please fill all fields.'); return; }
  const emi  = P * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
  const total = emi * n;
  const interest = total - P;
  showCalcResult('emi-result',
    fmtCr(Math.round(emi)),
    'Monthly EMI',
    [
      ['Loan Amount', fmtCr(P)],
      ['Total Interest', fmtCr(Math.round(interest))],
      ['Total Repayment', fmtCr(Math.round(total))],
      ['Loan Tenure', (n/12) + ' years (' + n + ' months)'],
    ]
  );
  // Year-wise amortization (lightweight — max 40 rows)
  const years = Math.min(n / 12, 40);
  let balance = P, rows = '';
  for (let y = 1; y <= years; y++) {
    let yearPrincipal = 0, yearInterest = 0;
    for (let m = 1; m <= 12 && (y-1)*12+m <= n; m++) {
      const intPart = balance * r;
      const prinPart = emi - intPart;
      yearInterest  += intPart;
      yearPrincipal += prinPart;
      balance -= prinPart;
    }
    rows += `<tr>
      <td>Year ${y}</td>
      <td>${fmtCr(Math.round(yearPrincipal))}</td>
      <td>${fmtCr(Math.round(yearInterest))}</td>
      <td>${balance > 0 ? fmtCr(Math.round(balance)) : '—'}</td>
    </tr>`;
  }
  const amortEl = document.getElementById('emi-amort');
  amortEl.classList.remove('hidden');
  amortEl.innerHTML = `
    <div class="amort-title">Year-wise Amortization</div>
    <div style="overflow-x:auto">
      <table class="amort-table">
        <thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── ULIP CALCULATOR ──
function _calcULIP() {
  const premium    = getVal('ulip-premium');
  const term       = getVal('ulip-term');
  const retRate    = getVal('ulip-return') / 100;
  const equity     = getVal('ulip-equity') / 100;
  const fmc        = getVal('ulip-fmc') / 100;
  const fixedCharge= getVal('ulip-charges'); // annual admin + mortality
  if (!premium || !term || !retRate) { showCalcError('ulip-result', 'Please fill all fields.'); return; }
  // Blend return rate (equity portion gets market return, debt portion gets conservative 6%)
  const debtRate    = 0.06;
  const blendedRate = equity * retRate + (1 - equity) * debtRate;
  const netRate     = blendedRate - fmc; // deduct FMC
  let fundValue = 0;
  const totalPremium = premium * term;
  for (let y = 1; y <= term; y++) {
    const investable = premium - (fixedCharge || 0);
    fundValue = (fundValue + investable) * (1 + netRate);
  }
  const gain = fundValue - totalPremium;
  showCalcResult('ulip-result',
    fmtCr(Math.round(fundValue)),
    'Estimated Fund Value at Maturity',
    [
      ['Total Premium Paid', fmtCr(totalPremium)],
      ['Estimated Fund Value', fmtCr(Math.round(fundValue))],
      ['Estimated Gain', fmtCr(Math.round(gain))],
      ['Effective Net Return', (netRate*100).toFixed(2) + '% p.a. (after FMC)'],
      ['Blended Return', (blendedRate*100).toFixed(2) + '% p.a. (before FMC)'],
      ['FMC Deducted', (fmc*100).toFixed(2) + '% per year'],
    ]
  );
}