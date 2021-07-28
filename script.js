const replaceFn = () => {
  chrome.storage.sync.get('enabled', ({ enabled }) => {
    if (enabled) {
      const text = document.querySelectorAll(
        'h1, h2, h3, h4, h5, p, li, td, caption, span, a, p'
      );
      const regexp = /Chinese Taipei/gi;
      for (const element of text) {
        if (element.innerHTML.match(regexp)) {
          element.innerHTML = element.innerHTML.replace(regexp, 'Taiwan 🇹🇼');
        }
      }
    }
  });
};

let timeout = null;
document.addEventListener('DOMSubtreeModified', () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(replaceFn, 500);
});
