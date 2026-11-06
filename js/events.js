(() => {
  const triggers = [...document.querySelectorAll('[data-record-target]')];
  const overlays = [...document.querySelectorAll('[data-event-record-overlay]')];
  const stage = document.querySelector('.events-stage');
  if (!triggers.length || !overlays.length) return;

  let activeRecord = null;
  let closeTimer;
  const motionIsReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const closeDuration = motionIsReduced ? 20 : 900;

  const syncLanguage = (language = document.documentElement.dataset.language) => {
    const isChinese = language === 'zh';
    stage?.setAttribute('aria-label', isChinese ? '活动记录' : 'Event records');
    overlays.forEach((overlay) => {
      const closeButton = overlay.querySelector('.event-record-close');
      closeButton?.setAttribute('aria-label', isChinese ? '关闭活动药单' : 'Close event record');
      overlay.querySelectorAll('[data-alt-zh]').forEach((image) => {
        image.dataset.altEn ||= image.alt;
        image.alt = isChinese ? image.dataset.altZh : image.dataset.altEn;
      });
    });
  };

  const openRecord = (trigger) => {
    const overlay = document.getElementById(trigger.dataset.recordTarget);
    if (!overlay) return;
    window.clearTimeout(closeTimer);
    const closeButton = overlay.querySelector('.event-record-close');
    const spread = overlay.querySelector('.event-record-spread');
    const panels = overlay.querySelector('.event-paper-panels');
    const coverFlap = overlay.querySelector('.event-cover-flap');

    if (activeRecord && activeRecord.overlay !== overlay) closeRecord();
    activeRecord = { trigger, overlay };
    overlay.hidden = false;
    overlay.scrollTop = 0;
    if (spread) spread.scrollTop = 0;
    overlay.classList.remove('is-closing');
    document.body.classList.add('event-record-open');
    trigger.setAttribute('aria-expanded', 'true');

    window.requestAnimationFrame(() => {
      if (window.innerWidth > 760 && panels && spread && coverFlap) {
        spread.style.setProperty('--event-sheet-height', panels.scrollHeight + 'px');
      }
      window.requestAnimationFrame(() => overlay.classList.add('is-open'));
    });
    closeButton?.focus({ preventScroll: true });
  };

  function closeRecord() {
    if (!activeRecord) return;
    const { trigger, overlay } = activeRecord;
    activeRecord = null;
    overlay.classList.remove('is-open');
    overlay.classList.add('is-closing');
    document.body.classList.remove('event-record-open');
    trigger.setAttribute('aria-expanded', 'false');
    closeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
      trigger.focus({ preventScroll: true });
    }, closeDuration);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openRecord(trigger));
  });
  overlays.forEach((overlay) => {
    overlay.querySelector('.event-record-close')?.addEventListener('click', closeRecord);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeRecord();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (!activeRecord) return;
    if (event.key === 'Escape') closeRecord();
    if (event.key === 'Tab') {
      event.preventDefault();
      activeRecord.overlay.querySelector('.event-record-close')?.focus();
    }
  });
  window.addEventListener('herb-language-change', (event) => syncLanguage(event.detail?.language));
  syncLanguage();
})();
