/**
 * Mouse Gestures Extension - Content Script
 * Version: 1.4.0
 * Last Update: 2025-10-07
 */

class MouseGestureDetector {
  constructor() {
    this.isEnabled = true;
    this.debugLogging = false; // Debug logging disabled by default
    this.isDrawing = false;
    this.gesturePoints = [];
    this.trailSvg = null;
    this.trailPath = null;
    this.minDistance = 50; // Minimum distance to recognize a direction
    this.gestureDrawn = false; // Track if gesture was drawn
    this.inGestureMode = false; // Track if in gesture mode (long press or movement)
    this.lastRightClickTime = 0; // Track last right-click time for double-click detection
    this.doubleClickTimeout = 300; // Max time between clicks for double-click (ms)
    this.allowContextMenu = false; // Flag to allow context menu on double-click

    this.init();
  }

  log(...args) {
    if (this.debugLogging) {
      console.log(...args);
    }
  }

  init() {
    // Load enabled state - check if chrome.storage is available
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['gesturesEnabled', 'debugLogging'], (result) => {
        this.isEnabled = result.gesturesEnabled !== false; // Default to true
        this.debugLogging = result.debugLogging === true; // Default to false
      });

      // Listen for setting changes
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.gesturesEnabled) {
          this.isEnabled = changes.gesturesEnabled.newValue;
        }
        if (changes.debugLogging) {
          this.debugLogging = changes.debugLogging.newValue;
        }
      });
    } else {
      console.warn('[Mouse Gestures] chrome.storage not available - using default enabled state');
      this.isEnabled = true; // Default to enabled
      this.debugLogging = false; // Default to disabled
    }

    // Bind event listeners - use capture phase for mousedown and contextmenu
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this), true);
  }

  handleMouseDown(e) {
    this.log('[Mouse Gestures] MouseDown - button:', e.button, 'enabled:', this.isEnabled);

    if (!this.isEnabled || e.button !== 2) return; // Only right-click

    const now = Date.now();
    const timeSinceLastClick = now - this.lastRightClickTime;

    // Check for double right-click
    if (timeSinceLastClick < this.doubleClickTimeout) {
      this.log('[Mouse Gestures] Double right-click detected - will show context menu');
      this.allowContextMenu = true;
      this.lastRightClickTime = 0; // Reset to prevent triple-click from being detected as double
      return; // Don't start gesture detection
    }

    this.log('[Mouse Gestures] Starting gesture detection');
    this.lastRightClickTime = now;
    this.isDrawing = true;
    this.gestureDrawn = false;
    this.inGestureMode = false; // Not in gesture mode yet
    this.allowContextMenu = false;
    this.gesturePoints = [{ x: e.clientX, y: e.clientY }];
    this.mouseDownTime = Date.now(); // Track when mouse was pressed

    // Set a timeout - if held for more than 500ms, enter gesture mode
    this.longPressTimer = setTimeout(() => {
      if (this.isDrawing) {
        this.log('[Mouse Gestures] Long press (500ms) - entering gesture mode');
        this.inGestureMode = true;
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
      this.log('[Mouse Gestures] Movement detected - entering gesture mode');
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
    this.log('[Mouse Gestures] MouseUp - button:', e.button, 'isDrawing:', this.isDrawing, 'enabled:', this.isEnabled, 'points:', this.gesturePoints.length, 'inGestureMode:', this.inGestureMode);

    // Clear the long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // Only handle right-click release
    if (!this.isDrawing || e.button !== 2) return;

    this.log('[Mouse Gestures] Cleaning up gesture, had', this.gesturePoints.length, 'points');

    // If we're in gesture mode, try to recognize and execute gesture
    if (this.inGestureMode) {
      this.log('[Mouse Gestures] In gesture mode - checking for gesture');
      const gesture = this.recognizeGesture();
      if (gesture) {
        this.gestureDrawn = true;
        this.executeGesture(gesture);
      }
    } else {
      this.log('[Mouse Gestures] NOT in gesture mode - allowing context menu naturally');
      // Short click - let the natural contextmenu event fire
      // Don't suppress it
    }

    this.isDrawing = false;
    this.inGestureMode = false;
    this.suppressContextMenu = false;

    this.removeTrail();
    this.gesturePoints = [];
  }

  handleContextMenu(e) {
    if (!this.isEnabled) return;

    this.log('[Mouse Gestures] ContextMenu event - allowContextMenu:', this.allowContextMenu, 'inGestureMode:', this.inGestureMode, 'gestureDrawn:', this.gestureDrawn);

    // Allow context menu on double right-click
    if (this.allowContextMenu) {
      this.log('[Mouse Gestures] Allowing context menu - double right-click detected');
      this.allowContextMenu = false; // Reset flag
      return; // Let the menu show
    }

    // Suppress context menu if we're in gesture mode or gesture was drawn
    // This includes single clicks, long press, and gestures
    this.log('[Mouse Gestures] Suppressing context menu - gesture detection active');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Reset gestureDrawn flag after a delay
    setTimeout(() => {
      this.gestureDrawn = false;
    }, 100);

    return false;
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
    this.log('[Mouse Gestures] Removing trail, exists:', !!this.trailSvg);
    if (this.trailSvg && this.trailSvg.parentNode) {
      this.trailSvg.parentNode.removeChild(this.trailSvg);
      this.log('[Mouse Gestures] Trail removed from DOM');
    }
    this.trailSvg = null;
    this.trailPath = null;
  }

  recognizeGesture() {
    if (this.gesturePoints.length < 2) return null;

    const directions = this.getDirections();
    this.log('[Mouse Gestures] Detected directions:', directions);

    if (directions.length === 0) {
      this.log('[Mouse Gestures] No directions detected');
      return null;
    }

    const pattern = directions.join('-');
    this.log('[Mouse Gestures] Pattern:', pattern);

    // Match gesture patterns - order matters!
    // Back: single left direction
    if (pattern === 'left') {
      this.log('[Mouse Gestures] Recognized: BACK');
      return 'back';
    }
    // Reload: up then down (or down then up)
    if ((pattern === 'up-down') || (pattern === 'down-up')) {
      this.log('[Mouse Gestures] Recognized: RELOAD');
      return 'reload';
    }
    // Close: down then right
    if (pattern === 'down-right' || pattern.startsWith('down-right')) {
      this.log('[Mouse Gestures] Recognized: CLOSE TAB');
      return 'close';
    }
    // Next tab: up then right
    if (pattern === 'up-right' || pattern.startsWith('up-right')) {
      this.log('[Mouse Gestures] Recognized: NEXT TAB');
      return 'nextTab';
    }
    // Previous tab: up then left
    if (pattern === 'up-left' || pattern.startsWith('up-left')) {
      this.log('[Mouse Gestures] Recognized: PREVIOUS TAB');
      return 'prevTab';
    }

    this.log('[Mouse Gestures] No matching gesture pattern');
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
    this.log('[Mouse Gestures] Executing gesture:', gesture);

    // Show toast notification
    this.showToast(gesture);

    // Send message to background script - check if chrome.runtime is available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: gesture }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[Mouse Gestures] ERROR:', chrome.runtime.lastError);
        } else {
          this.log('[Mouse Gestures] Response from background:', response);
        }
      });
    } else {
      console.warn('[Mouse Gestures] chrome.runtime not available - gesture recognized but cannot execute action');
    }
  }

  showToast(gesture) {
    // Map gesture names to display text
    const gestureNames = {
      'back': 'Go Back',
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
