import { onMounted, ref } from "vue"
import realInput from "../inputs/day-2.txt?raw"

export const Day2 = {
    name: 'Gift Shop',

    data() {
        return {
            exampleInput: ("11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124").split(','),
            solution: 0,
            input: realInput,

        }
    },
    template: `<div><h1>Gift Shop</h1>
     <div><div class="row" v-for="row in exampleInput">{{row}}</div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const ranges =  this.input.split(',').map(item => item.split('-'));

            let count = 0;
            let invalidIds = ranges.map(range => this.findInvalidIds(parseInt(range[0] || '0'), parseInt(range[1] || '0')))
            count = invalidIds.reduce((acc, item) => (acc + item), 0);
            this.solution = count;
        },
        part2() {
            const ranges = this.input.split(',').map(item => item.split('-'));

            let count = 0;
            let invalidIds = ranges.map(range => this.findInvalidIds2(parseInt(range[0] || '0'), parseInt(range[1] || '0')))
            count = invalidIds.reduce((acc, item) => (acc + item), 0);
            this.solution = count;
        },
        findInvalidIds(start, end) {
            let invalidIds = [];
            for (let i = start; i <= end; i++) {
                let l = i.toString().length / 2;
                if (l % 1 == 0) {

                    let reg = new RegExp(`^(${i.toString().slice(0, l)}){2}$`)
                    if (i.toString().match(reg)) {
                        invalidIds.push(i);
                    }

                }

            }
            let sum = invalidIds.reduce((acc, item) => (acc + item), 0)
            //console.log(invalidIds)
            return sum;
        },
        findInvalidIds2(start, end) {
    let invalidIds = [];
    for (let i = start; i <= end; i++) {
        let l = i.toString().length;
        for (let j = 1; j <= l / 2; j++) {
            if (l % j == 0) {

                let reg = new RegExp(`^(${i.toString().slice(0, j)}){${l / j}}$`);
                if (i.toString().match(reg)) {
                    invalidIds.push(i);
                    j = l;
                }

            }
        }


    }
    let sum = invalidIds.reduce((acc, item) => (acc + item), 0)

    return sum;
}
    }
}