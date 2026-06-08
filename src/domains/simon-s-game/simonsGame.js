import {
    createApp,
    computed
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";
/*
The original Milton Bradley/Hasbro Simon offers four distinct skill levels: 
Skill 1: Up to 8 lights in a sequence.
Skill 2: Up to 16 lights in a sequence.
Skill 3: Up to 24 lights in a sequence.
Skill 4: Up to 32 lights in a sequence.
Note: The tempo automatically increases after completing the 5th, 9th, and 13th steps. 
*/

createApp({
    data() {
        return {
            score: 0,
            strict: false,
            simonSequence: "",
            userSequence: "",
            level: "1",
            listen: false,
            won: false,
            speed: 600,
            started: false,
            sounds: ['https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-1.mp3', 'https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-2.mp3', 'https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-3.mp3', 'https://cdn.freecodecamp.org/curriculum/take-home-projects/memory-light-game/sound-4.mp3'],
        };
    },
    computed: {
        maxLength() {
            return { 1: 8, 2: 16, 3: 24, 4: 32 }[this.level];
        }
    },
    mounted() { },
    methods: {
        start() {
            this.started = true;
            this.simonSequence = "";
            this.score = 0;
            this.won = false;
            this.speed = 600;
            this.listen = false;
            const startLength = { 1: 1, 2: 8, 3: 16, 4: 24 }[this.level];
            for (let i = 0; i < startLength; i++) {
                this.simonSequence += Math.floor(Math.random() * 4).toString();
            }

            this.flashSimonSequence();
        },
        playButtonSound(id) {
            var audio = new Audio(this.sounds[id]);
            audio.play();
        },
        addOneToSimonSequence() {
            this.simonSequence =
                this.simonSequence + Math.floor(Math.random() * 4).toString();
            this.flashSimonSequence();
        },
        async blink(id) {
            let button = document.getElementById(id.toString());
            button.classList.add("active");
            this.playButtonSound(id);
            await new Promise((resolve) => setTimeout(resolve, this.speed));
            button.classList.remove("active");
            await new Promise((resolve) => setTimeout(resolve, this.speed));
        },
        async flashSimonSequence() {
            this.listen = false; // we disable the listening while flashing
            for (const id of this.simonSequence.split("")) {
                await this.blink(id);
            }

            this.listenSequence();
        },
        listenSequence() {
            this.listen = true;
        },
        async addToUserSequence(id) {
            if (!this.listen) return;
            await this.blink(id);

            this.userSequence = this.userSequence + id;
            if (
                this.simonSequence.slice(0, this.userSequence.length) ===
                this.userSequence
            ) {
                if (this.userSequence.length === this.simonSequence.length) {
                    this.score++;
                    this.userSequence = "";
                    // advance level at boundaries
                    const boundaries = { 8: "2", 16: "3", 24: "4" };
                    if (boundaries[this.simonSequence.length] && this.level !== "4") {
                        this.level = boundaries[this.simonSequence.length];
                    } // win check — beat the max length of level 4
                    if (
                        this.simonSequence.length >= this.maxLength &&
                        this.level === "4"
                    ) {
                        this.won = true;
                        this.started = false;
                        return;
                    }
                    const len = this.simonSequence.length;
                    if (len === 5 || len === 9 || len === 13) {
                        this.speed = Math.max(200, this.speed - 100);
                    }
                    setTimeout(() => this.addOneToSimonSequence(), 1000);
                }
            } else {

                this.listen = false;
                await this.blinkScore();
                // do something when you make a mistake,
                if (this.strict) {
                    // start again from the first level
                    this.userSequence = "";
                    this.level = "1";
                    this.score = 0;
                    this.start();
                } else {
                    // flash the sequence again
                    this.userSequence = "";
                    this.flashSimonSequence();
                }
            }
        },
        async blinkScore(id) {
            let scoreDisplay = document.getElementById("score");
            let aux = this.score;
            this.score = "X"
            await new Promise((resolve) => setTimeout(resolve, this.speed));
            this.score = "";
            await new Promise((resolve) => setTimeout(resolve, this.speed));
            this.score = "X"
            await new Promise((resolve) => setTimeout(resolve, this.speed));
            this.score = aux;

        },
        updateLevel($event) {
            // the level updates automatically during the game
            // or can be set manually before starting
            this.level = $event.target.value;
        }
    },
    watch: {}
}).mount("#main");
