/**
 * Mouse Gestures Extension - Popup Script
 * Version: 1.4.1
 * Last Update: 2025-10-07
 */

console.log('Mouse Gestures Extension - Popup');
console.log('Version: 1.4.1');
console.log('Last Update: 2025-10-07');

const enableToggle = document.getElementById('enableToggle');
const debugToggle = document.getElementById('debugToggle');

// Load current state
chrome.storage.sync.get(['gesturesEnabled', 'debugLogging'], (result) => {
  const isEnabled = result.gesturesEnabled !== false; // Default to true
  const debugEnabled = result.debugLogging === true; // Default to false
  enableToggle.checked = isEnabled;
  debugToggle.checked = debugEnabled;
});

// Handle gesture enable/disable toggle
enableToggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;

  chrome.storage.sync.set({ gesturesEnabled: isEnabled }, () => {
    console.log('Gestures enabled:', isEnabled);
  });
});

// Handle debug logging toggle
debugToggle.addEventListener('change', (e) => {
  const debugEnabled = e.target.checked;

  chrome.storage.sync.set({ debugLogging: debugEnabled }, () => {
    console.log('Debug logging:', debugEnabled);
  });
});
