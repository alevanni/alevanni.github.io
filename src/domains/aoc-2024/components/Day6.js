import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day6 = {
    name: 'Guard Gallivant',

    data() {
        return {
            exampleInput: ("....#.....\n.........#\n..........\n..#.......\n.......#..\n..........\n.#..^.....\n........#.\n#.........\n......#...").split('\n'),
            solution: 0,
            input: "",
            dialNumbers: 100,
        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2024/inputs/day-6.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Guard Gallivant</h1>
    <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div>  
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let map = this.input.split('\n');
            let sol = 0;//middlePage.reduce((acc, item) => (acc + item), 0)
            let initialPosition = this.findGuard(map);
            if (initialPosition != undefined && initialPosition.column !== undefined) {
                let stop = false;
                //let position = {...initialPosition};
                while (!stop) {
                    switch (initialPosition.direction) {
                        case '^':
                            initialPosition = this.up(initialPosition.row, initialPosition.column, initialPosition.map);

                            break;
                        case 'v':
                            initialPosition = this.down(initialPosition.row, initialPosition.column, initialPosition.map);

                            break;
                        case '>':
                            initialPosition = this.east(initialPosition.row, initialPosition.column, initialPosition.map);

                            break;
                        case '<':
                            initialPosition = this.west(initialPosition.row, initialPosition.column, initialPosition.map);

                            break;
                        case 'STOP':
                            stop = true;
                            break;
                        default:
                            break;
                    }

                }
                sol = this.countX(initialPosition.map);
                //console.log(initialPosition)

            }
            this.solution=sol;
        },
        part2() {
            this.solution = "solution not available at this time";

        },
        findGuard(map) {
            let i = 0;
            let j;
            let guard = false;
            while (i < map.length && !guard) {

                let found = map[i]?.match(/\^|v|>|</)?.[0];
                if (found !== null && found !== undefined) {
                    guard = true;
                    if (map[i] == undefined) return { row: -1, column: -1 };
                    else j = map[i]?.indexOf(found)
                    return { map: map, row: i, column: j, direction: found };
                }
                else i++;
            }
            return { map: map, row: 0, column: 0, direction: 'not found' };
        },

        up(startX, startY, map) {
            let obstacle = false;
            let i = startX;
            let mapCopy = [...map];
            while (i >= 0 && !obstacle) {
                let aux = mapCopy[i]?.split('');
                aux[startY] = 'X';
                mapCopy[i] = aux?.join('');
                if (map[i - 1]?.[startY] === '#') obstacle = true;
                else {
                    i--;
                }
            }
            if (i == -1) return { map: mapCopy, row: i, column: startY, direction: 'STOP' };
            return { map: mapCopy, row: i, column: startY, direction: '>' };
        },
        down(startX, startY, map) {
            let obstacle = false;
            let i = startX;
            let mapCopy = [...map];
            while (i < mapCopy.length && !obstacle) {
                let aux = mapCopy[i]?.split('');
                aux[startY] = 'X';
                mapCopy[i] = aux?.join('');
                if (map[i + 1]?.[startY] === '#') obstacle = true;
                else {
                    i++;
                }
            }
            if (i == mapCopy.length) return { map: mapCopy, row: i, column: startY, direction: 'STOP' };
            return { map: mapCopy, row: i, column: startY, direction: '<' };
        },

        east(startX, startY, map) {
            let obstacle = false;
            console.log('here')
            let j = startY;
            let mapCopy = [...map];
            while (j < mapCopy[0].length && !obstacle) {
                let aux = mapCopy[startX]?.split('');
                aux[j] = 'X';
                mapCopy[startX] = aux?.join('');
                if (map[startX]?.[j + 1] === '#') obstacle = true;
                else {
                    j++;
                }
            }
            if (j == mapCopy[0].length) return { map: mapCopy, row: startX, column: j, direction: 'STOP' }
            return { map: mapCopy, row: startX, column: j, direction: 'v' };
        },
        west(startX, startY, map) {
            let obstacle = false;
            let j = startY;
            let mapCopy = [...map];
            while (j >= 0 && !obstacle) {
                let aux = mapCopy[startX]?.split('');
                aux[j] = 'X';
                mapCopy[startX] = aux?.join('');
                if (map[startX]?.[j - 1] === '#') obstacle = true;
                else {
                    j--;
                }
            }
            if (j == -1) return { map: mapCopy, row: startX, column: j, direction: 'STOP' };
            return { map: mapCopy, row: startX, column: j, direction: '^' };
        },

        countX(map) {
            let xs = map.map((item) => (item.match(/X/g)?.length || 0));
            let totalXs = xs.reduce((acc, item) => (acc + item), 0)
            return totalXs;
        }


    }
}