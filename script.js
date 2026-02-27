// Firefox and Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const replaceFn = () => {
  browserAPI.storage.sync.get(['enabled', 'showEmoji'], (data) => {
    // Default both to true if not set
    const enabled = data.enabled === undefined ? true : data.enabled;
    const showEmoji = data.showEmoji === undefined ? true : data.showEmoji;

    if (enabled) {
      const text = document.querySelectorAll(
        'h1, h2, h3, h4, h5, p, li, td, caption, span, a, div'
      );
      const replacement = showEmoji ? 'Taiwan 🇹🇼' : 'Taiwan';

      for (const element of text) {
        const html = element.innerHTML;

        // Only replace "Chinese Taipei"
        if (/Chinese Taipei/i.test(html)) {
          element.innerHTML = html.replace(/Chinese Taipei/gi, replacement);
        }
      }
    }
  });
};

// Initial replacement on page load
replaceFn();

// Use MutationObserver instead of deprecated DOMSubtreeModified
let timeout = null;
const observer = new MutationObserver(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(replaceFn, 500);
});

// Observe changes to the entire document
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
