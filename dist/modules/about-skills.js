const parseTime = (value) => {
  const text = String(value || '').trim();
  if (!text) return 0;
  if (text.endsWith('ms')) return Number.parseFloat(text) || 0;
  if (text.endsWith('s')) return (Number.parseFloat(text) || 0) * 1000;
  return Number.parseFloat(text) || 0;
};

const maxTransitionTime = (element) => {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const durations = style.transitionDuration.split(',').map(parseTime);
  const delays = style.transitionDelay.split(',').map(parseTime);
  const count = Math.max(durations.length, delays.length);
  let longest = 0;
  for (let index = 0; index < count; index += 1) {
    const duration = durations[index % durations.length] || 0;
    const delay = delays[index % delays.length] || 0;
    longest = Math.max(longest, duration + delay);
  }
  return longest;
};

const getFillDelay = (row) => parseTime(row.style.getPropertyValue('--skill-delay'));

const initAboutSkillsMotion = () => {
  const root = document.querySelector('#heroLens');
  const card = root?.querySelector('#heroFlipCard');
  const aboutFace = root?.querySelector('.hero-about-face');
  const skillsPanel = root?.querySelector('.hero-about-skills-panel');
  const skillRows = [...(root?.querySelectorAll('.hero-about-skill-row') || [])];
  if (!root || !card || !aboutFace || !skillsPanel || !skillRows.length) return;
  if (root.dataset.aboutSkillsMotionReady === 'true') return;

  root.dataset.aboutSkillsMotionReady = 'true';
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const requestFrame = window.requestAnimationFrame?.bind(window) || ((callback) => window.setTimeout(callback, 16));
  let visible = false;
  let startTimer = 0;
  let resetTimer = 0;
  let runId = 0;

  const clearTimers = () => {
    window.clearTimeout(startTimer);
    window.clearTimeout(resetTimer);
    startTimer = 0;
    resetTimer = 0;
  };

  const clearSkillState = () => {
    skillsPanel.classList.remove('is-about-skills-active', 'is-about-skills-shimmer');
  };

  const maxFillDelay = () => skillRows.reduce((longest, row) => Math.max(longest, getFillDelay(row)), 0);

  const startSkillSequence = () => {
    clearTimers();
    const sequenceId = ++runId;
    clearSkillState();

    const start = () => {
      if (sequenceId !== runId || !visible) return;
      requestFrame(() => {
        if (sequenceId !== runId || !visible) return;
        skillsPanel.classList.add('is-about-skills-active');
      });

      if (reducedMotion?.matches) return;
      const fillDuration = 900;
      const shimmerStart = fillDuration + maxFillDelay() + 80;
      startTimer = window.setTimeout(() => {
        if (sequenceId === runId && visible) {
          skillsPanel.classList.add('is-about-skills-shimmer');
        }
      }, shimmerStart);
    };

    const flipDuration = reducedMotion?.matches ? 0 : maxTransitionTime(card);
    startTimer = window.setTimeout(start, flipDuration ? flipDuration + 30 : 0);
  };

  const stopSkillSequence = () => {
    ++runId;
    window.clearTimeout(startTimer);
    startTimer = 0;
    skillsPanel.classList.remove('is-about-skills-shimmer');

    // Keep the completed fill in place while the Hero flips away. Clear it
    // only after the existing flip transition has finished, so no new reset
    // motion is visible during the established Hero animation.
    const clearAfterFlip = reducedMotion?.matches ? 0 : maxTransitionTime(card) + 30;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (!visible) clearSkillState();
      resetTimer = 0;
    }, clearAfterFlip);
  };

  const syncVisibility = () => {
    const nextVisible = card.classList.contains('is-flipped')
      && aboutFace.getAttribute('aria-hidden') === 'false';
    if (nextVisible === visible) return;
    visible = nextVisible;

    if (visible) {
      window.clearTimeout(resetTimer);
      resetTimer = 0;
      startSkillSequence();
    } else {
      stopSkillSequence();
    }
  };

  const observer = new MutationObserver(syncVisibility);
  observer.observe(card, { attributes: true, attributeFilter: ['class'] });
  observer.observe(aboutFace, { attributes: true, attributeFilter: ['aria-hidden'] });
  syncVisibility();

  reducedMotion?.addEventListener?.('change', () => {
    if (visible) startSkillSequence();
  });

  window.addEventListener('pagehide', () => {
    clearTimers();
    observer.disconnect();
  }, { once: true, passive: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSkillsMotion, { once: true });
} else {
  initAboutSkillsMotion();
}
