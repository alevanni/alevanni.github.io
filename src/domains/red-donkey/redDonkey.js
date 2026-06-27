import { createApp, ref, reactive, computed, onMounted, onBeforeUnmount } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";

const SQUARE_SIDE = 100;
const RECTANGLE_HEIGHT = 200;
const BOARD_WIDTH = 406;
const BOARD_HEIGHT = 506;

const INITIAL_PIECES = {
  piece1:  { x: 0,   y: 0,   width: SQUARE_SIDE,      height: RECTANGLE_HEIGHT },
  piece2:  { x: 300, y: 0,   width: SQUARE_SIDE,      height: RECTANGLE_HEIGHT },
  piece3:  { x: 100, y: 0,   width: RECTANGLE_HEIGHT, height: RECTANGLE_HEIGHT },
  piece4:  { x: 100, y: 200, width: RECTANGLE_HEIGHT, height: SQUARE_SIDE      },
  piece5:  { x: 0,   y: 300, width: SQUARE_SIDE,      height: RECTANGLE_HEIGHT },
  piece6:  { x: 300, y: 300, width: SQUARE_SIDE,      height: RECTANGLE_HEIGHT },
  piece7:  { x: 100, y: 300, width: SQUARE_SIDE,      height: SQUARE_SIDE      },
  piece8:  { x: 200, y: 300, width: SQUARE_SIDE,      height: SQUARE_SIDE      },
  piece9:  { x: 100, y: 400, width: SQUARE_SIDE,      height: SQUARE_SIDE      },
  piece10: { x: 200, y: 400, width: SQUARE_SIDE,      height: SQUARE_SIDE      },
};

function cloneInitial() {
  return Object.fromEntries(
    Object.entries(INITIAL_PIECES).map(([name, p]) => [
      name,
      { ...p, initialX: p.x, initialY: p.y },
    ])
  );
}

// ── Compute the scale factor so the board fits the viewport ──────────────────
function computeBoardScale() {
  const PADDING = 32; // px breathing room on each side
  const navbarHeight = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")
  ) || 0;
  const maxW = window.innerWidth  - PADDING * 2;
  const maxH = window.innerHeight - navbarHeight - PADDING * 2;
  return Math.min(1, maxW / BOARD_WIDTH, maxH / BOARD_HEIGHT);
}

function applyBoardScale(scale) {
  document.documentElement.style.setProperty("--board-scale", scale);
}

// ────────────────────────────────────────────────────────────────────────────

