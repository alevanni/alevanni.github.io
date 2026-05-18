import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";

const SQUARE_SIDE = 100;
const RECTANGLE_HEIGHT = 200;
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 500;
const pieceMovedEvent = new CustomEvent("piece-moved");
const resetEvent = new CustomEvent("reset");
const board = {
  left: window.innerWidth / 2 - BOARD_WIDTH / 2,
  top: window.innerHeight / 2 - BOARD_HEIGHT / 2,
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
  donkey: {x:100, y:0},
};

const initial = {
  piece1: { x: 0,   y: 0, initialX: 0,   initialY: 0,   width: SQUARE_SIDE, height: RECTANGLE_HEIGHT },
  piece2: { x: 300, y: 0, initialX: 300, initialY: 0,   width: SQUARE_SIDE, height: RECTANGLE_HEIGHT },

  piece3: { x: 100, y: 0, initialX: 100, initialY: 0,   width: RECTANGLE_HEIGHT, height: RECTANGLE_HEIGHT },
  piece4: { x: 100, y: 200, initialX: 100, initialY: 200,   width: RECTANGLE_HEIGHT, height: SQUARE_SIDE },
  piece5: { x: 0, y: 300, initialX: 0, initialY: 300,   width: SQUARE_SIDE, height: RECTANGLE_HEIGHT },
  piece6: { x: 300, y: 300, initialX: 300, initialY: 300,   width: SQUARE_SIDE, height: RECTANGLE_HEIGHT },
  piece7: { x: 100, y: 300, initialX: 100, initialY: 300,   width: SQUARE_SIDE, height: SQUARE_SIDE },
  piece8: { x: 200, y: 300, initialX: 200, initialY: 300,   width: SQUARE_SIDE, height: SQUARE_SIDE },
  piece9: { x: 100, y: 400, initialX: 100, initialY: 400,   width: SQUARE_SIDE, height: SQUARE_SIDE },
  piece10: { x: 200, y: 400, initialX: 200, initialY: 400,   width: SQUARE_SIDE, height: SQUARE_SIDE },
};
const initialCopy = {...initial};
const state = ref(structuredClone(initial));
const stateBoard = ref(board);

createApp({
  data() { 
    return {
    donkeyPosition: {x: state.value.piece3.initialX, y: state.value.piece3.initialY}
  }; },
  
  mounted() {
    const boardElement = document.getElementById("board");
    boardElement.style.left = board.left + "px";
    boardElement.style.top  = board.top  + "px";
    boardElement.addEventListener("piece-moved", this.haveIWon);
    const dialogButton = document.getElementById("play-again");
    dialogButton.addEventListener('click', this.rearrange);
  },
  methods: {
    haveIWon() {
      this.donkeyPosition= {x: state.value.piece3.initialX, y: state.value.piece3.initialY}
      
      if (this.donkeyPosition.x==100 && this.donkeyPosition.y==300) {
        document.getElementById('you-won').showModal();
      }
    },
    rearrange() {

      state.value = initial;
      stateBoard.value = board;
      document.getElementById('you-won').close();
      Object.entries(state.value).forEach(([name, data])=> {
        document.getElementById(name).dispatchEvent(resetEvent);
      })
    }
  },
}).mount("#board");

Object.entries(state.value).forEach(([name, data]) => {
  createApp({
    data() {
      return {
        name,
        drag: false,
        positionX: data.x,
        positionY: data.y,
        initialX:  data.initialX,
        initialY:  data.initialY,
        width:     data.width,
        height:    data.height,
      };
    },
  template: "<div class='circle'></div>",
    mounted() {
      const el = document.getElementById(this.name);
      el.style.left = this.initialX + "px";
      el.style.top  = this.initialY + "px";
      el.addEventListener("mousedown", this.startDrag);
      el.addEventListener("reset", this.getBackToStart)
      window.addEventListener("mousemove", this.dragging);
      window.addEventListener("mouseup",   this.stopDrag);
    },

    beforeUnmount() {
      window.removeEventListener("mousemove", this.dragging);
      window.removeEventListener("mouseup",   this.stopDrag);
    },

    methods: {
      startDrag(event) {
        this.drag = true;
        event.preventDefault();
      },

      stopDrag() {
        if (!this.drag) return;
        this.drag = false;

        const snappedX = this.snap1D(this.positionX, SQUARE_SIDE);
        const snappedY = this.snap1D(this.positionY, SQUARE_SIDE); // not mistake, the squareside is the unit

        const invalid =
          this.outOfBounds(snappedX, snappedY) ||
          this.isOverlapping(snappedX, snappedY) ||
          this.isTooFar(snappedX, snappedY) ||
          this.movedDiagonally(snappedX, snappedY);
        if (invalid) {
          this.moveTo(this.initialX, this.initialY);
        } else {
          this.moveTo(snappedX, snappedY);
          // Commit as new safe position
          this.initialX = snappedX;
          this.initialY = snappedY;
          state.value[this.name].initialX = snappedX;
          state.value[this.name].initialY = snappedY;
          const board = document.getElementById("board");
          
          board.dispatchEvent(pieceMovedEvent);
        }
      },

      dragging(event) {
        if (!this.drag) return;
        const boardRect = document.getElementById("board").getBoundingClientRect();
  const x = event.clientX - boardRect.left - this.width  / 2;
  const y = event.clientY - boardRect.top  - this.height / 2;
        this.moveTo(x, y);
      },

      // Move element + sync state, without committing initialX/Y
      moveTo(x, y) {
        this.positionX = x;
        this.positionY = y;
        const el = document.getElementById(this.name);
        el.style.left = x + "px";
        el.style.top  = y + "px";
        
        
        state.value[this.name].x = x;
        state.value[this.name].y = y;
      },

      
      snap1D(v, size) {
        return Math.round(v / size) * size;
      },

      outOfBounds(x, y) {
        return (
          x < 0 ||
          x + this.width  > board.width ||   
          y < 0 ||
          y + this.height > board.height
        );
      },
      isTooFar(x,y) {
        return (Math.abs(x - this.initialX)>2*SQUARE_SIDE ||Math.abs(y - this.initialY)>2*SQUARE_SIDE)
      },
      movedDiagonally(x,y) {
        return (x!=this.initialX && y!=this.initialY);
      },
      isOverlapping(x, y) {
        return Object.entries(state.value).some(([otherName, other]) => {
          if (otherName === this.name) return false;
          return this.overlap(
            { x, y, width: this.width, height: this.height },
            { x: other.x, y: other.y, width: other.width, height: other.height }
          );
        });
      },

      overlap(a, b) {
        
        return !(
          a.x + a.width  <= b.x ||
          a.x >= b.x + b.width  ||
          a.y + a.height <= b.y ||
          a.y >= b.y + b.height
        );
      },
      getBackToStart() {
        
        this.moveTo(initial[this.name].initialX, initial[this.name].initialY)
      }
    },
  }).mount("#" + name);
});

createApp(navbar).mount("#navbar")
