const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const settle = (value, target, threshold) => Math.abs(value - target) <= threshold;

export function initHeroLens(root = document.querySelector('#heroLens')) {
  if (!root || root.dataset.heroLensReady === 'true') return;

  const revealLayer = root.querySelector('.hero-lens-reveal');
  const flipCard = root.querySelector('#heroFlipCard');
  const frontFace = root.querySelector('.hero-front-face');
  const aboutFace = root.querySelector('.hero-about-face');
  const titleNodes = root.querySelectorAll('.hero-content');
  if (!revealLayer || !flipCard || !frontFace || !aboutFace || !titleNodes.length) return;

  root.dataset.heroLensReady = 'true';

  const getMediaQuery = (query) => {
    if (typeof window.matchMedia === 'function') return window.matchMedia(query);
    return { matches: false, addEventListener() {}, addListener() {} };
  };
  const reducedMotion = getMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = getMediaQuery('(hover: hover) and (pointer: fine)');
  const requestFrame = typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (callback) => window.setTimeout(callback, 16);
  const cancelFrame = typeof window.cancelAnimationFrame === 'function'
    ? window.cancelAnimationFrame.bind(window)
    : window.clearTimeout.bind(window);

  const target = { x: 50, y: 50, radius: 0 };
  const current = { x: 50, y: 50, radius: 0, opacity: 0 };
  const targetTitle = { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 };
  const currentTitle = { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 };
  const orbSafeGap = 10;

  let frameId = 0;
  let pointerInside = false;
  let heroInView = true;
  let flipped = false;
  let frameRect = null;

  const writeLensVariables = () => {
    root.style.setProperty('--lens-x', `${current.x.toFixed(2)}%`);
    root.style.setProperty('--lens-y', `${current.y.toFixed(2)}%`);
    root.style.setProperty('--lens-radius', `${current.radius.toFixed(1)}px`);
    root.style.setProperty('--lens-opacity', current.opacity.toFixed(3));
  };

  const writeTitleVariables = () => {
    const vars = [
      ['--title-x', `${currentTitle.x.toFixed(2)}px`],
      ['--title-y', `${currentTitle.y.toFixed(2)}px`],
      ['--title-rotate-x', `${currentTitle.rotateX.toFixed(2)}deg`],
      ['--title-rotate-y', `${currentTitle.rotateY.toFixed(2)}deg`],
      ['--title-rotate-z', `${currentTitle.rotateZ.toFixed(2)}deg`],
      ['--title-middle-x', `${(currentTitle.x * 0.08).toFixed(2)}px`],
      ['--title-middle-y', `${(currentTitle.y * 0.08).toFixed(2)}px`],
      ['--title-middle-rotate-x', `${(currentTitle.rotateX * 0.08).toFixed(2)}deg`],
      ['--title-middle-rotate-y', `${(currentTitle.rotateY * 0.08).toFixed(2)}deg`],
      ['--title-middle-rotate-z', `${(currentTitle.rotateZ * 0.08).toFixed(2)}deg`],
      ['--title-signature-x', `${(currentTitle.x * -0.18).toFixed(2)}px`],
      ['--title-signature-y', `${(currentTitle.y * -0.18).toFixed(2)}px`],
      ['--title-signature-rotate-x', `${(currentTitle.rotateX * -0.18).toFixed(2)}deg`],
      ['--title-signature-rotate-y', `${(currentTitle.rotateY * -0.18).toFixed(2)}deg`],
      ['--title-signature-rotate-z', `${(currentTitle.rotateZ * -0.18).toFixed(2)}deg`],
    ];
    vars.forEach(([name, value]) => root.style.setProperty(name, value));
  };

  const cancelMotion = () => {
    if (frameId) cancelFrame(frameId);
    frameId = 0;
  };

  const isSettled = () => settle(current.x, target.x, 0.08)
    && settle(current.y, target.y, 0.08)
    && settle(current.radius, target.radius, 0.25)
    && settle(currentTitle.x, targetTitle.x, 0.08)
    && settle(currentTitle.y, targetTitle.y, 0.08)
    && settle(currentTitle.rotateX, targetTitle.rotateX, 0.08)
    && settle(currentTitle.rotateY, targetTitle.rotateY, 0.08)
    && settle(currentTitle.rotateZ, targetTitle.rotateZ, 0.08);

  const drawMotion = () => {
    const positionSmoothing = reducedMotion.matches ? 1 : 0.1;
    const radiusSmoothing = reducedMotion.matches ? 1 : 0.16;
    const titleSmoothing = reducedMotion.matches ? 1 : 0.12;

    current.x += (target.x - current.x) * positionSmoothing;
    current.y += (target.y - current.y) * positionSmoothing;
    current.radius += (target.radius - current.radius) * radiusSmoothing;
    currentTitle.x += (targetTitle.x - currentTitle.x) * titleSmoothing;
    currentTitle.y += (targetTitle.y - currentTitle.y) * titleSmoothing;
    currentTitle.rotateX += (targetTitle.rotateX - currentTitle.rotateX) * titleSmoothing;
    currentTitle.rotateY += (targetTitle.rotateY - currentTitle.rotateY) * titleSmoothing;
    currentTitle.rotateZ += (targetTitle.rotateZ - currentTitle.rotateZ) * titleSmoothing;

    // Keep the black layer opaque while it shrinks. This avoids a gray veil
    // competing with the radius animation during pointer exit.
    current.opacity = target.radius > 0 || current.radius > 0.5 ? 1 : 0;
    writeLensVariables();
    writeTitleVariables();

    if (!isSettled()) {
      frameId = requestFrame(drawMotion);
      return;
    }

    current.x = target.x;
    current.y = target.y;
    current.radius = target.radius;
    currentTitle.x = targetTitle.x;
    currentTitle.y = targetTitle.y;
    currentTitle.rotateX = targetTitle.rotateX;
    currentTitle.rotateY = targetTitle.rotateY;
    currentTitle.rotateZ = targetTitle.rotateZ;
    current.opacity = target.radius > 0 ? 1 : 0;
    writeLensVariables();
    writeTitleVariables();
    frameId = 0;
  };

  const scheduleMotion = () => {
    if (!frameId) frameId = requestFrame(drawMotion);
  };

  const measureFrame = () => {
    const nextRect = root.getBoundingClientRect();
    frameRect = nextRect.width && nextRect.height ? nextRect : null;
    return frameRect;
  };

  const getViewportState = () => {
    const rect = root.getBoundingClientRect();
    const topbarBottom = document.querySelector('.topbar')?.getBoundingClientRect().bottom || 0;
    return rect.bottom > topbarBottom && rect.top < window.innerHeight;
  };

  const getResponsiveRadius = (rect) => {
    const preferred = Math.min(170, Math.max(rect.width * 0.11, 115));
    const mobileLimit = rect.width <= 720 ? rect.width * 0.35 : Number.POSITIVE_INFINITY;
    const horizontalLimit = Math.max(0, rect.width / 2 - orbSafeGap);
    const verticalLimit = Math.max(0, rect.height / 2 - orbSafeGap);
    return Math.max(0, Math.min(preferred, mobileLimit, horizontalLimit, verticalLimit));
  };

  const setTitleTarget = (x, y, rect) => {
    const normalizedX = clamp((x / rect.width) * 2 - 1, -1, 1);
    const normalizedY = clamp((y / rect.height) * 2 - 1, -1, 1);
    targetTitle.x = normalizedX * 12;
    targetTitle.y = normalizedY * 9;
    targetTitle.rotateX = normalizedY * -7;
    targetTitle.rotateY = normalizedX * 10;
    targetTitle.rotateZ = normalizedX * 3.5;
  };

  const canFollowPointer = (event) => {
    if (flipped || reducedMotion.matches || event?.pointerType === 'touch') return false;
    return event?.pointerType === 'mouse'
      || event?.pointerType === 'pen'
      || finePointer.matches;
  };

  const setPointerTarget = (event) => {
    if (!heroInView || !canFollowPointer(event)) return;
    const rect = frameRect || measureFrame();
    if (!rect) return;

    const localX = clamp(event.clientX - rect.left, 0, rect.width);
    const localY = clamp(event.clientY - rect.top, 0, rect.height);
    const radius = getResponsiveRadius(rect);
    const x = clamp((localX / rect.width) * 100, 0, 100);
    const y = clamp((localY / rect.height) * 100, 0, 100);
    const safeX = clamp(localX, radius + orbSafeGap, rect.width - radius - orbSafeGap);
    const safeY = clamp(localY, radius + orbSafeGap, rect.height - radius - orbSafeGap);
    const safePercentX = (safeX / rect.width) * 100;
    const safePercentY = (safeY / rect.height) * 100;

    if (!pointerInside) {
      cancelMotion();
      current.x = safePercentX;
      current.y = safePercentY;
      current.radius = 0;
      current.opacity = 1;
      currentTitle.x = 0;
      currentTitle.y = 0;
      currentTitle.rotateX = 0;
      currentTitle.rotateY = 0;
      currentTitle.rotateZ = 0;
      pointerInside = true;
    }

    // The pointer remains the target. The safe point only keeps the actual
    // circle inside the Hero so the clip path never meets an inner rectangle.
    target.x = clamp(x, (radius + orbSafeGap) / rect.width * 100, 100 - (radius + orbSafeGap) / rect.width * 100);
    target.y = clamp(y, (radius + orbSafeGap) / rect.height * 100, 100 - (radius + orbSafeGap) / rect.height * 100);
    target.radius = radius;
    setTitleTarget(localX, localY, rect);
    root.classList.add('is-pointer-active');
    scheduleMotion();
  };

  const closePointerLens = ({ immediate = false, resetPosition = false } = {}) => {
    pointerInside = false;
    target.radius = 0;
    target.x = resetPosition ? 50 : current.x;
    target.y = resetPosition ? 50 : current.y;
    targetTitle.x = 0;
    targetTitle.y = 0;
    targetTitle.rotateX = 0;
    targetTitle.rotateY = 0;
    targetTitle.rotateZ = 0;
    root.classList.remove('is-pointer-active');

    if (immediate) {
      cancelMotion();
      current.x = target.x;
      current.y = target.y;
      current.radius = 0;
      current.opacity = 0;
      currentTitle.x = 0;
      currentTitle.y = 0;
      currentTitle.rotateX = 0;
      currentTitle.rotateY = 0;
      currentTitle.rotateZ = 0;
      writeLensVariables();
      writeTitleVariables();
      return;
    }
    scheduleMotion();
  };

  const setFlipped = (nextValue) => {
    flipped = Boolean(nextValue);
    closePointerLens({ immediate: true, resetPosition: true });
    flipCard.classList.toggle('is-flipped', flipped);
    root.setAttribute('aria-pressed', String(flipped));
    root.setAttribute('aria-label', flipped
      ? 'Hero：关于我，按 Enter 返回首页'
      : 'Hero：移动鼠标探索两套身份，按 Enter 查看关于我');
    frontFace.setAttribute('aria-hidden', String(flipped));
    aboutFace.setAttribute('aria-hidden', String(!flipped));
  };

  const toggleFlipped = () => setFlipped(!flipped);

  root.addEventListener('pointerenter', (event) => {
    frameRect = measureFrame();
    setPointerTarget(event);
  }, { passive: true });
  root.addEventListener('pointermove', setPointerTarget, { passive: true });
  root.addEventListener('pointerleave', () => closePointerLens(), { passive: true });
  root.addEventListener('pointercancel', () => closePointerLens({ immediate: true }), { passive: true });

  // Keep the click-to-flip gesture separate from the action links inside Hero.
  root.addEventListener('click', (event) => {
    const protectedBackContent = event.target.closest('.hero-about-topline, .hero-about-layout, .hero-about-footer');
    if (flipped && protectedBackContent && !event.target.closest('.hero-about-return-prompt')) return;
    const interactive = event.target.closest('a, button, input, textarea, select, summary');
    if (interactive?.classList.contains('hero-about-back')) setFlipped(false);
    if (interactive) return;
    toggleFlipped();
  });
  // Keep readable back-face content from toggling the Hero when it is clicked.
  // The intentionally quiet return prompt remains the only back-face content
  // area that bubbles to the Hero toggle handler.
  aboutFace.addEventListener('click', (event) => {
    if (!flipped || event.target.closest('.hero-about-return-prompt')) return;
    if (event.target.closest('.hero-about-topline, .hero-about-layout, .hero-about-footer')) {
      event.stopPropagation();
    }
  });
  root.addEventListener('keydown', (event) => {
    if (event.target !== root) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlipped();
    }
  });

  document.querySelectorAll('.nav a[href="#home"], .brand[href="#top"]').forEach((link) => {
    link.addEventListener('click', () => setFlipped(false));
  });

  const handleScroll = () => {
    heroInView = getViewportState();
    frameRect = null;
    closePointerLens({ immediate: true, resetPosition: true });
  };

  const handleResize = () => {
    frameRect = null;
    heroInView = getViewportState();
    closePointerLens({ immediate: true, resetPosition: true });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('blur', () => closePointerLens({ immediate: true, resetPosition: true }), { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) closePointerLens({ immediate: true, resetPosition: true });
  }, { passive: true });

  if (typeof window.IntersectionObserver === 'function') {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      heroInView = entry.isIntersecting;
      if (!entry.isIntersecting) closePointerLens({ immediate: true, resetPosition: true });
    }, { threshold: 0 });
    visibilityObserver.observe(root);
  }

  const syncCapability = () => {
    // The event type is the reliable capability check. Some embedded or
    // hybrid browsers report pointer: coarse while still sending mouse events.
    const isStatic = reducedMotion.matches;
    root.classList.toggle('is-static', isStatic);
    if (isStatic) closePointerLens({ immediate: true, resetPosition: true });
  };

  const addMediaListener = (mediaQuery, listener) => {
    if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', listener);
    else mediaQuery.addListener?.(listener);
  };
  addMediaListener(reducedMotion, syncCapability);
  addMediaListener(finePointer, syncCapability);

  heroInView = getViewportState();
  syncCapability();
  if (!heroInView) closePointerLens({ immediate: true, resetPosition: true });
  writeLensVariables();
  writeTitleVariables();
  frontFace.setAttribute('aria-hidden', 'false');
  aboutFace.setAttribute('aria-hidden', 'true');
}
