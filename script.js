/**
 * Classic Elegant Wedding Invitation
 * English Mobile Wedding Invitation - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();

    const period = hours < 12 ? 'AM' : 'PM';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ':00';

    return `${date} / ${month} / ${year}  ${day} ${h12}${minuteStr} ${period}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
      const images = [];
      let current = 1;
      let consecutiveFails = 0;

      function tryNext() {
        if (current > maxAttempts || consecutiveFails >= 3) {
          resolve(images);
          return;
        }

        const img = new Image();
        const path = `images/${folder}/${current}.jpg`;

        img.onload = function() {
          images.push(path);
          consecutiveFails = 0;
          current++;
          tryNext();
        };

        img.onerror = function() {
          consecutiveFails++;
          current++;
          tryNext();
        };

        img.src = path;
      }

      tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast Notifications
     ═══════════════════════════════════════════ */

  let toastTimer = null;

  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      el.classList.remove('is-visible');
    }, 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }

      showToast(successMsg || 'Copied successfully');
    } catch {
      showToast('Failed to copy');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;

    document.title = m.title;

    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };

    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    // If useCurtain is false, skip the curtain entirely
    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      initPetals();
      return;
    }

    namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;

    btn.addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');

      setTimeout(() => {
        curtain.classList.add('is-hidden');
        initPetals();
      }, 1400);
    });

    document.body.classList.add('no-scroll');
  }

  /* ═══════════════════════════════════════════
     Falling Petals
     ═══════════════════════════════════════════ */

  function initPetals() {
    const canvas = $('#petalCanvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    const PETAL_COUNT = 25;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -20;
        this.size = 8 + Math.random() * 10;
        this.speedY = 0.5 + Math.random() * 1;
        this.speedX = -0.3 + Math.random() * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.oscillateAmp = 20 + Math.random() * 30;
        this.oscillateSpeed = 0.01 + Math.random() * 0.02;
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.2 + Math.random() * 0.4;
        this.t = 0;
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX +
          Math.sin(
            this.t * this.oscillateSpeed + this.oscillateOffset
          ) * 0.5;

        this.rotation += this.rotSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#e8c8b0';

        ctx.beginPath();

        // Petal shape
        ctx.moveTo(0, 0);

        ctx.bezierCurveTo(
          this.size * 0.3,
          -this.size * 0.4,
          this.size * 0.7,
          -this.size * 0.5,
          this.size,
          0
        );

        ctx.bezierCurveTo(
          this.size * 0.7,
          this.size * 0.3,
          this.size * 0.3,
          this.size * 0.3,
          0,
          0
        );

        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroDate').textContent = formatDate(
      CONFIG.wedding.date,
      CONFIG.wedding.time
    );
    $('#heroVenue').textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '0';
        $('#countMinutes').textContent = '0';
        $('#countSeconds').textContent = '0';

        labelEl.textContent = 'Wedding started';
        return;
      }

      const totalDays = Math.ceil(
        diff / (1000 * 60 * 60 * 24)
      );

      labelEl.textContent = `Until the wedding: ${totalDays} days`;

      const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (diff / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (diff / 1000) % 60
      );

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    $('#greetingParents').innerHTML = `
      <div class="parent-row">
        <span class="child-name">${g.name}</span>
        <span class="parent-dot">♥</span>
        <span class="child-name">${b.name}</span>
      </div>
    `;
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();

    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const grid = $('#calendarGrid');

    // Header
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    grid.innerHTML = `
      <div class="calendar__header">
        ${monthNames[month]} ${year}
      </div>
    `;

    // Weekdays
    const weekdays = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ];

    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';

    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });

    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const lastDate = new Date(
      year,
      month + 1,
      0
    ).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');

      dayEl.className = 'calendar__day';

      if (d === weddingDay) {
        dayEl.classList.add('is-today');
      }

      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);

    // Google Calendar link
    const startDate =
      dt.toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';

    const endDt = new Date(
      dt.getTime() + 2 * 60 * 60 * 1000
    );

    const endDate =
      endDt.toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';

    const gcalUrl =
      `https://calendar.google.com/calendar/render` +
      `?action=TEMPLATE` +
      `&text=${encodeURIComponent(
        CONFIG.groom.name +
        ' ♥ ' +
        CONFIG.bride.name +
        ' Wedding'
      )}` +
      `&dates=${startDate}/${endDate}` +
      `&location=${encodeURIComponent(
        CONFIG.wedding.venue +
        ' ' +
        CONFIG.wedding.address
      )}` +
      `&details=${encodeURIComponent(
        'You are invited to our wedding.'
      )}`;

    $('#googleCalBtn').href = gcalUrl;

    // ICS download
    $('#icsDownloadBtn').addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding//Invitation//EN',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} Wedding`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        'DESCRIPTION:You are invited to our wedding.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob(
        [icsContent],
        {
          type: 'text/calendar;charset=utf-8'
        }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'wedding.ics';
      a.click();

      URL.revokeObjectURL(url);

      showToast('Calendar file downloaded');
    });
  }

  /* ═══════════════════════════════════════════
     Story Section
     ═══════════════════════════════════════════ */

  function initStory(storyImages) {
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    const container = $('#storyPhotos');

    // Remove loading placeholder if present
    const placeholder =
      container.querySelector('.loading-placeholder');

    if (placeholder) {
      placeholder.remove();
    }

    if (storyImages.length === 0) return;

    storyImages.forEach((src, i) => {
      const div = document.createElement('div');

      div.className = 'story__photo-item animate-item';
      div.setAttribute('data-animate', 'fade-up');

      div.innerHTML = `
        <img
          src="${src}"
          alt="Story Photo ${i + 1}"
          loading="lazy"
        >
      `;

      div.addEventListener('click', () => {
        openPhotoModal(storyImages, i);
      });

      container.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  function initGallery(galleryImages) {
    const grid = $('#galleryGrid');
    if (!grid) return;

    // Clear all existing gallery items before adding photos
    grid.innerHTML = '';

    // Display only the first 6 pictures
    const photos = galleryImages.slice(0, 6);

    if (photos.length === 0) {
      const gallerySection = $('#gallery');
      if (gallerySection) {
        gallerySection.style.display = 'none';
      }
      return;
    }

    const gallerySection = $('#gallery');
    if (gallerySection) {
      gallerySection.style.display = '';
    }

    photos.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery__item animate-item';
      div.setAttribute('data-animate', 'scale-in');

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Gallery Photo ${i + 1}`;
      img.loading = 'lazy';

      div.appendChild(img);

      div.addEventListener('click', () => {
        openPhotoModal(photos, i);
      });

      grid.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;

    showModalImage();

    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function showModalImage() {
    const img = $('#modalImg');

    img.src = modalImages[modalIndex];

    $('#modalCounter').textContent =
      `${modalIndex + 1} / ${modalImages.length}`;

    $('#modalPrev').style.display =
      modalIndex > 0 ? '' : 'none';

    $('#modalNext').style.display =
      modalIndex < modalImages.length - 1
        ? ''
        : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;

    if (
      newIndex >= 0 &&
      newIndex < modalImages.length
    ) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener(
      'click',
      closePhotoModal
    );

    $('#modalPrev').addEventListener(
      'click',
      () => modalNavigate(-1)
    );

    $('#modalNext').addEventListener(
      'click',
      () => modalNavigate(1)
    );

    const modal = $('#photoModal');

    modal.addEventListener('click', (e) => {
      if (
        e.target === modal ||
        e.target.id === 'modalContainer'
      ) {
        closePhotoModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closePhotoModal();
      }

      if (e.key === 'ArrowLeft') {
        modalNavigate(-1);
      }

      if (e.key === 'ArrowRight') {
        modalNavigate(1);
      }
    });

    // Swipe support
    const container = $('#modalContainer');

    container.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    container.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        handleSwipe();
      },
      { passive: true }
    );
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (
      Math.abs(diffX) < minSwipe ||
      Math.abs(diffX) < Math.abs(diffY)
    ) {
      return;
    }

    if (diffX > 0) {
      // Swipe left -> next photo
      modalNavigate(1);
    } else {
      // Swipe right -> previous photo
      modalNavigate(-1);
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;

    $('#locationVenue').textContent = w.venue;
    $('#locationHall').textContent = w.hall;
    $('#locationAddress').textContent = w.address;

    $('#locationTel').textContent =
      w.tel ? `Tel. ${w.tel}` : '';

    $('#locationMapImg').src =
      'images/location/1.jpg';

    $('#kakaoMapBtn').href =
      w.mapLinks.kakao || '#';

    $('#naverMapBtn').href =
      w.mapLinks.naver || '#';

    $('#googleMapBtn').href =
      w.mapLinks.google || '#';

    $('#copyAddressBtn').addEventListener(
      'click',
      () => {
        copyToClipboard(
          w.address,
          'Address copied successfully'
        );
      }
    );
  }

  /* ═══════════════════════════════════════════
     Account Section (Wedding Gifts)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);

    accounts.forEach((acc) => {
      const item = document.createElement('div');

      item.className = 'account-item';

      item.innerHTML = `
        <div class="account-item__info">
          <div class="account-item__role">
            ${acc.role}
          </div>

          <div class="account-item__detail">
            <span class="account-item__name">
              ${acc.name || ''}
            </span>

            ${acc.bank} ${acc.number}
          </div>
        </div>

        <button
          class="account-item__copy"
          data-account="${acc.bank} ${acc.number} ${acc.name || ''}"
        >
          Copy
        </button>
      `;

      container.appendChild(item);
    });
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded =
        trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute(
        'aria-expanded',
        !expanded
      );

      if (!expanded) {
        panel.style.maxHeight =
          panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(
      CONFIG.accounts.groom,
      'groomAccountList'
    );

//    renderAccounts(
//      CONFIG.accounts.bride,
//      'brideAccountList'
//    );

    initAccordion(
      'groomAccordion',
      'groomAccordionPanel'
    );

    initAccordion(
      'brideAccordion',
      'brideAccordionPanel'
    );

    // Copy account number using event delegation
    document.addEventListener('click', (e) => {
      const btn =
        e.target.closest('.account-item__copy');

      if (!btn) return;

      const text = btn.dataset.account;

      copyToClipboard(
        text,
        'Account information copied'
      );
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();

    const year = dt.getFullYear();

    const month = String(
      dt.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      dt.getDate()
    ).padStart(2, '0');

    $('#footerText').textContent =
      `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const storyPhotos = $('#storyPhotos');
    const galleryGrid = $('#galleryGrid');

    const placeholderHTML =
      '<div class="loading-placeholder">' +
      '<span class="loading-dot"></span>' +
      '<span class="loading-dot"></span>' +
      '<span class="loading-dot"></span>' +
      '</div>';

    if (storyPhotos) {
      storyPhotos.innerHTML = placeholderHTML;
    }

    if (galleryGrid) {
      galleryGrid.innerHTML = placeholderHTML;
    }
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Observe initial static items
    $$('.animate-item').forEach((el) => {
      observer.observe(el);
    });

    // Re-observe after dynamic content is added
    // using MutationObserver
    const mutObs = new MutationObserver(
      (mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;

            if (
              node.classList &&
              node.classList.contains('animate-item')
            ) {
              observer.observe(node);
            }

            if (node.querySelectorAll) {
              node
                .querySelectorAll('.animate-item')
                .forEach((el) => {
                  observer.observe(el);
                });
            }
          });
        });
      }
    );

    mutObs.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* FAQ */
  document.querySelectorAll('.faq__question').forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items
      document.querySelectorAll('.faq__question').forEach((item) => {
        item.setAttribute('aria-expanded', 'false');
        item.nextElementSibling.style.maxHeight = null;
      });

      // Open the selected item
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Google drive upload */


  /* Google Drive photo upload */


