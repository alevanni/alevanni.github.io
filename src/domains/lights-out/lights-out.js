import {
  createApp,
  computed
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";
let _timerInterval = null;

createApp({
  data() {
    return {
      state: 4,
      won: false,
      moves: 0,
      bestMoves: 0,
      timeElapsed: 0,
      bestTime: 0,
      size: 3,
      buttons: [
        [
          { x: 0, y: 0, state: "active" },
          { x: 0, y: 1, state: "inactive" },
          { x: 0, y: 2, state: "active" }
        ],
        [
          { x: 1, y: 0, state: "inactive" },
          { x: 1, y: 1, state: "active" },
          { x: 1, y: 2, state: "inactive" }
        ],
        [
          { x: 2, y: 0, state: "inactive" },
          { x: 2, y: 1, state: "active" },
          { x: 2, y: 2, state: "inactive" }
        ]
      ]
    };
  },
  computed: {
    formattedTime() {
      const m = Math.floor(this.timeElapsed / 60)
        .toString()
        .padStart(2, "0");
      const s = (this.timeElapsed % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    }
  },
  mounted() {
    this.setGame(this.size);
  },
  methods: {
    pressButton(item) {
      this.startTimer();
      // you flip the adjacent buttons
      this.flip(item.x, item.y);
      this.flip(item.x + 1, item.y);
      this.flip(item.x - 1, item.y);
      this.flip(item.x, item.y + 1);
      this.flip(item.x, item.y - 1);
      this.moves++;
      this.haveIwon();
    },
    startTimer() {
      if (_timerInterval) return;
      _timerInterval = setInterval(() => {
        this.timeElapsed++;
      }, 1000);
    },
    stopTimer() {
      clearInterval(_timerInterval);

      _timerInterval = null;
    },
    resetTimer() {
      this.stopTimer();
      this.timeElapsed = 0;
    },
    formatTime(seconds) {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    },
    flip(x, y) {
      if (x >= this.size || x < 0 || y >= this.size || y < 0) return;
      else {
        if (this.buttons[x][y].state === "active") {
          this.buttons[x][y].state = "inactive";
          this.state--;
        } else {
          this.buttons[x][y].state = "active";
          this.state++;
        }
      }
    },
    haveIwon() {
      if (this.state === this.size * this.size) {
        this.stopTimer();
        this.won = true;
      }
    },
    close() {
      document.getElementById("dialog").close();
      this.reset();
    },
    setGame(size) {
      //Game not always solvable: start from all-active (solved) state
    this.buttons = Array.from({ length: this.size }, (_, x) =>
      Array.from({ length: this.size }, (_, y) => ({
        x,
        y,
        state: "active"
      }))
    );
    this.state = this.size * this.size;

    // Make N random moves so you always have a solvable puzzle)
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      this.flip(x, y);
    }

    this.resetTimer();
    this.moves = 0;
    this.won = false;
    }
    ,
    reset() {
      if (
        (this.bestMoves != 0 && this.moves < this.bestMoves) ||
        this.bestMoves === 0
      )
        this.bestMoves = this.moves;

      if (
        (this.bestTime != 0 && this.timeElapsed < this.bestTime) ||
        this.bestTime === 0
      )
        this.bestTime = this.timeElapsed;

      this.resetTimer();
      this.moves = 0;
      
      this.won = false;
      this.setGame(this.size);
    },
    updateSize(size) {}
  },
  watch: {
    size(newSize) {
      this.reset();
      this.bestMoves=0;
      this.bestTime=0;
      
    }
  }
}).mount("#main");
