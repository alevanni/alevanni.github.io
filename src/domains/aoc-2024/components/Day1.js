import { onMounted, ref } from "vue"
import realInput from "../inputs/day-1.txt?raw"

export const Day1 = {
    name: 'Historian Hysteria',

    data() {
        return {
            exampleInput: ("3   4\n4   3\n2   5\n1   3\n3   9\n3   3").split('\n'),
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Historian Hysteria</h1>
    <div><div class="row" v-for="row in exampleInput">{{row}}</div></div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let list = this.input.split(/(\s{3}|\n)/);
            list = list.filter((item) => item !== '   ' && item !== '\n' && item != '')

            let stringList1 = list.filter((item, index) => index % 2 === 0);
            let stringList2 = list.filter((item, index) => index % 2 === 1);

            let list1 = [0];
            let list2 = [0];
            stringList1.forEach((element, index) => {
                list1[index] = parseInt(element);

            });
            stringList2.forEach((element, index) => {
                list2[index] = parseInt(element);

            });
            stringList1.sort(this.compareNumbers);
            stringList2.sort(this.compareNumbers);
            let distances = this.arraySubtraction(stringList1, stringList2);

            let totalDistances = distances?.reduce((accumulator, item) => (accumulator + item), 0)
            this.solution = totalDistances;


        },
        part2() {
            let list = this.input.split(/(\s{3}|\n)/);
            list = list.filter((item) => item !== '   ' && item !== '\n' && item != '')

            let stringList1 = list.filter((item, index) => index % 2 === 0);
            let stringList2 = list.filter((item, index) => index % 2 === 1);

            let list1 = [0];
            let list2 = [0];
            stringList1.forEach((element, index) => {
                list1[index] = parseInt(element);

            });
            stringList2.forEach((element, index) => {
                list2[index] = parseInt(element);

            });
            let similarityScore = 0;
            let partialScores = [];
            for (let i = 0; i < stringList1.length; i++) {
                let sameValue = [];
                sameValue = stringList2.filter(item => item === stringList1[i]);
                partialScores[i] = stringList1[i] * sameValue.length;
            }
            similarityScore = partialScores.reduce((accumulator, item) => (accumulator + item), 0)
            this.solution = similarityScore;
        },
        compareNumbers(a, b) {
            return a - b;
        },

        arraySubtraction(array1, array2) {
            if (array1 === undefined || array2 === undefined) return;
            if (array1.length === array2.length) {
                let result = [];
                for (let i = 0; i < array1.length; i++) {
                    if (array1[i] == undefined || array2[i] == undefined) return;
                    else result[i] = Math.abs(array1[i] - array2[i]);
                }
                return result;
            }

        }
    }
}