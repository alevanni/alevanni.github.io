import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
const root = document.documentElement;

const magenta = getComputedStyle(root).getPropertyValue('--electric-magenta');
const green = getComputedStyle(root).getPropertyValue('--spring-green');
const cyan = getComputedStyle(root).getPropertyValue('--aqua-cyan');
const yellow = getComputedStyle(root).getPropertyValue('--bright-yellow');
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
        this.zoom = 2;
        this.canvas = document.getElementById("hero-canvas");

        this.ctx = this.canvas.getContext("2d");

        // Set canvas dimensions to fill the viewport
        // After setting canvas display:block, read its actual CSS size
        this.canvas.width = this.canvas.offsetHeight;
        this.canvas.height = this.canvas.offsetHeight;

        /* Create magnifier glass: */
        this.glass = document.createElement("canvas");
        this.zoomedCanvas = document.createElement("canvas"); //does not get added to the DOM, just used for drawing the zoomed image
        this.zoomedCanvas.width = this.canvas.width * this.zoom;
        this.zoomedCanvas.height = this.canvas.height * this.zoom;
        this.glass.setAttribute("class", "magnifier-glass");
        this.magnifiedCtx = this.glass.getContext("2d");
        this.zoomedCtx = this.zoomedCanvas.getContext("2d");
        /* Insert magnifier glass: */
        this.canvas.parentElement.insertBefore(this.glass, this.canvas);

        /* Set background properties for the magnifier glass: */
        this.glass.style.backgroundRepeat = "no-repeat";
        this.magnifiedCtx.backgroundSize = (this.canvas.width * this.zoom) + "px " + (this.canvas.height * this.zoom) + "px";
        this.zoomedCtx.backgroundSize = (this.canvas.width * this.zoom) + "px " + (this.canvas.height * this.zoom) + "px";

        const rectWidth = this.canvas.width / 3;
        const rectHeight = this.canvas.height / 3;
        this.drawSierpiski(this.ctx, rectWidth, rectHeight, rectWidth, rectHeight, 5, 1);
        this.drawSierpiski(this.zoomedCtx, rectWidth * this.zoom, rectHeight * this.zoom, rectWidth * this.zoom, rectHeight * this.zoom, 6, 1);
        const glassSize = 100;
        this.glass.width = glassSize;
        this.glass.height = glassSize;
        this.w = this.glass.width / 2;
        this.h = this.glass.height / 2;

        /* Execute a function when someone moves the magnifier glass over the image: */
        this.canvas.addEventListener("mousemove", this.moveMagnifier);
        this.glass.addEventListener("mousemove", this.moveMagnifier);
    },
    methods: {
        drawSierpiski(ctx, width, height, startX, startY, depth, step) {
            if (depth === 0) {
                return;
            }
            ctx.beginPath();
            ctx.rect(startX, startY, width, height);


            if (step % 2 === 0) {
                if (step % 4 === 0) {
                    ctx.strokeStyle = yellow;
                    ctx.fillStyle = yellow;

                } else {
                    ctx.strokeStyle = magenta;
                    ctx.fillStyle = magenta;

                }

            } else {
                if (step % 3 === 0) {
                    ctx.strokeStyle = cyan;
                    ctx.fillStyle = cyan;

                } else {
                    ctx.strokeStyle = green;
                    ctx.fillStyle = green;

                }
            }
            ctx.stroke();
            ctx.fill();

            const newWidth = width / 3;
            const newHeight = height / 3;


            for (let row = 1; row <= 3; row++) {
                for (let col = 1; col <= 3; col++) {
                    if (row === 2 && col === 2) continue; // skip center cell

                    this.drawSierpiski(
                        ctx,
                        newWidth,
                        newHeight,
                        (startX - width) + (col - 1) * width + newWidth,
                        (startY - height) + (row - 1) * width + newHeight,
                        depth - 1,
                        step + 1
                    );
                }
            }





        },
        moveMagnifier(e) {
            const a = this.canvas.getBoundingClientRect();
            const scaleX = a.width / this.canvas.width;
            const scaleY = a.height / this.canvas.height;
            
            var pos, x, y;
            /* Prevent any other actions that may occur when moving over the image */
            e.preventDefault();
            /* Get the cursor's x and y positions: */
            pos = this.getCursorPosition(e);
            x = pos.x;
            y = pos.y;
            /* Prevent the magnifier glass from being positioned outside the image: */
            if (x > this.canvas.width - (this.w / this.zoom)) { x = this.canvas.width - (this.w / this.zoom); }
            if (x < this.w / this.zoom) { x = this.w / this.zoom; }
            if (y > this.canvas.height - (this.h / this.zoom)) { y = this.canvas.height - (this.h / this.zoom); }
            if (y < this.h / this.zoom) { y = this.h / this.zoom; }
            /* Set the position of the magnifier glass: */
            this.glass.style.left = (x - this.w) + "px";
            this.glass.style.top = (y - this.h) + "px";
            /* Display what the magnifier glass "sees": */
            this.magnifiedCtx.clearRect(0, 0, this.glass.width, this.glass.height);
            this.magnifiedCtx.drawImage(
                this.zoomedCanvas,
                x * this.zoom - this.w,        // source x (in zoomed coords)
                y * this.zoom - this.h,        // source y (in zoomed coords)
                this.glass.width,    // source width
                this.glass.height,   // source height
                0,
                0,
                this.glass.width,
                this.glass.height
            );
            //console.log('cursor x:', x, 'source x:', (x - this.w) * this.zoom, 'glass left:', (x - this.w));
        },
        getCursorPosition(e) {
            var a, x = 0, y = 0;
            e = e || window.event;
            /* Get the x and y positions of the image: */
            a = this.canvas.getBoundingClientRect();
            /* Calculate the cursor's x and y coordinates, relative to the image: */
            x = (e.clientX - a.left) * (this.canvas.width / a.width);
            y = (e.clientY - a.top) * (this.canvas.height / a.height);

            return { x: x, y: y };
        }
    }
}).mount("#magnified-hero-div");

