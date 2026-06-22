import { onMounted, ref } from "vue"
import realInput from "../inputs/day-5.txt?raw"

export const Day5 = {
    name: 'Print Queue',

    data() {
        return {
            exampleInput: ("47|53\n97|13\n97|61\n97|47\n75|29\n61|13\n75|53\n29|13\n97|29\n53|29\n61|53\n97|53\n61|29\n47|13\n75|47\n97|75\n47|61\n75|61\n47|29\n75|13\n53|13\n\n75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47").split('\n'),
            solution: 0,
            input: realInput,
            dialNumbers: 100,
        }
    },
    template: `<div><h1>Print Queue</h1>
    <div><div class="row" v-for="row in exampleInput"><div v-for="place in row" class="centered-char">{{place}}</div></div></div>  
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        
    </div>
    </div>`,
    methods: {
        part1() {
            let inputRows = this.input.split('\n');
            let ruleRows = inputRows.slice(0, inputRows.indexOf(''));
            let orderRows = inputRows.slice(inputRows.indexOf('') + 1);
            let correctOrders = orderRows.filter((item) => this.orderCheck(ruleRows, item));
            let correctOrdersInArrayForm = correctOrders.map(order => order.split(','))
            let middlePage = correctOrdersInArrayForm.map(order => this.middleNumbers(order))
            this.solution = middlePage.reduce((acc, item) => (acc + item), 0)

        },
        part2() {
            let inputRows = this.input.split('\n');
            let ruleRows = inputRows.slice(0, inputRows.indexOf(''));
            let orderRows = inputRows.slice(inputRows.indexOf('') + 1);
            let incorrectOrders = orderRows.filter((item) => !this.orderCheck(ruleRows, item));
            let incorrectOrdersInArrayForm = incorrectOrders.map(order => order.split(','));
            let reordered = incorrectOrdersInArrayForm.map(order => this.reorder(ruleRows, order));
            let middlePage = reordered.map(order => this.middleNumbers(order))
            this.solution = middlePage.reduce((acc, item) => (acc + item), 0);

        },
        reorder(rules, order) {
            let reordered = order;
            let i = 0;

            while (i < order.length) {

                //we check the numbers after order[i]
                let j = i + 1;
                while (j < reordered.length) {
                    if (rules.indexOf(reordered[j] + "|" + reordered[i]) != -1) {

                        reordered = reordered.slice(0, i).concat([reordered[j]]).concat(reordered.slice(i, j)).concat(reordered.slice(j + 1))


                    }
                    else {
                        j++;
                    }

                }

                i++;

            }
            return reordered;
        },

        orderCheck(rules, orderRow) {

            let i = 0;
            let brokenRule = false;
            let order = orderRow.split(',');

            while (i < order.length && !brokenRule) {
                let before = order.slice(0, i);
                let after = order.slice(i + 1);
                let j = 0;
                
                j = i + 1;
                while (j < order.length && !brokenRule) {
                    if (rules.indexOf(order[j] + "|" + order[i]) != -1) brokenRule = true;
                    j++;
                }
                i++;

            }
            return !brokenRule;
        },

        middleNumbers(array) {
            let middle = Math.floor(array.length / 2);
            if (array[middle] == undefined) return 0;
            return parseInt(array[middle]);
        }


    }
}