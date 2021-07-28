function switchEnabled() {
  const checkbox = document.getElementById('checkbox');
  chrome.storage.sync.set({ enabled: checkbox.checked });
}

chrome.storage.sync.get('enabled', ({ enabled }) => {
  document.getElementById('checkbox').checked = enabled;
});

document.getElementById('checkbox').addEventListener('click', switchEnabled);
