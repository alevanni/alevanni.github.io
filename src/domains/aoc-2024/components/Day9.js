import { onMounted, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export const Day9 = {
    name: 'Disk Fragmenter',

    data() {
        return {
            exampleInput: "2333133121414131402",
            solution: 0,
            message: "",
            input: "",
            dialNumbers: 100,
        }
    },
    async mounted() {
        const response = await fetch('https://alevanni.github.io/src/domains/aoc-2024/inputs/day-9.txt');
        this.input = await response.text();
    },
    template: `<div><h1>Disk Fragmenter</h1>
    <div>{{exampleInput}}</div> 
    <div><button class="btn" @click="part1()">part 1</button> <button class="btn" @click="part2()">part 2</button></div>
    <div><h2 class="solution-h2">Solution: {{solution}}</h2>
        <p v-if="message !=='' ">{{message}}</p>
    </div>
    </div>`,
    methods: {
        part1() {
            this.message = "Strap in, this takes a bit...";
            setTimeout(() => {
                let individualBlocks = this.blocks(this.input);
                let compactedDiskMap = this.compacting(individualBlocks);
                this.solution = this.checkSum(compactedDiskMap);
                this.message = "";
            }, 50);
        },
        part2() {
            this.solution = "solution not available at this time";
        },
        blocks(diskMap) {
            let individualBlocks = [];
            let id = 0;
            for (let i = 0; i < diskMap.length; i = i + 2) {
                for (let j = 0; j < parseInt(diskMap[i] || '0'); j++) {
                    individualBlocks.push(id);
                }
                for (let j = 0; j < parseInt(diskMap[i + 1] || '0'); j++) {
                    individualBlocks.push('.');
                }

                id++;

            }

            return individualBlocks;
        },
        compacting(blocks) {
            let compacted = blocks;
            for (let i = blocks.length - 1; i >= 0; i--) {
                if (blocks[i] != '.' && typeof blocks[i] === "number") {
                    compacted = this.reposition(blocks[i] || 0, compacted, i);
                }
            }
            return compacted;
        },

        reposition(character, blocks, oldIndex) {
            let j = 0;
            let repositioned = blocks;
            while (blocks[j] !== '.' && j < oldIndex) {
                j++;
            }
            if (j < oldIndex) {
                repositioned = [...blocks.slice(0, j), character, ...blocks.slice(j + 1, oldIndex), '.', ...blocks.slice(oldIndex + 1)];
            }
            return repositioned;
        },
        checkSum(compactedDiskMap) {
            let sum = 0;
            for (let i = 0; i < compactedDiskMap.length; i++) {
                if (compactedDiskMap[i] != '.' && typeof compactedDiskMap[i] === 'number') {
                    sum = sum + i * (compactedDiskMap[i] || 0)
                }
            }
            return sum;
        }

    }
}