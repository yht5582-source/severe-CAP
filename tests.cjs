// Tests for the engine and teaching blocks embedded in index.html.
// Run: node tests.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
function block(name) {
  const m = html.match(new RegExp('/\\*' + name + '-START\\*/([\\s\\S]*?)/\\*' + name + '-END\\*/'));
  if (!m) throw new Error(name + ' block not found');
  return m[1];
}
const { sev, pf, regimen, steroid } = new Function(block('ENGINE') + ';return {sev,pf,regimen,steroid};')();
const SCASES = new Function(block('CASES') + ';return SCASES;')();
const SQUIZ = new Function(block('QUIZ') + ';return SQUIZ;')();
const SMAP = new Function(block('MAP') + ';return SMAP;')();

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; console.log('  ✗ ' + name + '\n    ' + e.message); }
}
const bed = (v, c) => ({ v: v || {}, c: c || {}, note: '' });
const rows = B => steroid(B).filter(x => x[2]).map(x => x[0]);
const names = B => regimen(B).out.map(d => d.nm);
const has = (B, s) => regimen(B).out.some(d => d.opts.join(' ').includes(s));

console.log('engine');
t('1 major is severe', () => assert.ok(sev(bed({}, { ma_mv: true })).severe));
t('2 minors not severe, 3 minors severe', () => {
  assert.strictEqual(sev(bed({ rr: '30', bun: '20' })).severe, false);
  assert.strictEqual(sev(bed({ rr: '30', bun: '20', plt: '99999' })).severe, true);
});
t('P/F boundary 250 counts; FiO2 as percent works', () => {
  assert.strictEqual(pf(bed({ pao2: '75', fio2: '30' })), 250);
  assert.strictEqual(sev(bed({ pao2: '75', fio2: '0.3' })).min, 1);
});
t('non-numeric minors use checkboxes', () => assert.strictEqual(sev(bed({}, { mi_multi: true, mi_conf: true })).min, 2));
t('no risk: beta-lactam + macrolide', () => assert.deepStrictEqual(names(bed()), ['β-lactam', '＋ Macrolide']));
t('macrolide contraindicated: fluoroquinolone', () => assert.ok(names(bed({}, { macroci: true })).includes('＋ 呼吸道 fluoroquinolone')));
t('PsA: anti-pseudomonal first, no basic beta-lactam', () => {
  const n = names(bed({}, { psa_prior: true }));
  assert.strictEqual(n[0], '抗綠膿桿菌 β-lactam');
  assert.ok(!n.includes('β-lactam'));
});

console.log('cases');
const expected = {
  c1: { severe: true, maj: 0, min: 3, mrsa: false, psa: false, st: ['SCCM 2024', 'ATS 2025'], drug: 'Ceftriaxone' },
  c2: { severe: false, maj: 0, min: 2, mrsa: true, psa: true, st: [], drug: 'Piperacillin' },
  c3: { severe: true, maj: 1, min: 6, mrsa: false, psa: true, st: ['ATS/IDSA 2019', 'ERS/ESICM 2023', 'SCCM 2024', 'ATS 2025'], drug: 'Piperacillin' },
  c4: { severe: true, maj: 1, min: 3, mrsa: true, psa: false, st: [], drug: 'Oseltamivir' },
  c5: { severe: true, maj: 0, min: 4, mrsa: false, psa: true, st: ['SCCM 2024'], drug: 'Aztreonam' },
  c6: { severe: true, maj: 0, min: 4, mrsa: false, psa: false, st: ['SCCM 2024', 'ATS 2025'], drug: 'Ampicillin-sulbactam' },
};
t('6 cases with unique ids', () => {
  assert.strictEqual(SCASES.length, 6);
  assert.strictEqual(new Set(SCASES.map(c => c.id)).size, 6);
});
SCASES.forEach(c => {
  const e = expected[c.id], B = bed(c.load.v, c.load.c), s = sev(B), r = regimen(B);
  t(c.id + ' engine agrees with the case text', () => {
    assert.strictEqual(s.severe, e.severe);
    assert.strictEqual(s.maj, e.maj);
    assert.strictEqual(s.min, e.min);
    assert.strictEqual(!!r.mrsa, e.mrsa);
    assert.strictEqual(!!r.psa, e.psa);
    assert.deepStrictEqual(rows(B), e.st);
    assert.ok(has(B, e.drug), e.drug);
  });
  t(c.id + ' has steps, traps, source', () => {
    assert.strictEqual(c.steps.length, 5);
    assert.ok(c.trap.length >= 2 && c.src);
  });
});
t('c1 values: P/F 140, ROX 5.75', () => {
  const v = SCASES[0].load.v;
  assert.strictEqual(pf(bed(v)), 140);
  assert.strictEqual(((v.spo2 / v.fio2) / v.rr).toFixed(2), '5.75');
});
t('c2 P/F 280', () => assert.strictEqual(pf(bed(SCASES[1].load.v)), 280));
t('c5 P/F 163', () => assert.strictEqual(Math.round(pf(bed(SCASES[4].load.v))), 163));
t('c6 P/F 72, ROX 3.24 below the 6 h cutoff', () => {
  const v = SCASES[5].load.v, rox = (v.spo2 / v.fio2) / v.rr;
  assert.strictEqual(Math.floor(pf(bed(v))), 72);
  assert.strictEqual(rox.toFixed(2), '3.24');
  assert.ok(rox < 3.47);
});

console.log('quiz');
t('20 questions: 10 basic + 10 advanced', () => {
  assert.strictEqual(SQUIZ.length, 20);
  assert.strictEqual(SQUIZ.filter(q => q.l === 'basic').length, 10);
  assert.strictEqual(SQUIZ.filter(q => q.l === 'adv').length, 10);
});
t('answers spread A–D 5 each', () => {
  [0, 1, 2, 3].forEach(k => assert.strictEqual(SQUIZ.filter(q => q.a === k).length, 5, 'option ' + k));
});
t('each question has 4 distinct options, explanation, source', () => SQUIZ.forEach((q, i) => {
  assert.strictEqual(new Set(q.o).size, 4, 'q' + (i + 1));
  assert.ok(q.a >= 0 && q.a < 4 && q.x && q.src, 'q' + (i + 1));
}));
t('correct option is not usually the longest', () => {
  const longest = SQUIZ.filter(q => q.o[q.a].length === Math.max(...q.o.map(o => o.length))).length;
  assert.ok(longest <= 10, longest + '/20');
});
t('q3 P/F 250 counts', () => assert.strictEqual(sev(bed({ pao2: '75', fio2: '0.3' })).min, 1));
t('q13 tool rows match', () => assert.deepStrictEqual(rows(bed({ rr: '30', bun: '20', plt: '1' })), ['SCCM 2024', 'ATS 2025']));
t('q17 ROX 5.0', () => assert.strictEqual((90 / 0.6) / 30, 5));

console.log('map');
t('map branches all have leaves', () => [...SMAP.dx, ...SMAP.tx].forEach(b => assert.ok(b.t && b.s && b.l.length >= 3, b.t)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
