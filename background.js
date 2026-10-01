// Background service worker (Manifest V3)

// Listen for the global keyboard shortcut (Ctrl+Shift+T)
chrome.commands.onCommand.addListener((command) => {
  if (command === "quick-capture") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "OPEN_CAPTURE_OVERLAY" });
      }
    });
  }
});

// Keep the toolbar icon badge in sync with session state
async function refreshBadge() {
  const { sessionActive } = await chrome.storage.local.get("sessionActive");
  if (sessionActive) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.sessionActive) {
    refreshBadge();
  }
});

chrome.runtime.onInstalled.addListener(refreshBadge);
chrome.runtime.onStartup.addListener(refreshBadge);