const tabs = ref({ 1: "Frontend", 2: "DataVisualization", 3: "Arcade", 4: "Other", 5: "Backend" });
const tabProjects = {
    "Frontend": [{ name: 'Markdown Previewer', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/rOxjXK', background: './../src/assets/projectsBackground/markdown-previewer.png' },
    { name: 'Javascript Calculator', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/avJpxz', background: './../src/assets/projectsBackground/javascript-calculator.png' },
    { name: 'Pomodoro Clock', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/EVWNwE', background: './../src/assets/projectsBackground/pomodoro-clock.png' },
    { name: 'Weather App', githubLink: '', liveLink: './src/domains/weather-app/weather-app.html', background: './../src/assets/projectsBackground/local-weather-app.png' },
    ],
    "DataVisualization": [{ name: 'Bar Chart', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/LvgEwL', background: './../src/assets/projectsBackground/bar-chart.png' },
    { name: 'Heat Map', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/PowoXOz', background: './../src/assets/projectsBackground/heat-map.png' },
    { name: 'Choropleth Map', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/mdyyMjJ', background: './../src/assets/projectsBackground/choropleth-map.png' },
    { name: 'Scatterplot Graph', githubLink: '', liveLink: 'https://codepen.io/alevanni/full/QjypWg', background: './../src/assets/projectsBackground/scatterplot-graph.png' }],
    "Arcade": [{ name: 'Red Donkey', githubLink: '', liveLink: './src/domains/red-donkey/red-donkey.html', background: './../src/assets/projectsBackground/red-donkey.png' },
        { name: 'Lights Out', githubLink: '', liveLink: './src/domains/lights-out/lights-out.html', background: './../src/assets/projectsBackground/lights-out.png' }
    ],
    "Other": [{ name: 'nameOther', link: 'link' }],
    "Backend": [{ name: 'Issue Tracker', githubLink: 'https://github.com/alevanni/issue-tracker', liveLink: '', background: './../src/assets/projectsBackground/Issue-tracker.png' },
    { name: 'Sudoku Solver', githubLink: 'https://github.com/alevanni/sudoku-solver', liveLink: '', background: './../src/assets/projectsBackground/sudoku-solver.png' },
    { name: 'Imperial Metric Converter', githubLink: 'https://github.com/alevanni/imperial-metric-converter', liveLink: '', background: './../src/assets/projectsBackground/imperial-metric-converter.png' },
    { name: 'American-British Translator', githubLink: 'https://github.com/alevanni/american-british-translator', liveLink: '', background: './../src/assets/projectsBackground/american-british-translator.png' },
    { name: 'Request Header Parser Microservice', githubLink: 'https://github.com/alevanni/request-header-parser-microservice', liveLink: '', background: './../src/assets/projectsBackground/request-header-parser-microservice.png' },
    { name: 'Timestamp Microservice', githubLink: 'https://github.com/alevanni/timestamp-microservice', liveLink: '', background: './../src/assets/projectsBackground/timestamp-microservice.png' },
    { name: 'File Metadata Microservice', githubLink: 'https://github.com/alevanni/file-metadata', liveLink: '', background: './../src/assets/projectsBackground/file-metadata-microservice.png' }],
}
createApp({
    data() {
        return {
            tabs: tabs.value,
            activeTab: tabs.value[1],
        }
    },
    mounted() {
        const projectTabs = document.getElementById("projectTabs");

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
                
                <div v-for="(tab, key) in this.tabs" v-show="activeTab == tab" class="project-section"  :id="tab + '-projects'"></div>
                `,
}).mount("#project-tabs");

Object.entries(tabProjects).forEach(([tabName, data]) => {
    createApp({
        data() {

            return {
                id: tabName,
                projects: data,
            }
        },
        mounted() {
            
        },
        template: `<h2>{{id}} Projects</h2>
        <div class="showcase">
        <div v-for="project in projects" class="project-tile">
        <h3>{{project.name}}</h3>
        <div class="tile-img" :style="{ backgroundImage: 'url(' + project.background + ')', backgroundRepeat: 'no-repeat', backgroundPosition: '50% 50%', backgroundSize: '280px 170px' }">
        <div class="overlay">
        <a v-if="project.githubLink" target="_blank" :href="project.githubLink">
            <i class="fa fa-github" aria-hidden="true"></i> GitHub
        </a>
        <a v-if="project.liveLink" :href="project.liveLink" target="_blank">
            <i class="fa fa-eye"></i> Live
        </a>
        </div>
        </div>
        </div>
        </div>`,
    }).mount('#' + tabName + '-projects');
});