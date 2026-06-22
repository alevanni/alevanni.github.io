import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day5 = {
    name: 'Cafeteria',

    data() {
        return {
            exampleInput: ("3-5\n10-14\n16-20\n12-18").split('\n'),
            solution: 0,
            input: "",

        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2025/inputs/day-5.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Cafeteria</h1>
     <div><div class="row" v-for="row in exampleInput">{{row}}</div> </div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const freshIdsRanges = (this.input.split('\n\n')[0]?.split('\n') || ['']).map(item => item.split('-')).map(item => [parseInt(item[0] || ''), parseInt(item[1] || '')]);
            const ingredients = (this.input.split('\n\n')[1]?.split('\n') || ['0']).map(item => parseInt(item));
            let freshIds = ingredients.filter(id => this.isItFresh(freshIdsRanges, id));
            this.solution = freshIds.length;
        },
        part2() {
            const freshIdsRanges = (this.input.split('\n\n')[0]?.split('\n') || ['']).map(item => item.split('-')).map(item => [parseInt(item[0] || ''), parseInt(item[1] || '')]);
            const ingredients = (this.input.split('\n\n')[1]?.split('\n') || ['0']).map(item => parseInt(item));
            let count = 0;
            let orderedRanges = freshIdsRanges.sort(this.compare);
            let newRanges = [...orderedRanges];
            let i = 1;
            while (i < newRanges.length) {

                if ((newRanges[i]?.[0] || 0) <= (newRanges[i - 1]?.[1] || 0)) {
                    let aux = [(newRanges[i - 1]?.[0] || 0), Math.max((newRanges[i]?.[1] || 0), (newRanges[i - 1]?.[1] || 0))]

                    newRanges = [...newRanges.slice(0, i - 1), aux, ...newRanges.slice(i + 1)];

                }
                else i++;
            }
            console.log(orderedRanges)
            let partials = newRanges.map(range => (((range[1] || 0) - (range[0] || 0)) + 1));
            count = partials.reduce((acc, item) => (acc + item), 0);
            this.solution = count;
        },
        isItFresh(freshIdsRanges, id) {
            let fresh = false;
            let i = 0;

            while (!fresh && i < freshIdsRanges.length) {

                if (id >= (freshIdsRanges[i]?.[0] || 0) && id <= (freshIdsRanges[i]?.[1] || 0)) {
                    fresh = true;

                }
                else i++;
            }

            return fresh;
        },
        compare(range1, range2) {
            if ((range1[0] || 0) < (range2[0] || 0)) return -1;
            else if ((range1[0] || 0) > (range2[0] || 0)) return 1;
            else {
                if ((range1[1] || 0) < (range2[1] || 0)) return -1;
                else if ((range1[1] || 0) > (range2[1] || 0)) return 1;
                else return 0;
            };
        }
    }
}