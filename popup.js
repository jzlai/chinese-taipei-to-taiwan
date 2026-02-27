// Firefox and Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

function updateEmojiCheckboxState() {
  const enabledCheckbox = document.getElementById('checkbox');
  const emojiCheckbox = document.getElementById('emoji-checkbox');
  const emojiLabel = document.querySelector('label[for="emoji-checkbox"]');

  // Disable emoji checkbox when extension is disabled
  emojiCheckbox.disabled = !enabledCheckbox.checked;

  // Update label opacity for visual feedback
  if (enabledCheckbox.checked) {
    emojiLabel.style.opacity = '1';
    emojiCheckbox.style.opacity = '1';
  } else {
    emojiLabel.style.opacity = '0.5';
    emojiCheckbox.style.opacity = '0.5';
  }
}

async function onEnabledClick() {
  const checkbox = document.getElementById('checkbox');

  await browserAPI.storage.sync.set({ enabled: checkbox.checked });

  // Update emoji checkbox state
  updateEmojiCheckboxState();

  // Reload current tab to apply enabled state change
  const currentTab = await getCurrentTab();
  await browserAPI.tabs.reload(currentTab.id);
}

async function onEmojiClick() {
  const emojiCheckbox = document.getElementById('emoji-checkbox');

  await browserAPI.storage.sync.set({ showEmoji: emojiCheckbox.checked });

  // Reload current tab to apply emoji change
  const currentTab = await getCurrentTab();
  await browserAPI.tabs.reload(currentTab.id);
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await browserAPI.tabs.query(queryOptions);
  return tab;
}

// Load saved settings
browserAPI.storage.sync
  .get(['enabled', 'showEmoji'])
  .then((data) => {
    // Default both to true if not set
    const enabled = data.enabled === undefined ? true : data.enabled;
    const showEmoji = data.showEmoji === undefined ? true : data.showEmoji;

    document.getElementById('checkbox').checked = enabled;
    document.getElementById('emoji-checkbox').checked = showEmoji;

    // Update emoji checkbox state based on enabled state
    updateEmojiCheckboxState();

    // Save defaults if not set
    if (data.enabled === undefined || data.showEmoji === undefined) {
      browserAPI.storage.sync.set({ enabled, showEmoji });
    }
  });

document.getElementById('checkbox').addEventListener('click', onEnabledClick);
document
  .getElementById('emoji-checkbox')
  .addEventListener('click', onEmojiClick);
