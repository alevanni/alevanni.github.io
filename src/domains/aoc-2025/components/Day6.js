import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day6 = {
    name: 'Trash Compactor',

    data() {
        return {
            exampleInput: ("123 328  51 64 \n 45 64  387 23 \n  6 98  215 314\n*   +   *   +  ").split('\n'),
            solution: 0,
            input: "",

        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2025/inputs/day-6.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Trash Compactor</h1>
     <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let problems = [[0]];
            const operators = ((this.input.split('\n')).pop()?.split(/\s+/).join("") || '');
            var problemRows =
                (this.input.split('\n')
                    .map(row => ((row.split(" ")).filter(item => item != "")).map(item => parseInt(item))))
                    .slice(0, -1);

            for (let j = 0; j < (problemRows[0]?.length || 0); j++) {
                let p = [0]
                for (let i = 0; i < problemRows.length; i++) {
                    p.push((problemRows[i] || [0])[j] || 0);
                }
                problems.push(p.slice(1));
            }
            problems = problems.slice(1);

            let count = 0;
            let results = problems.map((numbers, index) => this.partial((operators[index] || '-'), numbers));
            count = results.reduce((acc, item) => (acc + item), 0);
            this.solution = count;
        },
        part2() {
            const operators = ((this.input.split('\n')).pop()?.split(/\s+/).join("") || '');
            let cephalopodProblems = [['']];
            let cephalopodProblemsBlocks = [[['']]];
            let cephalopodProblemRows = [];

            cephalopodProblemRows = (this.input.split('\n') || ['']).slice(0, -1);


            for (let j = 0; j < (cephalopodProblemRows[0]?.length || 0); j++) {
                let p = [''];
                for (let i = 0; i < cephalopodProblemRows.length; i++) {
                    p.push((cephalopodProblemRows[i] || [''])[j] || '');
                }
                cephalopodProblems.push(p.slice(1));
            }
            cephalopodProblems = cephalopodProblems.slice(1); // moved outside the loop

            let aux = [];
            let pp = [['']];
            for (let i = 0; i < cephalopodProblems.length; i++) {
                if (cephalopodProblems[i]?.join('').trim() !== "") {
                    pp.push(cephalopodProblems[i] || ['']);
                } else {
                    aux.push(pp.slice(1));
                    pp = [['']];
                }
            }
            aux.push(pp.slice(1));
            cephalopodProblemsBlocks = aux;

            let count = 0;
            let results = cephalopodProblemsBlocks.map((item, index) => this.partial2((operators[index] || '-'), item));
            count = results.reduce((acc, item) => (acc + item), 0);
            this.solution = count;
        },
        partial(operator, numbers) {

            if (operator == '*') {
                let result = 1;
                for (let i = 0; i < numbers.length; i++) {
                    result = result * (numbers[i] || 1);
                }
                return result;
            }
            else if (operator == '+') {
                let result = 0;
                for (let i = 0; i < numbers.length; i++) {
                    result = result + (numbers[i] || 0);
                }
                return result;
            }
            else return 0;
        },
        partial2(operator, numbers) {

            if (operator == '*') {
                let result = 1;
                for (let i = 0; i < numbers.length; i++) {
                    result = result * (parseInt(numbers[i]?.join("") || '1') || 1);
                }
                return result;
            }
            else if (operator == '+') {
                let result = 0;
                for (let i = 0; i < numbers.length; i++) {
                    result = result + (parseInt(numbers[i]?.join('') || '0') || 0);
                }
                return result;
            }
            else return 0;
        }
    }
}