async function onClick() {
  const checkbox = document.getElementById('checkbox');

  chrome.storage.sync.set({ enabled: checkbox.checked });

  if (!checkbox.checked) {
    const currentTab = await getCurrentTab();
    await chrome.tabs.reload(currentTab.id);
    console.log(currentTab);
  }
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.storage.sync.get('enabled', ({ enabled }) => {
  document.getElementById('checkbox').checked = enabled;
});

document.getElementById('checkbox').addEventListener('click', onClick);
