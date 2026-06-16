import { onMounted, ref } from "vue"
import realInput from "../inputs/day-3.txt?raw"

export const Day3 = {
    name: 'Lobby',

    data() {
        return {
            exampleInput: ("987654321111111\n811111111111119\n234234234234278\n818181911112111").split('\n'),
            solution: 0,
            input: realInput,

        }
    },
    template: `<div><h1>Lobby</h1>
     <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            
            var banks = this.input.split('\n');

            let count = 0;
            let joltages = banks.map(bank => this.joltage(bank));
            count = joltages.reduce((acc, item) => acc + parseInt(item), 0);

            this.solution = count;
        },
        part2() {
            var banks = this.input.split('\n');

            let count = 0;
            let joltages = banks.map(bank => this.joltage2(bank));

            count = joltages.reduce((acc, item) => acc + parseInt(item), 0);
            this.solution = count;
        },
        joltage(bank) {
            let battery = bank.split('').map(num => parseInt(num));
            let max1 = Math.max(...battery.slice(0, battery.length - 1))
            let newBank = battery.slice(battery.indexOf(max1) + 1)
            let max2 = Math.max(...newBank);
            let joltage = max1.toString() + max2.toString();
            return joltage;
        },

        joltage2(bank) {
            let battery = bank.split('').map(num => parseInt(num));
            let max = [];

            for (let i = 1; i <= 12; i++) {

                max.push(Math.max(...battery.slice(0, battery.length - (12 - i))))
                battery = battery.slice(battery.indexOf(max[i - 1] || 0) + 1)

            }

            let joltage = max.join('');

            return joltage;
        }
    }
}