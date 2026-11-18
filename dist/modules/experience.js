export function initExperience(root = document.querySelector('#experienceTimeline')) {
  if (!root || root.dataset.experienceReady === 'true') return;

  const items = [...root.querySelectorAll('.experience-item')];
  if (!items.length) return;
  root.dataset.experienceReady = 'true';

  const timers = new WeakMap();
  const reducedMotion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  const finePointer = typeof window.matchMedia === 'function'
    ? window.matchMedia('(hover: hover) and (pointer: fine)')
    : { matches: false };
  const nextFrame = typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (callback) => window.setTimeout(callback, 0);

  const parts = (item) => ({
    toggle: item.querySelector('.experience-toggle'),
    detail: item.querySelector('.experience-details'),
  });

  const clearPendingHide = (detail) => {
    const timer = timers.get(detail);
    if (timer) window.clearTimeout(timer);
    timers.delete(detail);
  };

  const closeItem = (item) => {
    const { toggle, detail } = parts(item);
    if (!toggle || !detail) return;

    clearPendingHide(detail);
    toggle.setAttribute('aria-expanded', 'false');
    detail.setAttribute('aria-hidden', 'true');
    item.classList.remove('is-open');

    if (reducedMotion.matches) {
      detail.hidden = true;
      return;
    }

    const timer = window.setTimeout(() => {
      if (!item.classList.contains('is-open')) detail.hidden = true;
      timers.delete(detail);
    }, 360);
    timers.set(detail, timer);
  };

  const setOpen = (item, open) => {
    const { toggle, detail } = parts(item);
    if (!toggle || !detail) return;

    clearPendingHide(detail);
    toggle.setAttribute('aria-expanded', String(open));
    detail.setAttribute('aria-hidden', String(!open));

    if (open) {
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });
      detail.hidden = false;
      item.classList.remove('is-open');
      nextFrame(() => {
        if (toggle.getAttribute('aria-expanded') === 'true') item.classList.add('is-open');
      });
      return;
    }

    closeItem(item);
  };

  const initialItem = items.find((item) => {
    const toggle = item.querySelector('.experience-toggle');
    return item.classList.contains('is-open') || toggle?.getAttribute('aria-expanded') === 'true';
  }) || items[0];

  items.forEach((item) => {
    const { toggle, detail } = parts(item);
    if (!toggle || !detail) return;

    const open = item === initialItem;
    item.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    detail.setAttribute('aria-hidden', String(!open));
    detail.hidden = !open;
    toggle.addEventListener('click', () => {
      setOpen(item, toggle.getAttribute('aria-expanded') !== 'true');
    });
    item.addEventListener('pointerenter', (event) => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      setOpen(item, true);
    }, { passive: true });
    toggle.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      setOpen(item, toggle.getAttribute('aria-expanded') !== 'true');
    });
  });
}
