import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day4 = {
    name: 'Printing Department',

    data() {
        return {
            exampleInput: ("..@@.@@@@.\n@@@.@.@.@@\n@@@@@.@.@@\n@.@@@@..@.\n@@.@@@@.@@\n.@@@@@@@.@\n.@.@.@.@@@\n@.@@@.@@@@\n.@@@@@@@@.\n@.@.@@@.@.").split('\n'),
            solution: 0,
            input: "",

        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2025/inputs/day-4.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Printing Department</h1>
     <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const rolls = this.input.split('\n');
            this.solution = this.forklift(rolls);
        },
        part2() {
            const rolls = this.input.split('\n');
            let newRolls = rolls;

            while (this.forklift2(newRolls).accessibleRolls > 0) {

                newRolls = this.forklift2(newRolls).newRolls;

            }
            this.solution = this.removedRollsCount(newRolls);
        },
        forklift(rolls) {
            let accessibleRolls = 0;
            let width = rolls[0]?.length || 0;
            for (let i = 0; i < rolls.length; i++) {
                for (let j = 0; j < width; j++) {
                    if (rolls[i]?.[j] === '@') {
                        let surroundings = (rolls[i - 1]?.[j - 1] || '.') + (rolls[i - 1]?.[j] || '.')
                            + (rolls[i - 1]?.[j + 1] || '.') + (rolls[i]?.[j - 1] || '.')
                            + (rolls[i]?.[j + 1] || '.') + (rolls[i + 1]?.[j - 1] || '.')
                            + (rolls[i + 1]?.[j] || '.') + (rolls[i + 1]?.[j + 1] || '.');


                        if ((surroundings.match(/@/g) || []).length < 4) {
                            accessibleRolls++;
                        }
                    }

                }
            }
            return accessibleRolls;
        },
        forklift2(rolls) {
            let accessibleRolls = 0;
            let newRolls = rolls;
            let width = rolls[0]?.length || 0;
            for (let i = 0; i < rolls.length; i++) {
                for (let j = 0; j < width; j++) {
                    if (newRolls[i]?.[j] === '@') {
                        let surroundings = (newRolls[i - 1]?.[j - 1] || '.') + (newRolls[i - 1]?.[j] || '.')
                            + (newRolls[i - 1]?.[j + 1] || '.') + (newRolls[i]?.[j - 1] || '.')
                            + (newRolls[i]?.[j + 1] || '.') + (newRolls[i + 1]?.[j - 1] || '.')
                            + (newRolls[i + 1]?.[j] || '.') + (newRolls[i + 1]?.[j + 1] || '.');


                        if ((surroundings.match(/@/g) || []).length < 4) {
                            accessibleRolls++;
                            newRolls[i] = newRolls[i]?.slice(0, j) + 'x' + newRolls[i]?.slice(j + 1);
                        }
                    }

                }
            }
            return { accessibleRolls, newRolls };
        },

        removedRollsCount(rolls) {
            let count = 0;
            for (let i = 0; i < rolls.length; i++) {
                count = count + (rolls[i]?.match(/x/g)?.length || 0);
            }
            return count;
        }
    }
}