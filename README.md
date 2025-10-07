# Mouse Gestures Browser Extension

**Version:** 1.0.4
**Last Update:** 2025-10-07

A simple and elegant mouse gesture extension for Brave and Chrome browsers with a purple gesture trail.

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

1. Hold down the **right mouse button**
2. Draw one of the gesture patterns
3. Release the mouse button
4. The action will be executed

**Note:** The context menu will be suppressed when drawing gestures.

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
