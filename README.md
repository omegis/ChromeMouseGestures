# Mouse Gestures Browser Extension

**Version:** 1.3.0
**Last Update:** 2025-10-07

A simple and elegant mouse gesture extension for Brave and Chrome browsers with a purple gesture trail.

**How to access context menu:** Double right-click!

## Features

- 🖱️ **4 Essential Gestures** - Quick navigation with simple mouse movements
- 🟣 **Purple Visual Trail** - See your gestures in real-time with a beautiful purple trail
- ⚡ **Lightweight** - Minimal resource usage
- 🎯 **Simple Toggle** - Easy enable/disable from toolbar

## Supported Gestures

| Gesture | Direction | Action |
|---------|-----------|--------|
| Reload Page | ↑ ↓ (Up-Down) | Reload current page |
| Close Tab | ↓ → (Down-Right) | Close current tab |
| Next Tab | ↑ → (Up-Right) | Switch to next tab |
| Previous Tab | ↑ ← (Up-Left) | Switch to previous tab |

## Installation

1. Clone or download this repository
2. Open Brave/Chrome and navigate to `brave://extensions` or `chrome://extensions`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the `MouseGestures` directory

## Usage

**Gestures:**
1. Hold down the **right mouse button**
2. Draw one of the gesture patterns (or hold for 500ms)
3. Release the mouse button
4. The action will be executed

**Context Menu:**
- **Double right-click** to show the context menu
- Single right-click will suppress the menu (gesture mode active)

## Enable/Disable

Click the extension icon in your toolbar to toggle gestures on/off.

## Technical Details

- **Manifest Version:** 3
- **Permissions:** tabs, storage, activeTab
- **Architecture:**
  - `content.js` - Gesture detection and visualization
  - `background.js` - Tab operations handler
  - `popup.html/js` - Settings interface

## Best Practices

This extension follows:
- **SOLID Principles** - Separation of concerns (detection, rendering, execution)
- **DRY Principle** - Reusable gesture pattern matcher
- Clean event listener management
- Proper resource cleanup

## Version History

### 1.3.0 (2025-10-07)
- **MAJOR FEATURE**: Double right-click to show context menu
- Learned from crxMouse extension: use double-click pattern
- Added `lastRightClickTime` tracking for double-click detection
- Added `allowContextMenu` flag for double-click behavior
- Double-click timeout set to 300ms (industry standard)
- Single right-click: suppress menu, enter gesture mode
- Double right-click (< 300ms apart): show context menu
- Long press (≥ 500ms): show purple trail, suppress menu
- Mouse movement: show purple trail, suppress menu, execute gesture
- This is a major version bump due to new user interaction pattern
- Updated documentation with double-click instructions

