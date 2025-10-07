/**
 * Mouse Gestures Extension - Content Script
 * Version: 1.1.3
 * Last Update: 2025-10-07
 */

class MouseGestureDetector {
  constructor() {
    this.isEnabled = true;
    this.isDrawing = false;
    this.gesturePoints = [];
    this.trailSvg = null;
    this.trailPath = null;
    this.minDistance = 50; // Minimum distance to recognize a direction
    this.gestureDrawn = false; // Track if gesture was drawn
    this.suppressContextMenu = false; // Flag to suppress context menu
    this.inGestureMode = false; // Track if in gesture mode (long press or movement)

    this.init();
  }

  init() {
    // Load enabled state - check if chrome.storage is available
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['gesturesEnabled'], (result) => {
        this.isEnabled = result.gesturesEnabled !== false; // Default to true
      });

      // Listen for enable/disable changes
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.gesturesEnabled) {
          this.isEnabled = changes.gesturesEnabled.newValue;
        }
      });
    } else {
      console.warn('[Mouse Gestures] chrome.storage not available - using default enabled state');
      this.isEnabled = true; // Default to enabled
    }

    // Bind event listeners - use capture phase for mousedown and contextmenu
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this), true);
  }

  handleMouseDown(e) {
    console.log('[Mouse Gestures] MouseDown - button:', e.button, 'enabled:', this.isEnabled);

    if (!this.isEnabled || e.button !== 2) return; // Only right-click

    console.log('[Mouse Gestures] Starting gesture detection');
    this.isDrawing = true;
    this.gestureDrawn = false;
    this.suppressContextMenu = true; // Suppress by default, will allow if short click
    this.inGestureMode = false; // Not in gesture mode yet
    this.gesturePoints = [{ x: e.clientX, y: e.clientY }];
    this.mouseDownTime = Date.now(); // Track when mouse was pressed

    // Set a timeout - if held for more than 500ms, enter gesture mode
    this.longPressTimer = setTimeout(() => {
      if (this.isDrawing) {
        console.log('[Mouse Gestures] Long press (500ms) - entering gesture mode');
        this.inGestureMode = true;
        this.suppressContextMenu = true;
        // Create trail on long press
        if (!this.trailSvg) {
          this.createTrailSvg();
        }
      }
    }, 500);
  }

  handleMouseMove(e) {
    if (!this.isDrawing || !this.isEnabled) return;

    this.gesturePoints.push({ x: e.clientX, y: e.clientY });

    // Enter gesture mode on any movement
    if (!this.inGestureMode) {
      console.log('[Mouse Gestures] Movement detected - entering gesture mode');
      this.inGestureMode = true;
      this.suppressContextMenu = true;
      // Create trail if not already created
      if (!this.trailSvg) {
        this.createTrailSvg();
      }
    }

    this.updateTrail();
  }

  handleMouseUp(e) {
    console.log('[Mouse Gestures] MouseUp - button:', e.button, 'isDrawing:', this.isDrawing, 'enabled:', this.isEnabled, 'points:', this.gesturePoints.length, 'inGestureMode:', this.inGestureMode);

    // Clear the long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // Always clean up if we were drawing, regardless of button
    if (this.isDrawing) {
      console.log('[Mouse Gestures] Cleaning up gesture, had', this.gesturePoints.length, 'points');

      // Check if this was a short click (< 500ms) without entering gesture mode
      const clickDuration = Date.now() - this.mouseDownTime;
      const isShortClick = clickDuration < 500 && !this.inGestureMode;

      if (isShortClick) {
        console.log('[Mouse Gestures] Short click detected (< 500ms) - allowing context menu');
        this.suppressContextMenu = false;
      } else {
        console.log('[Mouse Gestures] Long press or gesture - suppressing context menu');
        this.suppressContextMenu = true;

        // Only try to recognize gesture if we're in gesture mode
        if (this.inGestureMode) {
          const gesture = this.recognizeGesture();
          if (gesture) {
            this.gestureDrawn = true;
            this.executeGesture(gesture);
          }
        }
      }

      this.isDrawing = false;
      this.inGestureMode = false;

      this.removeTrail();
      this.gesturePoints = [];
    }
  }

  handleContextMenu(e) {
    console.log('[Mouse Gestures] ContextMenu event - suppressContextMenu:', this.suppressContextMenu, 'gestureDrawn:', this.gestureDrawn);

    // Prevent context menu if we moved while drawing or recognized a gesture
    if (this.suppressContextMenu || this.gestureDrawn) {
      console.log('[Mouse Gestures] Preventing context menu');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Reset flags after a short delay to ensure event is fully handled
      setTimeout(() => {
        this.gestureDrawn = false;
        this.suppressContextMenu = false;
      }, 100);

      return false;
    }
  }

  createTrailSvg() {
    // Create SVG overlay for trail
    this.trailSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.trailSvg.style.position = 'fixed';
    this.trailSvg.style.top = '0';
    this.trailSvg.style.left = '0';
    this.trailSvg.style.width = '100%';
    this.trailSvg.style.height = '100%';
    this.trailSvg.style.pointerEvents = 'none';
    this.trailSvg.style.zIndex = '2147483647'; // Maximum z-index

    this.trailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.trailPath.setAttribute('stroke', '#9b59b6'); // Purple color
    this.trailPath.setAttribute('stroke-width', '3');
    this.trailPath.setAttribute('fill', 'none');
    this.trailPath.setAttribute('stroke-linecap', 'round');
    this.trailPath.setAttribute('stroke-linejoin', 'round');

    this.trailSvg.appendChild(this.trailPath);

    // Append to body or documentElement if body doesn't exist yet
    const target = document.body || document.documentElement;
    target.appendChild(this.trailSvg);
  }

  updateTrail() {
    if (!this.trailPath || this.gesturePoints.length === 0) return;

    let pathData = `M ${this.gesturePoints[0].x} ${this.gesturePoints[0].y}`;
    for (let i = 1; i < this.gesturePoints.length; i++) {
      pathData += ` L ${this.gesturePoints[i].x} ${this.gesturePoints[i].y}`;
    }

    this.trailPath.setAttribute('d', pathData);
  }

  removeTrail() {
    console.log('[Mouse Gestures] Removing trail, exists:', !!this.trailSvg);
    if (this.trailSvg && this.trailSvg.parentNode) {
      this.trailSvg.parentNode.removeChild(this.trailSvg);
      console.log('[Mouse Gestures] Trail removed from DOM');
    }
    this.trailSvg = null;
    this.trailPath = null;
  }

  recognizeGesture() {
    if (this.gesturePoints.length < 2) return null;

    const directions = this.getDirections();
    console.log('[Mouse Gestures] Detected directions:', directions);

    if (directions.length < 2) {
      console.log('[Mouse Gestures] Not enough directions, need at least 2');
      return null;
    }

    const pattern = directions.join('-');
    console.log('[Mouse Gestures] Pattern:', pattern);

    // Match gesture patterns - order matters!
    // Reload: up then down (or down then up)
    if ((pattern === 'up-down') || (pattern === 'down-up')) {
      console.log('[Mouse Gestures] Recognized: RELOAD');
      return 'reload';
    }
    // Close: down then right
    if (pattern === 'down-right' || pattern.startsWith('down-right')) {
      console.log('[Mouse Gestures] Recognized: CLOSE TAB');
      return 'close';
    }
    // Next tab: up then right
    if (pattern === 'up-right' || pattern.startsWith('up-right')) {
      console.log('[Mouse Gestures] Recognized: NEXT TAB');
      return 'nextTab';
    }
    // Previous tab: up then left
    if (pattern === 'up-left' || pattern.startsWith('up-left')) {
      console.log('[Mouse Gestures] Recognized: PREVIOUS TAB');
      return 'prevTab';
    }

    console.log('[Mouse Gestures] No matching gesture pattern');
    return null;
  }

  getDirections() {
    const directions = [];
    let lastDirection = null;
    let lastDirectionPoint = this.gesturePoints[0];

    for (let i = 1; i < this.gesturePoints.length; i++) {
      const curr = this.gesturePoints[i];

      // Calculate distance from last direction change point
      const dx = curr.x - lastDirectionPoint.x;
      const dy = curr.y - lastDirectionPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.minDistance) continue;

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const direction = this.angleToDirection(angle);

      if (direction && direction !== lastDirection) {
        directions.push(direction);
        lastDirection = direction;
        lastDirectionPoint = curr; // Update reference point
      }
    }

    return directions;
  }

  angleToDirection(angle) {
    // Normalize angle to 0-360
    const normalizedAngle = (angle + 360) % 360;

    if (normalizedAngle >= 45 && normalizedAngle < 135) return 'down';
    if (normalizedAngle >= 135 && normalizedAngle < 225) return 'left';
    if (normalizedAngle >= 225 && normalizedAngle < 315) return 'up';
    return 'right';
  }

  executeGesture(gesture) {
    console.log('[Mouse Gestures] Executing gesture:', gesture);

    // Show toast notification
    this.showToast(gesture);

    // Send message to background script - check if chrome.runtime is available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: gesture }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[Mouse Gestures] ERROR:', chrome.runtime.lastError);
        } else {
          console.log('[Mouse Gestures] Response from background:', response);
        }
      });
    } else {
      console.warn('[Mouse Gestures] chrome.runtime not available - gesture recognized but cannot execute action');
    }
  }

  showToast(gesture) {
    // Map gesture names to display text
    const gestureNames = {
      'reload': 'Reload Page',
      'close': 'Close Tab',
      'nextTab': 'Next Tab',
      'prevTab': 'Previous Tab'
    };

    const displayName = gestureNames[gesture] || gesture;

    // Remove existing toast if any
    const existingToast = document.getElementById('mouseGestureToast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'mouseGestureToast';
    toast.textContent = displayName;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(155, 89, 182, 0.95);
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 18px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 2147483647;
      pointer-events: none;
      animation: fadeInOut 0.8s ease-in-out;
    `;

    // Add animation styles if not already present
    if (!document.getElementById('mouseGestureToastStyles')) {
      const style = document.createElement('style');
      style.id = 'mouseGestureToastStyles';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
      `;
      document.head.appendChild(style);
    }

    // Append to body
    (document.body || document.documentElement).appendChild(toast);

    // Remove after animation completes
    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 800);
  }
}

// Initialize the gesture detector
const gestureDetector = new MouseGestureDetector();
