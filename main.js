/* ================================================================
   main.js  v2  —  Portfolio rendering, animations, interactions
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Theme ---- */
  const html = document.documentElement;
  const themeBtn  = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('nh_theme', t);
    themeIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  applyTheme(localStorage.getItem('nh_theme') || 'dark');
  themeBtn.addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );

  /* ---- Navbar ---- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', onScroll, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(l =>
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  /* ---- Scroll handler (optimized) ---- */
  let scrollTimeout;
  function onScroll() {
    const sy = window.scrollY;
    
    // navbar
    navbar.classList.toggle('scrolled', sy > 50);
    
    // progress bar
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scroll-bar').style.width = total > 0 ? `${(sy / total) * 100}%` : '0%';
    
    // back to top
    document.getElementById('back-to-top').classList.toggle('visible', sy > 400);

    // active nav (debounced for performance)
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        updateActiveNav();
        scrollTimeout = null;
      }, 100);
    }
  }

  /* ---- Active Nav ---- */
  function updateActiveNav() {
    const pos = window.scrollY + 130;
    document.querySelectorAll('section[id]').forEach(s => {
      const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
      if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
    });
  }

  /* ---- Back to top ---- */
  document.getElementById('back-to-top').addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---- Typewriter ---- */
  const roles = ['elegant websites.','network solutions.','full stack apps.','ISP systems.','digital experiences.'];
  let ri = 0, ci = 0, del = false;
  const tw = document.getElementById('typewriter');
  function type() {
    const r = roles[ri];
    tw.textContent = del ? r.slice(0, --ci) : r.slice(0, ++ci);
    if (!del && ci === r.length)  { del = true;  setTimeout(type, 2200); return; }
    if (del  && ci === 0)         { del = false;  ri = (ri+1) % roles.length; setTimeout(type, 400); return; }
    setTimeout(type, del ? 45 : 75);
  }
  type();

  /* ---- Intersection Observer for reveals ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate skill bars if they exist inside
        entry.target.querySelectorAll('.skill-bar[data-level]').forEach(bar => {
          if (!bar.dataset.animated) {
            bar.dataset.animated = '1';
            setTimeout(() => {
              bar.style.width = bar.dataset.level + '%';
            }, 100);
          }
        });
        
        // Stop observing once visible
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  function initReveal() {
    document.querySelectorAll('.reveal, .timeline-content, .service-card, .project-card').forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ---- Apply site info to DOM ---- */
  window.applyInfo = function() {
    const info = window.portfolioData.info;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    const setHTML = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerHTML = val; };
    set('hero-name', info.heroName);
    set('hero-tagline', info.heroTagline);
    set('about-subtitle', info.aboutSubtitle);
    setHTML('about-bio', info.aboutBio);
    set('about-email', info.email);
    set('about-phone', info.phone);
    set('about-location', info.location);
    set('hero-projects-count', info.heroProjectsCount);
    set('contact-location', info.location);
    const ce = document.getElementById('contact-email-link');
    const cp = document.getElementById('contact-phone-link');
    if (ce && info.email) { ce.textContent = info.email; ce.href = `mailto:${info.email}`; }
    if (cp && info.phone) { cp.textContent = info.phone; cp.href = `tel:${info.phone}`; }
  };
  window.applyInfo();

  /* ---- Restore saved profile photo ---- */
  if (window.restoreProfilePhoto) window.restoreProfilePhoto();

  /* ---- Render Projects ---- */
  window.renderProjects = function() {
    const c = document.getElementById('projects-container');
    const data = window.portfolioData.projects;
    if (!data.length) { c.innerHTML = '<p style="text-align:center;color:var(--text-dim);">No projects added yet.</p>'; return; }
    const active = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    c.innerHTML = data.map(p => `
      <div class="project-card reveal${active !== 'all' && active !== p.category ? ' hidden-card' : ''}" data-cat="${p.category}">
        <div class="project-header">
          <div class="project-icon"><i class="fa-solid ${p.icon}"></i></div>
          <span class="project-category-badge">${p.category}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tech">${(p.tech||[]).map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
        <div class="project-links">
          <a href="${p.liveUrl||'#'}" class="project-link" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
          <a href="${p.githubUrl||'#'}" class="project-link" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>
        </div>
      </div>`).join('');
    initFilters();
    initReveal();
  };

  function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
          const show = f === 'all' || card.dataset.cat === f;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }
  window.renderProjects();

  /* ---- Render Skills ---- */
  window.renderSkills = function(cat = 'web') {
    const c = document.getElementById('skills-container');
    const data = window.portfolioData.skills.filter(s => s.category === cat);
    if (!data.length) { c.innerHTML = '<p style="text-align:center;color:var(--text-dim);">No skills in this category.</p>'; return; }
    c.innerHTML = data.map(s => `
      <div class="skill-card">
        <div class="skill-icon"><i class="${s.icon}"></i></div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-bar-wrap"><div class="skill-bar" data-level="${s.level}" style="width:0%"></div></div>
        <div class="skill-percent">${s.level}%</div>
      </div>`).join('');
    // animate bars visible now
    setTimeout(() => {
      c.querySelectorAll('.skill-bar').forEach(bar => {
        if (bar.getBoundingClientRect().top < window.innerHeight) {
          bar.style.width = bar.dataset.level + '%';
          bar.dataset.animated = '1';
        }
      });
    }, 100);
  };

  document.querySelectorAll('.skills-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.skills-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      window.renderSkills(tab.dataset.tab);
    });
  });
  window.renderSkills('web');

  /* ---- Render Services ---- */
  window.renderServices = function() {
    const c = document.getElementById('services-container');
    const data = window.portfolioData.services;
    if (!data.length) { c.innerHTML = '<p style="text-align:center;color:var(--text-dim);">No services added yet.</p>'; return; }
    c.innerHTML = data.map(s => `
      <div class="service-card reveal">
        <div class="service-icon"><i class="fa-solid ${s.icon}"></i></div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.description}</p>
        <ul class="service-features">${(s.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul>
      </div>`).join('');
    initReveal();
  };
  window.renderServices();

  /* ---- Render Timeline ---- */
  window.renderTimeline = function(type = 'experience') {
    const c = document.getElementById('experience-container');
    const data = window.portfolioData.timeline.filter(t => t.type === type);
    if (!data.length) { c.innerHTML = '<p style="text-align:center;color:var(--text-dim);">No entries yet.</p>'; return; }
    c.innerHTML = data.map((t, i) => `
      <div class="timeline-item ${i%2===0?'left':'right'}">
        <div class="timeline-content">
          <div class="timeline-period"><i class="fa-regular fa-calendar"></i> ${t.period}</div>
          <div class="timeline-title">${t.title}</div>
          <div class="timeline-org"><i class="fa-solid fa-building"></i> ${t.organization}</div>
          <p class="timeline-desc">${t.description}</p>
        </div>
        <div class="timeline-dot"></div>
      </div>`).join('');
    initReveal();
  };

  document.querySelectorAll('.exp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      window.renderTimeline(tab.dataset.tab);
    });
  });
  window.renderTimeline('experience');

  /* ---- Contact form ---- */
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('c-name').value.trim();
    const email   = document.getElementById('c-email').value.trim();
    const subject = document.getElementById('c-subject').value.trim();
    const message = document.getElementById('c-message').value.trim();
    const status  = document.getElementById('form-status');
    if (!name||!email||!subject||!message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      status.textContent = `Thank you, ${name}! Message received. I'll be in touch soon.`;
      status.className = 'form-status success';
      e.target.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }, 1400);
  });

  /* ---- CV download ---- */
  document.getElementById('cv-download-btn').addEventListener('click', e => {
    e.preventDefault();
    const info = window.portfolioData.info;
    const skills = window.portfolioData.skills.map(s=>`  - ${s.name} (${s.level}%)`).join('\n');
    const cvText = [
      info.heroName,
      'Full Stack Web Developer & Network Engineer',
      '',
      'CONTACT',
      `Email: ${info.email}`,
      `Phone: ${info.phone}`,
      `Location: ${info.location}`,
      '',
      'ABOUT',
      info.aboutBio.replace(/<[^>]+>/g,''),
      '',
      'SKILLS',
      skills,
      '',
      `Portfolio: ${window.location.href}`,
    ].join('\n');
    const blob = new Blob([cvText], { type:'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download:'Nur_Hossain_CV.txt' });
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ---- Footer year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id || id === 'admin') return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
      }
    });
  });

  /* ---- Initial trigger ---- */
  initReveal();
  setTimeout(onScroll, 50);
});
