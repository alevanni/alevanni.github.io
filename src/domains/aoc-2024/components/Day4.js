import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import realInput from "../inputs/day-4.txt?raw";

export const Day4 = {
    name: 'Ceres Search',

    data() {
        return {
            exampleInput: ("MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX").split('\n'),
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Ceres Search</h1>
    <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div>  
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            const rows = this.input.split('\n');
            let rowsNumber = rows.length - 1; // the last row is empty!!
            let columnsNumber = rows[0]?.length;
            let horizontal = 0;
            let vertical = 0;
            let diagonal = 0;
            let horizontalInLine = rows.map((item) => this.searchLine(item));
            horizontal = horizontalInLine.reduce((acc, item) => acc + item, 0);
            let columnsArray = this.columns(this.input);
            let verticalInColumns = columnsArray.map((item) => this.searchLine(item));
            vertical = verticalInColumns.reduce((acc, item) => acc + item, 0);
            
            let diag45DegreesArray = this.diagonals45Degrees(this.input);
            let diagMinus45DegreesArray = this.diagonalsMinus45Degrees(this.input);
            let allDiagonals = diag45DegreesArray.concat(diagMinus45DegreesArray);
            let xmasInDiagonals = allDiagonals.map((item) => this.searchLine(item));
            diagonal = xmasInDiagonals.reduce((acc, item) => acc + item, 0);
            
            this.solution = horizontal + vertical + diagonal;


        },
        part2() {
            const rows = this.input.split('\n');
            
            let count = 0;
            for (let i = 1; i < rows.length - 1; i++) {
                for (let j = 1; j < rows[0].length - 1; j++) {
                    if (rows[i][j] === 'A') {
                        let diag1 = rows[i - 1][j - 1] + rows[i][j] + rows[i + 1][j + 1];
                        let diag2 = rows[i + 1][j - 1] + rows[i][j] + rows[i - 1][j + 1];
                        if (diag1 === 'MAS' || diag1 === 'SAM') {
                            if (diag2 === 'MAS' || diag2 === 'SAM') count = count + 1;
                            
                        }

                    }

                }
            }
            this.solution = count;

        },
        searchLine(line) {
            let normal = line.match(/XMAS/g)?.length ?? 0;
            let inverted = line.match(/SAMX/g)?.length ?? 0;

            return normal + inverted;

        },
        columns(text) {
            if (text === undefined) return [''];
            const rows = text.split('\n');

            let rowsNumber = rows.length; //the last line is empty
            let columnsNumber = rows[0]?.length;
            let textColumn = [''];
            if (columnsNumber == undefined) return [''];
            for (let i = 0; i < columnsNumber; i++) {
                textColumn[i] = '';
                for (let j = 0; j < rowsNumber; j++) {
                    if (textColumn[i] != undefined && rows[j][i] !== undefined) {
                        textColumn[i] = textColumn[i] + rows[j][i];
                    }

                }

            }
           
            return textColumn;
        },

        diagonals45Degrees(text) {
            if (text === undefined) return [''];
            const rows = text.split('\n');
            let rowsNumber = rows.length - 1;
            let columnsNumber = rows[0]?.length;
            if (!columnsNumber) return [''];
            let textDiagonal = [''];
            // first half of the 45 deg diags
            // rowsNUmber 141, columnsnumber 140
            for (let i = 0; i < rowsNumber; i++) {
                textDiagonal[i] = '';
                for (let j = 0; j <= i; j++) {
                    textDiagonal[i] = textDiagonal[i] + rows[i - j][j];
                }
            }
            // second half of the 45 deg diags
            for (let i = rowsNumber; i < (rowsNumber + columnsNumber); i++) {
                textDiagonal[i] = '';
                for (let j = i - rowsNumber; j < columnsNumber; j++) {
                    if (i - j >= 0) textDiagonal[i] = textDiagonal[i] + rows[i - j][j];
                }

            }
            return textDiagonal;

        },

        diagonalsMinus45Degrees(text) {
            if (text === undefined) return [''];
            const rows = text.split('\n');
            let reversedRows = rows.map(line => this.reverseString(line));
            let flippedText = reversedRows.join("\n");
            return this.diagonals45Degrees(flippedText);

        },

        reverseString(line) {
            return line.split('').reverse().join('');
        }

    }
}