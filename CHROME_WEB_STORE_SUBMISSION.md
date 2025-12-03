# Chrome Web Store Submission Text

**Version: 1.7.7**
**Last Updated: 2025-12-03**

## Single Purpose

```
This extension enables mouse gesture navigation in the browser. Users can perform common browser actions (reload page, close tab, switch tabs, navigate history) by drawing simple mouse patterns with the right button, accompanied by visual feedback.
```

---

## Permission Justifications

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

---

## What's New in v1.7.7 (Update Notes)

```
Version 1.7.7 - Major UX Improvements

• Improved gesture responsiveness - gestures now activate with just 5 pixels of movement
• More forgiving reload gesture - up or down movement triggers reload
• Fixed context menu behavior - double right-click shows menu reliably
• Added 3-second gesture timeout - prevents stuck gestures
• Better compatibility with sites like Google Maps and ManyChat

This update focuses on making gestures feel more natural and responsive while ensuring the context menu remains accessible via double right-click.
```

---

## Store Listing Description

```
Navigate your browser faster with elegant mouse gestures!

🖱️ 6 ESSENTIAL GESTURES
Simply hold right-click and draw:
• ← Left: Go back in history
• → Right: Go forward in history
• ↑ or ↓ Up/Down: Reload page
• ↓→ Down-Right: Close tab
• ↑→ Up-Right: Next tab
• ↑← Up-Left: Previous tab

🟣 BEAUTIFUL PURPLE TRAIL
See your gestures in real-time with a smooth purple trail

⚡ LIGHTWEIGHT & FAST
Minimal resource usage, maximum productivity

🎯 EASY TOGGLE
Enable/disable gestures with one click from the toolbar

🔒 PRIVACY FIRST
No data collection, no tracking, completely local

💡 CONTEXT MENU ACCESS
Double right-click to access your normal context menu

Works on all websites. Simple, fast, and private.
```
