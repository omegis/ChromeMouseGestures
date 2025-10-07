/**
 * Mouse Gestures Extension - Background Service Worker
 * Version: 1.0.2
 * Last Update: 2025-10-07
 */

console.log('Mouse Gestures Extension - Background Service Worker Started');
console.log('Version: 1.0.2');
console.log('Last Update: 2025-10-07');

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.action) {
    sendResponse({ success: false, error: 'No action specified' });
    return;
  }

  handleGestureAction(request.action, sender.tab)
    .then(() => sendResponse({ success: true }))
    .catch((error) => {
      console.error('Action error:', error);
      sendResponse({ success: false, error: error.message });
    });

  return true; // Keep the message channel open for async response
});

/**
 * Handle gesture actions
 * @param {string} action - The gesture action to perform
 * @param {object} tab - The tab object from the sender
 */
async function handleGestureAction(action, tab) {
  if (!tab || !tab.id) {
    throw new Error('Invalid tab');
  }

  switch (action) {
    case 'reload':
      await reloadTab(tab.id);
      break;

    case 'close':
      await closeTab(tab.id);
      break;

    case 'nextTab':
      await switchToNextTab(tab);
      break;

    case 'prevTab':
      await switchToPrevTab(tab);
      break;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Reload the current tab
 */
async function reloadTab(tabId) {
  await chrome.tabs.reload(tabId);
}

/**
 * Close the current tab
 */
async function closeTab(tabId) {
  await chrome.tabs.remove(tabId);
}

/**
 * Switch to the next tab
 */
async function switchToNextTab(currentTab) {
  const tabs = await chrome.tabs.query({ windowId: currentTab.windowId });
  const currentIndex = tabs.findIndex(tab => tab.id === currentTab.id);

  if (currentIndex === -1) return;

  const nextIndex = (currentIndex + 1) % tabs.length;
  await chrome.tabs.update(tabs[nextIndex].id, { active: true });
}

/**
 * Switch to the previous tab
 */
async function switchToPrevTab(currentTab) {
  const tabs = await chrome.tabs.query({ windowId: currentTab.windowId });
  const currentIndex = tabs.findIndex(tab => tab.id === currentTab.id);

  if (currentIndex === -1) return;

  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  await chrome.tabs.update(tabs[prevIndex].id, { active: true });
}
