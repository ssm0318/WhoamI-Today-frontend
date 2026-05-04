export function scrollAndHighlight(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.style.transition = 'none';
  el.style.borderColor = '#8700FF';
  el.style.backgroundColor = '#F3E8FF';
  setTimeout(() => {
    el.style.transition = 'border-color 0.4s ease, background-color 0.4s ease';
    el.style.borderColor = '';
    el.style.backgroundColor = '';
    setTimeout(() => {
      el.style.transition = '';
    }, 400);
  }, 1800);
}
