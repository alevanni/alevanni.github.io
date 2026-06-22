import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import realInput from "../inputs/day-3.txt?raw";

export const Day3 = {
    name: 'Mull It Over',

    data() {
        return {
            exampleInput: ("xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))").split('\n'),
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Mull It Over</h1>
    <div><div class="row" v-for="row in exampleInput">{{row}}</div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            var multiplyList = [''];
            multiplyList = this.input.match(/mul\(\d+,\d+\)/g);

            if (multiplyList) {
                let multiplicationsResults = multiplyList.map(item => this.twoFactorsMul(item));
                let total = multiplicationsResults.reduce((acc, item) => (acc + item), 0);
                this.solution = total;
            }


        },
        part2() {
            var multiplyList = [''];
            let initialList = this.input.split(/(do\(\)|don\'t\(\))/);//text.split(/(mul\(\d+,\d+\))/);
            let filteredString = '';
            let i = 0;
            if (initialList[0] == 'do()' && initialList[1]) {
                filteredString = filteredString + initialList[1];
                i = i + 2;
            }
            else if (initialList[i] == 'don\'t()') { i = i + 2; }
            else {
                filteredString = filteredString + initialList[0];
                i = i + 1;
            }
            while (i < initialList.length - 1) {

                if (initialList[i] == 'do()' && initialList[i + 1]) {
                    filteredString = filteredString + initialList[i + 1];

                }
                i = i + 2;

            }

            multiplyList = filteredString.match(/mul\(\d+,\d+\)/g);
            if (multiplyList) {
                let multiplicationsResults = multiplyList.map(item => this.twoFactorsMul(item));
                let total = multiplicationsResults.reduce((acc, item) => (acc + item), 0);
                this.solution = total;
            }
        },
        twoFactorsMul(factors) {
            // estracts the two numbers from a list of mul(a,b) strings
            // and multiplies them
            let numsString = factors.match(/\d+/g);
            if (numsString && numsString.length == 2 && numsString[1]) {
                return parseInt(numsString[0]) * parseInt(numsString[1])
            }
            return 0;
        }
    }
}