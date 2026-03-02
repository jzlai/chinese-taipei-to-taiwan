// Firefox and Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const replaceFn = () => {
  browserAPI.storage.sync.get(['enabled', 'showEmoji'], (data) => {
    // Default both to true if not set
    const enabled = data.enabled === undefined ? true : data.enabled;
    const showEmoji = data.showEmoji === undefined ? true : data.showEmoji;

    if (enabled) {
      const replacement = showEmoji ? 'Taiwan 🇹🇼' : 'Taiwan';

      // Use TreeWalker to find and replace text nodes only
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const nodesToReplace = [];
      let node;
      while ((node = walker.nextNode())) {
        if (/Chinese Taipei/i.test(node.textContent)) {
          nodesToReplace.push(node);
        }
      }

      // Replace text in collected nodes
      for (const textNode of nodesToReplace) {
        textNode.textContent = textNode.textContent.replace(
          /Chinese Taipei/gi,
          replacement
        );
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
