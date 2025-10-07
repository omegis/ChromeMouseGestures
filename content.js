/**
 * Mouse Gestures Extension - Content Script
 * Version: 1.0.1
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

    this.init();
  }

  init() {
    // Load enabled state
    chrome.storage.sync.get(['gesturesEnabled'], (result) => {
      this.isEnabled = result.gesturesEnabled !== false; // Default to true
    });

    // Listen for enable/disable changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.gesturesEnabled) {
        this.isEnabled = changes.gesturesEnabled.newValue;
      }
    });

    // Bind event listeners
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
  }

  handleMouseDown(e) {
    if (!this.isEnabled || e.button !== 2) return; // Only right-click

    this.isDrawing = true;
    this.gestureDrawn = false;
    this.gesturePoints = [{ x: e.clientX, y: e.clientY }];
    this.createTrailSvg();
  }

  handleMouseMove(e) {
    if (!this.isDrawing || !this.isEnabled) return;

    this.gesturePoints.push({ x: e.clientX, y: e.clientY });
    this.updateTrail();
  }

  handleMouseUp(e) {
    if (!this.isDrawing || !this.isEnabled) return;

    this.isDrawing = false;
    const gesture = this.recognizeGesture();

    if (gesture) {
      this.gestureDrawn = true;
      this.executeGesture(gesture);
    }

    this.removeTrail();
    this.gesturePoints = [];
  }

  handleContextMenu(e) {
    // Prevent context menu if we've drawn a gesture
    if (this.gestureDrawn) {
      e.preventDefault();
      this.gestureDrawn = false; // Reset flag
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
    if (this.trailSvg && this.trailSvg.parentNode) {
      this.trailSvg.parentNode.removeChild(this.trailSvg);
    }
    this.trailSvg = null;
    this.trailPath = null;
  }

  recognizeGesture() {
    if (this.gesturePoints.length < 2) return null;

    const directions = this.getDirections();
    if (directions.length < 2) return null; // Need at least 2 directions

    const pattern = directions.join('-');

    // Match gesture patterns - order matters!
    // Reload: up then down (or down then up)
    if ((pattern === 'up-down') || (pattern === 'down-up')) {
      return 'reload';
    }
    // Close: down then right
    if (pattern === 'down-right' || pattern.startsWith('down-right')) {
      return 'close';
    }
    // Next tab: up then right
    if (pattern === 'up-right' || pattern.startsWith('up-right')) {
      return 'nextTab';
    }
    // Previous tab: up then left
    if (pattern === 'up-left' || pattern.startsWith('up-left')) {
      return 'prevTab';
    }

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
    // Send message to background script
    chrome.runtime.sendMessage({ action: gesture }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Gesture execution error:', chrome.runtime.lastError);
      }
    });
  }
}

// Initialize the gesture detector
const gestureDetector = new MouseGestureDetector();
