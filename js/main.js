/* =========================================================
   PENEDO BBQ FESTIVAL — interações
   ========================================================= */
(function(){
  "use strict";

  /* ---------- 0. Slots de imagem/vídeo ----------
     Tenta carregar cada foto/vídeo real. Enquanto o ficheiro não existir
     (ainda não foi enviado via WordPress), a caixa tracejada com o nome
     do ficheiro fica visível. Assim que o ficheiro certo for colocado no
     caminho indicado, a foto aparece sozinha — não precisa mexer em código. */
  function fillImageSlot(el, onFail){
    if (!el) return;
    var src = el.getAttribute('data-img');
    if (!src) return;
    // Mostra a foto de imediato (como qualquer <img>/background normal).
    // Só volta à caixa tracejada se o ficheiro realmente não carregar.
    el.style.backgroundImage = "url('" + src + "')";
    el.classList.add('is-filled');
    var tester = new Image();
    tester.onerror = function(){
      el.classList.remove('is-filled');
      el.style.backgroundImage = '';
      if (onFail) onFail();
    };
    tester.src = src;
  }

  // Preenche automaticamente qualquer slot de foto que tenha data-img
  // (logo do hero, foto de Penedo, open bar/food, as 3 fotos do "tudo incluso").
  document.querySelectorAll('.img-slot[data-img]').forEach(function(el){
    if (el.id === 'heroBg') return; // tratado à parte abaixo (também esconde o crachá)
    fillImageSlot(el);
  });

  var heroBg = document.getElementById('heroBg');
  var heroBgTag = document.getElementById('heroBgTag');
  if (heroBg) {
    fillImageSlot(heroBg);
    if (heroBgTag) heroBgTag.classList.add('is-hidden');
    var heroSrcCheck = new Image();
    heroSrcCheck.onerror = function(){ if (heroBgTag) heroBgTag.classList.remove('is-hidden'); };
    heroSrcCheck.src = heroBg.getAttribute('data-img');
  }

  // Secção "Munhoz e Mariano" usa a mesma foto de capa como fundo
  var attractionBg = document.getElementById('attractionBg');
  if (attractionBg) {
    fillImageSlot(attractionBg);
  }

  var videoSlot = document.getElementById('videoSlot');
  var festivalVideo = document.getElementById('festivalVideo');
  if (videoSlot && festivalVideo) {
    festivalVideo.addEventListener('loadeddata', function(){
      videoSlot.classList.add('is-filled');
    });
  }

  /* ---------- 1. Mini header ao rolar ---------- */
  var miniHeader = document.getElementById('miniHeader');
  var hero = document.querySelector('.hero');
  if (miniHeader && hero) {
    var onScrollHeader = function(){
      var trigger = hero.offsetHeight * 0.7;
      if (window.scrollY > trigger) {
        miniHeader.classList.add('is-visible');
      } else {
        miniHeader.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- 2. Contador regressivo ---------- */
  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    var targetDate = new Date(countdownEl.dataset.date).getTime();
    var dayEl = countdownEl.querySelector('[data-unit="days"]');
    var hourEl = countdownEl.querySelector('[data-unit="hours"]');
    var minEl = countdownEl.querySelector('[data-unit="minutes"]');
    var secEl = countdownEl.querySelector('[data-unit="seconds"]');

    var pad = function(n){ return String(n).padStart(2, '0'); };

    var tick = function(){
      var diff = targetDate - Date.now();
      if (diff <= 0) {
        dayEl.textContent = hourEl.textContent = minEl.textContent = secEl.textContent = '00';
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);

      dayEl.textContent = pad(days);
      hourEl.textContent = pad(hours);
      minEl.textContent = pad(mins);
      secEl.textContent = pad(secs);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 3. Marquees (fotos e patrocinadores) ---------- */
  var galleryPhotos = [
    'assets/img/gallery/g01.jpg',
    'assets/img/gallery/g02.jpg',
    'assets/img/gallery/g03.jpg',
    'assets/img/gallery/g04.jpg',
    'assets/img/gallery/g05.jpg',
    'assets/img/gallery/g06.jpg',
    'assets/img/gallery/g07.jpg',
    'assets/img/gallery/g08.jpg',
    'assets/img/gallery/g09.jpg',
    'assets/img/gallery/g10.jpg',
    'assets/img/gallery/g11.jpg',
    'assets/img/gallery/g12.jpg',
    'assets/img/gallery/g13.jpg',
    'assets/img/gallery/g14.jpg',
    'assets/img/gallery/g15.jpg',
    'assets/img/gallery/g16.jpg'
  ];

  function buildMarquee(trackId, photos){
    var track = document.getElementById(trackId);
    if (!track) return;
    var fragment = document.createDocumentFragment();
    // duplicamos a lista para criar o loop infinito sem emenda
    [photos, photos].forEach(function(set){
      set.forEach(function(src){
        var div = document.createElement('div');
        div.className = 'marquee__item is-filled';
        div.style.backgroundImage = "url('" + src + "')";

        var tester = new Image();
        tester.onerror = function(){
          div.classList.remove('is-filled');
          div.style.backgroundImage = '';
          var slot = document.createElement('div');
          slot.className = 'img-slot';
          var fileName = src.split('/').pop();
          slot.innerHTML = '<span class="img-slot__label">📷<br><small>' + fileName + '</small></span>';
          div.appendChild(slot);
        };
        tester.src = src;

        fragment.appendChild(div);
      });
    });
    track.appendChild(fragment);
  }
  // dividimos em dois grupos para os carrosséis mostrarem fotos diferentes
  buildMarquee('marqueeTrack1', galleryPhotos.slice(0, 8));
  buildMarquee('marqueeTrack2', galleryPhotos.slice(8).reverse());

  // Depoimentos: coloque os prints (screenshots) em assets/img/testimonials/
  // com estes nomes. Formato retrato (ex.: 3:5), como um print de story/chat.
  var testimonialShots = [
    'assets/img/testimonials/t01.jpg',
    'assets/img/testimonials/t02.jpg',
    'assets/img/testimonials/t03.jpg',
    'assets/img/testimonials/t04.jpg',
    'assets/img/testimonials/t05.jpg',
    'assets/img/testimonials/t06.jpg',
    'assets/img/testimonials/t07.jpg',
    'assets/img/testimonials/t08.jpg',
    'assets/img/testimonials/t09.jpg',
    'assets/img/testimonials/t10.jpg'
  ];
  function buildTestimonials(trackId, shots){
    var track = document.getElementById(trackId);
    if (!track) return;
    var fragment = document.createDocumentFragment();
    [shots, shots].forEach(function(set){
      set.forEach(function(src){
        var div = document.createElement('div');
        div.className = 'testimonial-item photo-hover is-filled';
        div.style.backgroundImage = "url('" + src + "')";

        var tester = new Image();
        tester.onerror = function(){
          div.classList.remove('is-filled');
          div.style.backgroundImage = '';
          var slot = document.createElement('div');
          slot.className = 'img-slot';
          var fileName = src.split('/').pop();
          slot.innerHTML = '<span class="img-slot__label">💬<br><small>' + fileName + '</small></span>';
          div.appendChild(slot);
        };
        tester.src = src;

        fragment.appendChild(div);
      });
    });
    track.appendChild(fragment);
  }
  buildTestimonials('testimonialsTrack', testimonialShots);

  // Logos dos patrocinadores: coloque os PNGs (fundo transparente) em
  // assets/img/sponsors/ com estes nomes de ficheiro.
  var sponsors = [
    { name: 'Brahma',           file: 'brahma.png' },
    { name: 'Maturatta Friboi', file: 'maturatta.png' },
    { name: 'RAM',              file: 'ram.png' },
    { name: 'Parrillas Penedo', file: 'parrillas.png' },
    { name: 'Coca-Cola',        file: 'coca-cola.png' },
    { name: 'Byma',             file: 'byma.png' }
  ];
  function buildSponsors(trackId, list){
    var track = document.getElementById(trackId);
    if (!track) return;
    var fragment = document.createDocumentFragment();
    [list, list].forEach(function(set){
      set.forEach(function(sponsor){
        var div = document.createElement('div');
        div.className = 'sponsor-logo is-filled';
        var src = 'assets/img/sponsors/' + sponsor.file;
        div.style.backgroundImage = "url('" + src + "')";

        var tester = new Image();
        tester.onerror = function(){
          div.classList.remove('is-filled');
          div.style.backgroundImage = '';
          var slot = document.createElement('div');
          slot.className = 'img-slot';
          slot.innerHTML = '<span class="img-slot__label">' + sponsor.name + '<br><small>assets/img/sponsors/' + sponsor.file + '</small></span>';
          div.appendChild(slot);
        };
        tester.src = src;

        fragment.appendChild(div);
      });
    });
    track.appendChild(fragment);
  }
  buildSponsors('sponsorsTrack', sponsors);

  // Permite arrastar com o mouse (desktop) ou deslizar com o dedo (celular)
  // para navegar pelos carrosséis manualmente. Ao soltar, o carrossel volta
  // a andar sozinho a partir de onde a pessoa parou.
  function makeMarqueeDraggable(trackId){
    var track = document.getElementById(trackId);
    if (!track) return;
    var wrap = track.closest('.marquee');
    if (!wrap) return;
    wrap.classList.add('marquee--draggable');

    var isDown = false;
    var pointerId = null;
    var startX = 0;
    var baseX = 0;
    var moved = false;

    function getTranslateX(){
      var st = getComputedStyle(track).transform;
      if (st === 'none') return 0;
      var parts = st.match(/matrix\(([^)]+)\)/);
      if (!parts) return 0;
      var vals = parts[1].split(',');
      return parseFloat(vals[4]) || 0;
    }

    function onPointerDown(e){
      isDown = true;
      moved = false;
      pointerId = e.pointerId;
      track.setPointerCapture(pointerId);
      startX = e.clientX;
      baseX = getTranslateX();
      track.classList.add('is-dragging');
      wrap.classList.add('is-dragging');
    }
    function onPointerMove(e){
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.style.transform = 'translateX(' + (baseX + dx) + 'px)';
    }
    function onPointerUp(e){
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      wrap.classList.remove('is-dragging');
      try { track.releasePointerCapture(pointerId); } catch(err){}

      var halfWidth = track.scrollWidth / 2;
      if (!halfWidth) { track.style.transform = ''; return; }
      var finalX = getTranslateX();
      var normalized = finalX % halfWidth;
      if (normalized > 0) normalized -= halfWidth;
      var progress = Math.min(Math.max(-normalized / halfWidth, 0), 1);

      var cs = getComputedStyle(track);
      var duration = parseFloat(cs.animationDuration) || 40;
      var isReverse = cs.animationDirection === 'reverse';
      var elapsed = isReverse ? (1 - progress) * duration : progress * duration;

      track.style.transform = '';
      track.style.animationDelay = (-elapsed) + 's';
    }

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    // evita que o navegador tente arrastar as imagens individualmente
    track.addEventListener('dragstart', function(e){ e.preventDefault(); });
  }
  ['marqueeTrack1', 'marqueeTrack2', 'sponsorsTrack', 'testimonialsTrack'].forEach(makeMarqueeDraggable);

  // Faixa vermelha divisória, com texto girando sem parar
  var tickerItems = ['04 SET 2027', 'Penedo BBQ Festival', '2ª Edição', 'Viva seu momento'];
  function buildTicker(trackId, items){
    var track = document.getElementById(trackId);
    if (!track) return;
    var fragment = document.createDocumentFragment();
    for (var r = 0; r < 4; r++) { // repete várias vezes para preencher telas largas
      items.forEach(function(text){
        var span = document.createElement('span');
        span.className = 'ticker-item';
        span.innerHTML = '<span class="star">★</span>' + text;
        fragment.appendChild(span);
      });
    }
    track.appendChild(fragment);
  }
  buildTicker('tickerTrack', tickerItems);

  /* ---------- 4. Scroll reveal ----------
     As animações repetem sempre que o elemento entra na tela (não só na
     primeira vez). Quando a pessoa rola para cima, a animação entra do
     lado/direção oposta à de quando desce — fica mais dinâmico e
     intencional em vez de repetir sempre igual. */
  var revealEls = document.querySelectorAll('.reveal');
  var scrollDirection = 'down';
  var lastScrollY = window.scrollY;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if (y > lastScrollY + 2) scrollDirection = 'down';
    else if (y < lastScrollY - 2) scrollDirection = 'up';
    lastScrollY = y;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    revealEls.forEach(function(el){
      var delay = el.getAttribute('data-reveal-delay');
      el.dataset.baseDelay = delay || '0';
    });
    var io = new IntersectionObserver(function(entries){
      // Fase 1: para TODOS os elementos deste disparo de uma vez, desliga a
      // transição e aplica a direção/posição "escondida" correta. Fazer isto
      // em lote (em vez de um a um) evita engasgos quando vários elementos
      // entram juntos (ex.: título + fotos de uma secção).
      entries.forEach(function(entry){
        var el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('reveal--notransition');
          el.classList.toggle('reveal--reverse', scrollDirection === 'up');
          // ao subir a página, o efeito cascata (1º, 2º, 3º...) deixa de
          // fazer sentido, porque a ordem de entrada na tela se inverte —
          // o elemento com maior atraso passaria a ser o primeiro a aparecer.
          // Por isso, ao subir, todos entram juntos (sem atraso extra).
          el.style.setProperty('--d', scrollDirection === 'up' ? 0 : el.dataset.baseDelay);
        } else {
          el.classList.remove('is-visible');
        }
      });
      void document.body.offsetWidth; // um único reflow para todo o lote

      // Fase 2: liga a transição de novo e revela, também em lote.
      entries.forEach(function(entry){
        if (entry.isIntersecting) entry.target.classList.remove('reveal--notransition');
      });
      void document.body.offsetWidth;
      entries.forEach(function(entry){
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.15, rootMargin: '-40px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- 5. Parallax leve no hero ---------- */
  if (heroBg) {
    var ticking = false;
    window.addEventListener('scroll', function(){
      if (!ticking) {
        window.requestAnimationFrame(function(){
          var y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            heroBg.style.transform = 'translate3d(0,' + (y * 0.25) + 'px,0) scale(1.08)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- 6. Faíscas / brasa (canvas) ----------
     Partículas reais de brasa subindo e piscando, para dar sensação de
     fogo de verdade (não ícones desenhados). Desliga sozinho se o
     visitante preferir menos animação (prefers-reduced-motion). */
  function startEmbers(canvas, options){
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var opts = options || {};
    var count = opts.count || 36;
    var particles = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize(){
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function spawn(fromBottom){
      var w = canvas.offsetWidth, h = canvas.offsetHeight;
      return {
        x: Math.random() * w,
        y: fromBottom ? h + Math.random() * 30 : Math.random() * h,
        r: Math.random() * 1.6 + 0.5,
        speed: Math.random() * 0.5 + 0.25,
        drift: (Math.random() - 0.5) * 0.5,
        wobble: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: Math.random() * 220 + 160
      };
    }
    for (var i = 0; i < count; i++) particles.push(spawn(false));

    function tick(){
      var w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function(p){
        p.y -= p.speed;
        p.wobble += 0.04;
        p.x += p.drift + Math.sin(p.wobble) * 0.3;
        p.life++;

        var lifeRatio = p.life / p.maxLife;
        if (lifeRatio >= 1 || p.y < -10) {
          var fresh = spawn(true);
          Object.assign(p, fresh);
          return;
        }
        var alpha = Math.sin(lifeRatio * Math.PI);

        var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        glow.addColorStop(0, 'rgba(255,190,90,' + (alpha * 0.9) + ')');
        glow.addColorStop(0.4, 'rgba(255,110,40,' + (alpha * 0.5) + ')');
        glow.addColorStop(1, 'rgba(255,60,20,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,224,160,' + alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      canvas._emberRaf = requestAnimationFrame(tick);
    }
    tick();
  }

  startEmbers(document.getElementById('emberHero'), { count: 30 });
  startEmbers(document.getElementById('emberCountdown'), { count: 44 });
  startEmbers(document.getElementById('emberPresale'), { count: 22 });

})();