function initGoogleDriveUpload() {
  const button = document.getElementById('googleDriveUploadBtn');

  if (button) {
    const driveUrl = CONFIG.googleDriveUploadUrl;

    if (driveUrl) {
      button.href = driveUrl;
    } else {
      button.style.display = 'none';
    }
  }

  const form = document.getElementById('photoUploadForm');
  const fileInput = document.getElementById('weddingPhotoFiles');
  const submitButton = document.getElementById('photoUploadSubmit');
  const status = document.getElementById('photoUploadStatus');
  const frame = document.getElementById('photoUploadFrame');

  if (!form || !fileInput || !submitButton || !status || !frame) {
    console.error('Photo upload form elements are missing.');
    return;
  }

  const uploadUrl = CONFIG.googleDriveUploadUrl;

  if (!uploadUrl || !uploadUrl.includes('/exec')) {
    status.textContent = 'Photo upload is not configured correctly.';
    return;
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ];

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const files = Array.from(fileInput.files || []);

    if (files.length === 0) {
      status.textContent = 'Please select at least one photo.';
      return;
    }

    if (files.length > 30) {
      status.textContent = 'Please select no more than 30 photos at a time.';
      return;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        status.textContent = `Unsupported photo type: ${file.name}`;
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        status.textContent = `${file.name} is larger than 30 MB.`;
        return;
      }
    }

    submitButton.disabled = true;
    fileInput.disabled = true;
    let uploaded = 0;

    try {

        for (const originalFile of files) {
          status.textContent =
            `Compressing photo ${uploaded + 1} of ${files.length}...`;

          const file = await compressWeddingPhoto(originalFile);

          const base64 = await new Promise((resolve, reject) => {

          const reader = new FileReader();

          reader.onload = () => {
            const result = String(reader.result || '');
            resolve(result.substring(result.indexOf(',') + 1));
          };

          reader.onerror = () => {
            reject(new Error(`Could not read ${file.name}`));
          };

          reader.readAsDataURL(file);
        });

        status.textContent =
          `Uploading photo ${uploaded + 1} of ${files.length}...`;

        await new Promise((resolve, reject) => {
          const requestId =
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;

          let completed = false;

          const finish = (error) => {
            if (completed) return;
            completed = true;

            clearTimeout(timeout);
            window.removeEventListener('message', onMessage);

            if (error) reject(error);
            else resolve();
          };

          const timeout = setTimeout(() => {
            finish(new Error(
              'No upload confirmation received. Check the Apps Script deployment and browser console.'
            ));
          }, 120000);

          function onMessage(event) {
            const data = event.data;

            if (
              !data ||
              data.type !== 'wedding-upload' ||
              data.requestId !== requestId
            ) {
              return;
            }

            // Apps Script can return through script.googleusercontent.com.
            // Match the request ID and message type rather than assuming
            // the response origin is always the original /exec URL.
            if (data.success) {
              finish();
            } else {
              finish(new Error(data.message || 'Google Drive rejected the upload.'));
            }
          }

          window.addEventListener('message', onMessage);

          const uploadForm = document.createElement('form');
          uploadForm.method = 'POST';
          uploadForm.action = uploadUrl;
          uploadForm.target = frame.name;
          uploadForm.style.display = 'none';

          const payloadInput = document.createElement('input');
          payloadInput.type = 'hidden';
          payloadInput.name = 'payload';
          payloadInput.value = JSON.stringify({
            requestId,
            files: [{
              name: file.name,
              type: file.type,
              data: base64
            }]
          });

          uploadForm.appendChild(payloadInput);
          document.body.appendChild(uploadForm);
          uploadForm.submit();
          uploadForm.remove();
        });

        uploaded++;
      }

      status.textContent =
        `Success! All ${uploaded} photo(s) uploaded. Thank you!`;

      form.reset();

    } catch (error) {
      console.error('Wedding photo upload failed:', error);

      status.textContent =
        `Upload stopped after ${uploaded} of ${files.length} photos. ${error.message}`;
    } finally {
      submitButton.disabled = false;
      fileInput.disabled = false;
    }
  });
}



