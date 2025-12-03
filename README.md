# Simple Mouse Gestures Browser Extension

**Version:** 1.7.5
**Last Update:** 2025-12-03

A simple and elegant mouse gesture extension for Brave and Chrome browsers with a purple gesture trail.

**Double right-click for context menu!** Single right-click + move = gesture.

## Features

- 🖱️ **6 Essential Gestures** - Quick navigation with simple mouse movements
- 🟣 **Purple Visual Trail** - See your gestures in real-time with a beautiful purple trail
- ⚡ **Lightweight** - Minimal resource usage
- 🎯 **Simple Toggle** - Easy enable/disable from toolbar

## Supported Gestures

| Gesture | Direction | Action |
|---------|-----------|--------|
| Go Back | ← (Left) | Go back in browser history |
| Go Forward | → (Right) | Go forward in browser history |
| Reload Page | ↑ ↓ (Up-Down) | Reload current page |
| Close Tab | ↓ → (Down-Right) | Close current tab |
| Next Tab | ↑ → (Up-Right) | Switch to next tab |
| Previous Tab | ↑ ← (Up-Left) | Switch to previous tab |

## Installation

### From Chrome Web Store (Coming Soon)
*Extension will be available on Chrome Web Store soon*

### Manual Installation (Developer Mode)
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
- **Double right-click** to show context menu
- Single right-click is used for gesture detection

## Enable/Disable

Click the extension icon in your toolbar to toggle gestures on/off.

## Technical Details

- **Manifest Version:** 3
- **Permissions:** storage, activeTab
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

### 1.7.5 (2025-12-03)
- **REVERT**: Back to double right-click for context menu (like crxMouse)
- Single right-click now always used for gesture detection
- Double right-click (within 300ms) shows context menu
- This is the only reliable way to have both gestures AND context menu working
- Reason: Browser fires contextmenu event BEFORE any mouse movement can happen

### 1.7.4 (2025-12-03)
- **FIX**: Fixed gesture mode not triggering - context menu was blocking gesture detection
- Now suppresses native context menu during detection, triggers it manually on mouseup if no gesture
- Added `showContextMenu()` method to programmatically show context menu
- Both gestures AND right-click context menu now work properly

### 1.7.3 (2025-12-03)
- **FIX**: Lowered movement threshold from 15px to 5px for more responsive gesture activation
- Gestures now activate almost immediately when moving the mouse
- Based on research: industry standard is 5-10 pixels for gesture start detection
- Sources: MooseGesture (60px for direction), Gesturefy (5-10px for start), CrxMouse (configurable)

### 1.7.2 (2025-12-03)
- **FIX**: Gesture mode no longer activates when context menu is open
- When context menu opens, gesture detection is cancelled immediately
- Moving mouse while context menu is visible won't trigger gestures
- Added `cancelGestureDetection()` method to cleanly stop detection when menu opens

### 1.7.1 (2025-12-03)
- **NATURAL RIGHT-CLICK**: Context menu now works naturally without double-click
- Right-click without movement → shows context menu (like normal browser behavior)
- Right-click with movement (>15px) → gesture mode activates, menu suppressed
- Removed double-click requirement - much more intuitive experience
- Cleaned up unused double-click detection code

### 1.7.0 (2025-12-03)
- **FIX**: Trail not stopping on sites requiring right-click (Google Maps, ManyChat, etc.)
- **NEW**: Added 15px movement threshold before gesture mode activates
- Small accidental movements during right-click no longer trigger gestures
- Native context menus now work properly on sites that need them
- **NEW**: Maximum gesture duration of 3 seconds
- Gestures that run longer than 3 seconds are automatically cancelled (silent cancel)
- Added `cancelGesture()` method for clean gesture abortion
- Added `movementThreshold` (15px) and `maxGestureDuration` (3000ms) configuration
- Trail only appears after moving 15+ pixels from click start point
- Improved compatibility with sites that use right-click functionality

### 1.6.1 (2025-10-22)
- **CHROME WEB STORE FIX**: Removed unnecessary "tabs" permission
- Fixed Chrome Web Store submission violation (Purple Potassium)
- Verified all tab operations work with only "activeTab" permission
- Removed "tabs" from manifest.json permissions array
- Renamed extension to "Simple Mouse Gestures"
- All features continue to work as expected

