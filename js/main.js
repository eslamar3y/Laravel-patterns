// ─── Language System ───────────────────────────────────────────────────────
const LANG_KEY = 'lpat_lang';

function getSavedLang() { return localStorage.getItem(LANG_KEY) || 'en'; }
function saveLang(lang) { localStorage.setItem(LANG_KEY, lang); }
function getCurrentLang() { return document.documentElement.lang || 'en'; }

function applyBilingualSpans(lang) {
  document.querySelectorAll('.l-en').forEach(el => { el.style.display = lang === 'en' ? '' : 'none'; });
  document.querySelectorAll('.l-ar').forEach(el => { el.style.display = lang === 'ar' ? '' : 'none'; });
}

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;
  document.documentElement.lang = lang;
  document.documentElement.dir  = t.dir;
  saveLang(lang);

  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.textContent = t.langBtn;
    btn.dataset.lang = lang;
  });

  // Apply bilingual spans (detail pages)
  applyBilingualSpans(lang);

  // Index page translations
  if (document.getElementById('patternsGrid')) applyIndexTranslations(t, lang);

  // Detail page extra (title/tagline/cat from i18n fallback)
  if (document.querySelector('.detail-hero')) applyDetailTranslations(t, lang);

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    if (!btn.classList.contains('copied')) btn.textContent = t.copyBtn;
  });
}

function applyIndexTranslations(t, lang) {
  setText('[data-i18n="nav.patterns"]',     t.nav.patterns);
  setText('[data-i18n="nav.interview"]',     t.nav.interview);
  setText('[data-i18n="nav.architecture"]',  t.nav.architecture);
  setHTML('[data-i18n="hero.badge"]',        t.hero.badge);
  setHTML('[data-i18n="hero.title"]',        t.hero.title);
  setText('[data-i18n="hero.subtitle"]',     t.hero.subtitle);
  setText('[data-i18n="hero.btnBrowse"]',    t.hero.btnBrowse);
  setText('[data-i18n="hero.btnInterview"]', t.hero.btnInterview);
  setText('[data-i18n="stats.patterns"]',    t.stats.patterns);
  setText('[data-i18n="stats.categories"]',  t.stats.categories);
  setText('[data-i18n="stats.examples"]',    t.stats.examples);
  setText('[data-i18n="stats.questions"]',   t.stats.questions);
  setText('[data-i18n="ps.tag"]',   t.patternsSection.tag);
  setText('[data-i18n="ps.title"]', t.patternsSection.title);
  setText('[data-i18n="ps.sub"]',   t.patternsSection.sub);
  const si = document.getElementById('patternSearch');
  if (si) si.placeholder = t.patternsSection.searchPlaceholder;
  const allBtn = document.querySelector('[data-cat="All"]');
  const crBtn  = document.querySelector('[data-cat="Creational"]');
  const stBtn  = document.querySelector('[data-cat="Structural"]');
  const beBtn  = document.querySelector('[data-cat="Behavioral"]');
  if (allBtn) allBtn.textContent = t.patternsSection.filterAll;
  if (crBtn)  crBtn.textContent  = t.categories.Creational;
  if (stBtn)  stBtn.textContent  = t.categories.Structural;
  if (beBtn)  beBtn.textContent  = t.categories.Behavioral;
  document.querySelectorAll('.pattern-card[data-id]').forEach(card => {
    const id = card.dataset.id;
    const p  = t.patterns[id];
    if (!p) return;
    const nameEl    = card.querySelector('.card-name');
    const taglineEl = card.querySelector('.card-tagline');
    const linkEl    = card.querySelector('.card-link');
    const catEl     = card.querySelector('.card-cat');
    if (nameEl)    nameEl.textContent    = p.name;
    if (taglineEl) taglineEl.textContent = p.tagline;
    if (linkEl)    linkEl.textContent    = t.patternsSection.learnMore;
    if (catEl)     catEl.textContent     = t.categories[card.dataset.category] || card.dataset.category;
  });
  setText('[data-i18n="int.tag"]',   t.interview.tag);
  setText('[data-i18n="int.title"]', t.interview.title);
  setText('[data-i18n="int.sub"]',   t.interview.sub);
  document.querySelectorAll('.question-card').forEach((card, i) => {
    const q = t.interview.questions[i];
    if (!q) return;
    const qEl = card.querySelector('.q-text');
    const aEl = card.querySelector('.question-answer');
    if (qEl) qEl.textContent = q.q;
    if (aEl) aEl.innerHTML   = q.a;
  });
  setText('[data-i18n="arch.tag"]',   t.architecture.tag);
  setText('[data-i18n="arch.title"]', t.architecture.title);
  setText('[data-i18n="arch.sub"]',   t.architecture.sub);
  document.querySelectorAll('.arch-card').forEach((card, i) => {
    const c = t.architecture.cards[i];
    if (!c) return;
    const h3 = card.querySelector('h3');
    const p  = card.querySelector('p');
    if (h3) h3.innerHTML = c.title;
    if (p)  p.innerHTML  = c.body;
  });
  setText('[data-i18n="footer.note"]', t.footer.note);
}

function applyDetailTranslations(t, lang) {
  setText('[data-i18n="nav.patterns"]',     t.nav.patterns);
  setText('[data-i18n="nav.interview"]',     t.nav.interview);
  setText('[data-i18n="nav.architecture"]',  t.nav.architecture);
  setText('[data-i18n="nav.patterns-bc"]',   t.nav.patterns);
  setText('[data-i18n="footer.note"]', t.footer.note);
}

function setText(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (val !== undefined) el.textContent = val; });
}
function setHTML(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (val !== undefined) el.innerHTML = val; });
}

function createLangBtn() {
  const btn = document.createElement('button');
  btn.className = 'lang-toggle-btn';
  btn.title = 'Switch language / تغيير اللغة';
  const t = translations[getSavedLang()];
  btn.textContent = t ? t.langBtn : 'عربي';
  btn.addEventListener('click', () => {
    const next = getCurrentLang() === 'en' ? 'ar' : 'en';
    applyLang(next);
  });
  return btn;
}

// ─── Main Init ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (nav) nav.appendChild(createLangBtn());

  applyLang(getSavedLang());

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block-wrap').querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        const t = translations[getCurrentLang()];
        btn.textContent = t ? t.copiedBtn : 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = t ? t.copyBtn : 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  const searchInput = document.getElementById('patternSearch');
  const cards       = document.querySelectorAll('.pattern-card');
  if (searchInput && cards.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      cards.forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
      });
      if (searchInput) searchInput.value = '';
    });
  });

  document.querySelectorAll('.question-card').forEach(card => {
    card.querySelector('.question-header')?.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });

  const tocLinks = document.querySelectorAll('.toc-links a');
  if (tocLinks.length) {
    const anchors = [...tocLinks].map(l => document.querySelector(l.getAttribute('href')));
    const onScroll = () => {
      let active = 0;
      anchors.forEach((el, i) => { if (el && el.getBoundingClientRect().top < 140) active = i; });
      tocLinks.forEach(l => l.classList.remove('active'));
      if (tocLinks[active]) tocLinks[active].classList.add('active');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