### 1.2.1 (2025-10-07)
- **FINAL FIX**: Selective context menu suppression based on gesture mode
- Removed manual menu dispatching approach (doesn't trigger native menu)
- Simplified logic: only suppress contextmenu if `inGestureMode` or `gestureDrawn` is true
- For short clicks, `inGestureMode` stays false, so native menu fires naturally
- For long press (≥500ms) or movement, `inGestureMode` becomes true, menu suppressed
- Removed all `suppressContextMenu` flag complexity
- This approach works with the natural browser event flow

### 1.2.0 (2025-10-07)
- **BREAKTHROUGH FIX**: Manual context menu triggering for short clicks
- Fixed event ordering issue: contextmenu fires BEFORE mouseup
- Always block native context menu, then manually trigger for short clicks
- Added 50ms delay before triggering manual context menu
- Short clicks (< 500ms) now properly show context menu via programmatic dispatch
- Long press and gestures still suppress menu as intended
- This is a major version bump due to fundamental architecture change

### 1.1.4 (2025-10-07)
- **DEBUG BUILD**: Added button check in mouseup (only handle button 2)
- Added enhanced logging for debugging context menu behavior
- Added log message when allowing context menu to show
- Fixed potential issue with handling non-right-click mouseup events
- Improved code clarity in handleContextMenu

### 1.1.3 (2025-10-07)
- **CRITICAL FIX**: Context menu suppression logic inverted
- Changed strategy: suppress by default, allow only on short clicks
- Fixed race condition where context menu would fire before suppression flag was set
- Context menu now properly suppressed on long press and gestures
- Short clicks (< 500ms) properly allow context menu

### 1.1.2 (2025-10-07)
- **MAJOR REDESIGN**: Implemented proper 500ms long-press detection
- Short click (< 500ms) → shows context menu
- Long press (≥ 500ms) → enters gesture mode, shows purple trail, suppresses menu
- Any mouse movement → immediately enters gesture mode, shows trail, executes gesture
- Added `inGestureMode` flag to track gesture state
- Purple trail now appears on long press even without movement
- Fixed all context menu behavior to match user expectations

### 1.1.1 (2025-10-07)
- **CRITICAL FIX**: Context menu now works correctly for all click durations
- Fixed bug where clicks held longer than 200ms wouldn't show context menu
- Changed logic: now checks for movement instead of click duration
- Context menu shows on ANY click without movement (short or long)
- Context menu only suppressed when user moves mouse (drawing gestures)

### 1.1.0 (2025-10-07)
- **CRITICAL FIX**: Context menu now works on short clicks
- Smart detection: Quick clicks (< 200ms) show normal context menu
- Long press (> 200ms) or any movement suppresses context menu for gestures
- Added timer-based long press detection
- Context menu behavior now matches user expectations

### 1.0.9 (2025-10-07)
- **BUG FIX**: Fixed chrome.runtime undefined error on certain pages
- Added safety checks for chrome.runtime and chrome.storage APIs
- Extension now gracefully handles contexts where Chrome APIs are unavailable
- Gesture recognition and toast still work even if background communication fails
- Prevents console errors on pages with strict content security policies

### 1.0.8 (2025-10-07)
- **NEW FEATURE**: Toast notification for executed commands
- Shows command name in center of window when gesture is executed
- Purple-themed toast with smooth fade animation
- Displays: "Reload Page", "Close Tab", "Next Tab", "Previous Tab"
- Auto-dismisses after 0.8 seconds

### 1.0.7 (2025-10-07)
- **CRITICAL FIX**: Context menu now suppressed on long clicks without movement
- Set suppressContextMenu = true immediately in mousedown
- Previous version only set flag on movement, missing static long clicks
- Removed redundant flag setting in mousemove
- Context menu now NEVER shows during gesture mode

### 1.0.6 (2025-10-07)
- **MAJOR FIX**: Event capture phase for mousedown and contextmenu
- Learned from crxMouse extension implementation
- Simplified context menu suppression logic
- Added stopImmediatePropagation() for better event blocking
- Context menu now properly prevented during gestures
- Improved event interception before browser handlers

### 1.0.5 (2025-10-07)
- Fixed context menu appearing during gesture drawing
- Added suppressContextMenu flag that triggers on mouse movement
- Context menu now only shows on short right-clicks without movement
- Enhanced logging for context menu prevention

### 1.0.4 (2025-10-07)
- Fixed purple trail not disappearing after right-click release
- Added mouse event debug logging (mousedown, mouseup)
- Improved cleanup logic to always remove trail on mouseup
- Enhanced debugging output for troubleshooting

### 1.0.3 (2025-10-07)
- Added comprehensive debug logging for troubleshooting
- Logs gesture detection, pattern recognition, and command execution
- Check browser console (F12) to see gesture activity

### 1.0.2 (2025-10-07)
- Fixed invalid icons error in manifest
- Removed emoji-based SVG icons (not supported in Chrome extensions)

### 1.0.1 (2025-10-07)
- Fixed context menu prevention logic
- Fixed gesture pattern matching to be more precise
- Fixed document.body null reference issue
- Improved distance calculation for direction detection

### 1.0.0 (2025-10-07)
- Initial release
- 4 basic gestures: reload, close, next tab, previous tab
- Purple gesture trail
- Enable/disable toggle
- Manifest V3 support

## License

MIT License
