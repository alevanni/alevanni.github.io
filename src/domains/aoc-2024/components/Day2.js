import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import realInput from "../inputs/day-2.txt?raw";

export const Day2 = {
    name: 'Red-Nosed Reports',

    data() {
        return {
            exampleInput: ("7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9").split('\n'),
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Red-Nosed Reports</h1>
    <div><div class="row" v-for="row in exampleInput">{{row}}</div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let reports = this.input.split('\n');
            var list = reports.map((item) => {
                let levelStrings = item.split(' ');
                let levelNumbers = levelStrings.map(item => parseInt(item));
                return levelNumbers;
            });
            let safeReports = list.map((item) => this.safeReport(item));
            let safeReportsNumber = safeReports.reduce((acc, value) => (acc + value), 0);
            this.solution = safeReportsNumber;


        },
        part2() {
            let reports = this.input.split('\n');
            var list = reports.map((item) => {
                let levelStrings = item.split(' ');
                let levelNumbers = levelStrings.map(item => parseInt(item));
                return levelNumbers;
            });
            let safeReports = list.map((item) => this.safeReport(item));
            let safeReportsWithDampener = list.map((item, index) => {
                if (!safeReports[index]) return this.safeReportWithDampener(item);
                else return 1;
            })
            let safeReportsNumber = safeReportsWithDampener.reduce((acc, value) => (acc + value), 0);
            this.solution = safeReportsNumber;
        },
        safeReport(levels) {
            // first we check the first two number to see if we have a decreasing 
            // or increasing report

            if (levels[0] < levels[1]) { // we should be in the ascending case
                for (let i = 0; i < levels.length - 1; i++) {
                    if (levels[i + 1] - levels[i] <= 0 || levels[i + 1] - levels[i] > 3) return 0;

                }
                return 1;
            }
            else if (levels[0] > levels[1]) { // we should be in the descending case
                for (let i = 0; i < levels.length - 1; i++) {
                    if (levels[i] - levels[i + 1] <= 0 || levels[i] - levels[i + 1] > 3) return 0;

                }
                return 1;
            }
            else return 0;

        },
        safeReportWithDampener(levels) {

            // we are supposed to be using this only on unsafe reports
            for (let i = 0; i < levels.length; i++) {
                let dampedReport = levels.toSpliced(i, 1) //we remove a level
                if (this.safeReport(dampedReport)) return 1;
            }
            return 0;


        }
    }
}