
(function () {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const isHome = document.body.dataset.page === 'home';
  const base = document.body.dataset.base || './';

  const asset = (name) => `${base}assets/${encodeURI(name)}`;
  const projectImageSrc = (value) => typeof value === 'number'
    ? asset(`page-${String(value).padStart(2, '0')}.webp`)
    : asset(String(value));
  const prioritizeProjects = (projects) => projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const aPriority = a.project.associated_with === 'MYNTRA' ? 0 : 1;
      const bPriority = b.project.associated_with === 'MYNTRA' ? 0 : 1;
      return aPriority - bPriority || a.index - b.index;
    })
    .map(({ project }) => project);

  const projectBySlug = (s) => data.projects.find(p => p.slug === s);
  const projectIndexBySlug = (s) => data.projects.findIndex(p => p.slug === s);
  const renderCompanyChip = (company) => {
    if (!company?.name) return '';

    const logo = company.logo
      ? `<span class="company-logo company-logo-image" aria-hidden="true">
          <img src="${asset(company.logo)}" alt="">
        </span>`
      : `<span class="company-logo" aria-hidden="true">${company.name.charAt(0)}</span>`;

    return `<span class="chip company-chip">${logo}<span class="company-name">${company.name}</span></span>`;
  };
  const socialIcon = (platform) => ({
    whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-7.7 13l-1.1 4.1 4.2-1.1A8.8 8.8 0 1 0 12 3.2Zm0 15.9a7.1 7.1 0 0 1-3.6-1l-.3-.2-2.5.7.7-2.4-.2-.3A7.1 7.1 0 1 1 12 19.1Zm3.9-5.3c-.2-.1-1.2-.6-1.3-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5.9 5.9 0 0 1-2.9-2.5c-.1-.2 0-.3.1-.4l.3-.3.2-.4c0-.1 0-.3 0-.4l-.6-1.4c-.1-.2-.2-.2-.4-.2h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.8c0 1 .7 2 1 2.4a8.2 8.2 0 0 0 3.2 2.8c1.8.8 1.8.5 2.1.5.3 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3Z" fill="currentColor"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 8.8A1.9 1.9 0 1 1 6.3 5a1.9 1.9 0 0 1 .1 3.8ZM5 10.5h2.8V19H5v-8.5Zm4.6 0h2.7v1.2h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V19H16v-3.8c0-.9 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V19H9.6v-8.5Z" fill="currentColor"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.8 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.4A4.6 4.6 0 1 1 7.4 12 4.6 4.6 0 0 1 12 7.4Zm0 1.8A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Z" fill="currentColor"/></svg>`
  }[platform] || '');
  const renderSocialLink = ({ platform, label, url }) => {
    const icon = socialIcon(platform);
    const isValid = /^https?:\/\//.test(url || '');
    const content = `
      <span class="social-icon">${icon}</span>
      <span>${label}</span>`;

    return isValid
      ? `<a class="social-link social-${platform}" href="${url}" target="_blank" rel="noreferrer" aria-label="${label}">${content}</a>`
      : `<span class="social-link social-${platform} is-disabled" aria-disabled="true">${content}</span>`;
  };
  const renderProjectCard = (p) => `
    <a class="project-card" href="${base}projects/${p.slug}/index.html">
      <div class="thumb"><img src="${projectImageSrc(p.cover)}" alt="${p.title}"></div>
      <div class="body">
        <div class="meta-row" style="margin-bottom:10px;">
          <span class="chip">${p.associated_with}</span>
        </div>
        <h3>${p.title}</h3>
        <span class="btn primary">Open project</span>
      </div>
    </a>`;

  const renderNav = () => `
    <div class="nav">
      <div class="container nav-inner">
        <a class="brand" href="${base}index.html">${data.siteTitle} / ${data.role}</a>
        <div class="nav-links">
          <a href="${base}index.html#projects">Projects</a>
          <a href="${base}index.html#values">Values</a>
          <a href="${base}index.html#contact">Contact</a>
        </div>
      </div>
    </div>`;

  if (isHome) {
    const hero = document.getElementById('hero');
    const projects = document.getElementById('projects');
    const values = document.getElementById('values');
    const contact = document.getElementById('contact');
    const orderedProjects = prioritizeProjects(data.projects);
    const projectFilters = [...new Set(['TIGC', 'MYNTRA', ...data.projects.map(p => p.associated_with).filter(Boolean)])];
    const activeProjectFilters = new Set();
    const socialLinks = [
      { platform: 'whatsapp', label: 'WhatsApp', url: data.contact.whatsapp },
      { platform: 'linkedin', label: 'LinkedIn', url: data.contact.linkedin }
    ];

    hero.innerHTML = `
      <section class="hero">
        <div class="container">
          <div class="hero-card">
            <div class="hero-card-layout">
              <div class="hero-copy hero-copy-inline">
                <div class="kicker">Portfolio</div>
                <h1>${data.siteTitle}</h1>
                <p class="lead">${data.summary}</p>
                <div class="hero-meta">
                  <span class="chip">${data.role}</span>
                  ${renderCompanyChip(data.currentCompany)}
                  <span class="chip">${data.location}</span>
                </div>
                <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
                </div>
              </div>
              <div class="hero-aside">
                <div class="profile-card">
                  <div class="profile-glow" aria-hidden="true"></div>
                  <div class="profile-photo-shell">
                    <img class="profile-photo" src="${asset('images/main/muskan1.jpg')}" alt="${data.siteTitle} profile picture" />
                  </div>
                </div>
              </div>
              <div class="toc-strip hero-bottom-panels">
                <div class="toc-card">
                  <div class="kicker" style="font-size:.72rem;">Main headings from the portfolio</div>
                  <ul>
                      ${orderedProjects.map(p => `<li>${p.title}</li>`).join('')}
                  </ul>
                </div>
                <div class="values-card">
                  <div class="kicker" style="font-size:.72rem;">Value proposition</div>
                  <p class="small muted" style="margin:10px 0 0; line-height:1.7;"> A design journey that blends creativity with commenrcial thinking, creating products through research, innovation and execution to final development.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;

    const renderProjectsSection = () => {
      const visibleProjects = activeProjectFilters.size
        ? orderedProjects.filter(p => activeProjectFilters.has(p.associated_with))
        : orderedProjects;

      projects.innerHTML = `
        <section class="section">
          <div class="container">
            <h2>Projects</h2>
            <p class="muted">Here's a list of few projects I have worked on till now. Click on the project to check out.</p>
            ${projectFilters.length ? `
              <div class="project-filter-wrap">
                <div class="filter-label">Filter by association</div>
                <div class="project-filters" aria-label="Project filters">
                  ${projectFilters.map((filterValue) => `
                    <button
                      type="button"
                      class="filter-chip ${activeProjectFilters.has(filterValue) ? 'is-active' : ''}"
                      data-project-filter="${filterValue}"
                      aria-pressed="${activeProjectFilters.has(filterValue)}">
                      ${filterValue}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="grid project-grid">
              ${visibleProjects.length
                ? visibleProjects.map(renderProjectCard).join('')
                : `<div class="panel empty-projects">No projects match the selected filter.</div>`}
            </div>
          </div>
        </section>`;

      projects.querySelectorAll('[data-project-filter]').forEach((button) => {
        button.addEventListener('click', () => {
          const { projectFilter } = button.dataset;
          if (!projectFilter) return;

          if (activeProjectFilters.has(projectFilter)) {
            activeProjectFilters.delete(projectFilter);
          } else {
            activeProjectFilters.add(projectFilter);
          }

          renderProjectsSection();
        });
      });
    };

    renderProjectsSection();

    values.innerHTML = `
      <section class="section" id="values">
        <div class="container">
          <h2>My values</h2>
          <div class="grid values-grid">
            ${data.values.map(v => `<div class="panel"><strong>${v}</strong></div>`).join('')}
          </div>
        </div>
      </section>`;

    contact.innerHTML = `
      <section class="section" id="contact">
        <div class="container contact-grid">
          <div class="panel contact-panel">
            <div class="kicker">Contact</div>
            <h2 style="margin-top:10px;">Let’s start the conversation.</h2>
            <p class="muted">Send a quick message from the form and your mail app will open with everything prefilled, so reaching out feels simple and direct.</p>
            <div class="contact-list">
              <div><strong>Phone</strong><a href="tel:${data.contact.phone}">${data.contact.phone}</a></div>
              <div><strong>Email</strong><a href="mailto:${data.contact.email}">${data.contact.email}</a></div>
              <div><strong>Website</strong><a href="https://${data.contact.website}" target="_blank" rel="noreferrer">${data.contact.website}</a></div>
              <div><strong>Address</strong><span>${data.contact.address}</span></div>
            </div>
            <div class="social-block">
              <div class="filter-label">Follow me</div>
              <div class="social-links">
                ${socialLinks.map(renderSocialLink).join('')}
              </div>
            </div>
          </div>
          <div class="panel contact-panel">
            <form class="contact-form" id="contact-form">
              <div class="form-field">
                <label for="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" placeholder="Your name" required>
              </div>
              <div class="form-field">
                <label for="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" placeholder="you@example.com" required>
              </div>
              <div class="form-field">
                <label for="contact-subject">Subject</label>
                <input id="contact-subject" name="subject" type="text" placeholder="Project inquiry" required>
              </div>
              <div class="form-field">
                <label for="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows="6" placeholder="Hey! Whats up?" required></textarea>
              </div>
              <button class="btn primary contact-submit" type="submit">Send mail</button>
              <p class="contact-note">This opens your default mail app with the message ready to send.</p>
            </form>
          </div>
        </div>
      </section>`;

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        const mailSubject = encodeURIComponent(subject || `Portfolio inquiry for ${data.siteTitle}`);
        const mailBody = encodeURIComponent([
          `Name: ${name}`,
          `Email: ${email}`,
          '',
          message
        ].join('\n'));

        window.location.href = `mailto:${data.contact.email}?subject=${mailSubject}&body=${mailBody}`;
      });
    }

    document.getElementById('nav-root').innerHTML = renderNav();
    return;
  }

  const projectSlug = document.body.dataset.project;
  const project = projectBySlug(projectSlug);
  if (!project) return;
  const projectIndex = projectIndexBySlug(projectSlug);
  const previousProject = projectIndex > 0 ? data.projects[projectIndex - 1] : null;
  const nextProject = projectIndex >= 0 && projectIndex < data.projects.length - 1 ? data.projects[projectIndex + 1] : null;
  const projectSlides = project.pages.map(([page, caption]) => ({
    page,
    caption,
    src: projectImageSrc(page),
    alt: `${caption} - ${project.title}`
  }));

  const hero = document.getElementById('project-hero');
  const gallery = document.getElementById('gallery');
  const nav = document.getElementById('nav-root');

  nav.innerHTML = renderNav();

  hero.innerHTML = `
    <section class="page-hero">
      <div class="container page-hero-inner">
        <div class="page-info">
          <div class="range">${project.associated_with}</div>
          <h1>${project.title}</h1>
          <div class="project-actions">
            <a class="btn back" href="${base}index.html#projects">Back to projects</a>
            <nav class="project-pagination" aria-label="Project navigation">
              ${previousProject
                ? `<a class="btn" href="${base}projects/${previousProject.slug}/index.html" aria-label="Previous project: ${previousProject.title}">← Previous</a>`
                : `<span class="btn is-disabled" aria-disabled="true">← Previous</span>`}
              ${nextProject
                ? `<a class="btn primary" href="${base}projects/${nextProject.slug}/index.html" aria-label="Next project: ${nextProject.title}">Next →</a>`
                : `<span class="btn primary is-disabled" aria-disabled="true">Next →</span>`}
            </nav>
          </div>
        </div>
      </div>
    </section>`;

  gallery.innerHTML = `
    <section class="gallery">
      <div class="container">
        <h2>Project details</h2>
        <p class="muted">Click any page below to open it in a popup and browse the visuals for this project.</p>
        <div class="gallery-grid">
          ${projectSlides.map((slide, index) => `
            <article class="gallery-item">
              <button class="gallery-trigger" type="button" data-gallery-index="${index}" aria-label="Open ${slide.caption}">
                <img src="${slide.src}" alt="${slide.alt}">
              </button>
              <div class="caption">
                <button class="caption-trigger" type="button" data-gallery-index="${index}">
                  <div class="page-no">${slide.caption}</div>
                </button>
              </div>
            </article>
          `).join('')}
        </div>
        <div class="lightbox" id="project-lightbox" aria-hidden="true">
          <div class="lightbox-backdrop" data-lightbox-close></div>
          <div class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Project image viewer">
            <div class="lightbox-toolbar">
              <div class="lightbox-meta">
                <span class="lightbox-counter" id="lightbox-counter"></span>
                <span class="lightbox-caption" id="lightbox-caption"></span>
              </div>
              <button class="btn lightbox-close" type="button" data-lightbox-close aria-label="Close popup">Close ✕</button>
            </div>
            <div class="lightbox-stage">
              <button class="btn lightbox-nav" type="button" id="lightbox-prev" aria-label="Previous image">← Previous</button>
              <div class="lightbox-frame">
                <img id="lightbox-image" src="" alt="">
              </div>
              <button class="btn primary lightbox-nav lightbox-next" type="button" id="lightbox-next" aria-label="Next image">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const lightbox = document.getElementById('project-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCloseButtons = lightbox.querySelectorAll('[data-lightbox-close]');
  const galleryTriggers = gallery.querySelectorAll('[data-gallery-index]');
  let activeSlideIndex = 0;

  const renderActiveSlide = () => {
    const slide = projectSlides[activeSlideIndex];
    if (!slide) return;

    lightboxImage.src = slide.src;
    lightboxImage.alt = slide.alt;
    lightboxCaption.textContent = slide.caption;
    lightboxCounter.textContent = `${activeSlideIndex + 1} / ${projectSlides.length}`;
    lightboxPrev.disabled = activeSlideIndex === 0;
    lightboxNext.disabled = activeSlideIndex === projectSlides.length - 1;
    lightboxPrev.classList.toggle('is-disabled', lightboxPrev.disabled);
    lightboxNext.classList.toggle('is-disabled', lightboxNext.disabled);
  };

  const openLightbox = (index) => {
    activeSlideIndex = index;
    renderActiveSlide();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const goToSlide = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= projectSlides.length) return;
    activeSlideIndex = nextIndex;
    renderActiveSlide();
  };

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openLightbox(Number(trigger.dataset.galleryIndex));
    });
  });

  lightboxPrev.addEventListener('click', () => goToSlide(activeSlideIndex - 1));
  lightboxNext.addEventListener('click', () => goToSlide(activeSlideIndex + 1));
  lightboxCloseButtons.forEach((button) => button.addEventListener('click', closeLightbox));

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      goToSlide(activeSlideIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      goToSlide(activeSlideIndex + 1);
    }
  });
})();
