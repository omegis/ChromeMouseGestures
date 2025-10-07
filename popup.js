/**
 * Mouse Gestures Extension - Popup Script
 * Version: 1.0.9
 * Last Update: 2025-10-07
 */

console.log('Mouse Gestures Extension - Popup');
console.log('Version: 1.0.9');
console.log('Last Update: 2025-10-07');

const enableToggle = document.getElementById('enableToggle');

// Load current state
chrome.storage.sync.get(['gesturesEnabled'], (result) => {
  const isEnabled = result.gesturesEnabled !== false; // Default to true
  enableToggle.checked = isEnabled;
});

// Handle toggle changes
enableToggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;

  chrome.storage.sync.set({ gesturesEnabled: isEnabled }, () => {
    console.log('Gestures enabled:', isEnabled);
  });
});