createApp({
  setup() {
    const pieces    = reactive(cloneInitial());
    const dragging  = ref(null);
    const moveCount = ref(0);
    const timeElapsed = ref(0);
    const won       = ref(false);

    // Initial scale
    let boardScale = computeBoardScale();
    applyBoardScale(boardScale);

    // Timer
    let timerInterval = null;
    function startTimer() {
      if (timerInterval) return;
      timerInterval = setInterval(() => { timeElapsed.value++; }, 1000);
    }
    function stopTimer()  { clearInterval(timerInterval); timerInterval = null; }
    function resetTimer() { stopTimer(); timeElapsed.value = 0; }

    const formattedTime = computed(() => {
      const m = Math.floor(timeElapsed.value / 60).toString().padStart(2, "0");
      const s = (timeElapsed.value % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    });

    // Win detection
    function checkWin() {
      const p3 = pieces.piece3;
      if (p3.initialX === 100 && p3.initialY === 300) {
        stopTimer();
        won.value = true;
      }
    }

    // Reset
    function reset() {
      const fresh = cloneInitial();
      for (const name in pieces) Object.assign(pieces[name], fresh[name]);
      moveCount.value = 0;
      won.value = false;
      resetTimer();
    }

    // Drag helpers (unchanged game logic)
    function snap1D(v) { return Math.round(v / SQUARE_SIDE) * SQUARE_SIDE; }

    function overlap(a, b) {
      return !(
        a.x + a.width  <= b.x || a.x >= b.x + b.width  ||
        a.y + a.height <= b.y || a.y >= b.y + b.height
      );
    }

    function outOfBounds(name, x, y) {
      const p = pieces[name];
      return x < 0 || x + p.width > BOARD_WIDTH || y < 0 || y + p.height > BOARD_HEIGHT;
    }

    function isOverlapping(name, x, y) {
      const p = pieces[name];
      return Object.entries(pieces).some(([otherName, other]) => {
        if (otherName === name) return false;
        return overlap(
          { x, y, width: p.width, height: p.height },
          { x: other.x, y: other.y, width: other.width, height: other.height }
        );
      });
    }

    function isPathBlocked(name, x, y) {
      const p = pieces[name];
      const dx = x - p.initialX;
      const dy = y - p.initialY;
      const steps = Math.max(Math.abs(dx), Math.abs(dy)) / SQUARE_SIDE;
      if (steps > 2) return true;
      for (let i = 1; i < steps; i++) {
        const cellX = p.initialX + (dx / steps) * i;
        const cellY = p.initialY + (dy / steps) * i;
        const blocked = Object.entries(pieces).some(([otherName, other]) => {
          if (otherName === name) return false;
          return overlap(
            { x: cellX, y: cellY, width: p.width, height: p.height },
            { x: other.x, y: other.y, width: other.width, height: other.height }
          );
        });
        if (blocked) return true;
      }
      return false;
    }

    function movedDiagonally(name, x, y) {
      const p = pieces[name];
      return x !== p.initialX && y !== p.initialY;
    }

    // ── Shared coordinate helper ─────────────────────────────────────────────
    // Converts a raw client {x,y} to board-space coordinates,
    // accounting for CSS scale so touch/mouse work at any size.
    function clientToBoardCoords(clientX, clientY, pieceName) {
      const p = pieces[pieceName];
      const boardEl = document.getElementById("board");
      const rect = boardEl.getBoundingClientRect();
      // rect dimensions already reflect the CSS scale transform
      const scaleX = BOARD_WIDTH  / rect.width;
      const scaleY = BOARD_HEIGHT / rect.height;
      const x = (clientX - rect.left) * scaleX - p.width  / 2;
      const y = (clientY - rect.top)  * scaleY - p.height / 2;
      return { x, y };
    }

    // Mouse handlers
    function onMouseDown(name, event) {
      event.preventDefault();
      dragging.value = name;
      startTimer();
    }

    function onMouseMove(event) {
      if (!dragging.value) return;
      const name = dragging.value;
      const p = pieces[name];
      const { x, y } = clientToBoardCoords(event.clientX, event.clientY, name);
      p.x = x;
      p.y = y;
    }

    function onMouseUp() {
      if (!dragging.value) return;
      const name = dragging.value;
      const p = pieces[name];
      dragging.value = null;
      commitMove(name, p);
    }

    // Touch handlers
    function onTouchStart(name, event) {
      event.preventDefault();
      dragging.value = name;
      startTimer();
    }

    function onTouchMove(event) {
      if (!dragging.value) return;
      const touch = event.touches[0];
      const name = dragging.value;
      const p = pieces[name];
      const { x, y } = clientToBoardCoords(touch.clientX, touch.clientY, name);
      p.x = x;
      p.y = y;
    }

    // Shared drop logic
    function commitMove(name, p) {
      const snappedX = snap1D(p.x);
      const snappedY = snap1D(p.y);

      const invalid =
        outOfBounds(name, snappedX, snappedY)    ||
        isOverlapping(name, snappedX, snappedY)  ||
        isPathBlocked(name, snappedX, snappedY)  ||
        movedDiagonally(name, snappedX, snappedY);

      if (invalid) {
        p.x = p.initialX;
        p.y = p.initialY;
      } else {
        p.x = snappedX;
        p.y = snappedY;
        p.initialX = snappedX;
        p.initialY = snappedY;
        moveCount.value++;
        checkWin();
      }
    }

    // Resize handler — recompute scale when the window size changes
    function onResize() {
      boardScale = computeBoardScale();
      applyBoardScale(boardScale);
    }

    // Lifecycle
    onMounted(() => {
      window.addEventListener("mousemove",  onMouseMove);
      window.addEventListener("mouseup",    onMouseUp);
      window.addEventListener("touchmove",  onTouchMove, { passive: false });
      window.addEventListener("touchend",   onMouseUp);
      window.addEventListener("resize",     onResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onMouseUp);
      window.removeEventListener("resize",     onResize);
      stopTimer();
    });

    return {
      pieces, moveCount, formattedTime, won,
      onMouseDown, onTouchStart, reset,
    };
  },
}).mount("#main");