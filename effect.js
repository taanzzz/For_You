/* ═══════════════════════════════════════════
   BIRTHDAY EXPERIENCE — Premium Interactions
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──
  let musicPlaying = false;
  let candleBlown = false;

  // ── DOM Elements ──
  const preloader = document.getElementById('preloader');
  const entranceScreen = document.getElementById('entranceScreen');
  const journey = document.getElementById('journey');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const musicIconOn = document.getElementById('musicIconOn');
  const musicIconOff = document.getElementById('musicIconOff');
  const cakeContainer = document.getElementById('cakeContainer');
  const cakeOn = document.getElementById('cakeOn');
  const cakeOff = document.getElementById('cakeOff');
  const cakeInstruction = document.getElementById('cakeInstruction');
  const scrollArrow = document.getElementById('scrollArrow');
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // ── Particles System ──
  let particles = [];
  const PARTICLE_COUNT = 60;

  function initCanvas() {
    if (!canvas || !ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }
    animateParticles();
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;
      const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 194, 127, ${currentOpacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  // ── Preloader ──
  function hidePreloader() {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hide');
      setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
    }, 2800);
  }

  // ── Music ──
  function toggleMusic() {
    if (!bgMusic) return;
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicIconOn.style.display = 'none';
      musicIconOff.style.display = 'flex';
    } else {
      bgMusic.play().catch(() => {});
      musicToggle.classList.add('playing');
      musicIconOn.style.display = 'flex';
      musicIconOff.style.display = 'none';
    }
    musicPlaying = !musicPlaying;
  }

  // ── Open Gift / Start Journey ──
  function startJourney() {
    // Start music
    if (!musicPlaying && bgMusic) {
      bgMusic.play().catch(() => {});
      musicPlaying = true;
      musicToggle.classList.add('playing');
      musicIconOn.style.display = 'flex';
      musicIconOff.style.display = 'none';
    }

    // Animate entrance out
    entranceScreen.style.transition = 'opacity 1s ease, transform 1s ease';
    entranceScreen.style.opacity = '0';
    entranceScreen.style.transform = 'scale(1.05)';

    setTimeout(() => {
      entranceScreen.style.display = 'none';
      journey.style.display = 'block';
      journey.style.opacity = '0';
      journey.style.transition = 'opacity 1s ease';
      
      requestAnimationFrame(() => { 
        journey.style.opacity = '1'; 
        if (scrollArrow) {
            setTimeout(() => { scrollArrow.classList.add('visible'); }, 2000);
        }
      });
      initScrollReveal();
    }, 1000);
  }

  // Hide scroll arrow as user scrolls near bottom
  window.addEventListener('scroll', () => {
      if (scrollArrow) {
          const scrollPosition = window.innerHeight + window.scrollY;
          const documentHeight = document.documentElement.offsetHeight;
          if (documentHeight - scrollPosition < 300) {
              scrollArrow.style.opacity = '0';
          } else {
              scrollArrow.style.opacity = '0.7';
          }
      }
  });

  // ── Scroll Reveal ──
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-text, .cake-container');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ── Cake Blow Out ──
  function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;

    cakeContainer.classList.add('blown');
    cakeOn.style.transition = 'opacity 0.5s ease';
    cakeOn.style.opacity = '0';

    setTimeout(() => {
      cakeOn.style.display = 'none';
      cakeOff.style.display = 'block';
      cakeOff.style.opacity = '0';
      requestAnimationFrame(() => {
        cakeOff.style.transition = 'opacity 0.8s ease';
        cakeOff.style.opacity = '1';
      });
    }, 500);

    if (cakeInstruction) {
      cakeInstruction.innerHTML = '<span style="font-size:1.2rem;">🎉</span> <span>Wish made! Keep scrolling...</span>';
    }

    // Subtle haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(100);

    // Grand explosion
    createGrandExplosion();
  }

  // ── Grand Explosion (Loves, Balloons, Confetti) ──
  function createGrandExplosion() {
    const colors = ['#f0c27f', '#e8628c', '#a78bfa', '#67e8f9', '#fceabb', '#fbbf24'];
    const emojis = ['❤️', '💖', '✨', '🎈', '🎉'];
    const balloons = ['b1.png', 'b2.png', 'b3.png', 'b4.png', 'b5.png', 'b6.png', 'b7.png'];

    const rect = cakeContainer.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + 40;

    // 1. Emoji & Confetti Burst
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.style.position = 'fixed';
        piece.style.left = startX + 'px';
        piece.style.top = startY + 'px';
        piece.style.zIndex = '9999';
        piece.style.pointerEvents = 'none';

        if (Math.random() > 0.4) {
            // Confetti shape
            piece.style.width = (Math.random() * 10 + 5) + 'px';
            piece.style.height = (Math.random() * 10 + 5) + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        } else {
            // Heart or emoji
            piece.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            piece.style.fontSize = (Math.random() * 20 + 15) + 'px';
        }

        document.body.appendChild(piece);
        animateExplosion(piece);
    }

    // 2. Huge Balloon Release (floating up from bottom)
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const balloon = document.createElement('img');
            balloon.src = balloons[Math.floor(Math.random() * balloons.length)];
            balloon.style.position = 'fixed';
            balloon.style.left = (Math.random() * 100) + '%';
            balloon.style.bottom = '-150px';
            balloon.style.width = (Math.random() * 60 + 40) + 'px';
            balloon.style.zIndex = '9998';
            balloon.style.pointerEvents = 'none';
            document.body.appendChild(balloon);

            const duration = Math.random() * 4 + 5; // 5 to 9 seconds
            balloon.animate([
                { transform: `translateY(0) rotate(${Math.random()*20 - 10}deg)` },
                { transform: `translateY(-130vh) rotate(${Math.random()*40 - 20}deg)` }
            ], {
                duration: duration * 1000,
                easing: 'linear',
                fill: 'forwards'
            });

            setTimeout(() => balloon.remove(), duration * 1000);
        }, Math.random() * 1500); // Stagger the release slightly
    }
  }

  function animateExplosion(piece) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = Math.random() * 500 + 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 400; // Strong upward bias

      let x = 0, y = 0, rotation = 0, opacity = 1;
      const gravity = 800;
      let startTime = null;

      function animatePiece(time) {
        if (!startTime) startTime = time;
        const elapsed = (time - startTime) / 1000;
        x = vx * elapsed;
        y = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
        rotation = elapsed * 360;
        opacity = Math.max(0, 1 - elapsed / 2.5);

        piece.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        piece.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animatePiece);
        } else {
          piece.remove();
        }
      }
      requestAnimationFrame(animatePiece);
  }

  // ── Event Listeners ──
  if (openGiftBtn) openGiftBtn.addEventListener('click', startJourney);
  if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
  if (cakeContainer) cakeContainer.addEventListener('click', blowCandle);

  // Touch support for cake
  if (cakeContainer) {
    cakeContainer.addEventListener('touchend', (e) => {
      e.preventDefault();
      blowCandle();
    });
  }

  // ── Init ──
  window.addEventListener('load', () => {
    hidePreloader();
    initCanvas();
  });

  // Fallback init
  if (document.readyState === 'complete') {
    hidePreloader();
    initCanvas();
  }

})();