async function compressWeddingPhoto(file) {
  // Only try to compress common browser-supported image types.
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  ) {
    return file;
  }

  let image;

  try {
    image = await createImageBitmap(file);

    const maxDimension = 2000;
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height)
    );

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const compressedBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });

    // If compression fails, upload the original photo instead.
    if (!compressedBlob) {
      return file;
    }

    return new File(
      [compressedBlob],
      file.name.replace(/\.[^.]+$/, '') + '.jpg',
      { type: 'image/jpeg', lastModified: Date.now() }
    );

  } catch (error) {
    // An image that cannot be decoded should not stop all uploads.
    console.warn('Could not compress photo; using original:', file.name, error);
    return file;

  } finally {
    if (image) {
      image.close();
    }
  }
}



/* ═══ Wedding RSVP ═══ */

// Use the same deployed Apps Script URL as the photo uploader.
const RSVP_WEB_APP_URL = CONFIG.googleDriveUploadUrl;
function initRsvp() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const guestSection = document.getElementById('rsvpGuestSection');
  const slider = document.getElementById('rsvpGuestSlider');
  const numberInput = document.getElementById('rsvpGuests');
  const submitButton = document.getElementById('rsvpSubmit');
  const status = document.getElementById('rsvpStatus');
  const responseFrame = document.getElementById('rsvpResponseFrame');

  let activeRequestId = null;
  let timeoutId = null;

  function setGuests(value) {
    const parsed = Number(value);
    const guests = Number.isFinite(parsed)
      ? Math.max(1, Math.min(5, Math.floor(parsed)))
      : 1;

    slider.value = String(guests);
    numberInput.value = String(guests);

    const guestLabel = document.getElementById('rsvpGuestLabel');
    if (guestLabel) {
      guestLabel.textContent = guests === 1 ? 'guest' : 'guests';
    }
  }

  slider.addEventListener('input', () => setGuests(slider.value));

  numberInput.addEventListener('input', () => {
    if (numberInput.value === '') return;
    setGuests(numberInput.value);
  });

  numberInput.addEventListener('change', () => {
    setGuests(numberInput.value);
  });

  form.querySelectorAll('input[name="attendance"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const attending = form.querySelector(
        'input[name="attendance"]:checked'
      )?.value === 'Yes';

      guestSection.hidden = !attending;

      if (attending) {
        setGuests(1);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (activeRequestId) return;

    if (!RSVP_WEB_APP_URL.startsWith('https://script.google.com/')) {
      status.textContent = 'Please configure the RSVP submission URL.';
      return;
    }

    const name = document.getElementById('rsvpName').value.trim();
    const attendance = form.querySelector(
      'input[name="attendance"]:checked'
    )?.value;

    if (!name || !['Yes', 'No'].includes(attendance)) {
      status.textContent = 'Please enter your name and select your attendance.';
      return;
    }

    const guests = attendance === 'Yes'
      ? Math.max(1, Math.min(5, Math.floor(Number(numberInput.value) || 1)))
      : 0;

    const requestId = (
      window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    const payload = {
      type: 'wedding-rsvp',
      requestId,
      name,
      attendance,
      guests,
      notes: document.getElementById('rsvpNotes').value.trim()
    };

    activeRequestId = requestId;
    submitButton.disabled = true;
    status.innerHTML =
      '<span class="rsvp-loader" aria-hidden="true"></span> Sending your RSVP...';
    status.classList.remove('rsvp__status--success', 'rsvp__status--error');

    const onMessage = (event) => {
      const data = event.data;

      if (
        !data ||
        data.type !== 'wedding-rsvp' ||
        data.requestId !== requestId
      ) {
        return;
      }

      window.removeEventListener('message', onMessage);
      clearTimeout(timeoutId);

      activeRequestId = null;
      submitButton.disabled = false;

      if (data.success) {
        status.textContent = 'Thank you! Your RSVP has been received.';
        status.classList.remove('rsvp__status--error');
        status.classList.add('rsvp__status--success');

        form.reset();
        setGuests(1);
        guestSection.hidden = true;
      } else {
        status.textContent =
          data.message || 'Sorry, your RSVP could not be submitted. Please try again.';

        status.classList.remove('rsvp__status--success');
        status.classList.add('rsvp__status--error');
      }
    };

    window.addEventListener('message', onMessage);

    const postForm = document.createElement('form');
    postForm.method = 'POST';
    postForm.action = RSVP_WEB_APP_URL;
    postForm.target = responseFrame.name;
    postForm.hidden = true;

    const payloadInput = document.createElement('input');
    payloadInput.type = 'hidden';
    payloadInput.name = 'payload';
    payloadInput.value = JSON.stringify(payload);

    postForm.appendChild(payloadInput);
    document.body.appendChild(postForm);
    postForm.submit();
    postForm.remove();

    timeoutId = setTimeout(() => {
      if (activeRequestId !== requestId) return;

      window.removeEventListener('message', onMessage);
      activeRequestId = null;
      submitButton.disabled = false;

      status.textContent =
        'We could not confirm your RSVP. Please check your spreadsheet before trying again.';
    }, 45000);
  });
}



initRsvp();



// Helper
const photoUploadLoader = document.getElementById("photoUploadLoader");
const photoUploadStatus = document.getElementById("photoUploadStatus");

function showPhotoUploadLoader(message) {
  if (photoUploadLoader) {
    photoUploadLoader.hidden = false;
  }

  if (photoUploadStatus && message) {
    photoUploadStatus.textContent = message;
  }
}

function hidePhotoUploadLoader() {
  if (photoUploadLoader) {
    photoUploadLoader.hidden = true;
  }
}



  /* ═══════════════════════════════════════════
     Initialization
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();

    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();
    initGoogleDriveUpload();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Initialize sections that don't depend on image detection
    initPhotoModal();
    initLocation();
//    initAccounts();
    initFooter();
    initScrollAnimations();

    // Set story text immediately
    // Photos will load asynchronously
    $('#storyTitle').textContent =
      CONFIG.story.title;

    $('#storyContent').textContent =
      CONFIG.story.content;

    // Auto-detect story and gallery images in parallel
    const [storyImages, galleryImages] =
      await Promise.all([
        loadImagesFromFolder('story'),
        loadImagesFromFolder('gallery')
      ]);

    // Render sections with discovered images
    initStory(storyImages);
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    );
  } else {
    init();
  }

})();