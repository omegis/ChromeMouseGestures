# Chrome Web Store Submission Text

## Single Purpose

```
This extension enables mouse gesture navigation in the browser. Users can perform common browser actions (reload page, close tab, switch tabs, navigate history) by drawing simple mouse patterns with the right button, accompanied by visual feedback.
```

---

## Permission Justifications

### tabs

```
Required to execute tab operations in response to user gestures. When a user draws a gesture pattern, the extension needs to perform actions such as: reload the current tab, close the current tab, switch to the next/previous tab, or navigate browser history (back/forward). The extension does not access tab content, URLs, or browsing history - it only executes user-requested tab operations.
```

### storage

```
Required to save user preferences locally on the device. The extension stores only two settings: (1) whether gestures are enabled or disabled, and (2) whether debug logging is enabled. These preferences are stored using chrome.storage.sync for Chrome's built-in cross-device sync feature. No user data, browsing data, or personal information is collected or stored. No data is transmitted to any external server.
```

### activeTab

```
Required to detect and track mouse gestures on the currently active tab. The extension listens for mouse movement and button events to recognize gesture patterns drawn by the user. This permission is necessary to capture mouse events and display the visual gesture trail. The extension does not access, read, or modify page content, form data, or any website information - it only tracks mouse coordinates for gesture recognition.
```

---

## Additional Information for Reviewers

### Complete Local Operation

This extension operates **entirely locally** within the browser:
- **No network requests** are made
- **No external servers** exist
- **No data collection** of any kind
- **No third-party services** are used
- All gesture detection and processing happens in browser memory
- Only two boolean preferences are stored locally

### Source Code Verification

The extension is open source and available at:
https://github.com/omegis/ChromeMouseGestures

Reviewers can verify:
- No fetch/XMLHttpRequest calls in code
- No analytics or tracking scripts
- No external dependencies
- Simple, transparent implementation

### Privacy Policy

Full privacy policy available at:
https://omegis.github.io/ChromeMouseGestures/PRIVACY.md

---

## Store Listing - Single Purpose (Alternative Versions)

**Version 1 (Concise - 49 words):**
```
This extension enables mouse gesture navigation in the browser. Users can perform common browser actions (reload page, close tab, switch tabs, navigate history) by drawing simple mouse patterns with the right button, accompanied by visual feedback.
```

**Version 2 (Detailed - 63 words):**
```
This extension provides mouse gesture navigation functionality for browser control. Users hold the right mouse button and draw directional patterns (up, down, left, right, combinations) to trigger predefined browser actions including page reload, tab management (close, switch next/previous), and history navigation (back/forward). The extension displays a visual purple trail during gesture drawing and toast notifications upon action execution. All operations are performed locally without data collection.
```

**Version 3 (Technical - 55 words):**
```
Mouse gesture recognition and execution system for browser navigation. The extension captures right-click mouse movements, analyzes directional patterns, and executes corresponding browser commands (reload, close tab, tab switching, history navigation). Features include visual gesture trail feedback, customizable enable/disable toggle, and debug logging option. Operates entirely client-side with no external communication or data collection.
```

---

## Recommended Choice

**Use Version 1** - It's clear, concise, and directly states the single purpose without unnecessary technical details. Chrome Web Store reviewers prefer straightforward descriptions.

---

## Quick Copy-Paste Summary

**Single Purpose:**
```
This extension enables mouse gesture navigation in the browser. Users can perform common browser actions (reload page, close tab, switch tabs, navigate history) by drawing simple mouse patterns with the right button, accompanied by visual feedback.
```

**tabs permission:**
```
Required to execute tab operations in response to user gestures. When a user draws a gesture pattern, the extension needs to perform actions such as: reload the current tab, close the current tab, switch to the next/previous tab, or navigate browser history (back/forward). The extension does not access tab content, URLs, or browsing history - it only executes user-requested tab operations.
```

**storage permission:**
```
Required to save user preferences locally on the device. The extension stores only two settings: (1) whether gestures are enabled or disabled, and (2) whether debug logging is enabled. These preferences are stored using chrome.storage.sync for Chrome's built-in cross-device sync feature. No user data, browsing data, or personal information is collected or stored. No data is transmitted to any external server.
```

**activeTab permission:**
```
Required to detect and track mouse gestures on the currently active tab. The extension listens for mouse movement and button events to recognize gesture patterns drawn by the user. This permission is necessary to capture mouse events and display the visual gesture trail. The extension does not access, read, or modify page content, form data, or any website information - it only tracks mouse coordinates for gesture recognition.
```

---

## Notes for Submission

1. **Be Honest**: These justifications are 100% accurate to the code
2. **Emphasize Privacy**: Repeatedly state no data collection/transmission
3. **Be Specific**: Explain exactly what each permission does
4. **Show Transparency**: Reference open source code and privacy policy
5. **Stay Consistent**: Match the language in PRIVACY.md

Chrome Web Store reviews typically take 1-3 business days. The straightforward, privacy-focused nature of this extension should help with approval.
