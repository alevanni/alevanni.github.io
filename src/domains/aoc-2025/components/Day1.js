import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import realInput from "../inputs/day-1.txt?raw";

export const Day1 = {
    name: 'Secret Entrance',

    data() {
        return {
            exampleInput: "L68\nL30\nR48\nL5\nR60\nL55\nL1\nL99\nR14\nL82",
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Secret entrance</h1>
     <div>{{exampleInput}}</div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        <!---- 
        <div class="dial">
        <span class='dial-item' v-for="item in dialNumbers" :style="{'--i': item}">{{item-1}}</span>
        <div class="dial-arrow"></div>
        </div>
        ---!>
    </div>
    </div>`,
    methods: {
        part1() {
            let rotations = [''];
            let directions = [''];
            let distances = [0];

            rotations = this.input.split('\n');
            directions = rotations.map(item => item[0] || 'x');
            distances = rotations.map(item => parseInt(item?.slice(1)) || 0);
            let count = 0;
            let start = 50;
            
            for (let i = 0; i < directions.length; i++) {
                if (directions[i] == "L") {
                    start = (start - (distances[i] || 0) % 100) < 0 ? 100 - Math.abs(start - (distances[i] || 0) % 100) : start - (distances[i] || 0) % 100;

                }
                if (directions[i] == "R") {
                    start = (start + (distances[i] || 0)) % 100;
                }
                if (start == 0) count++;
                
            }
            
            this.solution = count;

        },
        part2() {
            let rotations = [''];
            let directions = [''];
            let distances = [0];

            rotations = this.input.split('\n');
            directions = rotations.map(item => item[0] || 'x');
            distances = rotations.map(item => parseInt(item?.slice(1)) || 0);
            let count = 0;
            let start = 50;
            for (let i = 0; i < directions.length; i++) {
                let rounds = Math.floor((distances[i] || 0) / 100);

                if (directions[i] == "L") {
                    count = (start - (distances[i] || 0) % 100) <= 0 ? count + rounds + 1 : count + rounds;
                    if (start == 0) count--
                    start = (start - (distances[i] || 0) % 100) < 0 ? 100 - Math.abs(start - (distances[i] || 0) % 100) : start - (distances[i] || 0) % 100;

                }
                if (directions[i] == "R") {

                    count = (start + (distances[i] || 0) % 100) >= 100 ? count + rounds + 1 : count + rounds;

                    start = (start + (distances[i] || 0)) % 100;
                }

            }
            this.solution = count;
        }
    }
}