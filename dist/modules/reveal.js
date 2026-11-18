export function initReveal() {
  const elements = [...document.querySelectorAll('.reveal')];
  if (!elements.length) return;

  // Keep the page readable even when the enhancement script is unavailable.
  // The pending class is added only after this module has loaded successfully.
  elements.forEach((element) => element.classList.add('reveal-pending'));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  elements.forEach((element) => observer.observe(element));
}
