
    // page-load veil
    window.addEventListener('load', () => { setTimeout(() => document.getElementById('veil').classList.add('gone'), 420) });

    // custom cursor
    const cur = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
    let rx = 0, ry = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; cur.style.left = cx + 'px'; cur.style.top = cy + 'px' });
    (function loop() { rx += (cx - rx) * .18; ry += (cy - ry) * .18; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop) })();
    document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover') }); el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover') }) });

    // nav + scroll progress
    const nav = document.getElementById('nav'), prog = document.getElementById('progress');
    addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', scrollY > 40);
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (scrollY / h * 100) + '%';
    });

    // count-up
    function countUp(el) {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '', dur = 1400, t0 = performance.now();
      function tick(now) { const p = Math.min((now - t0) / dur, 1); const e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(e * target) + suffix; if (p < 1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick);
    }

    // reveal + triggers
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          e.target.querySelectorAll('[data-count]').forEach(c => { if (!c.dataset.done) { c.dataset.done = 1; countUp(c) } });
          if (e.target.querySelector('#scrollRing')) { e.target.querySelector('#scrollRing').style.strokeDashoffset = '153' }
          if (e.target.querySelector('#bars')) { e.target.querySelectorAll('.bar').forEach((b, i) => setTimeout(() => b.style.height = b.dataset.h + '%', i * 90)) }
          io.unobserve(e.target);
        }
      })
    }, { threshold: .18 });
    document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3 * 0.08) + 's'; io.observe(el) });

    // trust marquee
    const items = [['M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z', 'SOS safety', 'coming soon'], ['M4 19V5M4 19h16M8 16l3-4 3 2 4-7', 'Real-time', 'Payment tracking'], ['M3 21h18M5 21V10l7-5 7 5v11', 'Path to', 'Ownership'], ['M12 2 2 7v10l10 5 10-5V7L12 2z', 'PDPA', 'Compliant'], ['M2 12h20M12 2c3 3 3 17 0 20M12 2C9 5 9 19 12 22', 'Built for', 'East Africa'], ['M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', 'Owner pays,', 'driver free']];
    const mk = () => items.map(([d, a, b]) => `<div class="trust-item"><svg viewBox="0 0 24 24" fill="none"><path d="${d}" stroke="#1DD882" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><b>${a}</b> ${b}</div>`).join('');
    document.getElementById('track').innerHTML = mk() + mk();

    // FAQ accordion
    document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
      const item = q.parentElement; const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    }));

    // language toggle (EN <-> SW)
    const I18N = {
      en: {
        nav_story: 'Our Story', nav_how: 'How It Works', nav_features: 'Features', nav_calc: 'Calculator', nav_faq: 'FAQ', getApp: 'Get App',
        hero_eyebrow: 'Motorcycle Ownership Platform — East Africa',
        hero_sub: 'LUNO tracks every shilling toward motorcycle ownership. Digital proof. Real-time progress. No more lost receipts, disputed payments, or notebook chaos.',
        hero_btn1: 'Download Free', hero_btn2: 'Read Our Story'
      },
      sw: {
        nav_story: 'Hadithi Yetu', nav_how: 'Inavyofanya Kazi', nav_features: 'Vipengele', nav_calc: 'Kikokotoo', nav_faq: 'Maswali', getApp: 'Pata App',
        hero_eyebrow: 'Jukwaa la Umiliki wa Pikipiki — Afrika Mashariki',
        hero_sub: 'LUNO inafuatilia kila shilingi kuelekea umiliki wa pikipiki. Ushahidi wa kidijitali. Maendeleo ya wakati halisi. Hakuna risiti zilizopotea, migogoro ya malipo, wala fujo la daftari.',
        hero_btn1: 'Pakua Bure', hero_btn2: 'Soma Hadithi Yetu'
      }
    };
    let curLang = 'en';
    const langBtn = document.getElementById('langBtn'), langLabel = document.getElementById('langLabel');
    function applyLang(l) {
      curLang = l; const dict = I18N[l];
      document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (dict[k]) el.textContent = dict[k]; });
      langLabel.textContent = l === 'en' ? 'Swahili' : 'English';
      document.documentElement.lang = l;
    }
    langBtn.addEventListener('click', () => applyLang(curLang === 'en' ? 'sw' : 'en'));


    const seg = document.getElementById('segType'), wkRange = document.getElementById('wkRange'),
      wkVal = document.getElementById('wkVal'), priceVal = document.getElementById('priceVal'),
      weeksOut = document.getElementById('weeksOut'), weeksSub = document.getElementById('weeksSub'), dateOut = document.getElementById('dateOut');
    let price = 2300000;
    function fmt(n) { return n.toLocaleString('en-US') }
    function calc() {
      const wk = +wkRange.value;
      wkVal.textContent = fmt(wk) + ' TZS';
      priceVal.textContent = (price / 1e6).toFixed(1).replace('.0', '') + 'M TZS';
      // simple: weeks = price / weekly (with a small platform retention already baked into owner side)
      let weeks = Math.ceil(price / wk);
      weeksOut.textContent = weeks;
      const months = Math.round(weeks / 4.33);
      weeksSub.textContent = 'weeks · about ' + months + ' month' + (months === 1 ? '' : 's');
      const d = new Date(); d.setDate(d.getDate() + weeks * 7);
      dateOut.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); price = +b.dataset.price;
      // adjust slider sensible defaults per type
      if (price > 4000000) { wkRange.min = 120000; wkRange.max = 320000; wkRange.value = 175000; wkRange.step = 5000; }
      else { wkRange.min = 40000; wkRange.max = 160000; wkRange.value = 70000; wkRange.step = 5000; }
      document.querySelectorAll('.calc-range-labels span')[0].textContent = fmt(+wkRange.min);
      document.querySelectorAll('.calc-range-labels span')[1].textContent = fmt(+wkRange.max);
      calc();
    }));
    wkRange.addEventListener('input', calc);
    calc();




    // Show range from start year to current year
document.addEventListener('DOMContentLoaded', function() {
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('copyrightYear');
  
  if (yearElement) {
    if (currentYear > startYear) {
      yearElement.textContent = startYear + ' - ' + currentYear;
    } else {
      yearElement.textContent = startYear;
    }
  }
});