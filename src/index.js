import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "./components/Navbar.js";

const root = document.documentElement;
// these variables have to be renamed
const accent1 = ref(getComputedStyle(root).getPropertyValue('--color-accent-1'));
const accent2 = ref(getComputedStyle(root).getPropertyValue('--color-accent-2'));
const accent3 = ref(getComputedStyle(root).getPropertyValue('--color-accent-3'));
const accent4 = ref(getComputedStyle(root).getPropertyValue('--color-accent-4'));
const primary = ref(getComputedStyle(root).getPropertyValue('--color-primary'));
const secondary = ref(getComputedStyle(root).getPropertyValue('--color-secondary'));

createApp({
    data() {
        return {
            canvas: null,
            glass: null,
            ctx: null,
            magnifiedCtx: null,
            zoomedCanvas: null,
            zoomedCtx: null,
            w: null,
            h: null,
        }
    },
    mounted() {
        window.addEventListener('theme-changed', () => {
            console.log('theme changed');
            accent1.value = getComputedStyle(root).getPropertyValue('--color-accent-4').trim();
            accent2.value = getComputedStyle(root).getPropertyValue('--color-secondary').trim();
            accent3.value = getComputedStyle(root).getPropertyValue('--color-primary').trim();
            accent4.value = getComputedStyle(root).getPropertyValue('--color-accent-4').trim();
            // redraw canvas here
            this.drawCanvas();
        });
        this.drawCanvas();
    },
    methods: {
        drawCanvas() {
            this.canvas = document.getElementById("hero-canvas");
            this.ctx = this.canvas.getContext("2d");

            // Set canvas dimensions to fill the viewport
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;

            // Reset transform and clear
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.lineWidth = 1;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // remove old glass to avoid duplicates
            const oldGlass = this.canvas.parentElement.querySelector('.magnifier-glass');
            if (oldGlass) oldGlass.remove();
            this.zoom = 2;
            const glassSize = 100;

            // remove old listeners before adding new ones
            this.canvas.removeEventListener("mousemove", this.moveMagnifier);
            this.canvas.removeEventListener("touchmove", this.moveMagnifier);
            this.canvas.removeEventListener("touchstart", this.moveMagnifier);
            /* Create magnifier glass: */
            this.glass = document.createElement("canvas");
            this.zoomedCanvas = document.createElement("canvas");
            this.zoomedCanvas.width = this.canvas.width * this.zoom;
            this.zoomedCanvas.height = this.canvas.height * this.zoom;
            this.glass.setAttribute("class", "magnifier-glass");
            this.magnifiedCtx = this.glass.getContext("2d");
            this.zoomedCtx = this.zoomedCanvas.getContext("2d");

            // Reset zoomed context transform and line width
            this.zoomedCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.zoomedCtx.lineWidth = 1;

            /* Insert magnifier glass: */
            this.canvas.parentElement.insertBefore(this.glass, this.canvas);
            this.glass.style.visibility = "hidden";
            this.glass.style.backgroundRepeat = "no-repeat";

            const rectWidth = Math.round(this.canvas.width / 3);
            const rectHeight = Math.round(this.canvas.height / 3);

            this.drawSierpiski(this.ctx, rectWidth, rectHeight, rectWidth, rectHeight, 4, 1, 4);
            this.drawSierpiski(this.zoomedCtx, Math.round(rectWidth * this.zoom), Math.round(rectHeight * this.zoom), Math.round(rectWidth * this.zoom), Math.round(rectHeight * this.zoom), 5, 1, 5);

            this.glass.width = glassSize;
            this.glass.height = glassSize;
            this.w = this.glass.width / 2;
            this.h = this.glass.height / 2;

            /* Execute a function when someone moves the magnifier glass over the image: */
            this.canvas.addEventListener("mousemove", this.moveMagnifier);
            this.glass.addEventListener("mousemove", this.moveMagnifier);
            this.canvas.addEventListener("touchmove", this.moveMagnifier, { passive: false });
            this.canvas.addEventListener("touchstart", this.moveMagnifier, { passive: false });
        },
        drawSierpiski(ctx, width, height, startX, startY, depth, step, maxDepth) {
            if (depth === 0) {
                return;
            }

            const rx = Math.round(startX);
            const ry = Math.round(startY);
            const rw = Math.round(width);
            const rh = Math.round(height);

            const alpha = 0.4 + 0.8 * (depth / maxDepth);

            const toRgba = (hex, a) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            };

            const levelFromOutside = maxDepth - depth;

            const colorsByLevel = [
                secondary.value,
                accent4.value,
                primary.value,
                accent4.value,
                secondary.value,
            ];



            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.rect(rx, ry, rw, rh);
            ctx.fillStyle = toRgba(colorsByLevel[levelFromOutside] ?? primary.value, alpha);
            ctx.fill();

            const newWidth = Math.round(width / 3);
            const newHeight = Math.round(height / 3);

            for (let row = 1; row <= 3; row++) {
                for (let col = 1; col <= 3; col++) {
                    if (row === 2 && col === 2) continue;

                    this.drawSierpiski(
                        ctx,
                        newWidth,
                        newHeight,
                        Math.round((startX - width) + (col - 1) * width + newWidth),
                        Math.round((startY - height) + (row - 1) * height + newHeight),
                        depth - 1,
                        step + 1,
                        maxDepth
                    );
                }
            }
        },
        moveMagnifier(e) {
            this.glass.style.visibility = "visible";
            const a = this.canvas.getBoundingClientRect();
            const parentRect = this.canvas.parentElement.getBoundingClientRect();
            const scaleX = a.width / this.canvas.width;
            const scaleY = a.height / this.canvas.height;

            var pos, x, y;
            e.preventDefault();

            pos = this.getCursorPosition(e);
            x = pos.x;
            y = pos.y;

            if (x > this.canvas.width - (this.w / this.zoom)) { x = this.canvas.width - (this.w / this.zoom); }
            if (x < this.w / this.zoom) { x = this.w / this.zoom; }
            if (y > this.canvas.height - (this.h / this.zoom)) { y = this.canvas.height - (this.h / this.zoom); }
            if (y < this.h / this.zoom) { y = this.h / this.zoom; }

            this.glass.style.left = (x * scaleX + (a.left - parentRect.left) - this.w) + "px";
            this.glass.style.top = (y * scaleY + (a.top - parentRect.top) - this.h) + "px";

            this.magnifiedCtx.clearRect(0, 0, this.glass.width, this.glass.height);
            this.magnifiedCtx.drawImage(
                this.zoomedCanvas,
                x * this.zoom - this.w,
                y * this.zoom - this.h,
                this.glass.width,
                this.glass.height,
                0,
                0,
                this.glass.width,
                this.glass.height
            );
        },
        getCursorPosition(e) {
            var a, x = 0, y = 0;
            e = e || window.event;
            a = this.canvas.getBoundingClientRect();

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            x = (clientX - a.left) * (this.canvas.width / a.width);
            y = (clientY - a.top) * (this.canvas.height / a.height);

            return { x: x, y: y };
        },
    }
}).mount("#magnified-hero-div");

