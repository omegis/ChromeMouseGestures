# Mouse Gestures - Privacy Policy

**Last Updated:** October 12, 2025
**Version:** 1.0.0

---

## Summary

**Mouse Gestures does not collect, store, or transmit any user data.** This extension operates entirely locally in your browser.

---

## 1. Information Collection

**Mouse Gestures does NOT collect any personal information.**

The extension does not:
- Collect browsing history
- Track user behavior
- Access website content or user input
- Store passwords, credentials, or personal data
- Use cookies or tracking technologies
- Send any data to external servers
- Make any network requests

---

## 2. Data Storage

The extension uses Chrome's local storage API (`chrome.storage.sync`) to save **two simple preferences**:

1. **Extension Enable/Disable State** - A boolean tracking whether gestures are enabled
2. **Debug Logging Toggle** - A boolean for optional console logging

These preferences are stored **locally on your device only** and are never transmitted to any server. The `sync` storage is used solely for Chrome's built-in cross-device sync feature, if you have Chrome sync enabled.

---

## 3. Permissions Explanation

The extension requires minimal permissions to function:

### Tabs Permission
- **Purpose:** Execute tab operations (reload, close, navigate, switch tabs)
- **What we DON'T access:** Tab content, URLs, browsing history, or any website data
- **Why needed:** To perform actions like "close tab" or "switch to next tab"

### Storage Permission
- **Purpose:** Save user preferences locally (enable/disable state, debug logging)
- **What we DON'T store:** Any personal data, browsing data, or user activity

### Active Tab Permission
- **Purpose:** Detect mouse gestures on the currently active tab
- **What we DON'T access:** Page content, form data, or any website information

---

## 4. Data Sharing

**Mouse Gestures does NOT share any data with third parties** because it doesn't collect any data.

There are no analytics, no tracking, no telemetry, and no third-party services integrated into this extension.

---

## 5. How the Extension Works

The extension operates entirely locally in your browser:

1. Captures mouse movement and button events on web pages
2. Detects gesture patterns (up, down, left, right combinations)
3. Triggers predefined actions (reload, close tab, navigate, etc.)
4. Shows visual feedback (purple trail, toast notifications)
5. All processing happens in browser memory
6. **No data leaves your device**

---

## 6. Security

Since the extension doesn't collect or transmit data, there is no data at risk. The extension:

- Contains no external dependencies
- Loads no remote code or scripts
- Makes no network requests
- Operates in Chrome's sandboxed environment
- Has no backend servers
- Does not communicate with any external services

---

## 7. Children's Privacy

The extension does not collect data from anyone, including children under 13 years of age.

---

## 8. Changes to This Policy

If we make any changes to how the extension handles data in the future, we will:

1. Update this privacy policy
2. Increment the version number
3. Notify users through the Chrome Web Store listing
4. Request additional permissions if needed (Chrome will prompt users)

---

## 9. Open Source

The extension's source code is available on GitHub for full transparency. You can review the code to verify our privacy claims:

**GitHub Repository:** https://github.com/omegis/ChromeMouseGestures

---

## 10. Contact Information

If you have questions about this privacy policy or the extension:

- **GitHub Issues:** https://github.com/omegis/ChromeMouseGestures/issues
- **GitHub Repository:** https://github.com/omegis/ChromeMouseGestures

---

## 11. User Rights

Since we don't collect any data, there is no personal data to:
- Request access to
- Request deletion of
- Request correction of
- Request export of

You maintain complete control over the extension by simply enabling/disabling it or uninstalling it from Chrome.

---

## Technical Details

### Extension Architecture:
- **content.js** - Detects gestures, shows visual trail (local to each page)
- **background.js** - Executes tab actions (no data collection)
- **popup.js** - Settings interface (reads/writes local storage only)

### Data Flow:
```
User Mouse Movement → Gesture Detection (Local) → Action Execution (Local)
                                ↓
                        Visual Feedback (Local)
                                ↓
                          User Preference Storage (Local Only)
```

No data ever leaves your browser.

---

**In Summary:** Mouse Gestures is a privacy-first extension that performs all operations locally without collecting, storing, or transmitting any user data.
