import { onMounted, ref } from "vue"
import realInput from "../inputs/day-7.txt?raw"

export const Day7 = {
    name: 'Laboratories',

    data() {
        return {
            exampleInput: (".......S.......\n...............\n.......^.......\n...............\n......^.^......\n...............\n.....^.^.^.....\n...............\n....^.^...^....\n...............\n...^.^...^.^...\n...............\n..^...^.....^..\n...............\n.^.^.^.^.^...^.\n...............").split('\n'),
            solution: 0,
            input: realInput,

        }
    },
    template: `<div><h1>Laboratories</h1>
     <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2>Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const mapRows = this.input.split('\n');
            let newMapRows = [...mapRows];
            for (let i = 1; i < mapRows.length; i++) {
                for (let j = 0; j < (mapRows[0]?.length || 0); j++) {
                    newMapRows = this.beams(newMapRows, i, j);

                }
            }
            this.solution = this.countSplits(newMapRows);
        },
        part2() {
            const mapRows = this.input.split('\n');
            let newMapRows = [];
            for (let i = 0; i < mapRows.length; i++) {
                newMapRows.push(mapRows[i]?.split("").map(item => {
                    if (item == '.') return 0;
                    else return item || 0;
                }))
            }
            newMapRows[1][mapRows[0]?.indexOf('S')] = 1;
            for (let i = 2; i < mapRows.length; i++) {
                for (let j = 0; j < (mapRows[0]?.length || 0); j++) {
                    newMapRows = this.beams2(newMapRows, i, j);

                }
            }

            let count = newMapRows[newMapRows.length - 1].reduce((acc, item) => acc + item, 0);
            this.solution = count;


        },
        countSplits(mapRows) {
            let count = 0;
            for (let i = 0; i < mapRows.length; i++) {
                for (let j = 0; j < mapRows[0].length; j++) {
                    if (mapRows[i][j] == "^" && mapRows[i - 1][j] == "|") {
                        count++;
                    }
                }

            }
            //console.log(count)
            return count;
        },
        beams(mapRows, i, j) {
            let newMapRows = mapRows;

            if (mapRows?.[i]?.[j] === "^") {
                newMapRows[i] = newMapRows?.[i]?.slice(0, j - 1) + "|" + newMapRows?.[i]?.[j] + "|" + newMapRows?.[i]?.slice(j + 2);

                return newMapRows;
            }
            else if (newMapRows?.[i]?.[j] == "." && (newMapRows?.[i - 1]?.[j] == "|" || newMapRows?.[i - 1]?.[j] == "S")) {// s e |
                newMapRows[i] = newMapRows?.[i]?.slice(0, j) + "|" + newMapRows?.[i]?.slice(j + 1);
                return newMapRows
            }
            else return newMapRows;

        },
        beams2(mapRows, i, j) {

            let newMapRows = mapRows;

            if (i % 2 == 0) {

                if (newMapRows?.[i]?.[j] === "^") {
                    
                    newMapRows[i][j + 1] = newMapRows[i][j + 1] + newMapRows[i - 1][j];
                    newMapRows[i][j - 1] = newMapRows[i][j - 1] + newMapRows[i - 1][j];

                    return newMapRows;
                }

                else if (newMapRows?.[i]?.[j] !== "^") {
                    newMapRows[i][j] = newMapRows[i][j] + newMapRows[i - 1][j]
                    return newMapRows;
                }
                else return newMapRows;
            }
            else if (i % 2 == 1 && newMapRows?.[i - 1]?.[j] != '^') {

                newMapRows[i][j] = newMapRows[i][j] + newMapRows?.[i - 1]?.[j];
                return newMapRows;
            }

            else return newMapRows;
        }

    }
}