const tabs = ref({ 1: "Frontend", 2: "Arcade", 3: "Data Visualization", 4: "Backend", 5: "Advent of Code" });
const descriptions = ref({
    "Frontend": "These projects, that I have developed while studying the freeCodeCamp curriculum, are focused on frontend development. They feature HTML, CSS, and JavaScript. They include interactive web applications, responsive designs, and creative user interfaces.",
    "Arcade": "These little games are developed using HTML, CSS, and VueJS.",
    "Data Visualization": "Projects that focus on data visualization techniques using HTML, CSS, and JavaScript library D3. They were developed for the freeCodeCamp curriculum.",
    "Backend": "APIs, microservices, and server-side applications that handle data processing and business logic. Also made for freeCodeCamp curriculum.",
    "Advent of Code": "Open the package to reveal the solutions to some (hopefully one day, all) of the puzzles that I solved during the Advent of Code challenge!"
});
const tabProjects = {
    "Frontend": {
        description: descriptions.value.Frontend, projects: [
            { name: 'Weather App', githubLink: '', liveLink: './src/domains/weather-app/weather-app.html', background: './../src/assets/projectsBackground/local-weather-app.png', year: 2026, tech: ['HTML', 'CSS', 'VueJS'] },
            { name: 'Pomodoro Clock', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/EVWNwE', background: './../src/assets/projectsBackground/pomodoro-clock.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Markdown Previewer', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/rOxjXK', background: './../src/assets/projectsBackground/markdown-previewer.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Javascript Calculator', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/avJpxz', background: './../src/assets/projectsBackground/javascript-calculator.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
        ]
    },
    "Data Visualization": {
        description: descriptions.value['Data Visualization'], projects: [
            { name: 'Bar Chart', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/LvgEwL', background: './../src/assets/projectsBackground/bar-chart.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Heat Map', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/PowoXOz', background: './../src/assets/projectsBackground/heat-map.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Choropleth Map', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/mdyyMjJ', background: './../src/assets/projectsBackground/choropleth-map.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Scatterplot Graph', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/QjypWg', background: './../src/assets/projectsBackground/scatterplot-graph.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
            { name: 'Tree Map', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/xxbbLLy', background: './../src/assets/projectsBackground/tree-map.png', year: 2019, tech: ['HTML', 'CSS', 'JS'] },
        ]
    },
    "Arcade": {
        description: descriptions.value.Arcade, projects: [
            { name: 'Red Donkey', githubLink: '', liveLink: './src/domains/red-donkey/red-donkey.html', background: './../src/assets/projectsBackground/red-donkey.png', year: 2026, tech: ['HTML', 'CSS', 'VueJS'], description: 'Can you free the donkey from its prison?' },
            { name: 'Lights Out', githubLink: '', liveLink: './src/domains/lights-out/lights-out.html', background: './../src/assets/projectsBackground/lights-out.png', year: 2026, tech: ['HTML', 'CSS', 'VueJS'], description: 'Turn on the lights! Careful, when you switch one, all the ones around it will switch too.' },
            { name: 'Simon\'s Game', githubLink: '', liveLink: './src/domains/simon-s-game/simon-s-game.html', background: './../src/assets/projectsBackground/simon-s-game.png', year: 2026, tech: ['HTML', 'CSS', 'VueJS'], description: 'Test your memory with this classic game from the \'70s!' }
        ]
    },
    "Advent of Code": {
        description: descriptions.value['Advent of Code'], projects: [
            { name: 'Advent of Code 2025', liveLink: './src/domains/aoc-2025/aoc-2025.html', background: './../src/assets/projectsBackground/aoc-2025.png', year: '2025', tech: ['HTML', 'CSS', 'VueJS'], description: 'Decorate the North Pole before December 12th!!' },
            { name: 'Advent of Code 2024', liveLink: './src/domains/aoc-2024/aoc-2024.html', background: './../src/assets/projectsBackground/aoc-2024.png', year: '2025', tech: ['HTML', 'CSS', 'VueJS'], description: 'Can you find the Chief Historian??' }
        ]
    },
    "Backend": {
        description: descriptions.value.Backend, projects: [
            { name: 'Issue Tracker', githubLink: 'https://github.com/alevanni/issue-tracker', liveLink: '', background: './../src/assets/projectsBackground/Issue-tracker.png', year: 2021, tech: ['NodeJS', 'Express', 'MongoDB'], },
            { name: 'Sudoku Solver', githubLink: 'https://github.com/alevanni/sudoku-solver', liveLink: '', background: './../src/assets/projectsBackground/sudoku-solver.png', year: 2021, tech: ['NodeJS', 'Express'] },
            { name: 'Imperial Metric Converter', githubLink: 'https://github.com/alevanni/imperial-metric-converter', liveLink: '', background: './../src/assets/projectsBackground/imperial-metric-converter.png', year: 2021, tech: ['NodeJS', 'Express'] },
            { name: 'American-British Translator', githubLink: 'https://github.com/alevanni/american-british-translator', liveLink: '', background: './../src/assets/projectsBackground/american-british-translator.png', year: 2021, tech: ['NodeJS', 'Express'] },
            { name: 'Request Header Parser Microservice', githubLink: 'https://github.com/alevanni/request-header-parser-microservice', liveLink: '', background: './../src/assets/projectsBackground/request-header-parser-microservice.png', year: 2021, tech: ['NodeJS', 'Express'] },
            { name: 'Timestamp Microservice', githubLink: 'https://github.com/alevanni/timestamp-microservice', liveLink: '', background: './../src/assets/projectsBackground/timestamp-microservice.png', year: 2021, tech: ['NodeJS', 'Express'] },
            { name: 'File Metadata Microservice', githubLink: 'https://github.com/alevanni/file-metadata', liveLink: '', background: './../src/assets/projectsBackground/file-metadata-microservice.png', year: 2021, tech: ['NodeJS', 'Express'] },
        ]
    }
};
createApp({
    data() {
        return {
            tabs: tabs.value,
            activeTab: tabs.value[1],
        }
    },
    mounted() {
        const projectTabs = document.getElementById("projectTabs");
        console.log(document.documentElement.dataset.theme)
        console.log(root.dataset.theme);
    },
    methods: {
        activateTab(tab) {
            this.activeTab = tab;
        },
    },
    template: `<ul class="navigation-tabs">
                  <li v-for="(tab, key) in this.tabs" :key="key" class="navigation-tab">
                        <button :class="[activeTab==tab? 'active': 'inactive']" @click="activateTab(tab)" :id="tab" >{{ tab }}</button>
                    </li>
                    
                </ul>
                
                <div v-for="(tab, key) in this.tabs" v-show="activeTab == tab" class="projects" :id="tab.replaceAll(' ', '-') + '-projects'"></div>
                `,
}).mount("#project-tabs");

Object.entries(tabProjects).forEach(([tabName, data]) => {
    createApp({
        data() {
            return {
                id: tabName,
                projects: data.projects,
                description: data.description
            }
        },
        mounted() {

        },
        template: `<h2>{{id}} Projects</h2>
        <p>{{description}}</p>
        <div class="showcase">
        
        <div v-for="project in projects" class="project-tile">
            <div class="tile-img" :style="{ backgroundImage: 'url(' + project.background + ')' }"></div>
            <div class="tile-content">
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
                <div class="tile-badges">
                <span class="badge badge-secondary">{{ project.year }}</span>
                <span v-for="tech in project.tech" class="badge badge-accent-1">{{ tech }}</span>
            </div>
            <div class="tile-links card-footer">
                <a v-if="project.githubLink" :href="project.githubLink" target="_blank" class="btn">
                <i class="fa-brands fa-github"></i> GitHub
                </a>
                <a v-if="project.liveLink" :href="project.liveLink" target="_blank" class="btn-ghost btn">
                    <i class="fa fa-eye"></i> Live
                </a>
            </div>
        </div>
        </div>
        </div>`,
    }).mount('#' + tabName.replace(/\s+/g, '-') + '-projects');
});