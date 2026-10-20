// ============================================================
//  KARMA MUSIC — script.js
//  Interactividad completa: loader, cursor, quiz, wishlist,
//  frases, partículas, modal, fade-in, contador, ticker.
// ============================================================

// ── LOADER DE ENTRADA ─────────────────────────────────────
(function () {
  const loader = document.getElementById('pageLoader');
  const fill   = document.getElementById('loaderFill');
  let w = 0;
  const iv = setInterval(() => {
    w += Math.random() * 18;
    if (w >= 100) { w = 100; clearInterval(iv); }
    fill.style.width = w + '%';
    if (w === 100) {
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }, 80);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR PERSONALIZADO ─────────────────────────────────
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // ── PARTÍCULAS EN EL HERO ─────────────────────────────────
  const container = document.getElementById('heroParticles');
  if (container) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left     = Math.random() * 100 + '%';
      p.style.width    = (Math.random() * 4 + 2) + 'px';
      p.style.height   = p.style.width;
      p.style.animationDuration  = (Math.random() * 12 + 6) + 's';
      p.style.animationDelay     = (Math.random() * 8) + 's';
      p.style.background = Math.random() > .5 ? 'var(--dorado)' : 'var(--rojo)';
      container.appendChild(p);
    }
  }

  // ── CONTADOR DE VISITAS ───────────────────────────────────
  const vc = document.getElementById('visitCount');
  if (vc) {
    let visits = parseInt(localStorage.getItem('km_visits') || '0');
    visits += Math.floor(Math.random() * 3) + 1; // simula visitas nuevas
    localStorage.setItem('km_visits', visits);
    // Animación de conteo
    let current = 0;
    const target = visits + 1337; // número base para dar sensación de tráfico real
    const step = Math.ceil(target / 60);
    const counter = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(counter); }
      vc.textContent = current.toLocaleString('es-MX');
    }, 30);
  }

  // ── MENÚ MÓVIL ────────────────────────────────────────────
  const toggle   = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const icon = toggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  document.querySelectorAll('.nav-m-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const icon = toggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // ── BACK TO TOP ───────────────────────────────────────────
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── SCROLL SUAVE CON OFFSET HEADER ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('header').offsetHeight + 10;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // ── FADE-IN AL HACER SCROLL ───────────────────────────────
  const reveals = document.querySelectorAll(
    '.card, .store-card, .contact-card, .online-store-card, .quiz-box, .quote-box'
  );
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => { el.classList.add('reveal'); revObs.observe(el); });

  // ── MODAL "VER MÁS" ───────────────────────────────────────
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  document.querySelectorAll('.card-overlay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const img    = card.querySelector('img');
      const brand  = card.querySelector('.card-brand');
      const title  = card.querySelector('.card-title');
      const desc   = card.querySelector('.card-desc');
      const price  = card.querySelector('.price-main');
      document.getElementById('modalImg').src      = img ? img.src : '';
      document.getElementById('modalImg').alt      = img ? img.alt : '';
      document.getElementById('modalBrand').textContent = brand ? brand.textContent : '';
      document.getElementById('modalTitle').textContent = title ? title.textContent : '';
      document.getElementById('modalDesc').textContent  = desc  ? desc.textContent  : '';
      document.getElementById('modalPrice').textContent = price ? price.textContent : '';
      modalOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── WISHLIST ──────────────────────────────────────────────
  const wishData = JSON.parse(localStorage.getItem('km_wish') || '[]');
  const wlToggle = document.getElementById('wlToggle');
  const wlPanel  = document.getElementById('wishlistPanel');
  const wlClose  = document.getElementById('wlClose');
  const wlBody   = document.getElementById('wlBody');
  const wlCount  = document.getElementById('wlCount');

  function renderWishlist() {
    wlCount.textContent = wishData.length;
    if (wishData.length === 0) {
      wlBody.innerHTML = '<p class="wl-empty">No has agregado nada aún.<br/>Toca el ❤️ en cualquier instrumento.</p>';
      return;
    }
    wlBody.innerHTML = wishData.map(item => `
      <div class="wl-item">
        <span class="wl-item-name">${item.name}</span>
        <span class="wl-item-price">${item.price}</span>
        <button class="wl-item-del" data-id="${item.id}" title="Quitar">✕</button>
      </div>
    `).join('');
    wlBody.querySelectorAll('.wl-item-del').forEach(b => {
      b.addEventListener('click', () => {
        const idx = wishData.findIndex(x => x.id === b.dataset.id);
        if (idx > -1) { wishData.splice(idx, 1); }
        localStorage.setItem('km_wish', JSON.stringify(wishData));
        // Desactivar botón corazón
        const heartBtn = document.querySelector(`.btn-wish[data-id="${b.dataset.id}"]`);
        if (heartBtn) { heartBtn.classList.remove('active'); heartBtn.querySelector('i').className = 'far fa-heart'; }
        renderWishlist();
      });
    });
  }

  // Restaurar estado de botones
  document.querySelectorAll('.btn-wish').forEach(btn => {
    if (wishData.find(x => x.id === btn.dataset.id)) {
      btn.classList.add('active');
      btn.querySelector('i').className = 'fas fa-heart';
    }
    btn.addEventListener('click', () => {
      const card  = btn.closest('.card');
      const id    = btn.dataset.id;
      const name  = card.querySelector('.card-title').textContent;
      const price = card.querySelector('.price-main').textContent;
      const idx   = wishData.findIndex(x => x.id === id);
      if (idx > -1) {
        wishData.splice(idx, 1);
        btn.classList.remove('active');
        btn.querySelector('i').className = 'far fa-heart';
        showToast('Quitado de favoritos');
      } else {
        wishData.push({ id, name, price });
        btn.classList.add('active');
        btn.querySelector('i').className = 'fas fa-heart';
        // Animación latido
        btn.style.transform = 'scale(1.5)';
        setTimeout(() => btn.style.transform = '', 300);
        showToast('¡Agregado a favoritos! 🤘');
      }
      localStorage.setItem('km_wish', JSON.stringify(wishData));
      renderWishlist();
    });
  });

  wlToggle.addEventListener('click', () => wlPanel.classList.toggle('show'));
  wlClose.addEventListener('click',  () => wlPanel.classList.remove('show'));
  renderWishlist();

  // ── TOAST NOTIFICATIONS ───────────────────────────────────
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position:'fixed', bottom:'180px', left:'50%', transform:'translateX(-50%) translateY(10px)',
      background:' #111', color:'var(--dorado)', border:'1px solid var(--dorado)',
      fontFamily:'Oswald,sans-serif', fontSize:'.85rem', letterSpacing:'1px',
      padding:'10px 22px', borderRadius:'6px', zIndex:'9999',
      opacity:'0', transition:'all .3s', whiteSpace:'nowrap',
      boxShadow:'0 4px 20px rgba(0,0,0,.5)'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => t.remove(), 300);
    }, 2200);
  }

  // ── QUIZ ─────────────────────────────────────────────────
  const answers = [];
  let currentQ  = 0;
  const totalQ  = 4;
  const progressBar = document.getElementById('quizProgressBar');
  const quizStep    = document.getElementById('quizStep');
  const quizResult  = document.getElementById('quizResult');

  const resultData = {
    guitarra: {
      icon: '🎸',
      title: '¡Eres una GUITARRA ELÉCTRICA!',
      desc:  'Frontal, agresivo y con actitud. El escenario te llama y no puedes ignorarlo. Tu lugar está en el frente, con una Les Paul o una Flying V en las manos. 🔥',
      link:  '#guitarras'
    },
    bateria: {
      icon: '🥁',
      title: '¡Eres una BATERÍA!',
      desc:  'Eres la fuerza que mueve a la banda. Sin ti, todo colapsa. Tienes ritmo en la sangre y energía para dar. El kit Yamaha o Alesis te espera. 💥',
      link:  '#baterias'
    },
    bajo: {
      icon: '🎵',
      title: '¡Eres un BAJO ELÉCTRICO!',
      desc:  'Discreto pero indispensable. Eres el groove que conecta la batería con la guitarra. Tu estilo es cool, profundo y esencial. Fender Jazz Bass, hecho para ti. 🕶️',
      link:  '#bajos'
    },
    teclado: {
      icon: '🎹',
      title: '¡Eres un TECLADO!',
      desc:  'Eres la capa épica que lleva la música a otro nivel. Desde el metal sinfónico hasta el rock progresivo, tu versatilidad no tiene límites. 🌌',
      link:  '#teclados'
    },
    violin: {
      icon: '🎻',
      title: '¡Eres un VIOLÍN!',
      desc:  'Elegante, intenso y único. Fusionas lo clásico con la brutalidad del metal. Eres Apocalyptica en persona. Nadie más puede hacer lo que tú. 🔮',
      link:  '#violines'
    }
  };

  document.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIndex = parseInt(btn.dataset.q);
      answers[qIndex] = btn.dataset.val;

      // Marcar selección visual
      btn.closest('.quiz-question').querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      setTimeout(() => {
        if (currentQ < totalQ - 1) {
          // Pasar a siguiente pregunta
          document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
          currentQ++;
          const nextQ = document.querySelector(`.quiz-question[data-q="${currentQ}"]`);
          if (nextQ) nextQ.classList.add('active');
          quizStep.textContent = `Pregunta ${currentQ + 1} de ${totalQ}`;
          progressBar.style.width = ((currentQ / totalQ) * 100) + '%';
        } else {
          // Mostrar resultado
          progressBar.style.width = '100%';
          const freq = {};
          answers.forEach(a => { freq[a] = (freq[a] || 0) + 1; });
          const winner = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
          const res = resultData[winner] || resultData.guitarra;
          document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
          document.getElementById('quizResIcon').textContent  = res.icon;
          document.getElementById('quizResTitle').textContent = res.title;
          document.getElementById('quizResDesc').textContent  = res.desc;
          document.getElementById('quizResLink').href         = res.link;
          quizResult.classList.add('show');
          quizStep.textContent = '¡Resultado listo! 🤘';
        }
      }, 350);
    });
  });

  document.getElementById('quizRestart').addEventListener('click', () => {
    answers.length = 0;
    currentQ = 0;
    quizResult.classList.remove('show');
    document.querySelectorAll('.quiz-question').forEach(q => { q.classList.remove('active'); q.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected')); });
    document.querySelector('.quiz-question[data-q="0"]').classList.add('active');
    progressBar.style.width = '0%';
    quizStep.textContent = 'Pregunta 1 de 4';
  });

  // ── FRASES ROCKERAS ALEATORIAS ────────────────────────────
  const quotes = [
    { text: '"El rock no es un género, es una actitud."',          author: '— Karma Music' },
    { text: '"Tocar una guitarra es como ser libre."',              author: '— Jimi Hendrix' },
    { text: '"El music es el arma del futuro."',                    author: '— Fela Kuti' },
    { text: '"Sin música, la vida sería un error."',                author: '— Friedrich Nietzsche' },
    { text: '"El metal no es ruido, es catarsis."',                 author: '— James Hetfield' },
    { text: '"Un buen riff puede cambiar tu día, tu semana, tu vida."', author: '— Karma Music' },
    { text: '"La música te da lo que las palabras no pueden."',     author: '— Kurt Cobain' },
    { text: '"Toca duro o vete a casa."',                           author: '— Lemmy Kilmister' },
    { text: '"El bajo es la columna vertebral del universo."',      author: '— Bootsy Collins' },
    { text: '"Cada nota que tocas te acerca más a quien eres."',    author: '— Karma Music' },
  ];
  const qText   = document.getElementById('quoteText');
  const qAuthor = document.getElementById('quoteAuthor');
  const qBtn    = document.getElementById('newQuoteBtn');
  let qIdx = 0;
  function setQuote(idx) {
    qText.style.opacity = '0';
    qAuthor.style.opacity = '0';
    setTimeout(() => {
      qText.textContent   = quotes[idx].text;
      qAuthor.textContent = quotes[idx].author;
      qText.style.opacity = '1';
      qAuthor.style.opacity = '1';
    }, 250);
  }
  if (qBtn) {
    qBtn.addEventListener('click', () => {
      qIdx = (qIdx + 1) % quotes.length;
      setQuote(qIdx);
    });
    // Auto-cambio cada 8s
    setInterval(() => { qIdx = (qIdx + 1) % quotes.length; setQuote(qIdx); }, 8000);
  }

  // ── LINK ACTIVO EN NAV AL HACER SCROLL ───────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-desktop a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-desktop a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--dorado)';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

}); // end DOMContentLoaded
