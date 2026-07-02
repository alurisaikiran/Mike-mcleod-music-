const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a:not(.nav-cta)").forEach((link) => {
  const linkPage = link.getAttribute("href").split("/").pop();
  if (linkPage === currentPage) link.classList.add("active");
});

const siteHeader = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// ── Floating pill button (all pages) ──────────────────────
(function() {
  const widget = document.createElement('div');
  widget.className = 'float-pill';
  widget.innerHTML = `
    <div class="float-pill-expand">
      <a class="float-call-link" href="tel:4046631407">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        <span>404-663-1407</span>
      </a>
      <span class="float-sep"></span>
      <a class="float-book-link" href="booking.html">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5C3.89 4 3.01 4.9 3.01 6L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V1h-2zm3 19H5V9h14v11z"/>
        </svg>
        <span>Book Mike</span>
      </a>
    </div>
    <div class="float-pill-dot">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
      </svg>
    </div>`;
  document.body.appendChild(widget);

  // Tap to expand on touch devices
  const dot = widget.querySelector('.float-pill-dot');
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('expanded');
  });
  document.addEventListener('click', () => widget.classList.remove('expanded'));
})();

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Review cards — each slides up as it enters the viewport
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.review-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 3) * 80}ms`;
  cardObserver.observe(card);
});

// Staggered card groups
['.instrument-card', '.how-step'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    const siblings = Array.from(el.parentElement.querySelectorAll(sel));
    el.style.transitionDelay = `${siblings.indexOf(el) * 120}ms`;
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// Non-staggered reveals
[
  '.section-heading', '.about-photo', '.about-text',
  '.about-cta h2', '.about-cta-buttons',
  '.setlist-header', '.setlist-group',
  '.booking > div', '.booking form',
  '.creds-logos h2', '.videos .section-heading',
].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ── Stat counter ───────────────────────────────────────────
function runCounter(el) {
  const raw = el.textContent.trim();
  const num = parseInt(raw.replace(/\D/g, ''));
  if (!num) return;
  const suffix = raw.replace(/[\d]/g, '');
  const duration = 1400;
  let startTime = null;
  const tick = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  let counted = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statsEl.querySelectorAll('strong').forEach(runCounter);
    }
  }, { threshold: 0.5 }).observe(statsEl);
}

// ── Logo stagger + glow (Credentials) ─────────────────────
document.querySelectorAll('.logo-grid').forEach(grid => {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.querySelectorAll('.logo-cell').forEach((cell, i) => {
        setTimeout(() => {
          cell.classList.add('logo-in');
          setTimeout(() => cell.classList.add('logo-glow'), 100);
        }, i * 40);
      });
    }
  }, { threshold: 0.05 }).observe(grid);
});

// ── Lightbox (Photos page) ─────────────────────────────────
const photoGrid = document.querySelector('.photo-grid');
if (photoGrid) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-prev" aria-label="Previous">&#8592;</button>
    <button class="lb-next" aria-label="Next">&#8594;</button>
    <div class="lightbox-content">
      <img src="" alt="">
      <p class="lightbox-caption"></p>
    </div>`;
  document.body.appendChild(lb);

  const figures = Array.from(photoGrid.querySelectorAll('figure'));
  let current = 0;

  function openLb(idx) {
    current = idx;
    const fig = figures[idx];
    lb.querySelector('img').src = fig.querySelector('img').src;
    lb.querySelector('img').alt = fig.querySelector('img').alt;
    lb.querySelector('.lightbox-caption').textContent = fig.querySelector('figcaption')?.textContent || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  figures.forEach((fig, i) => {
    fig.style.cursor = 'zoom-in';
    fig.addEventListener('click', () => openLb(i));
  });

  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); openLb((current - 1 + figures.length) % figures.length); });
  lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); openLb((current + 1) % figures.length); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb((current - 1 + figures.length) % figures.length);
    if (e.key === 'ArrowRight') openLb((current + 1) % figures.length);
  });
}

// ── Animated stars (Reviews page) ─────────────────────────
document.querySelectorAll('.stars').forEach(el => {
  el.innerHTML = Array(5).fill('<span class="star">&#9733;</span>').join('');
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      el.querySelectorAll('.star').forEach((s, i) => {
        setTimeout(() => s.classList.add('lit'), i * 130);
      });
    }
  }, { threshold: 0.8 }).observe(el);
});

const audioPlayer = new Audio();
let activeTrack = null;

function resetTracks() {
  document.querySelectorAll(".track").forEach((item) => {
    item.classList.remove("playing", "loading");
    item.querySelector(".track-play").textContent = "\u25B6";
  });
}

document.querySelectorAll(".track-play").forEach((button) => {
  button.addEventListener("click", () => {
    const track = button.closest(".track");
    if (activeTrack === track && !audioPlayer.paused) {
      audioPlayer.pause();
      resetTracks();
      return;
    }

    resetTracks();
    activeTrack = track;
    track.classList.add("loading");
    audioPlayer.src = track.dataset.audio;
    audioPlayer.play().then(() => {
      track.classList.remove("loading");
      track.classList.add("playing");
      button.textContent = "\u25A0";
    }).catch(() => {
      resetTracks();
      activeTrack = null;
    });
  });
});

audioPlayer.addEventListener("ended", () => {
  resetTracks();
  activeTrack = null;
});

const bookingForm = document.querySelector(".booking form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const selects = form.querySelectorAll("select");
    const eventType = selects[0].value;
    const duration = selects[1].value;
    const eventDate = form.querySelector('input[type="date"]').value;
    const location = form.querySelectorAll('input[type="text"]')[1]?.value.trim() || "";
    const details = form.querySelector("textarea").value.trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Event type: ${eventType}`,
      `Event date: ${eventDate || "Not provided"}`,
      `Duration: ${duration || "Not specified"}`,
      `Location / Venue: ${location || "Not provided"}`,
      "",
      details
    ].join("\n");

    window.location.href = `mailto:MikeMcLeodMusic@gmail.com?subject=${encodeURIComponent("Live music booking inquiry")}&body=${encodeURIComponent(body)}`;
    form.querySelector(".form-message").textContent =
      "Opening your email app with the booking details.";
  });
}

const newsletterForm = document.querySelector(".newsletter");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.querySelector(".newsletter-message").textContent =
      "Demo form only. Use Mike's Facebook or YouTube links for current updates.";
  });
}
