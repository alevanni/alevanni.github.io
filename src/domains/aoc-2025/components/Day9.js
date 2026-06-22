import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day9 = {
    name: 'Movie Theater',

    data() {
        return {
            exampleInput: ("7,1\n11,1\n11,7\n9,7\n9,5\n2,5\n2,3\n7,3").split('\n'),
            solution: 0,
            input: "",

        }
    },
    async mounted() {
        const response = await fetch('../inputs/day-9.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Movie Theater</h1>
     <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const redTiles = this.input.split('\n').map(couple => couple.split(',').map(item => parseInt(item)));
            let areas = [];
            for (let i = 0; i < redTiles.length; i++) {
                areas[i] = [];
                for (let j = i + 1; j < redTiles.length; j++) {
                    areas[i]?.push(this.area(redTiles[i], redTiles[j]));
                }
            }

            let maxArea = areas.map(areas => Math.max(...areas));

            this.solution = Math.max(...maxArea);
        },
        part2() {
            const redTiles = this.input.split('\n').map(couple => couple.split(',').map(item => parseInt(item)));
            this.solution = "solution not available at this time";

        },
        area(vertix1, vertix2) {
            return Math.abs(vertix1[0] - vertix2[0] + 1) * Math.abs(vertix1[1] - vertix2[1] + 1);
        }

    }
}