### 1.6.0 (2025-10-12)
- **PUBLICATION READY**: Prepared extension for Chrome Web Store
- Added required icons (16x16, 48x48, 128x128) for Chrome Web Store
- Added icons field to manifest.json
- Created comprehensive privacy policy (PRIVACY.md)
- Created screenshot guide for store listing (SCREENSHOTS_GUIDE.md)
- Added publication instructions to README
- Created distribution ZIP package (mouse-gestures-v1.6.0.zip)
- All files ready for Chrome Web Store submission

### 1.5.0 (2025-10-07)
- **NEW GESTURE**: Go Forward - single line to the right
- Added browser history forward navigation (→ gesture)
- Uses chrome.tabs.goForward API
- Complements the back gesture (← / →)
- Simple single-direction gesture for common action
- Updated popup UI to show new gesture
- Updated documentation with forward gesture
- Now supports 6 gestures total

### 1.4.1 (2025-10-07)
- **CALIBRATION FIX**: Improved up-down gesture reliability
- Reduced minDistance threshold from 50px to 30px (40% reduction)
- Allows smaller, more natural gestures
- Fixed strict pattern matching for up-down gesture
- Now allows drift at end of gesture (e.g., "up-down-left" works)
- Matches behavior of other gestures (close, next tab, prev tab)
- Up-down gesture should now work consistently even with imprecise movements

### 1.4.0 (2025-10-07)
- **NEW GESTURE**: Go Back - single line to the left
- Added browser history back navigation (← gesture)
- Uses chrome.tabs.goBack API
- Simple single-direction gesture for common action
- Updated popup UI to show new gesture
- Updated documentation with back gesture
- Now supports 5 gestures total

### 1.3.1 (2025-10-07)
- **NEW FEATURE**: Optional debug logging toggle in extension menu
- Added "Debug Logging" toggle to popup UI
- Debug logging disabled by default (improves performance)
- All console.log statements now check debugLogging flag
- Added `log()` method that wraps console.log with debug check
- Settings stored in chrome.storage.sync
- Changes take effect immediately via storage change listener
- Keeps console clean unless debugging is needed

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

## Publishing to Chrome Web Store

### Prerequisites
- Google Chrome Developer account ($5 one-time fee)
- High-quality screenshots (see `SCREENSHOTS_GUIDE.md`)

### Publication Steps

1. **Create ZIP Package**
   ```bash
   # From project root
   zip -r mouse-gestures-v1.6.0.zip . -x "*.git*" "*.DS_Store" "SCREENSHOTS_GUIDE.md" "*.md"
   ```

2. **Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Click "New Item"
   - Upload `mouse-gestures-v1.5.0.zip`

3. **Store Listing Information**
   - **Name:** Simple Mouse Gestures
   - **Summary:** Simple mouse gesture extension with purple trail - reload, close, and navigate tabs
   - **Category:** Productivity
   - **Language:** English

4. **Detailed Description**
   ```
   Navigate your browser faster with elegant mouse gestures!

   🖱️ 6 ESSENTIAL GESTURES
   Simply hold right-click and draw:
   • ← Left: Go back in history
   • → Right: Go forward in history
   • ↑↓ Up-Down: Reload page
   • ↓→ Down-Right: Close tab
   • ↑→ Up-Right: Next tab
   • ↑← Up-Left: Previous tab

   🟣 BEAUTIFUL PURPLE TRAIL
   See your gestures in real-time with a smooth purple trail

   ⚡ LIGHTWEIGHT & FAST
   Minimal resource usage, maximum productivity

   🎯 EASY TOGGLE
   Enable/disable gestures with one click

   🔒 PRIVACY FIRST
   No data collection, no tracking, completely local

   CONTEXT MENU ACCESS
   Double right-click to access your normal context menu
   ```

5. **Screenshots**
   - Upload 3-5 screenshots (see `SCREENSHOTS_GUIDE.md`)
   - Recommended size: 1280x800 pixels

6. **Privacy**
   - **Privacy Policy URL:** https://omegis.github.io/ChromeMouseGestures/PRIVACY.md
   - Alternative: Copy content from `PRIVACY.md` to store listing

7. **Justification for Permissions**
   - **storage:** Save user preferences locally
   - **activeTab:** Detect mouse gestures on current tab and execute tab operations (reload, close, switch, navigate)

8. **Submit for Review**
   - Review all information
   - Click "Submit for Review"
   - Typical review time: 1-3 business days

### Post-Publication

- Monitor reviews and respond to user feedback
- Update version in manifest.json for future releases
- Follow semantic versioning (major.minor.patch)

## Privacy Policy

See [PRIVACY.md](PRIVACY.md) for complete privacy policy.

**Summary:** This extension does not collect, store, or transmit any user data. All operations are performed locally in your browser.

## License

MIT License
