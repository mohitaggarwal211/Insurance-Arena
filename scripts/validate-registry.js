// ══════════════════════════════════════════════════════════════
// REGISTRY SCHEMA VALIDATOR — run before EVERY upload
// Usage: node scripts/validate-registry.js
// Loads all data files, builds the registry, and reports every
// entry missing a universal field used by the A vs B comparison
// table. If this prints gaps, fix them BEFORE uploading.
// ══════════════════════════════════════════════════════════════
const vm = require('vm'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const ctx = {
  document: { addEventListener: () => {}, readyState: 'complete', getElementById: () => null, querySelectorAll: () => [] },
  window: {}, console, setTimeout, clearTimeout,
  localStorage: { getItem: () => null, setItem: () => {} }
};
vm.createContext(ctx);

['js/data.js','js/annuity-data.js','js/anmol-data.js','js/nishchit-data.js',
 'js/savings-income-data.js','js/ulip-data.js','js/product-meta.js']
  .forEach(f => vm.runInContext(
    fs.readFileSync(path.join(ROOT, f), 'utf8')
      .replace(/const /g, 'var ')
      .replace(/let PRODUCT_REGISTRY/g, 'var PRODUCT_REGISTRY'), ctx));
vm.runInContext('function getMeta(id){return {};} function san(s){return String(s||"");}', ctx);

const reg = ctx.buildProductRegistry();

// The universal fields the on-screen A vs B table reads for EVERY plan.
// If a field can't apply to a category, the registry block must still map
// it to an honest value (e.g. 'Not applicable for ULIPs') — never leave undefined.
const UNIVERSAL_FIELDS = ['company','plan','category','catKey','type','entryAge',
  'maturityAge','ppt','pt','deathBenefit','riders','bestFor','uniqueAdvantage'];

let gaps = 0;
const report = {};
reg.forEach(p => {
  UNIVERSAL_FIELDS.forEach(f => {
    const v = p[f];
    if (v === undefined || v === null || v === '' || v === '—') {
      gaps++;
      const key = p.category + ' | ' + p.company + ' — ' + p.plan;
      (report[key] = report[key] || []).push(f);
    }
  });
});

console.log('═'.repeat(60));
console.log('REGISTRY VALIDATION — ' + reg.length + ' entries checked');
console.log('═'.repeat(60));
if (gaps === 0) {
  console.log('✅ ALL CLEAR — every entry has all universal fields.');
} else {
  console.log('❌ ' + gaps + ' field gaps found. Fix before upload:\n');
  Object.entries(report).forEach(([plan, fields]) => {
    console.log('  ' + plan);
    console.log('    missing: ' + fields.join(', '));
  });
  process.exitCode = 1;
}
