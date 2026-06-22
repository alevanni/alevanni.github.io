import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day7 = {
    name: 'Bridge Repair',

    data() {
        return {
            exampleInput: ("190: 10 19\n3267: 81 40 27\n83: 17 5\n156: 15 6\n7290: 6 8 6 15\n161011: 16 10 13\n192: 17 8 14\n21037: 9 7 18 13\n292: 11 6 16 20").split('\n'),
            solution: 0,
            input: "",
            dialNumbers: 100,
        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2024/inputs/day-7.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Bridge Repair</h1>
    <div><div class="row" v-for="row in exampleInput">{{row}}</div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let equations = this.input.split('\n');
            let testValues = equations.map(string => parseInt(string.split(':')[0] || '0'));
            let calibrations = equations.map(string => (string.split(': ')[1] || '0').split(' ').map(x => parseInt(x)));

            let checkCalibrations = testValues.map((result, index) => this.equation(result, calibrations[index]));
            let validOnes = testValues.filter((result, index) => checkCalibrations[index]);
            this.solution = validOnes.reduce((acc, item) => acc + item, 0);

        },
        part2() {
            let equations = this.input.split('\n');
            let testValues = equations.map(string => parseInt(string.split(':')[0] || '0'));
            let calibrations = equations.map(string => (string.split(': ')[1] || '0').split(' ').map(x => parseInt(x)));

            let checkCalibrations = testValues.map((result, index) => this.equationWithThirdOperator(result, calibrations[index]));
            let validOnes = testValues.filter((result, index) => checkCalibrations[index]);
            this.solution = validOnes.reduce((acc, item) => acc + item, 0);
        },
        equation(result, partials) {

            if (partials.length == 2) {
                return (result == (partials[0] || 0) + (partials[1] || 0)) || result == (partials[0] || 0) * (partials[1] || 0);

            }
            else {
                return this.equation(result, [partials[0] * partials[1], ...partials.slice(2)]) || this.equation(result, [partials[0] + partials[1], ...partials.slice(2)])
            }
        },
        equationWithThirdOperator(result, partials) {

            if (partials.length == 2) {
                return (result == (partials[0] || 0) + (partials[1] || 0)) || result == (partials[0] || 0) * (partials[1] || 0) || result == this.thirdOperator(partials[0], partials[1]);

            }
            else {
                return this.equationWithThirdOperator(result, [partials[0] * partials[1], ...partials.slice(2)])
                    || this.equationWithThirdOperator(result, [partials[0] + partials[1], ...partials.slice(2)])
                    || this.equationWithThirdOperator(result, [this.thirdOperator(partials[0], partials[1]), ...partials.slice(2)])
            }
        },

        thirdOperator(a, b) {
            return parseInt(a.toString() + b.toString());
        }

    }
}